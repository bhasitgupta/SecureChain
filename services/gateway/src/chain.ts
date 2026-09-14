import { createPublicClient, createWalletClient, http, defineChain, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from './config.js';

export const polygonAmoy = defineChain({
  id: config.chainId,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: [config.polygonRpcUrl] },
    public: { http: [config.polygonRpcUrl] },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(config.polygonRpcUrl),
});

export const adminAccount = config.adminPrivateKey
  ? privateKeyToAccount(config.adminPrivateKey)
  : null;

export const walletClient = adminAccount
  ? createWalletClient({
      account: adminAccount,
      chain: polygonAmoy,
      transport: http(config.polygonRpcUrl),
    })
  : null;
