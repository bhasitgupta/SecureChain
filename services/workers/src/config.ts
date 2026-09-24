import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org',
  chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
  anchorAddress: (process.env.ANCHOR_ADDRESS || '') as `0x${string}`,
  adminPrivateKey: (process.env.ADMIN_PRIVATE_KEY || '') as `0x${string}`,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://securechain:securechain@localhost:5433/securechain',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: process.env.MINIO_PORT 
      ? parseInt(process.env.MINIO_PORT, 10) 
      : (process.env.MINIO_USE_SSL === 'true' ? 443 : 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    region: process.env.MINIO_REGION || 'us-east-1',
    publicUrl: process.env.MINIO_PUBLIC_URL || '',
    buckets: {
      documents: process.env.MINIO_BUCKET_DOCS || 'documents',
      ocrOutput: process.env.MINIO_BUCKET_OCR || 'ocr-output',
      assetThumbnails: process.env.MINIO_BUCKET_THUMBNAILS || 'asset-thumbnails',
      docThumbnails: process.env.MINIO_BUCKET_DOC_THUMBNAILS || 'doc-thumbnails',
    },
  },
  batchMaxLeaves: parseInt(process.env.BATCH_MAX_LEAVES || '10', 10), // Flush small batches quickly for demo
  batchMaxWaitSeconds: parseInt(process.env.BATCH_MAX_WAIT_SECONDS || '10', 10),
};
