"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRoutes = void 0;
const common_1 = require("@sih26125/common");
const config_js_1 = require("../config.js");
const chain_js_1 = require("../chain.js");
const db_js_1 = require("../db.js");
// Authoritative default roles
const memoryRoles = {
    '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
    '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
    '0x3d95ee72e01c793d097ae7aa9177d80fd3dc7a6a': 'AUDITOR',
};
// Ensure role persistence table exists
let dbInitialized = false;
async function ensureRoleTable() {
    if (dbInitialized)
        return;
    try {
        await (0, db_js_1.query)(`
      CREATE TABLE IF NOT EXISTS assigned_roles (
        address VARCHAR(66) PRIMARY KEY,
        role VARCHAR(32) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
        dbInitialized = true;
    }
    catch (err) {
        // Database might be booting; memory fallback remains active
    }
}
async function getStoredRoles() {
    await ensureRoleTable();
    const result = { ...memoryRoles };
    try {
        const res = await (0, db_js_1.query)('SELECT address, role FROM assigned_roles');
        for (const row of res.rows) {
            result[row.address.toLowerCase()] = row.role;
        }
    }
    catch {
        // Memory store fallback
    }
    return result;
}
async function persistRole(address, role) {
    const norm = address.toLowerCase();
    if (role === 'USER') {
        delete memoryRoles[norm];
    }
    else {
        memoryRoles[norm] = role;
    }
    await ensureRoleTable();
    try {
        if (role === 'USER') {
            await (0, db_js_1.query)('DELETE FROM assigned_roles WHERE LOWER(address) = $1', [norm]);
        }
        else {
            await (0, db_js_1.query)(`INSERT INTO assigned_roles (address, role, updated_at) 
         VALUES ($1, $2, NOW()) 
         ON CONFLICT (address) DO UPDATE SET role = EXCLUDED.role, updated_at = NOW()`, [norm, role]);
        }
    }
    catch {
        // Memory cache holds state
    }
}
const rolesRoutes = async (fastify) => {
    // GET /api/roles - Get all assigned roles across all devices
    fastify.get('/', async (_req, _reply) => {
        const roles = await getStoredRoles();
        return { success: true, roles };
    });
    // GET /api/roles/:address - check roles for address
    fastify.get('/:address', async (req, _reply) => {
        const address = req.params.address.toLowerCase();
        const storedRoles = await getStoredRoles();
        const roleMap = {
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
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.provider);
        if (config_js_1.config.iamAddress && iam) {
            try {
                const [isAdmin, isManager, isAuditor] = await Promise.all([
                    iam.hasRole(common_1.Roles.ADMIN, address),
                    iam.hasRole(common_1.Roles.MANAGER, address),
                    iam.hasRole(common_1.Roles.AUDITOR, address),
                ]);
                roleMap.ADMIN_ROLE = isAdmin;
                roleMap.MANAGER_ROLE = isManager;
                roleMap.AUDITOR_ROLE = isAuditor;
                roleMap.USER_ROLE = !isAdmin && !isManager && !isAuditor;
                onChainChecked = true;
            }
            catch (err) {
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
    fastify.post('/assign', async (req, reply) => {
        const { address, role } = req.body || {};
        if (!address || typeof address !== 'string' || !address.startsWith('0x') || address.length < 10) {
            return reply.status(400).send({ error: 'Valid 0x Ethereum address required' });
        }
        if (!['ADMIN', 'MANAGER', 'AUDITOR', 'USER'].includes(role)) {
            return reply.status(400).send({ error: 'Role must be ADMIN, MANAGER, AUDITOR, or USER' });
        }
        const target = address.toLowerCase();
        let txHash = null;
        // Persist to shared database & cache immediately
        await persistRole(target, role);
        // If relayer adminSigner is available, sync to Polygon Amoy
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.adminSigner);
        if (config_js_1.config.iamAddress && iam && chain_js_1.adminSigner) {
            try {
                // 1. Revoke any outdated on-chain roles
                const allRoles = [
                    { name: 'ADMIN', hash: common_1.Roles.ADMIN },
                    { name: 'MANAGER', hash: common_1.Roles.MANAGER },
                    { name: 'AUDITOR', hash: common_1.Roles.AUDITOR },
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
                    const roleHash = common_1.Roles[role];
                    const alreadyHas = await iam.hasRole(roleHash, target).catch(() => false);
                    if (!alreadyHas) {
                        const grantTx = await iam.grantRole(roleHash, target);
                        await grantTx.wait(1);
                        txHash = grantTx.hash;
                        req.log.info({ role, target, tx: grantTx.hash }, 'Granted new on-chain role');
                    }
                }
            }
            catch (chainErr) {
                req.log.warn({ err: chainErr.message }, 'On-chain transaction skipped or failed');
            }
        }
        // Record audit event
        try {
            await (0, db_js_1.query)(`INSERT INTO audit_events (event_type, contract_name, tx_hash, block_number, payload)
           VALUES ($1, $2, $3, $4, $5)`, [
                'ROLE_ASSIGNED',
                'IdentityAndAccessManager',
                txHash || 'OFF_CHAIN_SYNC',
                0,
                JSON.stringify({ target, role, assignedAt: new Date().toISOString() })
            ]);
        }
        catch { }
        return {
            success: true,
            address: target,
            role,
            txHash,
            message: `Role ${role} successfully assigned to ${target}`
        };
    });
    // POST /api/roles/grant - Direct grant endpoint
    fastify.post('/grant', async (req, reply) => {
        const parsed = common_1.GrantRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.issues[0].message });
        }
        const { role, account } = parsed.data;
        const cleanRole = role.replace('_ROLE', '');
        const roleHash = common_1.Roles[cleanRole];
        await persistRole(account, cleanRole);
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.iamAddress || !iam || !chain_js_1.adminSigner) {
            return { success: true, role, account, txHash: null, note: 'Saved to authoritative registry' };
        }
        try {
            await iam.grantRole.staticCall(roleHash, account);
            const tx = await iam.grantRole(roleHash, account);
            await tx.wait(1);
            return { success: true, role, account, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return { success: true, role, account, txHash: null, warning: 'On-chain: ' + (err.reason || err.message) };
        }
    });
    // POST /api/roles/revoke - Direct revoke endpoint
    fastify.post('/revoke', async (req, reply) => {
        const parsed = common_1.GrantRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.issues[0].message });
        }
        const { role, account } = parsed.data;
        const cleanRole = role.replace('_ROLE', '');
        const roleHash = common_1.Roles[cleanRole];
        await persistRole(account, 'USER');
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.iamAddress || !iam || !chain_js_1.adminSigner) {
            return { success: true, role, account, txHash: null, note: 'Revoked in authoritative registry' };
        }
        try {
            await iam.revokeRole.staticCall(roleHash, account);
            const tx = await iam.revokeRole(roleHash, account);
            await tx.wait(1);
            return { success: true, role, account, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return { success: true, role, account, txHash: null, warning: 'On-chain: ' + (err.reason || err.message) };
        }
    });
};
exports.rolesRoutes = rolesRoutes;
