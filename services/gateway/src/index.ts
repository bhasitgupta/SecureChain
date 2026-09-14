import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { config } from './config.js';
import { authRoutes } from './routes/auth.js';
import { identityRoutes } from './routes/identity.js';
import { rolesRoutes } from './routes/roles.js';
import { assetRoutes } from './routes/assets.js';
import { documentRoutes } from './routes/documents.js';
import { verifyRoutes } from './routes/verify.js';
import { recoveryRoutes } from './routes/recovery.js';
import { auditRoutes } from './routes/audit.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function main() {
  // Plugins
  await fastify.register(cors, {
    origin: [config.frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  await fastify.register(cookie, {
    secret: config.jwtSecret,
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB max
    },
  });

  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    service: 'sih26125-gateway',
    timestamp: new Date().toISOString(),
  }));

  // Route registration
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(identityRoutes, { prefix: '/api/identity' });
  await fastify.register(rolesRoutes, { prefix: '/api/roles' });
  await fastify.register(assetRoutes, { prefix: '/api/assets' });
  await fastify.register(documentRoutes, { prefix: '/api/documents' });
  await fastify.register(verifyRoutes, { prefix: '/api/verify' });
  await fastify.register(recoveryRoutes, { prefix: '/api/recovery' });
  await fastify.register(auditRoutes, { prefix: '/api/audit' });

  // Start listening
  try {
    const address = await fastify.listen({ port: config.port, host: config.host });
    console.log(`🚀 Gateway listening on ${address}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
