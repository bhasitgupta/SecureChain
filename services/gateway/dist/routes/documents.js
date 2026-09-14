"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRoutes = void 0;
const crypto_1 = require("crypto");
const config_js_1 = require("../config.js");
const db_js_1 = require("../db.js");
const minio_js_1 = require("../minio.js");
const redis_js_1 = require("../redis.js");
const documentRoutes = async (fastify) => {
    // GET /api/documents - list documents
    fastify.get('/', async (_req, _reply) => {
        const res = await (0, db_js_1.query)(`SELECT d.document_id, d.owner_address, d.title, d.latest_version_id, d.created_at,
              v.seq AS latest_seq, v.file_name, v.mime_type, v.size_bytes, v.sha256, v.state,
              p.status AS proof_status, p.batch_id,
              b.anchor_tx, b.anchor_block, b.status AS batch_status,
              (SELECT COUNT(*) FROM document_versions dv WHERE dv.document_id = d.document_id) AS version_count
       FROM documents d
       LEFT JOIN document_versions v ON d.latest_version_id = v.version_id
       LEFT JOIN proof_records p ON v.version_id = p.version_id
       LEFT JOIN merkle_batches b ON p.batch_id = b.batch_id
       ORDER BY d.created_at DESC`);
        return { documents: res.rows };
    });
    // GET /api/documents/:id - get document with all versions
    fastify.get('/:id', async (req, reply) => {
        const { id } = req.params;
        const docRes = await (0, db_js_1.query)(`SELECT document_id, owner_address, title, latest_version_id, created_at
       FROM documents WHERE document_id = $1`, [id]);
        if (docRes.rows.length === 0) {
            return reply.status(404).send({ error: 'Document not found' });
        }
        const versionsRes = await (0, db_js_1.query)(`SELECT v.version_id, v.seq, v.file_name, v.mime_type, v.size_bytes,
              v.sha256, v.minio_key, v.minio_version_id, v.state, v.created_at,
              p.leaf_hash, p.batch_id, p.leaf_index, p.status AS proof_status,
              b.root AS merkle_root, b.anchor_tx, b.anchor_block, b.status AS batch_status
       FROM document_versions v
       LEFT JOIN proof_records p ON v.version_id = p.version_id
       LEFT JOIN merkle_batches b ON p.batch_id = b.batch_id
       WHERE v.document_id = $1
       ORDER BY v.seq ASC`, [id]);
        return {
            document: docRes.rows[0],
            versions: versionsRes.rows,
        };
    });
    // GET /api/documents/:id/latest - retrieve latest version
    fastify.get('/:id/latest', async (req, reply) => {
        const { id } = req.params;
        const res = await (0, db_js_1.query)(`SELECT d.document_id, d.title, d.owner_address,
              v.version_id, v.seq, v.file_name, v.mime_type, v.size_bytes, v.sha256, v.state,
              p.status AS proof_status, b.anchor_tx, b.anchor_block
       FROM documents d
       JOIN document_versions v ON d.latest_version_id = v.version_id
       LEFT JOIN proof_records p ON v.version_id = p.version_id
       LEFT JOIN merkle_batches b ON p.batch_id = b.batch_id
       WHERE d.document_id = $1`, [id]);
        if (res.rows.length === 0) {
            return reply.status(404).send({ error: 'Document or latest version not found' });
        }
        return res.rows[0];
    });
    // GET /api/documents/:id/versions/:vid/download - get presigned URL
    fastify.get('/:id/versions/:vid/download', async (req, reply) => {
        const { vid } = req.params;
        const res = await (0, db_js_1.query)(`SELECT minio_key, file_name, mime_type FROM document_versions WHERE version_id = $1`, [vid]);
        if (res.rows.length === 0) {
            return reply.status(404).send({ error: 'Version not found' });
        }
        const { minio_key } = res.rows[0];
        const url = await (0, minio_js_1.getPresignedDownloadUrl)(config_js_1.config.minio.buckets.documents, minio_key, 300);
        return { downloadUrl: url };
    });
    // POST /api/documents - Upload document V1 (streaming SHA-256 + MinIO write + immediate ack)
    fastify.post('/', async (req, reply) => {
        if (!req.isMultipart()) {
            return reply.status(400).send({ error: 'Request must be multipart/form-data' });
        }
        let title = '';
        let ownerAddress = '0x0000000000000000000000000000000000000000';
        let fileName = '';
        let mimeType = 'application/octet-stream';
        let sizeBytes = 0;
        let sha256Hex = '';
        let fileBuffer = null;
        const parts = req.parts();
        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'file') {
                fileName = part.filename;
                mimeType = part.mimetype;
                // Streaming SHA-256 hash calculation while buffering for MinIO putObject
                const hash = (0, crypto_1.createHash)('sha256');
                const chunks = [];
                for await (const chunk of part.file) {
                    hash.update(chunk);
                    chunks.push(chunk);
                    sizeBytes += chunk.length;
                }
                sha256Hex = hash.digest('hex');
                fileBuffer = Buffer.concat(chunks);
            }
            else if (part.type === 'field') {
                if (part.fieldname === 'title')
                    title = part.value;
                if (part.fieldname === 'ownerAddress')
                    ownerAddress = part.value;
            }
        }
        if (!fileBuffer || fileBuffer.length === 0) {
            return reply.status(400).send({ error: 'No file uploaded or file is 0 bytes' });
        }
        if (!title) {
            title = fileName || 'Untitled Document';
        }
        // Database client transaction
        const client = await db_js_1.pool.connect();
        try {
            await client.query('BEGIN');
            // 1. Create Document
            const docRes = await client.query(`INSERT INTO documents (owner_address, title)
         VALUES ($1, $2) RETURNING document_id`, [ownerAddress.toLowerCase(), title]);
            const documentId = docRes.rows[0].document_id;
            // 2. Upload original bytes to MinIO
            const minioKey = `${documentId}/v1_${fileName}`;
            const uploadInfo = await (0, minio_js_1.putObject)(config_js_1.config.minio.buckets.documents, minioKey, fileBuffer, fileBuffer.length, { 'Content-Type': mimeType });
            // 3. Create Document Version V1
            const verRes = await client.query(`INSERT INTO document_versions 
         (document_id, seq, file_name, mime_type, size_bytes, sha256, minio_key, minio_version_id, state)
         VALUES ($1, 1, $2, $3, $4, $5, $6, $7, 'DURABLY_STORED')
         RETURNING version_id`, [
                documentId,
                fileName,
                mimeType,
                sizeBytes,
                sha256Hex,
                minioKey,
                uploadInfo.versionId || null,
            ]);
            const versionId = verRes.rows[0].version_id;
            // 4. Update latest_version_id
            await client.query(`UPDATE documents SET latest_version_id = $1 WHERE document_id = $2`, [versionId, documentId]);
            // 5. Append to latest_version_history
            await client.query(`INSERT INTO latest_version_history (document_id, from_version, to_version, actor)
         VALUES ($1, NULL, $2, $3)`, [documentId, versionId, ownerAddress.toLowerCase()]);
            // 6. Insert into Outbox for async pipeline dispatch
            await client.query(`INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload)
         VALUES ('DOCUMENT_VERSION', $1, 'VERSION_UPLOADED', $2)`, [
                versionId,
                JSON.stringify({
                    documentId,
                    versionId,
                    seq: 1,
                    fileName,
                    mimeType,
                    sha256: sha256Hex,
                    minioKey,
                }),
            ]);
            await client.query('COMMIT');
            // Dispatch async job to BullMQ queue
            await redis_js_1.documentQueue.add('process-version', {
                documentId,
                versionId,
                seq: 1,
                fileName,
                mimeType,
                sha256: sha256Hex,
                minioKey,
            });
            return reply.status(201).send({
                status: 'UPLOAD_ACKNOWLEDGED',
                documentId,
                versionId,
                seq: 1,
                sha256: sha256Hex,
                sizeBytes,
                state: 'DURABLY_STORED',
            });
        }
        catch (err) {
            await client.query('ROLLBACK');
            req.log.error(err);
            return reply.status(500).send({ error: 'Upload ingestion failed: ' + err.message });
        }
        finally {
            client.release();
        }
    });
    // POST /api/documents/:id/versions - Upload new version (V2, V3)
    fastify.post('/:id/versions', async (req, reply) => {
        const { id: documentId } = req.params;
        if (!req.isMultipart()) {
            return reply.status(400).send({ error: 'Request must be multipart/form-data' });
        }
        let ownerAddress = '0x0000000000000000000000000000000000000000';
        let fileName = '';
        let mimeType = 'application/octet-stream';
        let sizeBytes = 0;
        let sha256Hex = '';
        let fileBuffer = null;
        const parts = req.parts();
        for await (const part of parts) {
            if (part.type === 'file' && part.fieldname === 'file') {
                fileName = part.filename;
                mimeType = part.mimetype;
                const hash = (0, crypto_1.createHash)('sha256');
                const chunks = [];
                for await (const chunk of part.file) {
                    hash.update(chunk);
                    chunks.push(chunk);
                    sizeBytes += chunk.length;
                }
                sha256Hex = hash.digest('hex');
                fileBuffer = Buffer.concat(chunks);
            }
            else if (part.type === 'field') {
                if (part.fieldname === 'ownerAddress')
                    ownerAddress = part.value;
            }
        }
        if (!fileBuffer || fileBuffer.length === 0) {
            return reply.status(400).send({ error: 'No file uploaded or file is 0 bytes' });
        }
        const client = await db_js_1.pool.connect();
        try {
            await client.query('BEGIN');
            const docRes = await client.query(`SELECT document_id, latest_version_id FROM documents WHERE document_id = $1 FOR UPDATE`, [documentId]);
            if (docRes.rows.length === 0) {
                await client.query('ROLLBACK');
                return reply.status(404).send({ error: 'Document not found' });
            }
            const prevVersionId = docRes.rows[0].latest_version_id;
            // Get next sequence number
            const seqRes = await client.query(`SELECT COALESCE(MAX(seq), 0) + 1 AS next_seq FROM document_versions WHERE document_id = $1`, [documentId]);
            const nextSeq = parseInt(seqRes.rows[0].next_seq, 10);
            // Upload to MinIO
            const minioKey = `${documentId}/v${nextSeq}_${fileName}`;
            const uploadInfo = await (0, minio_js_1.putObject)(config_js_1.config.minio.buckets.documents, minioKey, fileBuffer, fileBuffer.length, { 'Content-Type': mimeType });
            // Insert new version
            const verRes = await client.query(`INSERT INTO document_versions 
         (document_id, seq, file_name, mime_type, size_bytes, sha256, minio_key, minio_version_id, state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'DURABLY_STORED')
         RETURNING version_id`, [
                documentId,
                nextSeq,
                fileName,
                mimeType,
                sizeBytes,
                sha256Hex,
                minioKey,
                uploadInfo.versionId || null,
            ]);
            const newVersionId = verRes.rows[0].version_id;
            // Update pointer
            await client.query(`UPDATE documents SET latest_version_id = $1 WHERE document_id = $2`, [newVersionId, documentId]);
            // Record in lineage history
            await client.query(`INSERT INTO latest_version_history (document_id, from_version, to_version, actor)
         VALUES ($1, $2, $3, $4)`, [documentId, prevVersionId, newVersionId, ownerAddress.toLowerCase()]);
            // Outbox
            await client.query(`INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload)
         VALUES ('DOCUMENT_VERSION', $1, 'VERSION_UPLOADED', $2)`, [
                newVersionId,
                JSON.stringify({
                    documentId,
                    versionId: newVersionId,
                    seq: nextSeq,
                    fileName,
                    mimeType,
                    sha256: sha256Hex,
                    minioKey,
                }),
            ]);
            await client.query('COMMIT');
            // Dispatch async job
            await redis_js_1.documentQueue.add('process-version', {
                documentId,
                versionId: newVersionId,
                seq: nextSeq,
                fileName,
                mimeType,
                sha256: sha256Hex,
                minioKey,
            });
            return reply.status(201).send({
                status: 'UPLOAD_ACKNOWLEDGED',
                documentId,
                versionId: newVersionId,
                seq: nextSeq,
                sha256: sha256Hex,
                sizeBytes,
                state: 'DURABLY_STORED',
            });
        }
        catch (err) {
            await client.query('ROLLBACK');
            req.log.error(err);
            return reply.status(500).send({ error: 'Version upload failed: ' + err.message });
        }
        finally {
            client.release();
        }
    });
};
exports.documentRoutes = documentRoutes;
