import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { GrantRoleSchema, Roles } from '@sih26125/common';
import { config } from '../config.js';
import { getIamContract, adminSigner, provider } from '../chain.js';

export const rolesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/roles/:address - check roles for address
  fastify.get<{ Params: { address: string } }>('/:address', async (req, _reply) => {
    const { address } = req.params;

    const roleMap: Record<string, boolean> = {
      ADMIN_ROLE: false,
      MANAGER_ROLE: false,
      AUDITOR_ROLE: false,
      USER_ROLE: false,
    };

    const iam = getIamContract(provider);
    if (config.iamAddress && iam) {
      try {
        const [isAdmin, isManager, isAuditor, isUser] = await Promise.all([
          iam.hasRole(Roles.ADMIN, address),
          iam.hasRole(Roles.MANAGER, address),
          iam.hasRole(Roles.AUDITOR, address),
          iam.hasRole(Roles.USER, address),
        ]);

        roleMap.ADMIN_ROLE = isAdmin;
        roleMap.MANAGER_ROLE = isManager;
        roleMap.AUDITOR_ROLE = isAuditor;
        roleMap.USER_ROLE = isUser;
      } catch (err) {
        req.log.warn({ err }, 'Contract read failed for roles');
      }
    }

    return { address: address.toLowerCase(), roles: roleMap };
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

      const iam = getIamContract(adminSigner);
      if (!config.iamAddress || !iam || !adminSigner) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        const tx = await iam.grantRole(roleHash, account);
        await tx.wait();
        return { success: true, role, account, txHash: tx.hash };
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

      const iam = getIamContract(adminSigner);
      if (!config.iamAddress || !iam || !adminSigner) {
        return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
      }

      try {
        const tx = await iam.revokeRole(roleHash, account);
        await tx.wait();
        return { success: true, role, account, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return reply.status(400).send({ error: 'Revoke role failed: ' + err.message });
      }
    }
  );
};
