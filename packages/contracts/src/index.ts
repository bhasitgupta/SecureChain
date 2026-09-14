export * from './abis.js';
import { ethers } from 'ethers';

export interface ContractAddresses {
  iam: string;
  nft: string;
  anchor: string;
  recovery: string;
}

export const AMOY_CHAIN_ID = 80002;
export const DEFAULT_AMOY_RPC = 'https://polygon-amoy.drpc.org';

export function getProvider(rpcUrl?: string) {
  return new ethers.JsonRpcProvider(rpcUrl || process.env.POLYGON_RPC_URL || DEFAULT_AMOY_RPC);
}
