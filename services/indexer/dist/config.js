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
    databaseUrl: process.env.DATABASE_URL || 'postgresql://sih:sih26125@localhost:5432/sih26125',
    contracts: {
        iam: (process.env.IAM_ADDRESS || ''),
        nft: (process.env.NFT_ADDRESS || ''),
        anchor: (process.env.ANCHOR_ADDRESS || ''),
        recovery: (process.env.RECOVERY_ADDRESS || ''),
    },
    pollIntervalMs: 5000,
    blockBatchSize: 1000n,
};
