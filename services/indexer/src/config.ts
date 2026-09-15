import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  polygonRpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org',
  chainId: parseInt(process.env.CHAIN_ID || '80002', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://sih:sih26125@localhost:5433/sih26125',
  contracts: {
    iam: (process.env.IAM_ADDRESS || '') as `0x${string}`,
    nft: (process.env.NFT_ADDRESS || '') as `0x${string}`,
    anchor: (process.env.ANCHOR_ADDRESS || '') as `0x${string}`,
    recovery: (process.env.RECOVERY_ADDRESS || '') as `0x${string}`,
  },
  pollIntervalMs: 5000,
  blockBatchSize: 1000n,
};
