"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
exports.config = {
    polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology',
    chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
    anchorAddress: (process.env.ANCHOR_ADDRESS || ''),
    adminPrivateKey: (process.env.ADMIN_PRIVATE_KEY || ''),
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
