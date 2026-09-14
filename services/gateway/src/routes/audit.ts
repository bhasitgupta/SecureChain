import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { query } from '../db.js';

export const auditRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/audit/events - Query audit log
  fastify.get<{
    Querystring: { eventName?: string; contract?: string; limit?: string; offset?: string };
  }>('/events', async (req, _reply) => {
    const { eventName, contract, limit = '50', offset = '0' } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];

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

    const res = await query(sql, params);
    return { events: res.rows };
  });

  // GET /api/stats - Dashboard summary metrics
  fastify.get('/stats', async (_req, _reply) => {
    const [identitiesRes, docsRes, versionsRes, batchesRes, assetsRes] = await Promise.all([
      query(`SELECT COUNT(*) FROM identities`),
      query(`SELECT COUNT(*) FROM documents`),
      query(`SELECT COUNT(*) FROM document_versions`),
      query(`SELECT COUNT(*) FROM merkle_batches`),
      query(`SELECT COUNT(*) FROM asset_thumbnails`),
    ]);

    const [anchoredBatchesRes, verifiableVersionsRes] = await Promise.all([
      query(`SELECT COUNT(*) FROM merkle_batches WHERE status = 'ANCHORED'`),
      query(`SELECT COUNT(*) FROM document_versions WHERE state = 'VERIFIABLE'`),
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
