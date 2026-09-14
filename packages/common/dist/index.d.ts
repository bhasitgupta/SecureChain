import { z } from 'zod';
export declare const ErrorCodes: {
    readonly AUTH_UNAUTHENTICATED: "AUTH-001";
    readonly AUTH_UNAUTHORIZED: "AUTH-002";
    readonly DOC_NOT_FOUND: "DOC-001";
    readonly DOC_INVALID_UPLOAD: "DOC-002";
    readonly DOC_IDEMPOTENCY_CONFLICT: "DOC-003";
    readonly MERKLE_PROOF_INVALID: "MERKLE-001";
    readonly CHAIN_RPC_UNAVAILABLE: "CHAIN-001";
    readonly CHAIN_TX_FAILED: "CHAIN-002";
    readonly REC_PROVIDER_UNAPPROVED: "REC-001";
    readonly REC_PROOF_EXPIRED: "REC-002";
    readonly REC_NONCE_REPLAYED: "REC-003";
    readonly REC_INVALID_SUBJECT: "REC-004";
    readonly AUDIT_STATE_MISMATCH: "AUDIT-001";
};
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
export declare const DocumentStates: {
    readonly UPLOADING: "UPLOADING";
    readonly DURABLY_STORED: "DURABLY_STORED";
    readonly HASHED: "HASHED";
    readonly OCR_PROCESSING: "OCR_PROCESSING";
    readonly PROOF_READY: "PROOF_READY";
    readonly MERKLE_BATCHED: "MERKLE_BATCHED";
    readonly ANCHOR_PENDING: "ANCHOR_PENDING";
    readonly ANCHORED: "ANCHORED";
    readonly VERIFIABLE: "VERIFIABLE";
    readonly FAILED: "FAILED";
};
export type DocumentState = typeof DocumentStates[keyof typeof DocumentStates];
export declare const Roles: {
    readonly ADMIN: `0x${string}`;
    readonly MANAGER: `0x${string}`;
    readonly AUDITOR: `0x${string}`;
    readonly USER: `0x${string}`;
};
export declare const Permissions: {
    readonly MINT: bigint;
    readonly ALLOCATE: bigint;
    readonly TRANSFER: bigint;
    readonly ANCHOR: bigint;
    readonly AUDIT: bigint;
};
export declare function formatDidPkh(chainId: number, address: string): string;
export declare function hashDid(did: string): `0x${string}`;
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
export declare const RegisterIdentitySchema: z.ZodObject<{
    account: z.ZodString;
    subjectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    account: string;
    subjectId: string;
}, {
    account: string;
    subjectId: string;
}>;
export declare const GrantRoleSchema: z.ZodObject<{
    role: z.ZodEnum<["ADMIN_ROLE", "MANAGER_ROLE", "AUDITOR_ROLE", "USER_ROLE"]>;
    account: z.ZodString;
}, "strip", z.ZodTypeAny, {
    account: string;
    role: "ADMIN_ROLE" | "MANAGER_ROLE" | "AUDITOR_ROLE" | "USER_ROLE";
}, {
    account: string;
    role: "ADMIN_ROLE" | "MANAGER_ROLE" | "AUDITOR_ROLE" | "USER_ROLE";
}>;
export declare const MintAssetSchema: z.ZodObject<{
    to: z.ZodString;
    assetClass: z.ZodString;
    metadataURI: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    to: string;
    assetClass: string;
    metadataURI: string;
}, {
    to: string;
    assetClass: string;
    metadataURI?: string | undefined;
}>;
export declare const AllocateAssetSchema: z.ZodObject<{
    tokenId: z.ZodString;
    to: z.ZodString;
}, "strip", z.ZodTypeAny, {
    to: string;
    tokenId: string;
}, {
    to: string;
    tokenId: string;
}>;
export declare const TransferAssetSchema: z.ZodObject<{
    tokenId: z.ZodString;
    from: z.ZodString;
    to: z.ZodString;
}, "strip", z.ZodTypeAny, {
    to: string;
    tokenId: string;
    from: string;
}, {
    to: string;
    tokenId: string;
    from: string;
}>;
export declare const RetireAssetSchema: z.ZodObject<{
    tokenId: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tokenId: string;
    reason: string;
}, {
    tokenId: string;
    reason: string;
}>;
