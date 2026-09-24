import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { formatDidPkh, hashDid } from '@securechain/common';
import { config } from '../config.js';
import { query } from '../db.js';
import { putObject, getObject, getPublicObjectUrl } from '../minio.js';
import { getNftContract, adminSigner, provider } from '../chain.js';
import { requireOnChainRole } from '../auth.js';

export const assetRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/assets - list assets from DB cache / chain
  fastify.get<{ Querystring: { wallet?: string; role?: string } }>('/', async (req, _reply) => {
    let callerWallet = req.query?.wallet?.toLowerCase()?.trim();
    let callerRole = req.query?.role?.toUpperCase()?.trim();

    // Check JWT cookie or bearer token if present
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.jwtSecret);
        if (decoded?.address) callerWallet = decoded.address.toLowerCase().trim();
        if (decoded?.role) callerRole = String(decoded.role).toUpperCase().trim();
      } catch {}
    }

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

      // If user is standard USER role, strictly restrict visibility to involved wallet
      const isPrivileged = callerRole === 'ADMIN' || callerRole === 'MANAGER' || callerRole === 'AUDITOR';
      if (!isPrivileged && callerRole === 'USER' && callerWallet) {
        const ownerLower = (chainData?.owner || '').toLowerCase();
        if (ownerLower !== callerWallet) {
          continue;
        }
      }

      const publicMinioUrl = getPublicObjectUrl(config.minio.buckets.assetThumbnails, row.minio_key);

      assets.push({
        tokenId: row.token_id,
        minioKey: row.minio_key,
        mimeType: row.mime_type,
        createdAt: row.created_at,
        thumbnailUrl: config.minio.publicUrl ? publicMinioUrl : `/api/assets/${row.token_id}/thumbnail`,
        publicMinioUrl,
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
  fastify.post(
    '/mint',
    { preHandler: [requireOnChainRole('ADMIN')] },
    async (req, reply) => {
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

      // Default `to` to relayer address when blank ("retain in custody")
      if (!toAddress || toAddress.trim() === '') {
        toAddress = adminSigner?.address;
      }

      if (!toAddress || !assetClass) {
        return reply.status(400).send({ error: 'Missing required fields: to, assetClass' });
      }

      const did = formatDidPkh(config.chainId, toAddress);
      const didHash = hashDid(did);

      let tokenId: string | null = null;
      let txHash: string | null = null;

      const nft = getNftContract(adminSigner);
      if (!config.nftAddress || !nft || !adminSigner) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      let finalMetadataURI = metadataURI;
      let minioImageUrl = '';
      let minioKey = '';

      // Upload thumbnail to MinIO before minting so public MinIO image URL is stamped in on-chain tokenURI
      if (thumbnailBuffer) {
        minioKey = `asset_${Date.now()}_thumb`;
        try {
          await putObject(
            config.minio.buckets.assetThumbnails,
            minioKey,
            thumbnailBuffer,
            thumbnailBuffer.length,
            { 'Content-Type': thumbnailMime }
          );
          minioImageUrl = getPublicObjectUrl(config.minio.buckets.assetThumbnails, minioKey);
        } catch (minioErr: any) {
          req.log.warn(`[MinIO] Asset thumbnail upload warning: ${minioErr.message}`);
        }
      }

      // If metadataURI is raw text without an image, build valid ERC-721 metadata JSON for Polygonscan
      if (!finalMetadataURI || (!finalMetadataURI.startsWith('data:application/json') && !finalMetadataURI.startsWith('http://') && !finalMetadataURI.startsWith('https://') && !finalMetadataURI.startsWith('ipfs://'))) {
        const metadataJson = {
          name: finalMetadataURI || 'Enterprise Asset',
          description: `${assetClass} enterprise asset secured on Polygon Amoy`,
          image: minioImageUrl || '',
          external_url: 'https://securechain1.vercel.app/assets',
          attributes: [
            { trait_type: 'Asset Class', value: assetClass },
            { trait_type: 'Network', value: 'Polygon Amoy (80002)' },
            { trait_type: 'Storage', value: minioImageUrl ? 'MinIO / S3' : 'On-Chain' },
            { trait_type: 'Standard', value: 'ERC-721' },
          ],
        };
        const jsonStr = JSON.stringify(metadataJson);
        finalMetadataURI = `data:application/json;base64,${Buffer.from(jsonStr).toString('base64')}`;
      }

      try {
        await nft.mint.staticCall(toAddress, didHash, assetClass, finalMetadataURI);
        const tx = await nft.mint(toAddress, didHash, assetClass, finalMetadataURI);
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
        return reply.status(400).send({ error: 'On-chain mint failed: ' + (err.reason || err.shortMessage || err.message) });
      }

      if (!tokenId) {
        return reply.status(500).send({ error: 'Mint succeeded on-chain but failed to parse tokenId from receipt' });
      }

      // Associate MinIO thumbnail with confirmed tokenId in DB
      if (thumbnailBuffer && minioKey) {
        try {
          await query(
            `INSERT INTO asset_thumbnails (token_id, minio_key, mime_type, created_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (token_id) DO UPDATE SET minio_key = $2, mime_type = $3`,
            [tokenId, minioKey, thumbnailMime]
          );
        } catch (dbErr: any) {
          req.log.warn(`DB thumbnail record cache skipped: ${dbErr.message}`);
        }
      }

      const publicUrl = minioImageUrl || (minioKey ? getPublicObjectUrl(config.minio.buckets.assetThumbnails, minioKey) : null);

      return {
        success: true,
        tokenId,
        txHash,
        thumbnailUrl: publicUrl || `/api/assets/${tokenId}/thumbnail`,
        publicMinioUrl: publicUrl,
        assetClass,
        owner: toAddress.toLowerCase(),
        did,
      };
    }
  );

  // POST /api/assets/upload-thumbnail - Pre-upload asset image to MinIO so caller gets public URL for direct MetaMask minting
  fastify.post('/upload-thumbnail', async (req, reply) => {
    if (!req.isMultipart()) {
      return reply.status(400).send({ error: 'Request must be multipart/form-data' });
    }

    let fileBuffer: Buffer | null = null;
    let mimeType = 'image/png';
    let fileName = 'thumbnail.png';

    const parts = req.parts();
    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'thumbnail') {
        fileBuffer = await part.toBuffer();
        mimeType = part.mimetype;
        fileName = part.filename;
      }
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return reply.status(400).send({ error: 'No thumbnail file uploaded' });
    }

    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `thumb_${Date.now()}_${cleanName}`;

    try {
      await putObject(
        config.minio.buckets.assetThumbnails,
        objectKey,
        fileBuffer,
        fileBuffer.length,
        { 'Content-Type': mimeType }
      );

      const publicUrl = getPublicObjectUrl(config.minio.buckets.assetThumbnails, objectKey);
      return {
        success: true,
        minioKey: objectKey,
        publicUrl,
        mimeType,
      };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ error: `MinIO upload failed: ${err.message}` });
    }
  });

  // POST /api/assets/allocate - Admin initial allocation
  fastify.post<{ Body: { tokenId: string; to: string } }>(
    '/allocate',
    { preHandler: [requireOnChainRole('ADMIN')] },
    async (req, reply) => {
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
        await nft.allocateInitial.staticCall(BigInt(tokenId), to, toDidHash);
        const tx = await nft.allocateInitial(BigInt(tokenId), to, toDidHash);
        await tx.wait();
        return { success: true, tokenId, to, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Allocation failed: ' + (err.reason || err.shortMessage || err.message) });
      }
    }
  );

  // POST /api/assets/transfer - Policy transfer
  fastify.post<{ Body: { tokenId: string; from: string; to: string } }>(
    '/transfer',
    { preHandler: [requireOnChainRole('ADMIN', 'MANAGER')] },
    async (req, reply) => {
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
        await nft.authorizeTransfer.staticCall(BigInt(tokenId), from, to, toDidHash);
        const tx = await nft.authorizeTransfer(BigInt(tokenId), from, to, toDidHash);
        await tx.wait();
        return { success: true, tokenId, from, to, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Transfer failed: ' + (err.reason || err.shortMessage || err.message) });
      }
    }
  );

  // POST /api/assets/retire - Admin retires asset
  fastify.post<{ Body: { tokenId: string; reason: string } }>(
    '/retire',
    { preHandler: [requireOnChainRole('ADMIN')] },
    async (req, reply) => {
      const { tokenId, reason } = req.body;
      if (!tokenId || !reason) {
        return reply.status(400).send({ error: 'Missing tokenId or reason' });
      }

      const nft = getNftContract(adminSigner);
      if (!config.nftAddress || !nft || !adminSigner) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        await nft.retireAsset.staticCall(BigInt(tokenId), reason);
        const tx = await nft.retireAsset(BigInt(tokenId), reason);
        await tx.wait();
        return { success: true, tokenId, reason, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Retirement failed: ' + (err.reason || err.shortMessage || err.message) });
      }
    }
  );
};

