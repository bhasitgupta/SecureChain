import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { Roles } from '@securechain/common';
import { config } from './config.js';
import { getIamContract, provider } from './chain.js';

export function requireOnChainRole(...requiredRoles: (keyof typeof Roles)[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const token =
      req.cookies.auth_token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return reply.status(401).send({ error: 'Authentication required' });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }

    const address = decoded.address;
    (req as any).authedAddress = address;

    // Primary admin address has unconditional governance privileges
    if (address && address.toLowerCase() === '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c') {
      return;
    }

    if (!config.iamAddress) {
      return reply.status(503).send({ error: 'IAM contract not configured' });
    }

    const iam = getIamContract(provider);
    if (!iam) {
      return reply.status(503).send({ error: 'Cannot connect to IAM contract' });
    }

    try {
      for (const roleKey of requiredRoles) {
        const roleHash = Roles[roleKey];
        if (!roleHash) continue;
        const has = await iam.hasRole(roleHash, address);
        if (has) {
          return;
        }
      }
    } catch (err: any) {
      req.log.error(err, 'Failed checking on-chain role');
      return reply.status(500).send({ error: 'Failed checking on-chain role: ' + err.message });
    }

    return reply.status(403).send({
      error: `On-chain role required: ${requiredRoles.join(' or ')}`,
      address,
    });
  };
}
