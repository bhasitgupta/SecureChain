"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetireAssetSchema = exports.TransferAssetSchema = exports.AllocateAssetSchema = exports.MintAssetSchema = exports.GrantRoleSchema = exports.RegisterIdentitySchema = exports.Permissions = exports.Roles = exports.DocumentStates = exports.ErrorCodes = void 0;
exports.formatDidPkh = formatDidPkh;
exports.hashDid = hashDid;
const zod_1 = require("zod");
const viem_1 = require("viem");
// ─── Error Codes ─────────────────────────────────────────────────────────────
exports.ErrorCodes = {
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
};
// ─── Document State Machine ──────────────────────────────────────────────────
exports.DocumentStates = {
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
};
// ─── RBAC Roles & Permissions ────────────────────────────────────────────────
exports.Roles = {
    ADMIN: (0, viem_1.keccak256)((0, viem_1.stringToHex)('ADMIN_ROLE')),
    MANAGER: (0, viem_1.keccak256)((0, viem_1.stringToHex)('MANAGER_ROLE')),
    AUDITOR: (0, viem_1.keccak256)((0, viem_1.stringToHex)('AUDITOR_ROLE')),
    USER: (0, viem_1.keccak256)((0, viem_1.stringToHex)('USER_ROLE')),
};
exports.Permissions = {
    MINT: 1n << 0n,
    ALLOCATE: 1n << 1n,
    TRANSFER: 1n << 2n,
    ANCHOR: 1n << 3n,
    AUDIT: 1n << 4n,
};
// ─── DID Utilities ───────────────────────────────────────────────────────────
function formatDidPkh(chainId, address) {
    return `did:pkh:eip155:${chainId}:${address.toLowerCase()}`;
}
function hashDid(did) {
    return (0, viem_1.keccak256)((0, viem_1.stringToHex)(did));
}
// ─── Zod Schemas ─────────────────────────────────────────────────────────────
exports.RegisterIdentitySchema = zod_1.z.object({
    account: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
    subjectId: zod_1.z.string().min(1).max(100),
});
exports.GrantRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['ADMIN_ROLE', 'MANAGER_ROLE', 'AUDITOR_ROLE', 'USER_ROLE']),
    account: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});
exports.MintAssetSchema = zod_1.z.object({
    to: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
    assetClass: zod_1.z.string().min(1).max(50),
    metadataURI: zod_1.z.string().optional().default(''),
});
exports.AllocateAssetSchema = zod_1.z.object({
    tokenId: zod_1.z.coerce.string(),
    to: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});
exports.TransferAssetSchema = zod_1.z.object({
    tokenId: zod_1.z.coerce.string(),
    from: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
    to: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid EVM address'),
});
exports.RetireAssetSchema = zod_1.z.object({
    tokenId: zod_1.z.coerce.string(),
    reason: zod_1.z.string().min(1).max(250),
});
