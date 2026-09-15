// Role Registry: Manages wallet-to-role mappings with persistent storage and on-chain sync
const ROLE_REGISTRY_KEY = 'sc_wallet_roles';
const ROLE_REQUESTS_KEY = 'sc_role_requests';

// Initial Authoritative Admin Addresses (Specified by Governance)
const DEFAULT_ROLES = {
  '0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c': 'ADMIN',
  '0xff00d19db6668537116ecda91ac07fa448a2223e': 'ADMIN',
};

// Deprecated old test addresses to purge automatically
const PURGE_OLD_ADDRESSES = [
  '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
  '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
];

const DEFAULT_REQUESTS = [];

function cleanRegistry(registry) {
  let modified = false;
  PURGE_OLD_ADDRESSES.forEach(addr => {
    if (registry[addr]) {
      delete registry[addr];
      modified = true;
    }
  });
  // Ensure authoritative admins are present
  Object.entries(DEFAULT_ROLES).forEach(([addr, role]) => {
    if (!registry[addr]) {
      registry[addr] = role;
      modified = true;
    }
  });
  return { registry, modified };
}

export function getRoleForWallet(address) {
  if (!address) return 'USER';
  const normalized = address.toLowerCase();

  try {
    const roles = getAllWalletRoles();
    return roles[normalized] || 'USER';
  } catch (e) {
    return DEFAULT_ROLES[normalized] || 'USER';
  }
}

export function getAllWalletRoles() {
  try {
    const stored = localStorage.getItem(ROLE_REGISTRY_KEY);
    let registry = stored ? JSON.parse(stored) : { ...DEFAULT_ROLES };
    const { registry: cleaned, modified } = cleanRegistry(registry);
    if (modified || !stored) {
      localStorage.setItem(ROLE_REGISTRY_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return { ...DEFAULT_ROLES };
  }
}

export function setWalletRole(address, role) {
  if (!address) return;
  const normalized = address.toLowerCase();
  try {
    const roles = getAllWalletRoles();
    if (role === 'USER') {
      delete roles[normalized];
    } else {
      roles[normalized] = role;
    }
    localStorage.setItem(ROLE_REGISTRY_KEY, JSON.stringify(roles));
    window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { address: normalized, role } }));
  } catch (e) {
    console.error('Failed to save wallet role', e);
  }
}

export function removeWalletRole(address) {
  if (!address) return;
  const normalized = address.toLowerCase();
  try {
    const roles = getAllWalletRoles();
    delete roles[normalized];
    localStorage.setItem(ROLE_REGISTRY_KEY, JSON.stringify(roles));
    window.dispatchEvent(new CustomEvent('sc_role_updated', { detail: { address: normalized, role: 'USER' } }));
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
