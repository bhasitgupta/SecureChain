"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = void 0;
const common_1 = require("@sih26125/common");
const config_js_1 = require("../config.js");
const db_js_1 = require("../db.js");
const minio_js_1 = require("../minio.js");
const chain_js_1 = require("../chain.js");
const auth_js_1 = require("../auth.js");
const assetRoutes = async (fastify) => {
    // GET /api/assets - list assets from DB cache / chain
    fastify.get('/', async (_req, _reply) => {
        const res = await (0, db_js_1.query)(`SELECT a.token_id, a.minio_key, a.mime_type, a.created_at
       FROM asset_thumbnails a
       ORDER BY a.created_at DESC`);
        const assets = [];
        for (const row of res.rows) {
            let chainData = null;
            if (config_js_1.config.nftAddress) {
                try {
                    const nft = (0, chain_js_1.getNftContract)(chain_js_1.provider);
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
                }
                catch (e) {
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
    fastify.get('/:tokenId/thumbnail', async (req, reply) => {
        const { tokenId } = req.params;
        const res = await (0, db_js_1.query)(`SELECT minio_key, mime_type FROM asset_thumbnails WHERE token_id = $1`, [tokenId]);
        if (res.rows.length === 0) {
            return reply.status(404).send({ error: 'Thumbnail not found' });
        }
        const { minio_key, mime_type } = res.rows[0];
        try {
            const stream = await (0, minio_js_1.getObject)(config_js_1.config.minio.buckets.assetThumbnails, minio_key);
            reply.header('Content-Type', mime_type || 'image/png');
            return reply.send(stream);
        }
        catch (err) {
            req.log.error(err);
            return reply.status(500).send({ error: 'Failed to retrieve thumbnail from MinIO' });
        }
    });
    // GET /api/assets/:tokenId - Get asset details
    fastify.get('/:tokenId', async (req, reply) => {
        const { tokenId } = req.params;
        let chainData = null;
        if (config_js_1.config.nftAddress) {
            try {
                const nft = (0, chain_js_1.getNftContract)(chain_js_1.provider);
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
            }
            catch (err) {
                req.log.warn(`Token #${tokenId} not found on-chain: ${err}`);
            }
        }
        const res = await (0, db_js_1.query)(`SELECT minio_key, mime_type, created_at FROM asset_thumbnails WHERE token_id = $1`, [tokenId]);
        return {
            tokenId,
            thumbnailUrl: res.rows.length > 0 ? `/api/assets/${tokenId}/thumbnail` : null,
            chain: chainData,
        };
    });
    // POST /api/assets/mint - Multipart form with thumbnail image + metadata
    fastify.post('/mint', { preHandler: [(0, auth_js_1.requireOnChainRole)('ADMIN')] }, async (req, reply) => {
        let toAddress;
        let assetClass;
        let metadataURI = '';
        let thumbnailBuffer = null;
        let thumbnailMime = 'image/png';
        if (req.isMultipart()) {
            const parts = req.parts();
            for await (const part of parts) {
                if (part.type === 'file' && part.fieldname === 'thumbnail') {
                    thumbnailBuffer = await part.toBuffer();
                    thumbnailMime = part.mimetype;
                }
                else if (part.type === 'field') {
                    if (part.fieldname === 'to')
                        toAddress = part.value;
                    if (part.fieldname === 'assetClass')
                        assetClass = part.value;
                    if (part.fieldname === 'metadataURI')
                        metadataURI = part.value;
                }
            }
        }
        else {
            const body = req.body;
            toAddress = body?.to;
            assetClass = body?.assetClass;
            metadataURI = body?.metadataURI || '';
        }
        // Default `to` to relayer address when blank ("retain in custody")
        if (!toAddress || toAddress.trim() === '') {
            toAddress = chain_js_1.adminSigner?.address;
        }
        if (!toAddress || !assetClass) {
            return reply.status(400).send({ error: 'Missing required fields: to, assetClass' });
        }
        const did = (0, common_1.formatDidPkh)(config_js_1.config.chainId, toAddress);
        const didHash = (0, common_1.hashDid)(did);
        let tokenId = null;
        let txHash = null;
        const nft = (0, chain_js_1.getNftContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.nftAddress || !nft || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            await nft.mint.staticCall(toAddress, didHash, assetClass, metadataURI);
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
                }
                catch { }
            }
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'On-chain mint failed: ' + (err.reason || err.shortMessage || err.message) });
        }
        if (!tokenId) {
            return reply.status(500).send({ error: 'Mint succeeded on-chain but failed to parse tokenId from receipt' });
        }
        // Save thumbnail in MinIO if provided
        if (thumbnailBuffer) {
            const minioKey = `${tokenId}_thumbnail`;
            await (0, minio_js_1.putObject)(config_js_1.config.minio.buckets.assetThumbnails, minioKey, thumbnailBuffer, thumbnailBuffer.length, { 'Content-Type': thumbnailMime });
            await (0, db_js_1.query)(`INSERT INTO asset_thumbnails (token_id, minio_key, mime_type, created_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (token_id) DO UPDATE SET minio_key = $2, mime_type = $3`, [tokenId, minioKey, thumbnailMime]);
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
    fastify.post('/allocate', { preHandler: [(0, auth_js_1.requireOnChainRole)('ADMIN')] }, async (req, reply) => {
        const { tokenId, to } = req.body;
        if (!tokenId || !to) {
            return reply.status(400).send({ error: 'Missing tokenId or to' });
        }
        const toDid = (0, common_1.formatDidPkh)(config_js_1.config.chainId, to);
        const toDidHash = (0, common_1.hashDid)(toDid);
        const nft = (0, chain_js_1.getNftContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.nftAddress || !nft || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            await nft.allocateInitial.staticCall(BigInt(tokenId), to, toDidHash);
            const tx = await nft.allocateInitial(BigInt(tokenId), to, toDidHash);
            await tx.wait();
            return { success: true, tokenId, to, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Allocation failed: ' + (err.reason || err.shortMessage || err.message) });
        }
    });
    // POST /api/assets/transfer - Policy transfer
    fastify.post('/transfer', { preHandler: [(0, auth_js_1.requireOnChainRole)('ADMIN', 'MANAGER')] }, async (req, reply) => {
        const { tokenId, from, to } = req.body;
        if (!tokenId || !from || !to) {
            return reply.status(400).send({ error: 'Missing tokenId, from, or to' });
        }
        const toDid = (0, common_1.formatDidPkh)(config_js_1.config.chainId, to);
        const toDidHash = (0, common_1.hashDid)(toDid);
        const nft = (0, chain_js_1.getNftContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.nftAddress || !nft || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            await nft.authorizeTransfer.staticCall(BigInt(tokenId), from, to, toDidHash);
            const tx = await nft.authorizeTransfer(BigInt(tokenId), from, to, toDidHash);
            await tx.wait();
            return { success: true, tokenId, from, to, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Transfer failed: ' + (err.reason || err.shortMessage || err.message) });
        }
    });
    // POST /api/assets/retire - Admin retires asset
    fastify.post('/retire', { preHandler: [(0, auth_js_1.requireOnChainRole)('ADMIN')] }, async (req, reply) => {
        const { tokenId, reason } = req.body;
        if (!tokenId || !reason) {
            return reply.status(400).send({ error: 'Missing tokenId or reason' });
        }
        const nft = (0, chain_js_1.getNftContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.nftAddress || !nft || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            await nft.retireAsset.staticCall(BigInt(tokenId), reason);
            const tx = await nft.retireAsset(BigInt(tokenId), reason);
            await tx.wait();
            return { success: true, tokenId, reason, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Retirement failed: ' + (err.reason || err.shortMessage || err.message) });
        }
    });
};
exports.assetRoutes = assetRoutes;
