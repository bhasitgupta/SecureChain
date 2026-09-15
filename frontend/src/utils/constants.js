export const ROLES = { ADMIN: 'ADMIN', MANAGER: 'MANAGER', AUDITOR: 'AUDITOR', USER: 'USER' };

export const DOC_STATES = [
  'UPLOADING', 'DURABLY_STORED', 'HASHED', 'OCR_PROCESSING',
  'PROOF_READY', 'MERKLE_BATCHED', 'ANCHOR_PENDING', 'ANCHORED', 'VERIFIABLE'
];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/identity', label: 'Identity', icon: 'Fingerprint', roles: ['ADMIN'] },
  { path: '/rbac', label: 'Access Control', icon: 'Shield', roles: ['ADMIN'] },
  { path: '/assets', label: 'Digital Access', icon: 'Gem', roles: ['ADMIN', 'MANAGER', 'USER'] },
  { path: '/verification', label: 'Document Verification', icon: 'ShieldCheck', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/documents', label: 'Document Proofs', icon: 'FileText', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/audit', label: 'Audit Trail', icon: 'ScrollText', roles: ['ADMIN', 'AUDITOR'] },
  { path: '/recovery', label: 'Recovery Settings', icon: 'KeyRound', roles: ['ADMIN'] },
  { path: '/settings', label: 'System Settings', icon: 'Settings', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
];

// ── Permission bits (must match IdentityAndAccessManager.sol) ──
export const PERMISSIONS = {
  MINT:     1 << 0,
  ALLOCATE: 1 << 1,
  TRANSFER: 1 << 2,
  ANCHOR:   1 << 3,
  AUDIT:    1 << 4,
};

// ── Identity status enum (must match IdentityAndAccessManager.sol) ──
export const IDENTITY_STATUS = { 0: 'Inactive', 1: 'Active', 2: 'Suspended', 3: 'Revoked' };

// ── Asset status enum (must match EnterpriseAssetNFT.sol) ──
export const ASSET_STATUS = { 0: 'Uninitialized', 1: 'Active', 2: 'Transferred', 3: 'Retired' };

// ── Contract addresses loaded from env (set via .env, never hardcoded) ──
export const CONTRACT_ADDRESSES = {
  IdentityAndAccessManager: import.meta.env.VITE_CONTRACT_IAM || '—',
  EnterpriseAssetNFT:       import.meta.env.VITE_CONTRACT_NFT || '—',
  DocumentAnchorRegistry:   import.meta.env.VITE_CONTRACT_ANCHOR || '—',
  RecoveryManager:          import.meta.env.VITE_CONTRACT_RECOVERY || '—',
};

export const NETWORK = {
  name:    import.meta.env.VITE_NETWORK_NAME || '—',
  chainId: import.meta.env.VITE_CHAIN_ID || '—',
  rpcUrl:  import.meta.env.VITE_RPC_URL || '—',
};
