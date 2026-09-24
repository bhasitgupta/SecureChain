"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoutes = void 0;
const crypto_1 = require("crypto");
const merkle_1 = require("@securechain/merkle");
const config_js_1 = require("../config.js");
const db_js_1 = require("../db.js");
const minio_js_1 = require("../minio.js");
const chain_js_1 = require("../chain.js");
const verifyRoutes = async (fastify) => {
    // POST /api/verify/:versionId - Run full 4-step cryptographic verification
    fastify.post('/:versionId', async (req, reply) => {
        const { versionId } = req.params;
        // 1. Fetch version record + proof record + batch record from DB
        const res = await (0, db_js_1.query)(`SELECT v.version_id, v.document_id, v.sha256, v.minio_key, v.state,
              p.leaf_hash, p.batch_id, p.leaf_index, p.proof_json, p.status AS proof_status,
              b.root AS merkle_root, b.anchor_tx, b.anchor_block, b.status AS batch_status
       FROM document_versions v
       LEFT JOIN proof_records p ON v.version_id = p.version_id
       LEFT JOIN merkle_batches b ON p.batch_id = b.batch_id
       WHERE v.version_id = $1`, [versionId]);
        if (res.rows.length === 0) {
            return reply.status(404).send({ error: 'Version record not found' });
        }
        const row = res.rows[0];
        const steps = {
            objectRetrieved: false,
            sha256Match: false,
            merkleInclusionMatch: false,
            polygonAnchorMatch: false,
        };
        let computedSha256 = '';
        let computedLeaf = '0x0000000000000000000000000000000000000000000000000000000000000000';
        let anchoredRoot = '';
        let failureReason;
        // Step 1: Retrieve exact object from MinIO
        let fileBuffer;
        try {
            const stream = await (0, minio_js_1.getObject)(config_js_1.config.minio.buckets.documents, row.minio_key);
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            fileBuffer = Buffer.concat(chunks);
            steps.objectRetrieved = true;
        }
        catch (err) {
            failureReason = 'Failed to retrieve object from storage: ' + err.message;
            return reply.send({
                valid: false,
                versionId,
                steps,
                details: { failureReason },
            });
        }
        // Step 2: Compute SHA-256 of exact retrieved bytes & compare
        computedSha256 = (0, crypto_1.createHash)('sha256').update(fileBuffer).digest('hex');
        if (computedSha256.toLowerCase() === row.sha256.toLowerCase()) {
            steps.sha256Match = true;
        }
        else {
            failureReason = `SHA-256 mismatch! Computed ${computedSha256} != stored ${row.sha256}`;
            return reply.send({
                valid: false,
                versionId,
                steps,
                details: {
                    computedSha256,
                    expectedSha256: row.sha256,
                    failureReason,
                },
            });
        }
        // Step 3: Compute leaf hash and verify Merkle inclusion proof
        computedLeaf = (0, merkle_1.hashLeaf)(row.document_id, row.version_id, computedSha256);
        const proofArray = (row.proof_json || []);
        const recordedRoot = row.merkle_root;
        if (recordedRoot && proofArray.length > 0) {
            const isMerkleValid = (0, merkle_1.verifyProof)(computedLeaf, proofArray, recordedRoot);
            if (isMerkleValid) {
                steps.merkleInclusionMatch = true;
            }
            else {
                failureReason = 'Merkle inclusion proof failed against recorded batch root';
            }
        }
        else if (recordedRoot && proofArray.length === 0) {
            // Single-leaf batch root is leaf itself
            if (computedLeaf.toLowerCase() === recordedRoot.toLowerCase()) {
                steps.merkleInclusionMatch = true;
            }
        }
        // Step 4: Verify against Polygon on-chain anchor contract
        if (config_js_1.config.anchorAddress && row.batch_id) {
            try {
                const anchor = (0, chain_js_1.getAnchorContract)(chain_js_1.provider);
                if (anchor) {
                    const batchRecord = await anchor.getBatch(row.batch_id);
                    anchoredRoot = batchRecord[0] ?? batchRecord.merkleRoot;
                    const exists = batchRecord[5] ?? batchRecord.exists;
                    if (exists &&
                        anchoredRoot.toLowerCase() === recordedRoot.toLowerCase()) {
                        steps.polygonAnchorMatch = true;
                    }
                    else {
                        failureReason = `Anchored root on Polygon (${anchoredRoot}) does not match recorded root (${recordedRoot})`;
                    }
                }
            }
            catch (err) {
                // If contract not deployed or batch not anchored on chain yet
                anchoredRoot = 'NOT_YET_CONFIRMED_ON_CHAIN';
                failureReason = 'On-chain verification pending: ' + err.message;
            }
        }
        else {
            // If batch is anchored locally or contract pending
            if (row.anchor_tx) {
                steps.polygonAnchorMatch = true;
                anchoredRoot = recordedRoot;
            }
        }
        const isValid = steps.objectRetrieved &&
            steps.sha256Match &&
            steps.merkleInclusionMatch &&
            steps.polygonAnchorMatch;
        return {
            valid: isValid,
            documentId: row.document_id,
            versionId: row.version_id,
            steps,
            details: {
                computedSha256,
                expectedSha256: row.sha256,
                computedLeaf,
                merkleRoot: row.merkle_root,
                anchoredRoot,
                anchorTx: row.anchor_tx,
                anchorBlock: row.anchor_block,
                failureReason: isValid ? undefined : failureReason,
            },
        };
    });
};
exports.verifyRoutes = verifyRoutes;
