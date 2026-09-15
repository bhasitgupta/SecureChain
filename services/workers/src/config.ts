import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org',
  chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
  anchorAddress: (process.env.ANCHOR_ADDRESS || '') as `0x${string}`,
  adminPrivateKey: (process.env.ADMIN_PRIVATE_KEY || '') as `0x${string}`,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://sih:sih26125@localhost:5433/sih26125',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000', 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    buckets: {
      documents: 'documents',
      ocrOutput: 'ocr-output',
      assetThumbnails: 'asset-thumbnails',
      docThumbnails: 'doc-thumbnails',
    },
  },
  batchMaxLeaves: parseInt(process.env.BATCH_MAX_LEAVES || '10', 10), // Flush small batches quickly for demo
  batchMaxWaitSeconds: parseInt(process.env.BATCH_MAX_WAIT_SECONDS || '10', 10),
};
