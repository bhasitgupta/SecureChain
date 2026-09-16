// Role Registry: Authoritative multi-tier role management with Polygon Amoy on-chain verification,
// gateway backend database persistence, and resilient local caching.
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK } from './constants.js';
import { fetchAssignedRoles, assignRoleAPI, fetchRolesForAddress, deleteRoleAPI } from '../lib/api.js';

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
  'https://rpc-amoy.polygon.technology',
  'https://polygon-amoy-bor-rpc.publicnode.com',
  'https://amoy.drpc.org',
].filter((url, idx, arr) => url && arr.indexOf(url) === idx);

// Primary Governance Admin Address (Main user wallet - permanently authoritative ADMIN)
export const PRIMARY_ADMIN_ADDRESS = '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c';

// Initial Authoritative Admin & Privileged Role Addresses
export const DEFAULT_ROLES = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
  '0x3d95ee72e01c793d097ae7aa9177d80fd3dc7a6a': 'AUDITOR',
};

const DEFAULT_REQUESTS = [];
const memoryStore = {};

function sanitizeRoleMap(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  const iamLower = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
  const legacyContract = '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6';

  Object.entries(obj).forEach(([k, v]) => {
    const a = k.toLowerCase().trim();
    if (v && v !== 'USER' && a !== legacyContract && a !== iamLower) {
      out[a] = v;
    }
  });
  return out;
}

function getStoredRoles() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(ROLE_REGISTRY_KEY) || window.sessionStorage?.getItem(ROLE_REGISTRY_KEY);
      if (stored) return sanitizeRoleMap(JSON.parse(stored));
    }
  } catch (e) {}
  return sanitizeRoleMap(memoryStore);
}

function saveStoredRoles(roles) {
  const sanitized = sanitizeRoleMap(roles);
  Object.keys(memoryStore).forEach(k => delete memoryStore[k]);
  Object.assign(memoryStore, sanitized);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const payload = JSON.stringify(sanitized);
      window.localStorage.setItem(ROLE_REGISTRY_KEY, payload);
      window.sessionStorage?.setItem(ROLE_REGISTRY_KEY, payload);
      window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { roles: sanitized } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {}
}

/**
 * Synchronize roles from the backend database/gateway into local storage
 */
export async function syncCloudRoles() {
  try {
    const roles = await fetchAssignedRoles();
    const local = getStoredRoles();
    const iamLower = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
    const legacyContract = '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6';
    let changed = false;

    // Purge unwanted addresses
    if (local[legacyContract]) { delete local[legacyContract]; changed = true; }
    if (iamLower && local[iamLower]) { delete local[iamLower]; changed = true; }
    Object.keys(local).forEach(k => {
      if (local[k] === 'USER') { delete local[k]; changed = true; }
    });

    if (roles && typeof roles === 'object') {
      Object.entries(roles).forEach(([addr, role]) => {
        const norm = addr.toLowerCase().trim();
        if (norm && norm !== legacyContract && norm !== iamLower && role && role !== 'USER') {
          if (local[norm] !== role) {
            local[norm] = role;
            changed = true;
          }
        }
      });
    }

    if (changed) {
      saveStoredRoles(local);
    }
  } catch (e) {
    // Fallback to local and default store
  }
}

// Initial sync on module load
syncCloudRoles();

/**
 * Returns role for a wallet address from local registry or defaults
 */
export function getRoleForWallet(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  if (normalized === PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
    return 'ADMIN';
  }

  try {
    const roles = getAllWalletRoles();
    if (roles[normalized]) {
      return roles[normalized];
    }
    if (DEFAULT_ROLES[normalized]) {
      return DEFAULT_ROLES[normalized];
    }
    return 'USER';
  } catch (e) {
    return DEFAULT_ROLES[normalized] || 'USER';
  }
}

/**
 * Query on-chain IAM contract on Polygon Amoy for authoritative role using fast timeout and multi-RPC fallback
 */
export async function checkOnChainRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  if (normalized === PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
    return 'ADMIN';
  }

  const iamAddr = CONTRACT_ADDRESSES.IdentityAndAccessManager;

  // 1. Try gateway backend role endpoint first (has direct node connection + DB cache, sub-100ms)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const apiData = await fetchRolesForAddress(normalized);
    clearTimeout(timer);

    if (apiData?.assignedRole) {
      return apiData.assignedRole;
    }
    if (apiData?.roles) {
      if (apiData.roles.ADMIN_ROLE) return 'ADMIN';
      if (apiData.roles.MANAGER_ROLE) return 'MANAGER';
      if (apiData.roles.AUDITOR_ROLE) return 'AUDITOR';
      if (apiData.roles.USER_ROLE) return 'USER';
    }
  } catch {
    // Fallback to direct on-chain RPC query
  }

  if (!iamAddr || !iamAddr.startsWith('0x') || iamAddr === '—') {
    return getRoleForWallet(normalized);
  }

  const abi = ['function hasRole(bytes32 role, address acct) view returns (bool)'];
  const net = ethers.Network.from(80002);

  for (const rpc of AMOY_RPCS) {
    try {
      const fetchReq = new ethers.FetchRequest(rpc);
      fetchReq.timeout = 2500; // Fast 2.5 second timeout per RPC
      const provider = new ethers.JsonRpcProvider(fetchReq, net, { staticNetwork: net, batchMaxCount: 1 });
      const iam = new ethers.Contract(iamAddr, abi, provider);

      const [isAdmin, isManager, isAuditor] = await Promise.race([
        Promise.all([
          iam.hasRole(ROLE_HASHES.ADMIN, normalized),
          iam.hasRole(ROLE_HASHES.MANAGER, normalized),
          iam.hasRole(ROLE_HASHES.AUDITOR, normalized),
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('RPC timeout')), 2500))
      ]);

      if (isAdmin) return 'ADMIN';
      if (isManager) return 'MANAGER';
      if (isAuditor) return 'AUDITOR';

      return 'USER';
    } catch (err) {
      continue;
    }
  }

  return getRoleForWallet(normalized);
}

/**
 * Master role resolver: queries On-Chain / Gateway first, then Local Registry & Defaults.
 */
export async function resolveAuthoritativeRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  if (normalized === PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
    return 'ADMIN';
  }

  try {
    const onChainRole = await checkOnChainRole(normalized);
    if (onChainRole) {
      const local = getAllWalletRoles();
      local[normalized] = onChainRole;
      saveStoredRoles(local);
      return onChainRole;
    }
  } catch (e) {}

  return getRoleForWallet(normalized);
}

/**
 * Fetch all configured wallet roles
 */
export function getAllWalletRoles() {
  try {
    const registry = getStoredRoles();
    const normalizedRegistry = {};

    // Load defaults first
    Object.entries(DEFAULT_ROLES).forEach(([addr, role]) => {
      normalizedRegistry[addr.toLowerCase().trim()] = role;
    });

    // Layer stored/assigned roles on top
    Object.entries(registry).forEach(([k, v]) => {
      if (k && v) {
        normalizedRegistry[k.toLowerCase().trim()] = v;
      }
    });

    // Clean up: Filter out USER and IAM contract address completely
    const privileged = {};
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
    Object.entries(normalizedRegistry).forEach(([addr, role]) => {
      const a = addr.toLowerCase().trim();
      if (role && role !== 'USER' && a !== iamAddr && a !== '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6') {
        privileged[a] = role;
      }
    });

    // Primary admin address is permanently guaranteed ADMIN
    privileged[PRIMARY_ADMIN_ADDRESS.toLowerCase()] = 'ADMIN';

    return privileged;
  } catch (e) {
    return { ...DEFAULT_ROLES, [PRIMARY_ADMIN_ADDRESS.toLowerCase()]: 'ADMIN' };
  }
}

/**
 * Assign a role to a wallet address, persist locally, and sync to backend/chain
 */
export async function setWalletRole(address, role) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  const currentRoles = getStoredRoles();

  if (role === 'USER') {
    delete currentRoles[normalized];
    delete memoryStore[normalized];
  } else {
    currentRoles[normalized] = role;
    memoryStore[normalized] = role;
  }

  // Remove any legacy contract address entry
  delete currentRoles['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];
  delete memoryStore['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];

  saveStoredRoles(currentRoles);

  // Sync to gateway backend for database persistence & on-chain relayer sync
  try {
    await assignRoleAPI(normalized, role);
  } catch (e) {
    console.warn('Backend role assignment sync warning:', e);
  }
}

export async function removeWalletRole(address) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  const currentRoles = getStoredRoles();
  const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();

  delete currentRoles[normalized];
  delete memoryStore[normalized];
  delete currentRoles['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];
  delete memoryStore['0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6'];
  if (iamAddr) {
    delete currentRoles[iamAddr];
    delete memoryStore[iamAddr];
  }

  saveStoredRoles(currentRoles);

  try {
    await deleteRoleAPI(normalized);
  } catch (e) {}

  try {
    await assignRoleAPI(normalized, 'USER');
  } catch (e) {
    console.warn('Backend role removal sync warning:', e);
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
