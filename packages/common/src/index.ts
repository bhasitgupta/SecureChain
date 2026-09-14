import { z } from 'zod';
import { keccak256, toHex, stringToHex, encodePacked } from 'viem';

// ─── Error Codes ─────────────────────────────────────────────────────────────
export const ErrorCodes = {
  AUTH_UNAUTHENTICATED: 'AUTH-001',
  AUTH_UNAUTHORIZED: 'AUTH-002',
  DOC_NOT_FOUND: 'DOC-001',
  DOC_INVALID_UPLOAD: 'DOC-002',
  DOC_IDEMPOTENCY_CONFLICT: 'DOC-003',
  MERKLE_PROOF_INVALID: 'MERKLE-001',
  CHAIN_RPC_UNAVAILABLE: 'CHAIN-001',
  CHAIN_TX_FAILED: 'CHAIN-002',
  REC_PROVIDER_UNAPPROVED: 'REC-001',
  REC_PROOF_EXPIRED: 'REC-002',
  REC_NONCE_REPLAYED: 'REC-003',
  REC_INVALID_SUBJECT: 'REC-004',
  AUDIT_STATE_MISMATCH: 'AUDIT-001',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ─── Document State Machine ──────────────────────────────────────────────────
export const DocumentStates = {
  UPLOADING: 'UPLOADING',
  DURABLY_STORED: 'DURABLY_STORED',
  HASHED: 'HASHED',
  OCR_PROCESSING: 'OCR_PROCESSING',
  PROOF_READY: 'PROOF_READY',
  MERKLE_BATCHED: 'MERKLE_BATCHED',
  ANCHOR_PENDING: 'ANCHOR_PENDING',
  ANCHORED: 'ANCHORED',
  VERIFIABLE: 'VERIFIABLE',
  FAILED: 'FAILED',
} as const;

export type DocumentState = typeof DocumentStates[keyof typeof DocumentStates];

// ─── RBAC Roles & Permissions ────────────────────────────────────────────────
export const Roles = {
  ADMIN: keccak256(stringToHex('ADMIN_ROLE')),
  MANAGER: keccak256(stringToHex('MANAGER_ROLE')),
  AUDITOR: keccak256(stringToHex('AUDITOR_ROLE')),
  USER: keccak256(stringToHex('USER_ROLE')),
} as const;

export const Permissions = {
  MINT: 1n << 0n,
  ALLOCATE: 1n << 1n,
  TRANSFER: 1n << 2n,
  ANCHOR: 1n << 3n,
  AUDIT: 1n << 4n,
} as const;

// ─── DID Utilities ───────────────────────────────────────────────────────────
export function formatDidPkh(chainId: number, address: string): string {
  return `did:pkh:eip155:${chainId}:${address.toLowerCase()}`;
}

export function hashDid(did: string): `0x${string}` {
  return keccak256(stringToHex(did));
}

// ─── Verification Status ─────────────────────────────────────────────────────
export interface VerificationResult {
  valid: boolean;
  documentId: string;
  versionId: string;
  steps: {
    objectRetrieved: boolean;
    sha256Match: boolean;
    merkleInclusionMatch: boolean;
    polygonAnchorMatch: boolean;
  };
  details: {
    computedSha256: string;
    expectedSha256: string;
    computedLeaf: string;
    merkleRoot: string;
    anchoredRoot: string;
    anchorTx?: string;
    anchorBlock?: number;
  };
  error?: string;
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────
export const RegisterIdentitySchema = z.object({
  account: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
  subjectId: z.string().min(1).max(100),
});

export const GrantRoleSchema = z.object({
  role: z.enum(['ADMIN_ROLE', 'MANAGER_ROLE', 'AUDITOR_ROLE', 'USER_ROLE']),
  account: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});

export const MintAssetSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
  assetClass: z.string().min(1).max(50),
  metadataURI: z.string().optional().default(''),
});

export const AllocateAssetSchema = z.object({
  tokenId: z.coerce.string(),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});

export const TransferAssetSchema = z.object({
  tokenId: z.coerce.string(),
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});

export const RetireAssetSchema = z.object({
  tokenId: z.coerce.string(),
  reason: z.string().min(1).max(250),
});
