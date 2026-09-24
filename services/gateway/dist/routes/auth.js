"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const ethers_1 = require("ethers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const config_js_1 = require("../config.js");
const common_1 = require("@securechain/common");
const db_js_1 = require("../db.js");
const authRoutes = async (fastify) => {
    // GET /api/auth/nonce
    fastify.get('/nonce', async (_req, reply) => {
        const nonce = (0, crypto_1.randomBytes)(16).toString('hex');
        // Store in cookie or return
        reply.setCookie('siwe_nonce', nonce, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 300, // 5 min
        });
        return { nonce };
    });
    // POST /api/auth/login
    fastify.post('/login', async (req, reply) => {
        const { message, signature, address } = req.body;
        if (!message || !signature || !address) {
            return reply.status(400).send({ error: 'Missing message, signature, or address' });
        }
        try {
            const recovered = ethers_1.ethers.verifyMessage(message, signature);
            if (recovered.toLowerCase() !== address.toLowerCase()) {
                return reply.status(401).send({ error: 'Signature verification failed' });
            }
            const did = (0, common_1.formatDidPkh)(config_js_1.config.chainId, address);
            const didHash = (0, common_1.hashDid)(did);
            // Upsert identity cache (non-blocking fallback)
            try {
                await (0, db_js_1.query)(`INSERT INTO identities (did_hash, did, account, status, updated_at)
           VALUES ($1, $2, $3, 'Active', NOW())
           ON CONFLICT (did_hash) DO UPDATE SET updated_at = NOW()`, [didHash, did, address.toLowerCase()]);
            }
            catch (dbErr) {
                req.log.warn({ err: dbErr.message }, 'Could not cache identity to DB, continuing with on-chain auth');
            }
            const token = jsonwebtoken_1.default.sign({ address: address.toLowerCase(), did, didHash }, config_js_1.config.jwtSecret, { expiresIn: '7d' });
            reply.setCookie('auth_token', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 3600,
            });
            return {
                success: true,
                address: address.toLowerCase(),
                did,
                didHash,
                token,
            };
        }
        catch (err) {
            req.log.error(err);
            return reply.status(500).send({ error: 'Login failed: ' + err.message });
        }
    });
    // GET /api/auth/me
    fastify.get('/me', async (req, reply) => {
        const token = req.cookies.auth_token ||
            req.headers.authorization?.replace(/^Bearer\s+/i, '');
        if (!token) {
            return reply.status(401).send({ error: 'Not authenticated' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_js_1.config.jwtSecret);
            return {
                authenticated: true,
                address: decoded.address,
                did: decoded.did,
                didHash: decoded.didHash,
            };
        }
        catch {
            return reply.status(401).send({ error: 'Invalid or expired token' });
        }
    });
    // POST /api/auth/logout
    fastify.post('/logout', async (_req, reply) => {
        reply.clearCookie('auth_token', { path: '/' });
        return { success: true };
    });
};
exports.authRoutes = authRoutes;
