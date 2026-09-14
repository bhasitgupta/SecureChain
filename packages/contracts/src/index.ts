export * from './abis.js';
import { createPublicClient, http, defineChain, type Address } from 'viem';

export interface ContractAddresses {
  iam: Address;
  nft: Address;
  anchor: Address;
  recovery: Address;
}

export const amoyChain = defineChain({
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
    public: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
});

export function getPublicClient(rpcUrl?: string) {
  return createPublicClient({
    chain: amoyChain,
    transport: http(rpcUrl || process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  });
}
