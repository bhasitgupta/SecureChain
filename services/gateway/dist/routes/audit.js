"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRoutes = void 0;
const db_js_1 = require("../db.js");
const auditRoutes = async (fastify) => {
    // GET /api/audit/events - Query audit log
    fastify.get('/events', async (req, _reply) => {
        const { eventName, contract, limit = '50', offset = '0' } = req.query;
        const conditions = [];
        const params = [];
        if (eventName) {
            params.push(eventName);
            conditions.push(`event_name = $${params.length}`);
        }
        if (contract) {
            params.push(contract.toLowerCase());
            conditions.push(`LOWER(contract_addr) = $${params.length}`);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        params.push(parseInt(limit, 10));
        params.push(parseInt(offset, 10));
        const sql = `
      SELECT id, contract_addr, event_name, block_number, tx_hash, log_index, decoded, created_at
      FROM audit_events
      ${whereClause}
      ORDER BY block_number DESC, log_index DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
        const res = await (0, db_js_1.query)(sql, params);
        return { events: res.rows };
    });
    // POST /api/audit/record - Dynamically record on-chain event
    fastify.post('/record', async (req, reply) => {
        const { event_name, contract_addr, block_number, tx_hash, decoded } = req.body;
        if (!event_name || !tx_hash) {
            return reply.code(400).send({ error: 'event_name and tx_hash are required' });
        }
        try {
            await (0, db_js_1.query)(`INSERT INTO audit_events (contract_addr, event_name, block_number, tx_hash, log_index, decoded)
         VALUES ($1, $2, $3, $4, 0, $5)
         ON CONFLICT DO NOTHING`, [contract_addr || '', event_name, block_number || 0, tx_hash, JSON.stringify(decoded || {})]);
            return { success: true };
        }
        catch {
            return { success: true, savedToDb: false };
        }
    });
    // GET /api/stats - Dashboard summary metrics
    fastify.get('/stats', async (_req, _reply) => {
        const [identitiesRes, docsRes, versionsRes, batchesRes, assetsRes] = await Promise.all([
            (0, db_js_1.query)(`SELECT COUNT(*) FROM identities`),
            (0, db_js_1.query)(`SELECT COUNT(*) FROM documents`),
            (0, db_js_1.query)(`SELECT COUNT(*) FROM document_versions`),
            (0, db_js_1.query)(`SELECT COUNT(*) FROM merkle_batches`),
            (0, db_js_1.query)(`SELECT COUNT(*) FROM asset_thumbnails`),
        ]);
        const [anchoredBatchesRes, verifiableVersionsRes] = await Promise.all([
            (0, db_js_1.query)(`SELECT COUNT(*) FROM merkle_batches WHERE status = 'ANCHORED'`),
            (0, db_js_1.query)(`SELECT COUNT(*) FROM document_versions WHERE state = 'VERIFIABLE'`),
        ]);
        return {
            identitiesCount: parseInt(identitiesRes.rows[0].count, 10),
            documentsCount: parseInt(docsRes.rows[0].count, 10),
            versionsCount: parseInt(versionsRes.rows[0].count, 10),
            batchesCount: parseInt(batchesRes.rows[0].count, 10),
            assetsCount: parseInt(assetsRes.rows[0].count, 10),
            anchoredBatchesCount: parseInt(anchoredBatchesRes.rows[0].count, 10),
            verifiableVersionsCount: parseInt(verifiableVersionsRes.rows[0].count, 10),
        };
    });
};
exports.auditRoutes = auditRoutes;
