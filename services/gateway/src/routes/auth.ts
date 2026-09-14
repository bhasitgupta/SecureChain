import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../config.js';
import { formatDidPkh, hashDid } from '@sih26125/common';
import { query } from '../db.js';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/auth/nonce
  fastify.get('/nonce', async (_req, reply) => {
    const nonce = randomBytes(16).toString('hex');
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
  fastify.post<{
    Body: { message: string; signature: string; address: string };
  }>('/login', async (req, reply) => {
    const { message, signature, address } = req.body;
    if (!message || !signature || !address) {
      return reply.status(400).send({ error: 'Missing message, signature, or address' });
    }

    try {
      const recovered = ethers.verifyMessage(message, signature);
      if (recovered.toLowerCase() !== address.toLowerCase()) {
        return reply.status(401).send({ error: 'Signature verification failed' });
      }

      const did = formatDidPkh(config.chainId, address);
      const didHash = hashDid(did);

      // Upsert identity cache
      await query(
        `INSERT INTO identities (did_hash, did, account, status, updated_at)
         VALUES ($1, $2, $3, 'Active', NOW())
         ON CONFLICT (did_hash) DO UPDATE SET updated_at = NOW()`,
        [didHash, did, address.toLowerCase()]
      );

      const token = jwt.sign(
        { address: address.toLowerCase(), did, didHash },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

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
    } catch (err: any) {
      req.log.error(err);
      return reply.status(500).send({ error: 'Login failed: ' + err.message });
    }
  });

  // GET /api/auth/me
  fastify.get('/me', async (req, reply) => {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      return {
        authenticated: true,
        address: decoded.address,
        did: decoded.did,
        didHash: decoded.didHash,
      };
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });

  // POST /api/auth/logout
  fastify.post('/logout', async (_req, reply) => {
    reply.clearCookie('auth_token', { path: '/' });
    return { success: true };
  });
};
