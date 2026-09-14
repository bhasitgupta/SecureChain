import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { GrantRoleSchema, Roles } from '@sih26125/common';
import { IdentityAndAccessManagerAbi } from '@sih26125/contracts';
import { config } from '../config.js';
import { publicClient, walletClient, adminAccount } from '../chain.js';

export const rolesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/roles/:address - check roles for address
  fastify.get<{ Params: { address: string } }>('/:address', async (req, _reply) => {
    const { address } = req.params;
    const acct = address as `0x${string}`;

    const roleMap: Record<string, boolean> = {
      ADMIN_ROLE: false,
      MANAGER_ROLE: false,
      AUDITOR_ROLE: false,
      USER_ROLE: false,
    };

    if (config.iamAddress) {
      try {
        const [isAdmin, isManager, isAuditor, isUser] = await Promise.all([
          publicClient.readContract({
            address: config.iamAddress,
            abi: IdentityAndAccessManagerAbi,
            functionName: 'hasRole',
            args: [Roles.ADMIN, acct],
          }),
          publicClient.readContract({
            address: config.iamAddress,
            abi: IdentityAndAccessManagerAbi,
            functionName: 'hasRole',
            args: [Roles.MANAGER, acct],
          }),
          publicClient.readContract({
            address: config.iamAddress,
            abi: IdentityAndAccessManagerAbi,
            functionName: 'hasRole',
            args: [Roles.AUDITOR, acct],
          }),
          publicClient.readContract({
            address: config.iamAddress,
            abi: IdentityAndAccessManagerAbi,
            functionName: 'hasRole',
            args: [Roles.USER, acct],
          }),
        ]);

        roleMap.ADMIN_ROLE = isAdmin;
        roleMap.MANAGER_ROLE = isManager;
        roleMap.AUDITOR_ROLE = isAuditor;
        roleMap.USER_ROLE = isUser;
      } catch (err) {
        req.log.warn({ err }, 'Contract read failed for roles');
      }
    }

    return { address: acct.toLowerCase(), roles: roleMap };
  });

  // POST /api/roles/grant - Admin grants role
  fastify.post<{ Body: { role: 'ADMIN_ROLE' | 'MANAGER_ROLE' | 'AUDITOR_ROLE' | 'USER_ROLE'; account: string } }>(
    '/grant',
    async (req, reply) => {
      const parsed = GrantRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues[0].message });
      }

      const { role, account } = parsed.data;
      const roleHash = Roles[role.replace('_ROLE', '') as keyof typeof Roles];

      if (!config.iamAddress || !walletClient || !adminAccount) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        const txHash = await walletClient.writeContract({
          address: config.iamAddress,
          abi: IdentityAndAccessManagerAbi,
          functionName: 'grantRole',
          args: [roleHash, account as `0x${string}`],
        });

        return { success: true, role, account, txHash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Grant role failed: ' + err.message });
      }
    }
  );

  // POST /api/roles/revoke - Admin revokes role
  fastify.post<{ Body: { role: 'ADMIN_ROLE' | 'MANAGER_ROLE' | 'AUDITOR_ROLE' | 'USER_ROLE'; account: string } }>(
    '/revoke',
    async (req, reply) => {
      const parsed = GrantRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues[0].message });
      }

      const { role, account } = parsed.data;
      const roleHash = Roles[role.replace('_ROLE', '') as keyof typeof Roles];

      if (!config.iamAddress || !walletClient || !adminAccount) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        const txHash = await walletClient.writeContract({
          address: config.iamAddress,
          abi: IdentityAndAccessManagerAbi,
          functionName: 'revokeRole',
          args: [roleHash, account as `0x${string}`],
        });

        return { success: true, role, account, txHash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Revoke role failed: ' + err.message });
      }
    }
  );
};
