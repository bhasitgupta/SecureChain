"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryRoutes = void 0;
const config_js_1 = require("../config.js");
const chain_js_1 = require("../chain.js");
const recoveryRoutes = async (fastify) => {
    // GET /api/recovery/:address - Read recovery state
    fastify.get('/:address', async (req, reply) => {
        const { address } = req.params;
        const rec = (0, chain_js_1.getRecoveryContract)(chain_js_1.provider);
        if (!config_js_1.config.recoveryAddress || !rec) {
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
        const rec = (0, chain_js_1.getRecoveryContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.recoveryAddress || !rec || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const tx = await rec.registerAccount(BigInt(timelockSeconds));
            await tx.wait();
            return { success: true, txHash: tx.hash, timelockSeconds };
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
        const rec = (0, chain_js_1.getRecoveryContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.recoveryAddress || !rec || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const tx = await rec.requestRecovery(account, proposedOwner, nonce, BigInt(deadline), signature);
            await tx.wait();
            return { success: true, txHash: tx.hash, account, proposedOwner };
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
        const rec = (0, chain_js_1.getRecoveryContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.recoveryAddress || !rec || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const tx = await rec.cancelRecovery(account);
            await tx.wait();
            return { success: true, txHash: tx.hash, account };
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
        const rec = (0, chain_js_1.getRecoveryContract)(chain_js_1.adminSigner);
        if (!config_js_1.config.recoveryAddress || !rec || !chain_js_1.adminSigner) {
            return reply.status(503).send({ error: 'Chain or wallet not configured' });
        }
        try {
            const tx = await rec.finalizeRecovery(account);
            await tx.wait();
            return { success: true, txHash: tx.hash, account };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(400).send({ error: 'Finalize recovery failed: ' + err.message });
        }
    });
};
exports.recoveryRoutes = recoveryRoutes;
