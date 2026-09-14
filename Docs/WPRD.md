# SIH26125 — Workflow/Product Requirements Document (WPRD)

## 1. Purpose
Define the complete operational workflow from document upload through proof creation, versioning, Polygon anchoring, retrieval, verification and recovery-aware access.

## 2. Master Workflow

```text
AUTHENTICATE
    ↓
AUTHORIZE
    ↓
RESUMABLE UPLOAD
    ↓
DURABLE MINIO WRITE + STREAMING SHA-256
    ↓
CREATE DOCUMENT/VERSION RECORD
    ↓
IMMEDIATE UPLOAD RECEIPT
    ↓
ASYNC OCR
    ↓
PROOF RECORD
    ↓
MERKLE BATCH
    ↓
POLYGON ROOT ANCHOR
    ↓
INDEX / RECONCILE
    ↓
VERIFIABLE
```

## 3. First Upload
First accepted upload:
`D001/V1/H1`

Original bytes are stored in MinIO. OCR is generated asynchronously. H1 becomes a Merkle leaf. The root is anchored on Polygon.

## 4. Revision
A revised document:
`D001/V2/H2`

H1 is never changed. V2 receives its own proof and later anchor.

## 5. Latest-Version Workflow
```text
GET /documents/D001/latest
        ↓
latestVersion = V2
        ↓
authorize
        ↓
resolve MinIO V2
        ↓
secure stream / URL
```

Do not scan blockchain blocks for normal retrieval.

## 6. Verification Workflow
```text
Retrieve exact MinIO version
        ↓
SHA-256
        ↓
compare stored hash
        ↓
Merkle inclusion proof
        ↓
reconstruct root
        ↓
compare Polygon anchor
        ↓
VALID / INVALID
```

## 7. Enterprise Upload Ordering
1. Authenticate.
2. Authorize.
3. Start resumable upload.
4. Write chunks to durable staging/object storage.
5. Finalize object.
6. Confirm SHA-256.
7. Create version record.
8. Return durable receipt.
9. Queue OCR.
10. Queue Merkle proof.
11. Batch.
12. Anchor Polygon root.
13. Reconcile transaction.
14. Mark proof verifiable.

## 8. Latency Principle
Do not claim zero latency. Instead:

**remove unnecessary latency from the critical path.**

The user waits only for durable ingestion and trusted hash completion. OCR, Merkle construction and Polygon confirmation are asynchronous.

## 9. Failure States
- `UPLOADING`
- `DURABLY_STORED`
- `HASHED`
- `OCR_PROCESSING`
- `PROOF_READY`
- `MERKLE_BATCHED`
- `ANCHOR_PENDING`
- `ANCHORED`
- `VERIFIABLE`

Failure at one downstream stage must not destroy earlier durable state.

## 10. Idempotency
Every upload uses an idempotency key. Retries with the same key must not create duplicate versions. Merkle batches use unique batch IDs.

## 11. Recovery-Aware Access
Account recovery occurs independently of document proof:
`lost credential → recovery provider → valid proof → smart-account access restored`.

Historical document hashes, versions, Merkle roots and Polygon anchors remain unchanged.

# FINAL ARCHITECTURE DECISIONS — SIH26125 / BEL

> This section is normative. It resolves ambiguities found during the final requirement-to-design review.

## A. Strict SIH26125 requirement interpretation

The platform SHALL implement the following as first-class capabilities, not optional features:

1. **Decentralized identity / DID**
   - Every registered organizational identity has a stable DID.
   - The DID is cryptographically associated with the user's supported EVM smart account.
   - DID documents and sensitive identity attributes are not stored as raw PII on the public blockchain.
   - The platform may use W3C DID/VC-compatible representations for interoperability.

2. **Cryptographic proof of identity**
   - Identity control is proven through cryptographic signatures/validations.
   - Credential/attribute proof may be represented using verifiable credentials.
   - The backend must never treat a UI-supplied user ID as proof of identity.

3. **RBAC**
   - Required baseline roles: `ADMIN`, `MANAGER`, `AUDITOR`, `USER`.
   - Authorization is enforced at the smart-contract/business-policy boundary.
   - UI authorization is advisory only.
   - Role creation, assignment, revocation and permission changes are auditable state transitions.

4. **NFT-based digital assets**
   - Enterprise digital assets are represented by unique ERC-721-compatible token semantics in the prototype.
   - Each token has a globally unique token ID within the registry.
   - The NFT represents the enterprise asset/control record, not the confidential document bytes.
   - The asset record contains a cryptographic link to the responsible DID/identity record.
   - NFT minting is restricted to authorized administrators.
   - Initial allocation is administrator-controlled; later transfer is governed by explicit role/policy rules.

5. **Smart-contract enforcement**
   - Identity registration, role changes, minting, allocation, transfer and permission changes are contract-governed operations.
   - Unauthorized calls MUST revert or otherwise fail closed.
   - No critical authorization decision may depend only on the frontend or indexer.

6. **Immutable audit trail**
   - Identity creation/status changes, role assignment/revocation, permission updates, asset minting, asset allocation, ownership transfer, document proof anchoring and recovery events emit auditable blockchain events.
   - The indexer is a derived read model and never the authority for blockchain state.

7. **Confidential enterprise document security**
   - Original documents, OCR output and sensitive metadata remain off-chain in encrypted MinIO storage.
   - No raw confidential document bytes are stored on Polygon.
   - The document proof is cryptographic evidence, not document publication.

8. **Document integrity and versioning**
   - Every accepted document version receives an exact SHA-256 digest.
   - `documentId` remains stable across revisions.
   - Each revision receives a new immutable `versionId` and hash.
   - Historical versions are never overwritten.
   - Latest-version lookup resolves the current version without scanning blockchain history.

9. **Efficient blockchain anchoring**
   - Document hashes are batched into Merkle trees.
   - A Merkle root is anchored to Polygon.
   - A version is independently verifiable using its hash + inclusion proof + anchored root.

10. **Account recovery**
    - ERC-7947 is treated as a draft interface for smart-account recovery, not as a universal property of ordinary EOAs.
    - The prototype SHALL use a supported smart-account implementation with an ERC-7947-compatible recovery interface/provider model.
    - Recovery requires a registered provider, valid proof and replay protection.
    - Recovery changes access control only; it never rewrites historical transactions, hashes, versions or anchors.

## B. Enterprise deployment rule

**Prototype:** Polygon Amoy / EVM-compatible environment.

**Production target:** an enterprise-approved EVM deployment or approved Polygon-based environment with BEL security, network, key-management, data-residency and governance controls. The application remains chain-portable at the contract/API boundary.

A public testnet is therefore a demonstration environment, not the assumed location for BEL confidential production documents.

## C. Data authority

| Data | Authoritative source |
|---|---|
| Blockchain-controlled identity state | Smart contract |
| Role / permission state | Smart contract |
| NFT existence / allocation / ownership | Smart contract |
| Blockchain audit events | Polygon/EVM chain |
| Original document bytes | MinIO |
| OCR | MinIO |
| Object version | MinIO |
| SHA-256 proof record | Proof service/database, cryptographically anchored |
| Merkle root | Anchor contract |
| Inclusion proof | Proof service/database |
| Latest-version pointer | Authoritative application/domain state with audit trail |
| Search/index cache | Derived only |

If an indexer, cache or UI conflicts with authoritative blockchain state, the authoritative source wins.

## D. What is intentionally beyond the literal PS

The following are deliberate enterprise extensions, not substitutions for SIH requirements:

- confidential MinIO document storage;
- SHA-256 document integrity;
- Merkle batching;
- document version lineage;
- latest-version retrieval;
- asynchronous OCR;
- resilient queues and retries;
- multi-RPC failover;
- ERC-7947-compatible recovery;
- security/reliability/compliance controls;
- independent verification tooling.

These extensions strengthen the requested identity/access/asset platform without changing its core purpose.

## E. Explicit non-goals

The prototype SHALL NOT become:

- a cryptocurrency system;
- a DeFi application;
- a public NFT marketplace;
- a token-trading platform;
- a repository of raw confidential documents on-chain;
- an ordinary EOA pretending to support ERC-7947 recovery;
- a replacement for BEL's entire enterprise IAM/ERP stack;
- an AI anomaly-detection platform;
- a facial-recognition or biometric system;
- an IoT/RFID/geofencing system.

# FINAL REQUIREMENT TRACEABILITY

| SIH26125 requirement | Final implementation | Status |
|---|---|---|
| Blockchain-based framework | Polygon/EVM Solidity smart-contract trust plane | **FULFILLED** |
| Decentralized identity | DID + cryptographic subject + smart-account association | **FULFILLED** |
| Cryptographic identity proof | Signature/credential proof + contract-controlled identity | **FULFILLED** |
| NFT digital assets | ERC-721-compatible unique enterprise asset registry | **FULFILLED** |
| Unique/traceable assets | Unique token IDs + immutable event history | **FULFILLED** |
| NFT linked to identity | Asset record binds token to identity/DID subject | **FULFILLED** |
| Admin-only NFT creation | Contract role/policy restricts minting | **FULFILLED** |
| Admin-controlled allocation | Initial allocation restricted to authorized admin | **FULFILLED** |
| RBAC | Admin / Manager / Auditor / User | **FULFILLED** |
| Smart-contract permission enforcement | Fail-closed contract authorization | **FULFILLED** |
| Identity creation recorded | Blockchain event | **FULFILLED** |
| NFT creation recorded | Blockchain event | **FULFILLED** |
| Asset allocation recorded | Blockchain event | **FULFILLED** |
| Ownership transfer recorded | Blockchain event | **FULFILLED** |
| Access-right assignment recorded | Blockchain event | **FULFILLED** |
| Permission updates recorded | Blockchain event | **FULFILLED** |
| Tamper-proof / immutable auditability | Chain event history + independent verification | **FULFILLED** |
| Enterprise confidentiality | MinIO encrypted off-chain data plane | **FULFILLED** |
| Document authenticity | SHA-256 + Merkle inclusion + Polygon root | **ENTERPRISE EXTENSION / FULFILLED** |
| Document versioning | Stable document ID + immutable versions | **ENTERPRISE EXTENSION / FULFILLED** |
| Account recovery | ERC-7947-compatible smart-account recovery | **ENTERPRISE EXTENSION / FULFILLED** |

## Final verdict

**The merged solution is requirement-complete for SIH26125 after the decisions above.**

The additions do not replace any explicit SIH requirement. They harden the solution for BEL's enterprise/defence context.

# FINAL WORKFLOW PRODUCT REQUIREMENTS

## Workflow priority

### P0 — Mandatory SIH core
- DID identity.
- Cryptographic identity proof.
- Admin/Manager/Auditor/User RBAC.
- Admin-only NFT minting.
- Admin-controlled initial allocation.
- Identity ↔ NFT association.
- Smart-contract authorization.
- Immutable lifecycle events.
- Auditor verification.

### P0 — Mandatory enterprise security extension
- Confidential MinIO document storage.
- SHA-256 per document version.
- Merkle proof batching.
- Polygon anchoring.
- Immutable version history.
- Latest-version retrieval.

### P1 — Controlled recovery
- ERC-7947-compatible smart-account recovery.
- Provider governance.
- Proof replay protection.

## Workflow acceptance criteria

A workflow is complete only when its authoritative state is durable, its authorization decision is enforceable, and its critical transition is auditable.

## UX rule

Never expose a UI state such as “Verified” solely because an indexer says so. Verification status must derive from authoritative proof/state checks.
