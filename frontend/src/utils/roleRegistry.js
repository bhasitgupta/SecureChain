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
  'https://rpc-amoy.polygon.technology',
  'https://polygon-amoy.drpc.org',
  'https://polygon-amoy-bor-rpc.publicnode.com',
  NETWORK.rpcUrl,
].filter((url, idx, arr) => url && arr.indexOf(url) === idx);

// Primary Governance Admin Address (Main user wallet - permanently authoritative ADMIN)
export const PRIMARY_ADMIN_ADDRESS = '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c';

// Initial Authoritative Admin & Privileged Role Addresses
export const DEFAULT_ROLES = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
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

const REVOKED_ROLES_KEY = 'sc_revoked_roles';

export function getRevokedRoles() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(REVOKED_ROLES_KEY);
      if (stored) return new Set(JSON.parse(stored));
    }
  } catch {}
  return new Set();
}

export function saveRevokedRoles(set) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(REVOKED_ROLES_KEY, JSON.stringify(Array.from(set)));
    }
  } catch {}
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
    const revoked = getRevokedRoles();
    let changed = false;

    // Purge unwanted addresses
    if (local[legacyContract]) { delete local[legacyContract]; changed = true; }
    if (iamLower && local[iamLower]) { delete local[iamLower]; changed = true; }
    Object.keys(local).forEach(k => {
      if (local[k] === 'USER' || revoked.has(k)) { delete local[k]; changed = true; }
    });

    if (roles && typeof roles === 'object') {
      Object.entries(roles).forEach(([addr, role]) => {
        const norm = addr.toLowerCase().trim();
        if (norm && norm !== legacyContract && norm !== iamLower && role && role !== 'USER' && !revoked.has(norm)) {
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

  const revoked = getRevokedRoles();
  if (revoked.has(normalized)) {
    return 'USER';
  }

  try {
    const roles = getAllWalletRoles();
    if (roles[normalized]) {
      return roles[normalized];
    }
    if (DEFAULT_ROLES[normalized] && !revoked.has(normalized)) {
      return DEFAULT_ROLES[normalized];
    }
    return 'USER';
  } catch (e) {
    return (!revoked.has(normalized) && DEFAULT_ROLES[normalized]) || 'USER';
  }
}

// Fast in-memory cache to prevent duplicate RPC calls during rapid UI operations
const onChainRoleCache = new Map();
const ON_CHAIN_CACHE_TTL = 5000; // 5 seconds TTL

/**
 * Query on-chain IAM contract on Polygon Amoy for authoritative role using fast timeout and multi-RPC fallback
 */
export async function checkOnChainRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  if (normalized === PRIMARY_ADMIN_ADDRESS.toLowerCase()) {
    return 'ADMIN';
  }

  // 1. Check in-memory fast cache
  const cached = onChainRoleCache.get(normalized);
  if (cached && (Date.now() - cached.timestamp < ON_CHAIN_CACHE_TTL)) {
    return cached.role;
  }

  const iamAddr = CONTRACT_ADDRESSES.IdentityAndAccessManager;
  if (!iamAddr || !iamAddr.startsWith('0x') || iamAddr === '—') {
    return getRoleForWallet(normalized);
  }

  const abi = ['function hasRole(bytes32 role, address acct) view returns (bool)'];

  // Fast path 1: Browser wallet provider (sub-100ms response if wallet connected)
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const iam = new ethers.Contract(iamAddr, abi, provider);
      const [isAdmin, isManager, isAuditor] = await Promise.race([
        Promise.all([
          iam.hasRole(ROLE_HASHES.ADMIN, normalized),
          iam.hasRole(ROLE_HASHES.MANAGER, normalized),
          iam.hasRole(ROLE_HASHES.AUDITOR, normalized),
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Browser provider timeout')), 900))
      ]);

      const result = isAdmin ? 'ADMIN' : isManager ? 'MANAGER' : isAuditor ? 'AUDITOR' : 'USER';
      onChainRoleCache.set(normalized, { role: result, timestamp: Date.now() });
      return result;
    } catch {
      // Fall through to parallel public RPC race
    }
  }

  // Fast path 2: Parallel RPC race across verified Polygon Amoy nodes (<800ms)
  const net = ethers.Network.from(80002);
  try {
    const rpcPromises = AMOY_RPCS.map(async (rpc) => {
      const fetchReq = new ethers.FetchRequest(rpc);
      fetchReq.timeout = 1500;
      const provider = new ethers.JsonRpcProvider(fetchReq, net, { staticNetwork: net, batchMaxCount: 1 });
      const iam = new ethers.Contract(iamAddr, abi, provider);

      const [isAdmin, isManager, isAuditor] = await Promise.race([
        Promise.all([
          iam.hasRole(ROLE_HASHES.ADMIN, normalized),
          iam.hasRole(ROLE_HASHES.MANAGER, normalized),
          iam.hasRole(ROLE_HASHES.AUDITOR, normalized),
        ]),
        new Promise((_, reject) => setTimeout(() => reject(new Error('RPC query timeout')), 1500))
      ]);

      return isAdmin ? 'ADMIN' : isManager ? 'MANAGER' : isAuditor ? 'AUDITOR' : 'USER';
    });

    const fastRole = await Promise.any(rpcPromises);
    onChainRoleCache.set(normalized, { role: fastRole, timestamp: Date.now() });
    return fastRole;
  } catch (err) {
    // All RPCs failed/offline, fall through
  }

  // Fast path 3: Quick gateway backend check (400ms max)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 400);
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
  } catch {}

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

  // 1. Sync latest roles from cloud registry in background (non-blocking)
  syncCloudRoles().catch(() => {});

  // 2. Query on-chain IAM contract for verified role (authoritative source of truth)
  try {
    const onChainRole = await checkOnChainRole(normalized);
    if (onChainRole) {
      const local = getAllWalletRoles();
      if (onChainRole === 'USER') {
        // Explicitly revoked on chain: purge privileged store and mark revoked
        delete local[normalized];
        saveStoredRoles(local);
        const revoked = getRevokedRoles();
        revoked.add(normalized);
        saveRevokedRoles(revoked);
        return 'USER';
      } else {
        // Privileged role confirmed on chain
        local[normalized] = onChainRole;
        saveStoredRoles(local);
        const revoked = getRevokedRoles();
        if (revoked.has(normalized)) {
          revoked.delete(normalized);
          saveRevokedRoles(revoked);
        }
        return onChainRole;
      }
    }
  } catch (e) {}

  // 3. Fallback only if on-chain failed to respond
  const assigned = getRoleForWallet(normalized);
  return assigned || 'USER';
}

/**
 * Fetch all configured wallet roles
 */
export function getAllWalletRoles() {
  try {
    const registry = getStoredRoles();
    const normalizedRegistry = {};
    const revoked = getRevokedRoles();

    // Load defaults first, skipping any revoked addresses
    Object.entries(DEFAULT_ROLES).forEach(([addr, role]) => {
      const norm = addr.toLowerCase().trim();
      if (!revoked.has(norm)) {
        normalizedRegistry[norm] = role;
      }
    });

    // Layer stored/assigned roles on top, skipping revoked
    Object.entries(registry).forEach(([k, v]) => {
      const norm = k.toLowerCase().trim();
      if (norm && v && !revoked.has(norm)) {
        normalizedRegistry[norm] = v;
      }
    });

    // Clean up: Filter out USER and IAM contract address completely
    const privileged = {};
    const iamAddr = (CONTRACT_ADDRESSES.IdentityAndAccessManager || '').toLowerCase();
    Object.entries(normalizedRegistry).forEach(([addr, role]) => {
      const a = addr.toLowerCase().trim();
      if (role && role !== 'USER' && a !== iamAddr && a !== '0x0ca09ba889727be9fbbaa53d2fe1541bf2f8cee6' && !revoked.has(a)) {
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
  const revoked = getRevokedRoles();

  if (role === 'USER') {
    revoked.add(normalized);
    saveRevokedRoles(revoked);
    delete currentRoles[normalized];
    delete memoryStore[normalized];
  } else {
    if (revoked.has(normalized)) {
      revoked.delete(normalized);
      saveRevokedRoles(revoked);
    }
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

  // Mark in revoked store so defaults and background cloud sync never resurrect it
  const revoked = getRevokedRoles();
  revoked.add(normalized);
  saveRevokedRoles(revoked);

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
