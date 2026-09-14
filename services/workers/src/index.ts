import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import sharp from 'sharp';
import { hashLeaf, buildMerkleTree } from '@sih26125/merkle';
import { DocumentAnchorRegistryAbi } from '@sih26125/contracts';
import { config } from './config.js';
import { query, pool } from './db.js';
import { getObject, putObject } from './minio.js';
import { getAnchorContract, adminSigner, provider } from './chain.js';

const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
});

console.log('⚡ SIH26125 Async Workers initializing...');

// Process a single document version (compute leaf hash + generate thumbnail + queue for batching)
async function processVersionJob(data: {
  documentId: string;
  versionId: string;
  seq: number;
  fileName: string;
  mimeType: string;
  sha256: string;
  minioKey: string;
}) {
  const { documentId, versionId, fileName, mimeType, sha256, minioKey } = data;
  console.log(`[Worker] Processing version ${versionId} (doc: ${documentId})`);

  // 1. Compute leaf hash
  const leafHash = hashLeaf(documentId, versionId, sha256);

  // 2. Insert into proof_records as PENDING
  await query(
    `INSERT INTO proof_records (version_id, leaf_hash, status)
     VALUES ($1, $2, 'PENDING')
     ON CONFLICT (version_id) DO UPDATE SET leaf_hash = $2, status = 'PENDING'`,
    [versionId, leafHash]
  );

  await query(
    `UPDATE document_versions SET state = 'PROOF_READY' WHERE version_id = $1`,
    [versionId]
  );

  // 3. Generate thumbnail if image
  if (mimeType.startsWith('image/')) {
    try {
      const stream = await getObject(config.minio.buckets.documents, minioKey);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const fileBuffer = Buffer.concat(chunks);

      const thumbBuffer = await sharp(fileBuffer)
        .resize(256, 256, { fit: 'inside' })
        .webp({ quality: 80 })
        .toBuffer();

      const thumbKey = `${versionId}.webp`;
      await putObject(
        config.minio.buckets.docThumbnails,
        thumbKey,
        thumbBuffer,
        thumbBuffer.length,
        { 'Content-Type': 'image/webp' }
      );

      await query(
        `INSERT INTO doc_thumbnails (version_id, minio_key, mime_type, status)
         VALUES ($1, $2, 'image/webp', 'GENERATED')
         ON CONFLICT (version_id) DO UPDATE SET minio_key = $2, status = 'GENERATED'`,
        [versionId, thumbKey]
      );
      console.log(`[Worker] Thumbnail generated for version ${versionId}`);
    } catch (thumbErr: any) {
      console.warn(`[Worker] Thumbnail generation skipped/failed for ${versionId}:`, thumbErr.message);
    }
  }

  // 4. Check if we should flush a Merkle batch
  await checkAndFlushMerkleBatch();
}

// Check and flush pending proof records into a Merkle batch
async function checkAndFlushMerkleBatch() {
  const pendingRes = await query(
    `SELECT p.version_id, p.leaf_hash, v.document_id, v.sha256
     FROM proof_records p
     JOIN document_versions v ON p.version_id = v.version_id
     WHERE p.status = 'PENDING'
     ORDER BY v.created_at ASC
     LIMIT $1`,
    [config.batchMaxLeaves]
  );

  if (pendingRes.rows.length === 0) {
    return;
  }

  const rows = pendingRes.rows;
  console.log(`[Batcher] Building Merkle batch with ${rows.length} leaves`);

  const leaves = rows.map((r) => r.leaf_hash as `0x${string}`);
  const tree = buildMerkleTree(leaves);

  // Start DB transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create batch record
    const batchRes = await client.query(
      `INSERT INTO merkle_batches (root, leaf_count, closed_at, status)
       VALUES ($1, $2, NOW(), 'ANCHOR_PENDING')
       RETURNING batch_id`,
      [tree.root, leaves.length]
    );
    const batchId = batchRes.rows[0].batch_id;

    // Update each proof record with inclusion proof
    for (let i = 0; i < rows.length; i++) {
      const proof = tree.getProof(i);
      await client.query(
        `UPDATE proof_records
         SET batch_id = $1, leaf_index = $2, proof_json = $3, status = 'BATCHED'
         WHERE version_id = $4`,
        [batchId, i, JSON.stringify(proof), rows[i].version_id]
      );

      await client.query(
        `UPDATE document_versions SET state = 'MERKLE_BATCHED' WHERE version_id = $1`,
        [rows[i].version_id]
      );
    }

    await client.query('COMMIT');
    console.log(`[Batcher] Merkle batch ${batchId} created with root ${tree.root}`);

    // Anchor batch on Polygon Amoy
    await anchorBatchOnChain(batchId, tree.root, leaves.length, rows.map((r) => r.version_id));
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('[Batcher] Batch creation failed:', err);
  } finally {
    client.release();
  }
}

// Submits anchorBatch transaction to DocumentAnchorRegistry
async function anchorBatchOnChain(
  batchId: string,
  root: string,
  leafCount: number,
  versionIds: string[]
) {
  // Convert UUID batchId to bytes32 format (pad or hash)
  const batchIdBytes32 = (
    batchId.replace(/-/g, '').padEnd(64, '0').slice(0, 64)
  );
  const formattedBatchId = `0x${batchIdBytes32}`;

  let txHash: string | undefined;
  let blockNumber: number | bigint | undefined;

  const anchor = getAnchorContract(adminSigner);
  if (config.anchorAddress && anchor && adminSigner) {
    try {
      console.log(`[Anchor] Submitting anchorBatch to ${config.anchorAddress}...`);
      const tx = await anchor.anchorBatch(formattedBatchId, root, BigInt(leafCount));
      txHash = tx.hash;
      console.log(`[Anchor] Tx submitted: ${txHash}, awaiting receipt...`);
      const receipt = await tx.wait();
      blockNumber = receipt.blockNumber;
      console.log(`[Anchor] Tx confirmed in block ${blockNumber}!`);
    } catch (err: any) {
      console.error('[Anchor] On-chain anchor submission failed:', err.message);
    }
  }

  // Update DB state
  const finalStatus = txHash ? 'ANCHORED' : 'LOCAL_ANCHORED';
  await query(
    `UPDATE merkle_batches
     SET anchor_tx = $1, anchor_block = $2, status = $3
     WHERE batch_id = $4`,
    [txHash || null, blockNumber ? Number(blockNumber) : null, finalStatus, batchId]
  );

  // Set versions to VERIFIABLE
  for (const vid of versionIds) {
    await query(
      `UPDATE document_versions SET state = 'VERIFIABLE' WHERE version_id = $1`,
      [vid]
    );
  }

  console.log(`[Anchor] Batch ${batchId} marked as ${finalStatus}`);
}

// BullMQ worker runner
const worker = new Worker(
  'document-pipeline',
  async (job) => {
    if (job.name === 'process-version') {
      await processVersionJob(job.data);
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err);
});

// Periodic timer to flush any pending batches even if batchMaxLeaves not reached
setInterval(() => {
  checkAndFlushMerkleBatch().catch((err) => {
    console.error('[Timer] Batch flush error:', err);
  });
}, config.batchMaxWaitSeconds * 1000);
