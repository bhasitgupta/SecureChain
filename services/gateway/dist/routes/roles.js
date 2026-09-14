"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRoutes = void 0;
const common_1 = require("@sih26125/common");
const config_js_1 = require("../config.js");
const chain_js_1 = require("../chain.js");
const rolesRoutes = async (fastify) => {
    // GET /api/roles/:address - check roles for address
    fastify.get('/:address', async (req, _reply) => {
        const { address } = req.params;
        const roleMap = {
            ADMIN_ROLE: false,
            MANAGER_ROLE: false,
            AUDITOR_ROLE: false,
            USER_ROLE: false,
        };
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.provider);
        if (config_js_1.config.iamAddress && iam) {
            try {
                const [isAdmin, isManager, isAuditor, isUser] = await Promise.all([
                    iam.hasRole(common_1.Roles.ADMIN, address),
                    iam.hasRole(common_1.Roles.MANAGER, address),
                    iam.hasRole(common_1.Roles.AUDITOR, address),
                    iam.hasRole(common_1.Roles.USER, address),
                ]);
                roleMap.ADMIN_ROLE = isAdmin;
                roleMap.MANAGER_ROLE = isManager;
                roleMap.AUDITOR_ROLE = isAuditor;
                roleMap.USER_ROLE = isUser;
            }
            catch (err) {
                req.log.warn({ err }, 'Contract read failed for roles');
            }
        }
        return { address: address.toLowerCase(), roles: roleMap };
    });
    // POST /api/roles/grant - Admin grants role
    fastify.post('/grant', async (req, reply) => {
        const parsed = common_1.GrantRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.issues[0].message });
        }
        const { role, account } = parsed.data;
        const roleHash = common_1.Roles[role.replace('_ROLE', '')];
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.iamAddress || !iam || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const tx = await iam.grantRole(roleHash, account);
            await tx.wait();
            return { success: true, role, account, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Grant role failed: ' + err.message });
        }
    });
    // POST /api/roles/revoke - Admin revokes role
    fastify.post('/revoke', async (req, reply) => {
        const parsed = common_1.GrantRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.issues[0].message });
        }
        const { role, account } = parsed.data;
        const roleHash = common_1.Roles[role.replace('_ROLE', '')];
        const iam = (0, chain_js_1.getIamContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.iamAddress || !iam || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const tx = await iam.revokeRole(roleHash, account);
            await tx.wait();
            return { success: true, role, account, txHash: tx.hash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Revoke role failed: ' + err.message });
        }
    });
};
exports.rolesRoutes = rolesRoutes;
