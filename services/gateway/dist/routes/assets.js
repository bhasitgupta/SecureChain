"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = void 0;
const common_1 = require("@sih26125/common");
const contracts_1 = require("@sih26125/contracts");
const config_js_1 = require("../config.js");
const db_js_1 = require("../db.js");
const minio_js_1 = require("../minio.js");
const chain_js_1 = require("../chain.js");
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
                    const rec = await chain_js_1.publicClient.readContract({
                        address: config_js_1.config.nftAddress,
                        abi: contracts_1.EnterpriseAssetNFTAbi,
                        functionName: 'getAsset',
                        args: [BigInt(row.token_id)],
                    });
                    const owner = await chain_js_1.publicClient.readContract({
                        address: config_js_1.config.nftAddress,
                        abi: contracts_1.EnterpriseAssetNFTAbi,
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
                }
                catch {
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
    fastify.get('/:tokenId/thumbnail', async (req, reply) => {
        const { tokenId } = req.params;
        const res = await (0, db_js_1.query)(`SELECT minio_key, mime_type FROM asset_thumbnails WHERE token_id = $1`, [tokenId]);
        if (res.rows.length === 0) {
            return reply.status(404).send({ error: 'Thumbnail not found' });
        }
        const { minio_key, mime_type } = res.rows[0];
        try {
            const stream = await (0, minio_js_1.getObject)(config_js_1.config.minio.buckets.assetThumbnails, minio_key);
            reply.header('Content-Type', mime_type || 'image/jpeg');
            reply.header('Cache-Control', 'public, max-age=86400');
            return reply.send(stream);
        }
        catch (err) {
            req.log.error(err);
            return reply.status(500).send({ error: 'Failed to retrieve thumbnail' });
        }
    });
    // GET /api/assets/:tokenId - Get asset details
    fastify.get('/:tokenId', async (req, reply) => {
        const { tokenId } = req.params;
        let chainData = null;
        if (config_js_1.config.nftAddress) {
            try {
                const rec = await chain_js_1.publicClient.readContract({
                    address: config_js_1.config.nftAddress,
                    abi: contracts_1.EnterpriseAssetNFTAbi,
                    functionName: 'getAsset',
                    args: [BigInt(tokenId)],
                });
                const owner = await chain_js_1.publicClient.readContract({
                    address: config_js_1.config.nftAddress,
                    abi: contracts_1.EnterpriseAssetNFTAbi,
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
            }
            catch (err) {
                req.log.warn({ err }, 'Contract read failed for getAsset');
            }
        }
        const thumbRes = await (0, db_js_1.query)(`SELECT minio_key, mime_type FROM asset_thumbnails WHERE token_id = $1`, [tokenId]);
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
        let thumbnailBuffer = null;
        let thumbnailMime = 'image/jpeg';
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
        if (!toAddress || !assetClass) {
            return reply.status(400).send({ error: 'Missing required fields: to, assetClass' });
        }
        const did = (0, common_1.formatDidPkh)(config_js_1.config.chainId, toAddress);
        const didHash = (0, common_1.hashDid)(did);
        let tokenId = null;
        let txHash = null;
        if (config_js_1.config.nftAddress && chain_js_1.walletClient && chain_js_1.adminAccount) {
            try {
                txHash = await chain_js_1.walletClient.writeContract({
                    address: config_js_1.config.nftAddress,
                    abi: contracts_1.EnterpriseAssetNFTAbi,
                    functionName: 'mint',
                    args: [toAddress, didHash, assetClass, metadataURI],
                });
                // Wait for receipt to extract tokenId from event
                const receipt = await chain_js_1.publicClient.waitForTransactionReceipt({
                    hash: txHash,
                });
                // Transfer event topic or AssetMinted
                for (const log of receipt.logs) {
                    if (log.topics[0] && log.topics[3]) {
                        // Transfer(address,address,uint256)
                        tokenId = BigInt(log.topics[3]).toString();
                        break;
                    }
                }
            }
            catch (err) {
                req.log.error(err);
                return reply.status(400).send({ error: 'On-chain mint failed: ' + err.message });
            }
        }
        // If local demo or contract not yet deployed, generate fallback monotonic or random ID
        if (!tokenId) {
            const countRes = await (0, db_js_1.query)(`SELECT COUNT(*) FROM asset_thumbnails`);
            tokenId = (parseInt(countRes.rows[0].count, 10) + 1).toString();
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
    fastify.post('/allocate', async (req, reply) => {
        const { tokenId, to } = req.body;
        if (!tokenId || !to) {
            return reply.status(400).send({ error: 'Missing tokenId or to' });
        }
        const toDid = (0, common_1.formatDidPkh)(config_js_1.config.chainId, to);
        const toDidHash = (0, common_1.hashDid)(toDid);
        if (!config_js_1.config.nftAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.nftAddress,
                abi: contracts_1.EnterpriseAssetNFTAbi,
                functionName: 'allocateInitial',
                args: [BigInt(tokenId), to, toDidHash],
            });
            return { success: true, tokenId, to, txHash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Allocation failed: ' + err.message });
        }
    });
    // POST /api/assets/transfer - Policy transfer
    fastify.post('/transfer', async (req, reply) => {
        const { tokenId, from, to } = req.body;
        if (!tokenId || !from || !to) {
            return reply.status(400).send({ error: 'Missing tokenId, from, or to' });
        }
        const toDid = (0, common_1.formatDidPkh)(config_js_1.config.chainId, to);
        const toDidHash = (0, common_1.hashDid)(toDid);
        if (!config_js_1.config.nftAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.nftAddress,
                abi: contracts_1.EnterpriseAssetNFTAbi,
                functionName: 'authorizeTransfer',
                args: [BigInt(tokenId), from, to, toDidHash],
            });
            return { success: true, tokenId, from, to, txHash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Transfer failed: ' + err.message });
        }
    });
    // POST /api/assets/retire - Admin retires asset
    fastify.post('/retire', async (req, reply) => {
        const { tokenId, reason } = req.body;
        if (!tokenId || !reason) {
            return reply.status(400).send({ error: 'Missing tokenId or reason' });
        }
        if (!config_js_1.config.nftAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.nftAddress,
                abi: contracts_1.EnterpriseAssetNFTAbi,
                functionName: 'retireAsset',
                args: [BigInt(tokenId), reason],
            });
            return { success: true, tokenId, reason, txHash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Retirement failed: ' + err.message });
        }
    });
};
exports.assetRoutes = assetRoutes;
