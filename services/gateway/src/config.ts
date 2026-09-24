import dotenv from 'dotenv';
import path from 'path';

// Load from root .env or process.env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Chain
  polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org',
  chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
  
  // Contract Addresses (0x...)
  iamAddress: (process.env.IAM_ADDRESS || '') as `0x${string}`,
  nftAddress: (process.env.NFT_ADDRESS || '') as `0x${string}`,
  anchorAddress: (process.env.ANCHOR_ADDRESS || '') as `0x${string}`,
  recoveryAddress: (process.env.RECOVERY_ADDRESS || '') as `0x${string}`,
  
  // Admin signer key
  adminPrivateKey: (process.env.ADMIN_PRIVATE_KEY || '') as `0x${string}`,
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://securechain:securechain@localhost:5433/securechain',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // MinIO / S3 Object Storage (Local or Remote Cloud)
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
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  
  // Merkle
  batchMaxLeaves: parseInt(process.env.BATCH_MAX_LEAVES || '256', 10),
  batchMaxWaitSeconds: parseInt(process.env.BATCH_MAX_WAIT_SECONDS || '60', 10),
};
