"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryRoutes = void 0;
const contracts_1 = require("@sih26125/contracts");
const config_js_1 = require("../config.js");
const chain_js_1 = require("../chain.js");
const recoveryRoutes = async (fastify) => {
    // GET /api/recovery/:address - Read recovery state
    fastify.get('/:address', async (req, reply) => {
        const { address } = req.params;
        if (!config_js_1.config.recoveryAddress) {
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
            const state = await chain_js_1.publicClient.readContract({
                address: config_js_1.config.recoveryAddress,
                abi: contracts_1.RecoveryManagerAbi,
                functionName: 'accounts',
                args: [address],
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
                pendingOwner: state[1] !== '0x0000000000000000000000000000000000000000' ? state[1] : null,
                unlockTime,
                timelockDuration: Number(state[3]),
                status,
            };
        }
        catch (err) {
            req.log.warn({ err }, 'Failed to read recovery state');
            return reply.status(500).send({ error: 'Failed to read recovery state: ' + err.message });
        }
    });
    // POST /api/recovery/register - Register account with timelock
    fastify.post('/register', async (req, reply) => {
        const { timelockSeconds = 300 } = req.body || {};
        if (!config_js_1.config.recoveryAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.recoveryAddress,
                abi: contracts_1.RecoveryManagerAbi,
                functionName: 'registerAccount',
                args: [BigInt(timelockSeconds)],
            });
            return { success: true, txHash, timelockSeconds };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Register account failed: ' + err.message });
        }
    });
    // POST /api/recovery/request - Request recovery
    fastify.post('/request', async (req, reply) => {
        const { account, proposedOwner, nonce, deadline, signature } = req.body;
        if (!account || !proposedOwner || !nonce || !deadline || !signature) {
            return reply.status(400).send({ error: 'Missing required recovery parameters' });
        }
        if (!config_js_1.config.recoveryAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.recoveryAddress,
                abi: contracts_1.RecoveryManagerAbi,
                functionName: 'requestRecovery',
                args: [
                    account,
                    proposedOwner,
                    nonce,
                    BigInt(deadline),
                    signature,
                ],
            });
            return { success: true, txHash, account, proposedOwner };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Request recovery failed: ' + err.message });
        }
    });
    // POST /api/recovery/cancel - Cancel pending recovery (Owner veto)
    fastify.post('/cancel', async (req, reply) => {
        const { account } = req.body;
        if (!account) {
            return reply.status(400).send({ error: 'Missing account' });
        }
        if (!config_js_1.config.recoveryAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.recoveryAddress,
                abi: contracts_1.RecoveryManagerAbi,
                functionName: 'cancelRecovery',
                args: [account],
            });
            return { success: true, txHash, account };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Cancel recovery failed: ' + err.message });
        }
    });
    // POST /api/recovery/finalize - Finalize recovery after timelock
    fastify.post('/finalize', async (req, reply) => {
        const { account } = req.body;
        if (!account) {
            return reply.status(400).send({ error: 'Missing account' });
        }
        if (!config_js_1.config.recoveryAddress || !chain_js_1.walletClient || !chain_js_1.adminAccount) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const txHash = await chain_js_1.walletClient.writeContract({
                address: config_js_1.config.recoveryAddress,
                abi: contracts_1.RecoveryManagerAbi,
                functionName: 'finalizeRecovery',
                args: [account],
            });
            return { success: true, txHash, account };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Finalize recovery failed: ' + err.message });
        }
    });
};
exports.recoveryRoutes = recoveryRoutes;
