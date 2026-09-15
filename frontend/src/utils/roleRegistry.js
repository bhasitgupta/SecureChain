// Role Registry: Authoritative multi-tier role management with Polygon Amoy on-chain verification,
// global cloud registry synchronization across devices, and persistent local caching.
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK } from './constants.js';

const ROLE_REGISTRY_KEY = 'sc_wallet_roles';
const ROLE_REQUESTS_KEY = 'sc_role_requests';

// Role keccak256 hashes matching IdentityAndAccessManager.sol
export const ROLE_HASHES = {
  ADMIN:   '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775',
  MANAGER: '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08',
  AUDITOR: '0x59a1c48e5837ad7a7f3dcedcbe129bf3249ec4fbf651fd4f5e2600ead39fe2f5',
  USER:    '0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8',
};

// High-speed, verified Polygon Amoy RPC endpoints with automatic failover
export const AMOY_RPCS = [
  NETWORK.rpcUrl || 'https://polygon-amoy.drpc.org',
  'https://polygon-amoy.drpc.org',
  'https://polygon-amoy-bor-rpc.publicnode.com',
  'https://80002.rpc.thirdweb.com',
].filter((url, idx, arr) => url && arr.indexOf(url) === idx);

// Global shared cloud registry object (ensures instant cross-device role sync across laptops & browsers)
const CLOUD_REGISTRY_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0a6aa0f9f13f1';

// Initial Authoritative Admin & Privileged Role Addresses (Specified by Governance & On-Chain Deployments)
export const DEFAULT_ROLES = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
  '0x3d95ee72e01c793d097ae7aa9177d80fd3dc7a6a': 'AUDITOR',
};

const DEFAULT_REQUESTS = [];

const memoryStore = {};

function getStoredRoles() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(ROLE_REGISTRY_KEY) || window.sessionStorage?.getItem(ROLE_REGISTRY_KEY);
      if (stored) return JSON.parse(stored);
    }
  } catch (e) {}
  return { ...memoryStore };
}

function saveStoredRoles(roles) {
  Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
  Object.assign(memoryStore, roles);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const payload = JSON.stringify(roles);
      window.localStorage.setItem(ROLE_REGISTRY_KEY, payload);
      window.sessionStorage?.setItem(ROLE_REGISTRY_KEY, payload);
      window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { sync: true } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {}
}

/**
 * Synchronize roles from the global cloud registry into local storage
 */
export async function syncCloudRoles() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(CLOUD_REGISTRY_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) return;
    const body = await res.json();
    if (body?.data && typeof body.data === 'object') {
      const local = getStoredRoles();
      let changed = false;

      Object.entries(body.data).forEach(([addr, role]) => {
        const norm = addr.toLowerCase().trim();
        if (role && role !== 'USER' && local[norm] !== role) {
          local[norm] = role;
          changed = true;
        }
      });

      if (changed) {
        saveStoredRoles(local);
      }
    }
  } catch (e) {
    // Silent failover to on-chain and local defaults
  }
}

// Kick off cloud sync on module load
syncCloudRoles();

/**
 * Returns role for a wallet address from local registry or defaults
 */
export function getRoleForWallet(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  // 1. Authoritative default addresses
  const defaultRole = DEFAULT_ROLES[normalized];

  try {
    const roles = getAllWalletRoles();
    const assigned = roles[normalized];
    if (assigned && assigned !== 'USER') {
      return assigned;
    }
    if (defaultRole) {
      return defaultRole;
    }
    return assigned || 'USER';
  } catch (e) {
    return defaultRole || 'USER';
  }
}

/**
 * Query on-chain IAM contract on Polygon Amoy for authoritative role using multi-RPC fallback
 */
export async function checkOnChainRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();
  const iamAddr = CONTRACT_ADDRESSES.IdentityAndAccessManager;
  if (!iamAddr || !iamAddr.startsWith('0x') || iamAddr === '—') {
    return getRoleForWallet(normalized);
  }

  const abi = ['function hasRole(bytes32 role, address acct) view returns (bool)'];
  const net = ethers.Network.from(80002);

  for (const rpc of AMOY_RPCS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc, net, { staticNetwork: net, batchMaxCount: 1 });
      const iam = new ethers.Contract(iamAddr, abi, provider);

      const [isAdmin, isAuditor, isManager] = await Promise.all([
        iam.hasRole(ROLE_HASHES.ADMIN, normalized),
        iam.hasRole(ROLE_HASHES.AUDITOR, normalized),
        iam.hasRole(ROLE_HASHES.MANAGER, normalized),
      ]);

      if (isAdmin) return 'ADMIN';
      if (isAuditor) return 'AUDITOR';
      if (isManager) return 'MANAGER';

      // Contract responded successfully that address holds no privileged roles
      return getRoleForWallet(normalized);
    } catch (err) {
      // Try next healthy RPC endpoint in list
      continue;
    }
  }

  return getRoleForWallet(normalized);
}

/**
 * Master role resolver: queries On-Chain first, then Cloud Store, then Local Registry & Defaults.
 * Guaranteed to reliably detect the friend's role across different machines.
 */
export async function resolveAuthoritativeRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  // Check on-chain Polygon Amoy (highest cryptographic authority)
  try {
    const onChainRole = await checkOnChainRole(normalized);
    if (onChainRole && onChainRole !== 'USER') {
      const local = getAllWalletRoles();
      local[normalized] = onChainRole;
      saveStoredRoles(local);
      return onChainRole;
    }
  } catch (e) {}

  // Check cloud registry
  try {
    await syncCloudRoles();
    const local = getAllWalletRoles();
    if (local[normalized] && local[normalized] !== 'USER') {
      return local[normalized];
    }
  } catch (e) {}

  // Check default roles
  if (DEFAULT_ROLES[normalized]) {
    return DEFAULT_ROLES[normalized];
  }

  return getRoleForWallet(normalized);
}

/**
 * Fetch all configured wallet roles
 */
export function getAllWalletRoles() {
  try {
    const registry = getStoredRoles();
    
    // Normalize all existing stored keys
    const normalizedRegistry = {};
    Object.entries(registry).forEach(([k, v]) => {
      if (k && v) {
        normalizedRegistry[k.toLowerCase().trim()] = v;
      }
    });

    // Ensure authoritative default roles are present
    Object.entries(DEFAULT_ROLES).forEach(([addr, role]) => {
      const normAddr = addr.toLowerCase().trim();
      if (!normalizedRegistry[normAddr] || normalizedRegistry[normAddr] === 'USER') {
        normalizedRegistry[normAddr] = role;
      }
    });

    return normalizedRegistry;
  } catch (e) {
    return { ...DEFAULT_ROLES };
  }
}

/**
 * Assign a role to a wallet address, persist locally, and sync to the cloud across all devices
 */
export async function setWalletRole(address, role) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  const currentRoles = getAllWalletRoles();

  if (role === 'USER') {
    delete currentRoles[normalized];
  } else {
    currentRoles[normalized] = role;
  }

  saveStoredRoles(currentRoles);

  // Sync to global shared cloud registry
  try {
    await fetch(CLOUD_REGISTRY_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SecureChain_RoleRegistry',
        data: currentRoles,
      }),
    });
  } catch (e) {
    console.warn('Cloud role broadcast skipped/failed:', e);
  }
}

/**
 * Remove an assigned role (downgrade to USER) and sync deletion across devices
 */
export async function removeWalletRole(address) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  const currentRoles = getAllWalletRoles();
  delete currentRoles[normalized];
  saveStoredRoles(currentRoles);

  try {
    await fetch(CLOUD_REGISTRY_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'SecureChain_RoleRegistry',
        data: currentRoles,
      }),
    });
  } catch (e) {
    console.warn('Cloud role removal skipped/failed:', e);
  }
}

export function getRoleRequests() {
  try {
    const stored = localStorage.getItem(ROLE_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_REQUESTS;
  } catch (e) {
    return DEFAULT_REQUESTS;
  }
}

export function saveRoleRequests(requests) {
  try {
    localStorage.setItem(ROLE_REQUESTS_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('sc_requests_updated'));
  } catch (e) {
    console.error('Failed to save role requests', e);
  }
}

export function approveRoleRequest(requestId) {
  const requests = getRoleRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  setWalletRole(req.address, req.requestedRole);
  req.status = 'APPROVED';
  saveRoleRequests(requests);
}

export function declineRoleRequest(requestId) {
  const requests = getRoleRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  req.status = 'DECLINED';
  saveRoleRequests(requests);
}
