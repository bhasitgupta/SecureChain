import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { config } from '../config.js';
import { getRecoveryContract, adminSigner, provider } from '../chain.js';

export const recoveryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/recovery/providers - List approved providers (read from audit events)
  fastify.get('/providers', async (req, _reply) => {
    const rec = getRecoveryContract(provider);
    if (!config.recoveryAddress || !rec) {
      return { providers: [] };
    }

    // Read ProviderRegistered events from audit_events table
    try {
      const { query } = await import('../db.js');
      const res = await query(
        `SELECT DISTINCT decoded->>'0' AS provider_address, block_number, tx_hash, created_at
         FROM audit_events 
         WHERE event_name = 'ProviderRegistered' AND LOWER(contract_addr) = LOWER($1)
         ORDER BY block_number DESC`,
        [config.recoveryAddress]
      );

      // Check each provider is still approved on-chain
      const providers = [];
      for (const row of res.rows) {
        const addr = row.provider_address;
        if (!addr) continue;
        let isApproved = false;
        try {
          isApproved = await rec.approvedProviders(addr);
        } catch {}
        providers.push({
          address: addr,
          status: isApproved ? 'Active' : 'Removed',
          registeredAt: row.created_at,
          txHash: row.tx_hash,
          blockNumber: row.block_number,
        });
      }
      return { providers };
    } catch (err: any) {
      req.log.warn({ err }, 'Failed to read providers from DB');
      return { providers: [] };
    }
  });

  // POST /api/recovery/providers/register - Admin registers a new recovery provider on-chain
  fastify.post<{ Body: { providerAddress: string } }>('/providers/register', async (req, reply) => {
    const { providerAddress } = req.body || {};
    if (!providerAddress || !providerAddress.startsWith('0x')) {
      return reply.status(400).send({ error: 'Missing or invalid providerAddress' });
    }

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.registerProvider(providerAddress);
      await tx.wait();
      return { success: true, txHash: tx.hash, providerAddress };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Register provider failed: ' + (err.reason || err.shortMessage || err.message) });
    }
  });

  // POST /api/recovery/providers/remove - Admin removes a recovery provider
  fastify.post<{ Body: { providerAddress: string } }>('/providers/remove', async (req, reply) => {
    const { providerAddress } = req.body || {};
    if (!providerAddress || !providerAddress.startsWith('0x')) {
      return reply.status(400).send({ error: 'Missing or invalid providerAddress' });
    }

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.removeProvider(providerAddress);
      await tx.wait();
      return { success: true, txHash: tx.hash, providerAddress };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Remove provider failed: ' + (err.reason || err.shortMessage || err.message) });
    }
  });

  // GET /api/recovery/:address - Read recovery state
  fastify.get<{ Params: { address: string } }>('/:address', async (req, reply) => {
    const { address } = req.params;

    const rec = getRecoveryContract(provider);
    if (!config.recoveryAddress || !rec) {
      return {
        address: address.toLowerCase(),
        owner: address.toLowerCase(),
        pendingOwner: null,
        unlockTime: 0,
        timelockDuration: 300,
        status: 'READY',
      };
    }

    try {
      const state = await rec.accounts(address);

      const now = Math.floor(Date.now() / 1000);
      const unlockTime = Number(state[2]);
      let status = 'READY';
      if (state[1] !== '0x0000000000000000000000000000000000000000') {
        status = now >= unlockTime ? 'READY_TO_FINALIZE' : 'TIMELOCK_ACTIVE';
      }

      return {
        address: address.toLowerCase(),
        owner: state[0],
        pendingOwner:
          state[1] !== '0x0000000000000000000000000000000000000000' ? state[1] : null,
        unlockTime,
        timelockDuration: Number(state[3]),
        status,
      };
    } catch (err: any) {
      req.log.warn({ err }, 'Failed to read recovery state');
      return reply.status(500).send({ error: 'Failed to read recovery state: ' + err.message });
    }
  });

  // POST /api/recovery/register - Register account with timelock
  fastify.post<{ Body: { timelockSeconds: number } }>('/register', async (req, reply) => {
    const { timelockSeconds = 300 } = req.body || {};

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.registerAccount(BigInt(timelockSeconds));
      await tx.wait();
      return { success: true, txHash: tx.hash, timelockSeconds };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Register account failed: ' + err.message });
    }
  });

  // POST /api/recovery/request - Request recovery
  fastify.post<{
    Body: {
      account: string;
      proposedOwner: string;
      nonce: string;
      deadline: number;
      signature: string;
    };
  }>('/request', async (req, reply) => {
    const { account, proposedOwner, nonce, deadline, signature } = req.body;

    if (!account || !proposedOwner || !nonce || !deadline || !signature) {
      return reply.status(400).send({ error: 'Missing required recovery parameters' });
    }

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.requestRecovery(
        account,
        proposedOwner,
        nonce,
        BigInt(deadline),
        signature
      );
      await tx.wait();
      return { success: true, txHash: tx.hash, account, proposedOwner };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Request recovery failed: ' + err.message });
    }
  });

  // POST /api/recovery/cancel - Cancel pending recovery (Owner veto)
  fastify.post<{ Body: { account: string } }>('/cancel', async (req, reply) => {
    const { account } = req.body;
    if (!account) {
      return reply.status(400).send({ error: 'Missing account' });
    }

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.cancelRecovery(account);
      await tx.wait();
      return { success: true, txHash: tx.hash, account };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Cancel recovery failed: ' + err.message });
    }
  });

  // POST /api/recovery/finalize - Finalize recovery after timelock
  fastify.post<{ Body: { account: string } }>('/finalize', async (req, reply) => {
    const { account } = req.body;
    if (!account) {
      return reply.status(400).send({ error: 'Missing account' });
    }

    const rec = getRecoveryContract(adminSigner);
    if (!config.recoveryAddress || !rec || !adminSigner) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const tx = await rec.finalizeRecovery(account);
      await tx.wait();
      return { success: true, txHash: tx.hash, account };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Finalize recovery failed: ' + err.message });
    }
  });
};
