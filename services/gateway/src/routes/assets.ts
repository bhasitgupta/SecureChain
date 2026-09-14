import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { formatDidPkh, hashDid } from '@sih26125/common';
import { EnterpriseAssetNFTAbi } from '@sih26125/contracts';
import { config } from '../config.js';
import { query } from '../db.js';
import { putObject, getObject } from '../minio.js';
import { publicClient, walletClient, adminAccount } from '../chain.js';

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
          const rec = await publicClient.readContract({
            address: config.nftAddress,
            abi: EnterpriseAssetNFTAbi,
            functionName: 'getAsset',
            args: [BigInt(row.token_id)],
          });
          const owner = await publicClient.readContract({
            address: config.nftAddress,
            abi: EnterpriseAssetNFTAbi,
            functionName: 'ownerOf',
            args: [BigInt(row.token_id)],
          });
          chainData = {
            owner,
            didHash: rec.didHash,
            assetClass: rec.assetClass,
            status: rec.status === 1 ? 'Active' : rec.status === 2 ? 'Transferred' : 'Retired',
            metadataURI: rec.metadataURI,
            mintedAt: Number(rec.mintedAt),
          };
        } catch {
          // fallback if contract read fails
        }
      }

      assets.push({
        tokenId: row.token_id,
        thumbnailUrl: `/api/assets/${row.token_id}/thumbnail`,
        ...chainData,
      });
    }

    return { assets };
  });

  // GET /api/assets/:tokenId/thumbnail - Serve thumbnail image from MinIO
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
      reply.header('Content-Type', mime_type || 'image/jpeg');
      reply.header('Cache-Control', 'public, max-age=86400');
      return reply.send(stream);
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ error: 'Failed to retrieve thumbnail' });
    }
  });

  // GET /api/assets/:tokenId - Get asset details
  fastify.get<{ Params: { tokenId: string } }>('/:tokenId', async (req, reply) => {
    const { tokenId } = req.params;

    let chainData: any = null;
    if (config.nftAddress) {
      try {
        const rec = await publicClient.readContract({
          address: config.nftAddress,
          abi: EnterpriseAssetNFTAbi,
          functionName: 'getAsset',
          args: [BigInt(tokenId)],
        });
        const owner = await publicClient.readContract({
          address: config.nftAddress,
          abi: EnterpriseAssetNFTAbi,
          functionName: 'ownerOf',
          args: [BigInt(tokenId)],
        });
        chainData = {
          tokenId,
          owner,
          didHash: rec.didHash,
          assetClass: rec.assetClass,
          status: rec.status === 1 ? 'Active' : rec.status === 2 ? 'Transferred' : 'Retired',
          metadataURI: rec.metadataURI,
          mintedAt: Number(rec.mintedAt),
        };
      } catch (err) {
        req.log.warn({ err }, 'Contract read failed for getAsset');
      }
    }

    const thumbRes = await query(
      `SELECT minio_key, mime_type FROM asset_thumbnails WHERE token_id = $1`,
      [tokenId]
    );

    return {
      tokenId,
      thumbnailUrl: thumbRes.rows.length > 0 ? `/api/assets/${tokenId}/thumbnail` : null,
      ...chainData,
    };
  });

  // POST /api/assets/mint - Admin mints NFT with thumbnail
  fastify.post('/mint', async (req, reply) => {
    let toAddress = '';
    let assetClass = '';
    let metadataURI = '';
    let thumbnailBuffer: Buffer | null = null;
    let thumbnailMime = 'image/jpeg';

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

    if (config.nftAddress && walletClient && adminAccount) {
      try {
        txHash = await walletClient.writeContract({
          address: config.nftAddress,
          abi: EnterpriseAssetNFTAbi,
          functionName: 'mint',
          args: [toAddress as `0x${string}`, didHash, assetClass, metadataURI],
        });

        // Wait for receipt to extract tokenId from event
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash as `0x${string}`,
        });

        // Transfer event topic or AssetMinted
        for (const log of receipt.logs) {
          if (log.topics[0] && log.topics[3]) {
            // Transfer(address,address,uint256)
            tokenId = BigInt(log.topics[3]).toString();
            break;
          }
        }
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'On-chain mint failed: ' + err.message });
      }
    }

    // If local demo or contract not yet deployed, generate fallback monotonic or random ID
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

    if (!config.nftAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.nftAddress,
        abi: EnterpriseAssetNFTAbi,
        functionName: 'allocateInitial',
        args: [BigInt(tokenId), to as `0x${string}`, toDidHash],
      });

      return { success: true, tokenId, to, txHash };
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

    if (!config.nftAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.nftAddress,
        abi: EnterpriseAssetNFTAbi,
        functionName: 'authorizeTransfer',
        args: [BigInt(tokenId), from as `0x${string}`, to as `0x${string}`, toDidHash],
      });

      return { success: true, tokenId, from, to, txHash };
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

    if (!config.nftAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.nftAddress,
        abi: EnterpriseAssetNFTAbi,
        functionName: 'retireAsset',
        args: [BigInt(tokenId), reason],
      });

      return { success: true, tokenId, reason, txHash };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Retirement failed: ' + err.message });
    }
  });
};
