"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRoutes = void 0;
const common_1 = require("@sih26125/common");
const contracts_1 = require("@sih26125/contracts");
const config_js_1 = require("../config.js");
const chain_js_1 = require("../chain.js");
const rolesRoutes = async (fastify) => {
    // GET /api/roles/:address - check roles for address
    fastify.get('/:address', async (req, _reply) => {
        const { address } = req.params;
        const acct = address;
        const roleMap = {
            ADMIN_ROLE: false,
            MANAGER_ROLE: false,
            AUDITOR_ROLE: false,
            USER_ROLE: false,
        };
        if (config_js_1.config.iamAddress) {
            try {
                const [isAdmin, isManager, isAuditor, isUser] = await Promise.all([
                    chain_js_1.publicClient.readContract({
                        address: config_js_1.config.iamAddress,
                        abi: contracts_1.IdentityAndAccessManagerAbi,
                        functionName: 'hasRole',
                        args: [common_1.Roles.ADMIN, acct],
                    }),
                    chain_js_1.publicClient.readContract({
                        address: config_js_1.config.iamAddress,
                        abi: contracts_1.IdentityAndAccessManagerAbi,
                        functionName: 'hasRole',
                        args: [common_1.Roles.MANAGER, acct],
                    }),
                    chain_js_1.publicClient.readContract({
                        address: config_js_1.config.iamAddress,
                        abi: contracts_1.IdentityAndAccessManagerAbi,
                        functionName: 'hasRole',
                        args: [common_1.Roles.AUDITOR, acct],
                    }),
                    chain_js_1.publicClient.readContract({
                        address: config_js_1.config.iamAddress,
                        abi: contracts_1.IdentityAndAccessManagerAbi,
                        functionName: 'hasRole',
                        args: [common_1.Roles.USER, acct],
                    }),
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
        return { address: acct.toLowerCase(), roles: roleMap };
    });
    // POST /api/roles/grant - Admin grants role
    fastify.post('/grant', async (req, reply) => {
        const parsed = common_1.GrantRoleSchema.safeParse(req.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.issues[0].message });
        }
        const { role, account } = parsed.data;
        const roleHash = common_1.Roles[role.replace('_ROLE', '')];
        if (!config_js_1.config.iamAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.iamAddress,
                abi: contracts_1.IdentityAndAccessManagerAbi,
                functionName: 'grantRole',
                args: [roleHash, account],
            });
            return { success: true, role, account, txHash };
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
        if (!config_js_1.config.iamAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or Admin wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.iamAddress,
                abi: contracts_1.IdentityAndAccessManagerAbi,
                functionName: 'revokeRole',
                args: [roleHash, account],
            });
            return { success: true, role, account, txHash };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Revoke role failed: ' + err.message });
        }
    });
};
exports.rolesRoutes = rolesRoutes;
