// Role Registry: Manages wallet-to-role mappings with persistent storage and on-chain Polygon Amoy sync
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK } from './constants';

const ROLE_REGISTRY_KEY = 'sc_wallet_roles';
const ROLE_REQUESTS_KEY = 'sc_role_requests';

// Role keccak256 hashes matching IdentityAndAccessManager.sol
export const ROLE_HASHES = {
  ADMIN:   '0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775',
  MANAGER: '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08',
  AUDITOR: '0x59a1c48e5837ad7a7f3dcedcbe129bf3249ec4fbf651fd4f5e2600ead39fe2f5',
  USER:    '0x14823911f2da1b49f045a0929a60b8c1f2a7fc8c06c7284ca3e8ab4e193a08c8',
};

// Initial Authoritative Admin & Privileged Role Addresses (Specified by Governance)
export const DEFAULT_ROLES = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
  '0x3d95ee72e01c793d097ae7aa9177d80fd3dc7a6a': 'AUDITOR',
};

const DEFAULT_REQUESTS = [];

/**
 * Returns role for a wallet address from local registry or defaults
 */
export function getRoleForWallet(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase().trim();

  // If address has an explicit authoritative role configured in DEFAULT_ROLES, retrieve it
  const defaultRole = DEFAULT_ROLES[normalized];

  try {
    const roles = getAllWalletRoles();
    const assigned = roles[normalized];
    // If dynamically assigned a privileged role (ADMIN, MANAGER, AUDITOR), respect it
    if (assigned && assigned !== 'USER') {
      return assigned;
    }
    // If default role exists, it takes precedence over USER
    if (defaultRole) {
      return defaultRole;
    }
    return assigned || 'USER';
  } catch (e) {
    return defaultRole || 'USER';
  }
}

/**
 * Query on-chain IAM contract on Polygon Amoy for authoritative role
 */
export async function checkOnChainRole(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase();
  const iamAddr = CONTRACT_ADDRESSES.IdentityAndAccessManager;
  if (!iamAddr || !iamAddr.startsWith('0x') || iamAddr === '—') {
    return getRoleForWallet(normalized);
  }

  try {
    const rpc = NETWORK.rpcUrl || 'https://rpc-amoy.polygon.technology';
    const provider = new ethers.JsonRpcProvider(rpc);
    const abi = ['function hasRole(bytes32 role, address acct) view returns (bool)'];
    const iam = new ethers.Contract(iamAddr, abi, provider);

    const [isAdmin, isAuditor, isManager] = await Promise.all([
      iam.hasRole(ROLE_HASHES.ADMIN, normalized).catch(() => false),
      iam.hasRole(ROLE_HASHES.AUDITOR, normalized).catch(() => false),
      iam.hasRole(ROLE_HASHES.MANAGER, normalized).catch(() => false),
    ]);

    if (isAdmin) return 'ADMIN';
    if (isAuditor) return 'AUDITOR';
    if (isManager) return 'MANAGER';
    return getRoleForWallet(normalized);
  } catch (err) {
    // Fallback to secondary RPC if primary fails
    try {
      if (NETWORK.fallbackRpcUrl) {
        const fallbackProvider = new ethers.JsonRpcProvider(NETWORK.fallbackRpcUrl);
        const abi = ['function hasRole(bytes32 role, address acct) view returns (bool)'];
        const iam = new ethers.Contract(iamAddr, abi, fallbackProvider);
        const isAuditor = await iam.hasRole(ROLE_HASHES.AUDITOR, normalized);
        if (isAuditor) return 'AUDITOR';
        const isAdmin = await iam.hasRole(ROLE_HASHES.ADMIN, normalized);
        if (isAdmin) return 'ADMIN';
        const isManager = await iam.hasRole(ROLE_HASHES.MANAGER, normalized);
        if (isManager) return 'MANAGER';
      }
    } catch (e) {}

    return getRoleForWallet(normalized);
  }
}

/**
 * Fetch all configured wallet roles
 */
export function getAllWalletRoles() {
  try {
    const stored = localStorage.getItem(ROLE_REGISTRY_KEY) || sessionStorage.getItem(ROLE_REGISTRY_KEY);
    let registry = stored ? JSON.parse(stored) : {};
    
    // Normalize all existing stored keys
    const normalizedRegistry = {};
    Object.entries(registry).forEach(([k, v]) => {
      if (k && v) {
        normalizedRegistry[k.toLowerCase().trim()] = v;
      }
    });

    // Ensure authoritative default roles are present and not overridden by stale USER
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
 * Assign a role to a wallet address and persist across storage
 */
export function setWalletRole(address, role) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  try {
    const roles = getAllWalletRoles();
    if (role === 'USER') {
      delete roles[normalized];
    } else {
      roles[normalized] = role;
    }

    const payload = JSON.stringify(roles);
    localStorage.setItem(ROLE_REGISTRY_KEY, payload);
    sessionStorage.setItem(ROLE_REGISTRY_KEY, payload);

    // Broadcast across windows, tabs, and current app context
    window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { address: normalized, role } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save wallet role', e);
  }
}

/**
 * Remove an assigned role (downgrade to USER)
 */
export function removeWalletRole(address) {
  if (!address) return;
  const normalized = address.toLowerCase().trim();
  try {
    const roles = getAllWalletRoles();
    delete roles[normalized];

    const payload = JSON.stringify(roles);
    localStorage.setItem(ROLE_REGISTRY_KEY, payload);
    sessionStorage.setItem(ROLE_REGISTRY_KEY, payload);

    window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { address: normalized, role: 'USER' } }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to remove wallet role', e);
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
