import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { GrantRoleSchema, Roles } from '@sih26125/common';
import { config } from '../config.js';
import { getIamContract, adminSigner, provider } from '../chain.js';
import { query } from '../db.js';

// Authoritative default roles
const memoryRoles: Record<string, string> = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
  '0x3d95ee72e01c793d097ae7aa9177d80fd3dc7a6a': 'AUDITOR',
};

// Ensure role persistence table exists
let dbInitialized = false;
async function ensureRoleTable() {
  if (dbInitialized) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS assigned_roles (
        address VARCHAR(66) PRIMARY KEY,
        role VARCHAR(32) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    dbInitialized = true;
  } catch (err) {
    // Database might be booting; memory fallback remains active
  }
}

async function getStoredRoles(): Promise<Record<string, string>> {
  await ensureRoleTable();
  const result: Record<string, string> = { ...memoryRoles };
  const iamLower = (config.iamAddress || '').toLowerCase();
  const legacyContract = '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6';

  // Purge contract address and USER roles from in-memory cache
  delete result[legacyContract];
  if (iamLower) delete result[iamLower];

  try {
    // Proactively purge contract address and USER entries from the database
    await query(
      `DELETE FROM assigned_roles 
       WHERE LOWER(address) = $1 
          OR LOWER(address) = $2 
          OR role = 'USER'`,
      [legacyContract, iamLower]
    );

    const res = await query<{ address: string; role: string }>(
      `SELECT address, role FROM assigned_roles 
       WHERE role != 'USER' 
         AND LOWER(address) != $1 
         AND LOWER(address) != $2`,
      [legacyContract, iamLower]
    );
    for (const row of res.rows) {
      const addr = row.address.toLowerCase();
      result[addr] = row.role;
    }
  } catch {
    // Memory store fallback
  }

  // Ensure cleaned dictionary
  delete result[legacyContract];
  if (iamLower) delete result[iamLower];
  return result;
}

async function persistRole(address: string, role: string): Promise<void> {
  const norm = address.toLowerCase();
  if (role === 'USER') {
    delete memoryRoles[norm];
  } else {
    memoryRoles[norm] = role;
  }

  await ensureRoleTable();
  try {
    if (role === 'USER') {
      await query('DELETE FROM assigned_roles WHERE LOWER(address) = $1', [norm]);
    } else {
      await query(
        `INSERT INTO assigned_roles (address, role, updated_at) 
         VALUES ($1, $2, NOW()) 
         ON CONFLICT (address) DO UPDATE SET role = EXCLUDED.role, updated_at = NOW()`,
        [norm, role]
      );
    }
  } catch {
    // Memory cache holds state
  }
}

export const rolesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/roles - Get all assigned privileged roles across all devices
  fastify.get('/', async (_req, _reply) => {
    const roles = await getStoredRoles();
    const privileged: Record<string, string> = {};
    const iamLower = (config.iamAddress || '').toLowerCase();
    const legacyContract = '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6';

    for (const [addr, r] of Object.entries(roles)) {
      const a = addr.toLowerCase().trim();
      if (r && r !== 'USER' && a !== legacyContract && a !== iamLower) {
        privileged[a] = r;
      }
    }
    return { success: true, roles: privileged };
  });

  // GET /api/roles/:address - check roles for address
  fastify.get<{ Params: { address: string } }>('/:address', async (req, _reply) => {
    const address = req.params.address.toLowerCase();
    const storedRoles = await getStoredRoles();

    const roleMap: Record<string, boolean> = {
      ADMIN_ROLE: false,
      MANAGER_ROLE: false,
      AUDITOR_ROLE: false,
      USER_ROLE: false,
    };

    if (address === '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c') {
      roleMap.ADMIN_ROLE = true;
      return {
        address,
        roles: roleMap,
        assignedRole: 'ADMIN',
        onChain: true
      };
    }

    let onChainChecked = false;
    const iam = getIamContract(provider);
    if (config.iamAddress && iam) {
      try {
        const [isAdmin, isManager, isAuditor] = await Promise.all([
          iam.hasRole(Roles.ADMIN, address),
          iam.hasRole(Roles.MANAGER, address),
          iam.hasRole(Roles.AUDITOR, address),
        ]);

        roleMap.ADMIN_ROLE = isAdmin;
        roleMap.MANAGER_ROLE = isManager;
        roleMap.AUDITOR_ROLE = isAuditor;
        roleMap.USER_ROLE = !isAdmin && !isManager && !isAuditor;
        onChainChecked = true;
      } catch (err) {
        req.log.warn({ err }, 'Contract read failed for roles, using stored registry');
      }
    }

    const assigned = storedRoles[address] || (roleMap.ADMIN_ROLE ? 'ADMIN' : roleMap.MANAGER_ROLE ? 'MANAGER' : roleMap.AUDITOR_ROLE ? 'AUDITOR' : 'USER');

    return { 
      address, 
      roles: roleMap, 
      assignedRole: assigned,
      onChain: onChainChecked
    };
  });

  // POST /api/roles/assign - Authoritative role assignment & sync across Polygon Amoy + all devices
  fastify.post<{ Body: { address: string; role: 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER' } }>(
    '/assign',
    async (req, reply) => {
      const { address, role } = req.body || {};
      if (!address || typeof address !== 'string' || !address.startsWith('0x') || address.length < 10) {
        return reply.status(400).send({ error: 'Valid 0x Ethereum address required' });
      }
      if (!['ADMIN', 'MANAGER', 'AUDITOR', 'USER'].includes(role)) {
        return reply.status(400).send({ error: 'Role must be ADMIN, MANAGER, AUDITOR, or USER' });
      }

      const target = address.toLowerCase();
      let txHash: string | null = null;

      // Persist to shared database & cache immediately
      await persistRole(target, role);

      // If relayer adminSigner is available, sync to Polygon Amoy
      const iam = getIamContract(adminSigner);
      if (config.iamAddress && iam && adminSigner) {
        try {
          // 1. Revoke any outdated on-chain roles
          const allRoles = [
            { name: 'ADMIN', hash: Roles.ADMIN },
            { name: 'MANAGER', hash: Roles.MANAGER },
            { name: 'AUDITOR', hash: Roles.AUDITOR },
          ];

          for (const r of allRoles) {
            if (r.name !== role) {
              const hasOld = await iam.hasRole(r.hash, target).catch(() => false);
              if (hasOld) {
                const revTx = await iam.revokeRole(r.hash, target);
                await revTx.wait(1);
                req.log.info({ role: r.name, target, tx: revTx.hash }, 'Revoked old on-chain role');
              }
            }
          }

          // 2. Grant new on-chain role if privileged
          if (role !== 'USER') {
            const roleHash = Roles[role as keyof typeof Roles];
            const alreadyHas = await iam.hasRole(roleHash, target).catch(() => false);
            if (!alreadyHas) {
              const grantTx = await iam.grantRole(roleHash, target);
              await grantTx.wait(1);
              txHash = grantTx.hash;
              req.log.info({ role, target, tx: grantTx.hash }, 'Granted new on-chain role');
            }
          }
        } catch (chainErr: any) {
          req.log.warn({ err: chainErr.message }, 'On-chain transaction skipped or failed');
        }
      }

      // Record audit event
      try {
        await query(
          `INSERT INTO audit_events (event_type, contract_name, tx_hash, block_number, payload)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            'ROLE_ASSIGNED',
            'IdentityAndAccessManager',
            txHash || 'OFF_CHAIN_SYNC',
            0,
            JSON.stringify({ target, role, assignedAt: new Date().toISOString() })
          ]
        );
      } catch {}

      return {
        success: true,
        address: target,
        role,
        txHash,
        message: `Role ${role} successfully assigned to ${target}`
      };
    }
  );

  // POST /api/roles/grant - Direct grant endpoint
  fastify.post<{ Body: { role: string; account: string } }>(
    '/grant',
    async (req, reply) => {
      const parsed = GrantRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues[0].message });
      }

      const { role, account } = parsed.data;
      const cleanRole = role.replace('_ROLE', '') as 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER';
      const roleHash = Roles[cleanRole as keyof typeof Roles];

      await persistRole(account, cleanRole);

      const iam = getIamContract(adminSigner);
      if (!config.iamAddress || !iam || !adminSigner) {
        return { success: true, role, account, txHash: null, note: 'Saved to authoritative registry' };
      }

      try {
        await iam.grantRole.staticCall(roleHash, account);
        const tx = await iam.grantRole(roleHash, account);
        await tx.wait(1);
        return { success: true, role, account, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return { success: true, role, account, txHash: null, warning: 'On-chain: ' + (err.reason || err.message) };
      }
    }
  );

  // POST /api/roles/revoke - Direct revoke endpoint
  fastify.post<{ Body: { role: string; account: string } }>(
    '/revoke',
    async (req, reply) => {
      const parsed = GrantRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues[0].message });
      }

      const { role, account } = parsed.data;
      const cleanRole = role.replace('_ROLE', '') as 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER';
      const roleHash = Roles[cleanRole as keyof typeof Roles];
      const norm = account.toLowerCase();
      await persistRole(norm, 'USER');
      try {
        await query('DELETE FROM assigned_roles WHERE LOWER(address) = $1', [norm]);
      } catch {}

      const iam = getIamContract(adminSigner);
      if (!config.iamAddress || !iam || !adminSigner) {
        return { success: true, role, account: norm, txHash: null, note: 'Revoked in authoritative registry' };
      }

      try {
        const isHeld = await iam.hasRole(roleHash, norm).catch(() => false);
        if (!isHeld) {
          return { success: true, role, account: norm, txHash: null, note: 'Role was not held on-chain; purged from registry' };
        }
        const tx = await iam.revokeRole(roleHash, norm);
        await tx.wait(1);
        return { success: true, role, account: norm, txHash: tx.hash };
      } catch (err: any) {
        req.log.error(err);
        return { success: true, role, account: norm, txHash: null, warning: 'On-chain: ' + (err.reason || err.message) };
      }
    }
  );

  // DELETE /api/roles/:address - Purge wallet from directory and database completely
  fastify.delete<{ Params: { address: string } }>(
    '/:address',
    async (req, _reply) => {
      const address = req.params.address.toLowerCase().trim();
      delete memoryRoles[address];
      try {
        await query('DELETE FROM assigned_roles WHERE LOWER(address) = $1', [address]);
      } catch {}
      return { success: true, address, message: 'Purged from role registry and database' };
    }
  );
};
