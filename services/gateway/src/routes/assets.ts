import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { formatDidPkh, hashDid } from '@sih26125/common';
import { config } from '../config.js';
import { query } from '../db.js';
import { putObject, getObject } from '../minio.js';
import { getNftContract, adminSigner, provider } from '../chain.js';

export const assetRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/assets - list assets from DB cache / chain
  fastify.get('/', async (_req, _reply) => {
    const res = await query(
      `SELECT a.token_id, a.minio_key, a.mime_type, a.created_at
       FROM asset_thumbnails a
       ORDER BY a.created_at DESC`
    );

    const assets = [];
    for (const row of res.rows) {
      let chainData: any = null;
      if (config.nftAddress) {
        try {
          const nft = getNftContract(provider);
          if (nft) {
            const rec = await nft.getAsset(BigInt(row.token_id));
            const owner = await nft.ownerOf(BigInt(row.token_id));
            chainData = {
              owner,
              didHash: rec.didHash,
              assetClass: rec.assetClass,
              status: Number(rec.status) === 1 ? 'Active' : Number(rec.status) === 2 ? 'Transferred' : 'Retired',
              metadataURI: rec.metadataURI,
            };
          }
        } catch (e) {
          // ignore chain read errors for local cache items
        }
      }

      assets.push({
        tokenId: row.token_id,
        minioKey: row.minio_key,
        mimeType: row.mime_type,
        createdAt: row.created_at,
        thumbnailUrl: `/api/assets/${row.token_id}/thumbnail`,
        chain: chainData,
      });
    }

    return { assets };
  });

  // GET /api/assets/:tokenId/thumbnail - Stream thumbnail from MinIO
  fastify.get<{ Params: { tokenId: string } }>('/:tokenId/thumbnail', async (req, reply) => {
    const { tokenId } = req.params;

    const res = await query(
      `SELECT minio_key, mime_type FROM asset_thumbnails WHERE token_id = $1`,
      [tokenId]
    );

    if (res.rows.length === 0) {
      return reply.status(404).send({ error: 'Thumbnail not found' });
    }

    const { minio_key, mime_type } = res.rows[0];

    try {
      const stream = await getObject(config.minio.buckets.assetThumbnails, minio_key);
      reply.header('Content-Type', mime_type || 'image/png');
      return reply.send(stream);
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ error: 'Failed to retrieve thumbnail from MinIO' });
    }
  });

  // GET /api/assets/:tokenId - Get asset details
  fastify.get<{ Params: { tokenId: string } }>('/:tokenId', async (req, reply) => {
    const { tokenId } = req.params;

    let chainData: any = null;
    if (config.nftAddress) {
      try {
        const nft = getNftContract(provider);
        if (nft) {
          const rec = await nft.getAsset(BigInt(tokenId));
          const owner = await nft.ownerOf(BigInt(tokenId));
          chainData = {
            tokenId,
            owner,
            didHash: rec.didHash,
            assetClass: rec.assetClass,
            status: Number(rec.status) === 1 ? 'Active' : Number(rec.status) === 2 ? 'Transferred' : 'Retired',
            metadataURI: rec.metadataURI,
            mintedAt: Number(rec.mintedAt),
          };
        }
      } catch (err) {
        req.log.warn(`Token #${tokenId} not found on-chain: ${err}`);
      }
    }

    const res = await query(
      `SELECT minio_key, mime_type, created_at FROM asset_thumbnails WHERE token_id = $1`,
      [tokenId]
    );

    return {
      tokenId,
      thumbnailUrl: res.rows.length > 0 ? `/api/assets/${tokenId}/thumbnail` : null,
      chain: chainData,
    };
  });

  // POST /api/assets/mint - Multipart form with thumbnail image + metadata
  fastify.post('/mint', async (req, reply) => {
    let toAddress: string | undefined;
    let assetClass: string | undefined;
    let metadataURI: string = '';
    let thumbnailBuffer: Buffer | null = null;
    let thumbnailMime: string = 'image/png';

    if (req.isMultipart()) {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'thumbnail') {
          thumbnailBuffer = await part.toBuffer();
          thumbnailMime = part.mimetype;
        } else if (part.type === 'field') {
          if (part.fieldname === 'to') toAddress = part.value as string;
          if (part.fieldname === 'assetClass') assetClass = part.value as string;
          if (part.fieldname === 'metadataURI') metadataURI = part.value as string;
        }
      }
    } else {
      const body = req.body as any;
      toAddress = body?.to;
      assetClass = body?.assetClass;
      metadataURI = body?.metadataURI || '';
    }

    if (!toAddress || !assetClass) {
      return reply.status(400).send({ error: 'Missing required fields: to, assetClass' });
    }

    const did = formatDidPkh(config.chainId, toAddress);
    const didHash = hashDid(did);

    let tokenId: string | null = null;
    let txHash: string | null = null;

    const nft = getNftContract(adminSigner);
    if (config.nftAddress && nft && adminSigner) {
      try {
        const tx = await nft.mint(toAddress, didHash, assetClass, metadataURI);
        txHash = tx.hash;
        const receipt = await tx.wait();

        for (const log of receipt.logs) {
          try {
            const parsed = nft.interface.parseLog(log);
            if (parsed && (parsed.name === 'AssetMinted' || parsed.name === 'Transfer')) {
              tokenId = (parsed.args.tokenId ?? parsed.args[2]).toString();
              break;
            }
          } catch {}
        }
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'On-chain mint failed: ' + err.message });
      }
    }

    // Fallback ID if off-chain or indexing
    if (!tokenId) {
      const countRes = await query(`SELECT COUNT(*) FROM asset_thumbnails`);
      tokenId = (parseInt(countRes.rows[0].count, 10) + 1).toString();
    }

    // Save thumbnail in MinIO if provided
    if (thumbnailBuffer) {
      const minioKey = `${tokenId}_thumbnail`;
      await putObject(
        config.minio.buckets.assetThumbnails,
        minioKey,
        thumbnailBuffer,
        thumbnailBuffer.length,
        { 'Content-Type': thumbnailMime }
      );

      await query(
        `INSERT INTO asset_thumbnails (token_id, minio_key, mime_type, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (token_id) DO UPDATE SET minio_key = $2, mime_type = $3`,
        [tokenId, minioKey, thumbnailMime]
      );
    }

    return {
      success: true,
      tokenId,
      txHash,
      thumbnailUrl: thumbnailBuffer ? `/api/assets/${tokenId}/thumbnail` : null,
      assetClass,
      owner: toAddress.toLowerCase(),
      did,
    };
  });

  // POST /api/assets/allocate - Admin initial allocation
  fastify.post<{ Body: { tokenId: string; to: string } }>('/allocate', async (req, reply) => {
    const { tokenId, to } = req.body;
    if (!tokenId || !to) {
      return reply.status(400).send({ error: 'Missing tokenId or to' });
    }

    const toDid = formatDidPkh(config.chainId, to);
    const toDidHash = hashDid(toDid);

    const nft = getNftContract(adminSigner);
    if (!config.nftAddress || !nft || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const tx = await nft.allocateInitial(BigInt(tokenId), to, toDidHash);
      await tx.wait();
      return { success: true, tokenId, to, txHash: tx.hash };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Allocation failed: ' + err.message });
    }
  });

  // POST /api/assets/transfer - Policy transfer
  fastify.post<{ Body: { tokenId: string; from: string; to: string } }>('/transfer', async (req, reply) => {
    const { tokenId, from, to } = req.body;
    if (!tokenId || !from || !to) {
      return reply.status(400).send({ error: 'Missing tokenId, from, or to' });
    }

    const toDid = formatDidPkh(config.chainId, to);
    const toDidHash = hashDid(toDid);

    const nft = getNftContract(adminSigner);
    if (!config.nftAddress || !nft || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const tx = await nft.authorizeTransfer(BigInt(tokenId), from, to, toDidHash);
      await tx.wait();
      return { success: true, tokenId, from, to, txHash: tx.hash };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Transfer failed: ' + err.message });
    }
  });

  // POST /api/assets/retire - Admin retires asset
  fastify.post<{ Body: { tokenId: string; reason: string } }>('/retire', async (req, reply) => {
    const { tokenId, reason } = req.body;
    if (!tokenId || !reason) {
      return reply.status(400).send({ error: 'Missing tokenId or reason' });
    }

    const nft = getNftContract(adminSigner);
    if (!config.nftAddress || !nft || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const tx = await nft.retireAsset(BigInt(tokenId), reason);
      await tx.wait();
      return { success: true, tokenId, reason, txHash: tx.hash };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Retirement failed: ' + err.message });
    }
  });
};
