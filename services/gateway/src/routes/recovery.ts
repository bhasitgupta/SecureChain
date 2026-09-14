import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { RecoveryManagerAbi } from '@sih26125/contracts';
import { config } from '../config.js';
import { publicClient, walletClient, adminAccount } from '../chain.js';

export const recoveryRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/recovery/:address - Read recovery state
  fastify.get<{ Params: { address: string } }>('/:address', async (req, reply) => {
    const { address } = req.params;

    if (!config.recoveryAddress) {
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
      const state = await publicClient.readContract({
        address: config.recoveryAddress,
        abi: RecoveryManagerAbi,
        functionName: 'accounts',
        args: [address as `0x${string}`],
      });

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

    if (!config.recoveryAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.recoveryAddress,
        abi: RecoveryManagerAbi,
        functionName: 'registerAccount',
        args: [BigInt(timelockSeconds)],
      });

      return { success: true, txHash, timelockSeconds };
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

    if (!config.recoveryAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.recoveryAddress,
        abi: RecoveryManagerAbi,
        functionName: 'requestRecovery',
        args: [
          account as `0x${string}`,
          proposedOwner as `0x${string}`,
          nonce as `0x${string}`,
          BigInt(deadline),
          signature as `0x${string}`,
        ],
      });

      return { success: true, txHash, account, proposedOwner };
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

    if (!config.recoveryAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.recoveryAddress,
        abi: RecoveryManagerAbi,
        functionName: 'cancelRecovery',
        args: [account as `0x${string}`],
      });

      return { success: true, txHash, account };
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

    if (!config.recoveryAddress || !walletClient || !adminAccount) {
      return reply.status(503).send({ error: 'Chain or wallet not configured' });
    }

    try {
      const txHash = await walletClient.writeContract({
        address: config.recoveryAddress,
        abi: RecoveryManagerAbi,
        functionName: 'finalizeRecovery',
        args: [account as `0x${string}`],
      });

      return { success: true, txHash, account };
    } catch (err: any) {
      req.log.error(err);
      return reply.status(400).send({ error: 'Finalize recovery failed: ' + err.message });
    }
  });
};
