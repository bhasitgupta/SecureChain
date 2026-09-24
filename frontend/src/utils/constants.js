export const ROLES = { ADMIN: 'ADMIN', MANAGER: 'MANAGER', AUDITOR: 'AUDITOR', USER: 'USER' };

export const DOC_STATES = [
  'UPLOADING', 'DURABLY_STORED', 'HASHED', 'OCR_PROCESSING',
  'PROOF_READY', 'MERKLE_BATCHED', 'ANCHOR_PENDING', 'ANCHORED', 'VERIFIABLE'
];

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/identity', label: 'Identity', icon: 'Fingerprint', roles: ['ADMIN', 'MANAGER'] },
  { path: '/rbac', label: 'Access Control', icon: 'Shield', roles: ['ADMIN'] },
  { path: '/assets', label: 'Digital Assets', icon: 'Gem', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/verification', label: 'Document Verification', icon: 'ShieldCheck', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/documents', label: 'Document Proofs', icon: 'FileText', roles: ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'] },
  { path: '/audit', label: 'Audit Trail', icon: 'ScrollText', roles: ['ADMIN', 'MANAGER', 'AUDITOR'] },
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

// ── Contract addresses loaded from env with real verified Polygon Amoy deployments as default ──
export const CONTRACT_ADDRESSES = {
  IdentityAndAccessManager: import.meta.env?.VITE_CONTRACT_IAM || '0x0Ca09ba889727bE9FbBAA53d2fE1541bF2f8cee6',
  EnterpriseAssetNFT:       import.meta.env?.VITE_CONTRACT_NFT || '0xE97E0ea3a452a5099fd126721Db0DAfa96455e7D',
  DocumentAnchorRegistry:   import.meta.env?.VITE_CONTRACT_ANCHOR || '0x8921960116d0D4a8A26aad7eA330E3f098C7F58F',
  RecoveryManager:          import.meta.env?.VITE_CONTRACT_RECOVERY || '0xf3F590b6DFA67a8453c62C8E065cdb5127518b90',
};

export const NETWORK = {
  name:          import.meta.env?.VITE_NETWORK_NAME || 'Polygon Amoy Testnet',
  chainId:       import.meta.env?.VITE_CHAIN_ID || '80002',
  rpcUrl:        import.meta.env?.VITE_RPC_URL || 'https://polygon-amoy.drpc.org',
  fallbackRpcUrl:'https://polygon-amoy-bor-rpc.publicnode.com',
  blockExplorer: import.meta.env?.VITE_BLOCK_EXPLORER || 'https://amoy.polygonscan.com',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
};
