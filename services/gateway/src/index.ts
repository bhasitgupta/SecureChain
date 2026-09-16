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

import { ethers } from 'ethers';
import { Roles } from '@sih26125/common';
import { adminSigner, provider, getIamContract } from './chain.js';

import { ensureBucketsExist, minioClient } from './minio.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function main() {
  // Plugins
  const envOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const origins = Array.from(
    new Set([
      config.frontendUrl,
      ...envOrigins,
      'https://securechain1.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ])
  );

  await fastify.register(cors, {
    origin: origins,
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

  // Health check with on-chain diagnostics
  fastify.get('/health', async () => {
    let relayerData: any = null;
    if (adminSigner) {
      try {
        const [balance, iam] = await Promise.all([
          provider.getBalance(adminSigner.address),
          Promise.resolve(getIamContract(provider)),
        ]);
        const isAdmin = iam ? await iam.hasRole(Roles.ADMIN, adminSigner.address) : false;
        relayerData = {
          address: adminSigner.address,
          balance: ethers.formatEther(balance),
          isAdmin,
        };
      } catch (err: any) {
        relayerData = {
          address: adminSigner.address,
          error: err.message,
        };
      }
    }

    let minioStatus: any = null;
    try {
      const buckets = await minioClient.listBuckets();
      minioStatus = {
        connected: true,
        endPoint: config.minio.endPoint,
        port: config.minio.port,
        ssl: config.minio.useSSL,
        buckets: buckets.map((b) => b.name),
        publicUrl: config.minio.publicUrl || 'Direct S3 / Gateway streaming',
      };
    } catch (err: any) {
      minioStatus = {
        connected: false,
        endPoint: config.minio.endPoint,
        port: config.minio.port,
        ssl: config.minio.useSSL,
        error: err.code || err.message,
      };
    }

    return {
      status: 'ok',
      service: 'sih26125-gateway',
      chainId: config.chainId,
      contracts: {
        iam: config.iamAddress,
        nft: config.nftAddress,
        anchor: config.anchorAddress,
        recovery: config.recoveryAddress,
      },
      minio: minioStatus,
      relayer: relayerData,
      timestamp: new Date().toISOString(),
    };
  });

  // Route registration
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(identityRoutes, { prefix: '/api/identity' });
  await fastify.register(rolesRoutes, { prefix: '/api/roles' });
  await fastify.register(assetRoutes, { prefix: '/api/assets' });
  await fastify.register(documentRoutes, { prefix: '/api/documents' });
  await fastify.register(verifyRoutes, { prefix: '/api/verify' });
  await fastify.register(recoveryRoutes, { prefix: '/api/recovery' });
  await fastify.register(auditRoutes, { prefix: '/api/audit' });

  // Initialize MinIO storage buckets safely in background
  ensureBucketsExist().catch((err) => {
    fastify.log.warn(`[MinIO] Bucket initialization skipped (storage offline/unreachable): ${err.message}`);
  });

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
