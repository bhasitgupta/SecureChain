import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { RegisterIdentitySchema, formatDidPkh, hashDid } from '@sih26125/common';
import { config } from '../config.js';
import { query } from '../db.js';
import { getIamContract, adminSigner, provider } from '../chain.js';
import { requireOnChainRole } from '../auth.js';

export const identityRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/identity - list all cached identities
  fastify.get('/', async (_req, _reply) => {
    const res = await query(
      `SELECT did_hash, did, subject_id, account, status, created_at, updated_at
       FROM identities ORDER BY created_at DESC LIMIT 100`
    );
    return { identities: res.rows };
  });

  // GET /api/identity/by-account/:address
  fastify.get<{ Params: { address: string } }>('/by-account/:address', async (req, reply) => {
    const { address } = req.params;
    const res = await query(
      `SELECT did_hash, did, subject_id, account, status, created_at, updated_at
       FROM identities WHERE LOWER(account) = LOWER($1)`,
      [address]
    );

    if (res.rows.length > 0) {
      return res.rows[0];
    }

    // Try reading from contract if contract address configured
    const iam = getIamContract(provider);
    if (config.iamAddress && iam) {
      try {
        const didHash = await iam.getDidByAccount(address);

        if (didHash && didHash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
          const rec = await iam.getIdentity(didHash);
          const did = formatDidPkh(config.chainId, address);
          await query(
            `INSERT INTO identities (did_hash, did, subject_id, account, status, updated_at)
             VALUES ($1, $2, $3, $4, 'Active', NOW())
             ON CONFLICT (did_hash) DO UPDATE SET updated_at = NOW()`,
            [didHash, did, rec.subjectId, address.toLowerCase()]
          );

          return {
            didHash,
            did,
            subjectId: rec.subjectId,
            account: address.toLowerCase(),
            status: Number(rec.status) === 1 ? 'Active' : 'Inactive',
          };
        }
      } catch (err) {
        req.log.warn({ err }, 'Contract read failed for getDidByAccount');
      }
    }

    return reply.status(404).send({ error: 'Identity not found for address' });
  });

  // GET /api/identity/:didHash
  fastify.get<{ Params: { didHash: string } }>('/:didHash', async (req, reply) => {
    const { didHash } = req.params;
    const res = await query(
      `SELECT did_hash, did, subject_id, account, status, created_at, updated_at
       FROM identities WHERE did_hash = $1`,
      [didHash]
    );

    if (res.rows.length > 0) {
      return res.rows[0];
    }

    return reply.status(404).send({ error: 'Identity not found' });
  });

  // POST /api/identity - Register identity
  fastify.post<{ Body: { account: string; subjectId: string } }>(
    '/',
    { preHandler: [requireOnChainRole('ADMIN')] },
    async (req, reply) => {
      const parsed = RegisterIdentitySchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues[0].message });
      }

      const { account, subjectId } = parsed.data;
      const did = formatDidPkh(config.chainId, account);
      const didHash = hashDid(did);

      let txHash: string | undefined;

      const iam = getIamContract(adminSigner);
      if (!config.iamAddress || !iam || !adminSigner) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        await iam.registerIdentity.staticCall(didHash, account, subjectId);
        const tx = await iam.registerIdentity(didHash, account, subjectId);
        txHash = tx.hash;
        await tx.wait();
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'On-chain registration failed: ' + (err.reason || err.shortMessage || err.message) });
      }

      // Upsert in database
    await query(
      `INSERT INTO identities (did_hash, did, subject_id, account, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'Active', NOW(), NOW())
       ON CONFLICT (did_hash) DO UPDATE 
       SET subject_id = $3, account = $4, updated_at = NOW()`,
      [didHash, did, subjectId, account.toLowerCase()]
    );

    return {
      success: true,
      did,
      didHash,
      account: account.toLowerCase(),
      subjectId,
      txHash,
    };
  });
};
