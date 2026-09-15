/**
 * Shared on-chain helpers for the SecureChain (SIH26125) admin scripts.
 *
 * ABIs are re-exported from the @sih26125/contracts workspace package so the
 * scripts, gateway, workers and indexer can never drift apart.
 */
import { ethers } from 'ethers';
import {
  IdentityAndAccessManagerAbi,
  EnterpriseAssetNFTAbi,
  DocumentAnchorRegistryAbi,
  RecoveryManagerAbi,
} from '@sih26125/contracts';

export const IAM_ABI = IdentityAndAccessManagerAbi;
export const NFT_ABI = EnterpriseAssetNFTAbi;
export const ANCHOR_ABI = DocumentAnchorRegistryAbi;
export const RECOVERY_ABI = RecoveryManagerAbi;

/** keccak256 role identifiers, matching IdentityAndAccessManager.sol constants. */
export const ROLES = {
  ADMIN_ROLE: ethers.id('ADMIN_ROLE'),
  MANAGER_ROLE: ethers.id('MANAGER_ROLE'),
  AUDITOR_ROLE: ethers.id('AUDITOR_ROLE'),
  USER_ROLE: ethers.id('USER_ROLE'),
};

/** Permission bits, matching IdentityAndAccessManager.sol PERM_* constants. */
export const PERMS = {
  MINT: 1n << 0n,
  ALLOCATE: 1n << 1n,
  TRANSFER: 1n << 2n,
  ANCHOR: 1n << 3n,
  AUDIT: 1n << 4n,
};

/** did:pkh identifier for an EVM account — must match packages/common/formatDidPkh. */
export const formatDidPkh = (chainId, address) =>
  `did:pkh:eip155:${chainId}:${address.toLowerCase()}`;

export const hashDid = (did) => ethers.id(did);

export const didHashFor = (chainId, address) => hashDid(formatDidPkh(chainId, address));

const EXPLORERS = {
  80002: 'https://amoy.polygonscan.com',
  137: 'https://polygonscan.com',
};

export const explorerBase = (chainId = 80002) =>
  EXPLORERS[Number(chainId)] || EXPLORERS[80002];

export const explorerAddress = (address, chainId = 80002) =>
  `${explorerBase(chainId)}/address/${address}`;

export const explorerTx = (hash, chainId = 80002) =>
  `${explorerBase(chainId)}/tx/${hash}`;

/** JsonRpcProvider tuned for public Amoy endpoints (many reject JSON-RPC batching). */
export const makeProvider = (rpcUrl) =>
  new ethers.JsonRpcProvider(rpcUrl || process.env.POLYGON_RPC_URL || 'https://polygon-amoy.drpc.org', undefined, {
    batchMaxCount: 1,
  });

/** Extract the useful part of an ethers/EVM error for CLI output. */
export function reasonOf(err) {
  return (
    err?.revert?.args?.[0] ||
    err?.reason ||
    err?.shortMessage ||
    err?.info?.error?.message ||
    err?.message ||
    String(err)
  );
}
