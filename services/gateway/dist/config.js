"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load from root .env or process.env
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
exports.config = {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || '0.0.0.0',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    // Chain
    polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology',
    chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
    // Contract Addresses (0x...)
    iamAddress: (process.env.IAM_ADDRESS || ''),
    nftAddress: (process.env.NFT_ADDRESS || ''),
    anchorAddress: (process.env.ANCHOR_ADDRESS || ''),
    recoveryAddress: (process.env.RECOVERY_ADDRESS || ''),
    // Admin signer key
    adminPrivateKey: (process.env.ADMIN_PRIVATE_KEY || ''),
    // Database
    databaseUrl: process.env.DATABASE_URL || 'postgresql://sih:sih26125@localhost:5433/sih26125',
    // Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    // MinIO
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
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    // Merkle
    batchMaxLeaves: parseInt(process.env.BATCH_MAX_LEAVES || '256', 10),
    batchMaxWaitSeconds: parseInt(process.env.BATCH_MAX_WAIT_SECONDS || '60', 10),
};
