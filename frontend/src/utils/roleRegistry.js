// Role Registry: Manages wallet-to-role mappings with persistent storage and on-chain sync
const ROLE_REGISTRY_KEY = 'sc_wallet_roles';
const ROLE_REQUESTS_KEY = 'sc_role_requests';

// Default initial roles (sample addresses for testing + demo)
const DEFAULT_ROLES = {
  // Configured initial admin addresses
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8': 'ADMIN',
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266': 'ADMIN',
};

// Initial sample role requests for admin review
const DEFAULT_REQUESTS = [
  { id: 'req-1', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', requestedRole: 'MANAGER', reason: 'Land Registry Officer - North Zone', timestamp: Date.now() - 3600000, status: 'PENDING' },
  { id: 'req-2', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', requestedRole: 'AUDITOR', reason: 'CAG State Comptroller Audit Lead', timestamp: Date.now() - 7200000, status: 'PENDING' },
];

export function getRoleForWallet(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase();

  try {
    const stored = localStorage.getItem(ROLE_REGISTRY_KEY);
    const registry = stored ? JSON.parse(stored) : DEFAULT_ROLES;

    // Return assigned role or default to USER for all new wallets
    return registry[normalized] || 'USER';
  } catch (e) {
    return 'USER';
  }
}

export function getAllWalletRoles() {
  try {
    const stored = localStorage.getItem(ROLE_REGISTRY_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ROLES;
  } catch (e) {
    return DEFAULT_ROLES;
  }
}

export function setWalletRole(address, role) {
  if (!address) return;
  const normalized = address.toLowerCase();
  try {
    const roles = getAllWalletRoles();
    roles[normalized] = role;
    localStorage.setItem(ROLE_REGISTRY_KEY, JSON.stringify(roles));
    window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { address: normalized, role } }));
  } catch (e) {
    console.error('Failed to save wallet role', e);
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

  // Grant the role to the wallet
  setWalletRole(req.address, req.requestedRole);

  // Mark request as approved
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
