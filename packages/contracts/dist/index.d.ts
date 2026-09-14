export * from './abis.js';
import { ethers } from 'ethers';
export interface ContractAddresses {
    iam: string;
    nft: string;
    anchor: string;
    recovery: string;
}
export declare const AMOY_CHAIN_ID = 80002;
export declare const DEFAULT_AMOY_RPC = "https://polygon-amoy.drpc.org";
export declare function getProvider(rpcUrl?: string): ethers.JsonRpcProvider;
