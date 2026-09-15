# SIH26125 — Technical Requirements & Design Document (TRD)

## 1. Technical Objective
Implement an enterprise EVM architecture using Polygon, Solidity smart contracts, MinIO, asynchronous processing, Merkle batching, blockchain event indexing and ERC-7947-compatible smart-account recovery.

## 2. Reference Architecture

## 2.1 Architecture objective

The reference architecture separates **confidential data**, **authoritative blockchain state**, **application orchestration**, **derived read models**, and **enterprise security controls**.

> **Core principle:** confidential bytes stay off-chain; only minimal, non-sensitive, cryptographically verifiable trust state is anchored on Polygon; authorization is enforced at the smart-contract/business-policy boundary; and critical state transitions are auditable.

## 2.2 Full end-to-end reference architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              BEL ENTERPRISE / TRUST BOUNDARY                                               │
│                                                                                                            │
│  ┌──────────────────────────── PRESENTATION & CLIENT LAYER ────────────────────────────────────────────┐   │
│  │ Admin Portal │ Manager Portal │ Auditor Portal │ User Portal │ Independent Verification Tool        │   │
│  └──────────────────────────────────────────────┬───────────────────────────────────────────────────────┘   │
│                                                 │ HTTPS / authenticated requests                           │
│                                                 ▼                                                          │
│  ┌──────────────────────────── APPLICATION & POLICY LAYER ─────────────────────────────────────────────┐   │
│  │ API Gateway / BFF                                                                                     │   │
│  │   ├─ Authentication / session / signature verification                                               │   │
│  │   ├─ Policy Enforcement Point (PEP)                                                                  │   │
│  │   ├─ Input validation / rate limiting / idempotency                                                  │   │
│  │   └─ Audit correlation / request trace ID                                                             │   │
│  │                                                                                                      │   │
│  │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐                              │   │
│  │   │Identity Svc  │ │ RBAC/Policy  │ │ Asset Svc    │ │ Document Svc   │                              │   │
│  │   └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └───────┬────────┘                              │   │
│  │          └─────────────────┴────────────────┴─────────────────┘                                       │   │
│  │                                      │                                                               │   │
│  │                         Blockchain Gateway / Tx Service                                               │   │
│  │                  signing • nonce • gas • retry • RPC failover • receipt reconciliation               │   │
│  └──────────────────────────────┬──────────────────────────────┬────────────────────────────────────────┘   │
│                                 │                              │                                            │
│                                 │                              ▼                                            │
│                                 │               ┌─────────────────────────────────────────────┐            │
│                                 │               │         CONFIDENTIAL DATA PLANE             │            │
│                                 │               │                                             │            │
│                                 │               │ MinIO: Original / OCR / Versions           │            │
│                                 │               │ Proof DB: SHA-256 / Merkle proof / status   │            │
│                                 │               └─────────────────────────────────────────────┘            │
│                                 │                                                                        │
│                                 ▼                                                                        │
│  ┌──────────────────────────── TRUST / BLOCKCHAIN PLANE ──────────────────────────────────────────────┐   │
│  │                                      Polygon / EVM                                                    │   │
│  │                                           │                                                          │   │
│  │    ┌────────────────┐ ┌───────────────────┼──────────────────┐ ┌────────────────────────────┐        │   │
│  │    │IdentityRegistry│ │RolePermissionReg. │ │EnterpriseAssetNFT│ │DocumentAnchorRegistry  │        │   │
│  │    └────────────────┘ └───────────────────┼──────────────────┘ └────────────────────────────┘        │   │
│  │                                          │                                                           │   │
│  │                                  AssetGovernance                                                    │   │
│  │                                          │                                                           │   │
│  │                         Smart Accounts / Recovery Interface                                         │   │
│  │                                          │                                                           │   │
│  │                                  Recovery Provider                                                  │   │
│  └──────────────────────────────────────────┼─────────────────────────────────────────────────────────┘   │
│                                             │                                                             │
│  ┌──────────────────────────── ASYNCHRONOUS PROCESSING PLANE ───────────────────────────────────────────┐   │
│  │ Durable Queue → OCR Workers → Proof Workers → Merkle Batcher → Polygon Anchor Workers              │   │
│  │                     │              │                │                       │                       │   │
│  │                     └──────────────┴────────────────┴───────────────────────┘                       │   │
│  │                                   Retry / Backoff / DLQ                                               │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                            │
│  ┌──────────────────────────── READ / INDEX / VERIFICATION PLANE ──────────────────────────────────────┐   │
│  │ Polygon → Indexer → Query DB / Search Index → Read API                                               │   │
│  │                    └────────────── replayable derived state ────────────────┘                       │   │
│  │ Independent verifier: exact MinIO object → SHA-256 → Merkle proof → Polygon root                    │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                            │
│  ┌──────────────────────────── SECURITY / OPERATIONS PLANE ─────────────────────────────────────────────┐   │
│  │ KMS/HSM/MPC │ Secrets Manager │ TLS/mTLS │ WAF │ SIEM │ Logs │ Metrics │ Tracing │ Backup / DR      │   │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Component connectivity — normative data flow

```text
CLIENT
  │
  ▼
API GATEWAY
  │
  ├──► Authentication / Signature Verification
  │
  ├──► Policy Enforcement Point
  │       │
  │       └──► RBAC / authorization pre-check
  │
  ├──► Identity Service ───────► IdentityRegistry
  │
  ├──► RBAC Service ───────────► RolePermissionRegistry
  │
  ├──► Asset Service ──────────► EnterpriseAssetNFT
  │                              │
  │                              └──► AssetGovernance
  │
  └──► Document Service
          │
          ├──► MinIO
          │      ├── Original bytes
          │      ├── OCR output
          │      └── Immutable object versions
          │
          ├──► SHA-256 / Proof Record
          │
          └──► Durable Queue
                 ├──► OCR Worker ───────────────► MinIO
                 ├──► Proof Worker ─────────────► Proof DB
                 └──► Merkle Batcher
                         │
                         ▼
                    Polygon Anchor Worker
                         │
                         ▼
                  DocumentAnchorRegistry

Polygon
  │
  ├──► Blockchain Indexer ─► Query DB / Search Index ─► Read API
  │
  └──► Independent Verification Service

Smart Account
  │
  └──► ERC-7947-compatible Recovery Interface
                │
                └──► Approved Recovery Provider
```

**Authority rule:** application services orchestrate transactions, but smart contracts make the final blockchain authorization decision. The frontend and indexer are never authorization authorities.

## 2.4 Architecture planes

| Plane | Components | Responsibility | Authority |
|---|---|---|---|
| Presentation | Portals, verification tool | User interaction | None |
| Application | Gateway, services, policy layer | Validation/orchestration | Application policy |
| Confidential data | MinIO, proof DB | Document bytes/OCR/proof metadata | MinIO for bytes |
| Blockchain trust | Polygon + contracts | Identity, RBAC, NFT, anchor state | **Polygon** |
| Async processing | Queue/workers | OCR/proof/anchor processing | Durable job state |
| Read/index | Indexer/query/search | Fast retrieval | **Derived only** |
| Verification | Independent verifier | Cryptographic validation | Hash + proof + chain |
| Security/ops | KMS/HSM/SIEM/DR | Protection/assurance | Enterprise controls |

## 2.5 Trust boundaries

```text
[User Device / Untrusted]
          │ HTTPS + authenticated request
          ▼
[BEL Application Zone]
          │
     ┌────┴────────────────┐
     ▼                     ▼
[Confidential Data]    [Blockchain Zone]
     │                     │
   MinIO               Polygon/EVM
```

Rules:

- Client-supplied role, ownership, hash, or “verified” flag is never trusted.
- Application authorization is defensive; protected state transitions remain contract/policy controlled.
- Sensitive documents remain inside the confidential data boundary.
- Polygon receives only minimal non-sensitive trust/proof state.
- Service-to-service communication must be authenticated and encrypted according to the deployment security model.

## 2.6 Contract decomposition

```text
                         GOVERNANCE / ADMIN
                                │
             ┌──────────────────┼───────────────────┐
             ▼                  ▼                   ▼
      IdentityRegistry   RolePermissionRegistry  AssetGovernance
             │                  │                   │
             │                  │                   ▼
             │                  │          EnterpriseAssetNFT
             │                  │                   │
             └──────────────────┴───────────────────┘
                                │
                                ▼
                     DocumentAnchorRegistry

Smart Account
      │
      ▼
ERC-7947-compatible Recovery Interface
      │
      ▼
Approved Recovery Provider
```

| Contract | Responsibility |
|---|---|
| `IdentityRegistry` | DID/identity registration, account binding, status, identity events |
| `RolePermissionRegistry` | Admin/Manager/Auditor/User roles, permissions, grants/revocations |
| `EnterpriseAssetNFT` | Unique ERC-721-compatible enterprise token identity and ownership |
| `AssetGovernance` | Initial allocation and transfer policy |
| `DocumentAnchorRegistry` | Merkle-root/batch anchoring |
| Smart Account | User/account control and execution |
| Recovery interface/provider | Controlled account recovery |

Do not create one monolithic contract. Keep identity, policy, asset and document-anchor state separately governable and testable.

## 2.7 Identity architecture

```text
DID
 │
 ▼
IdentityRegistry
 │
 ├── status
 ├── identity subject/reference
 └── controller
        │
        ▼
   Smart Account
        │
   ┌────┼───────────────┐
   ▼    ▼               ▼
 Roles Permissions     Assets
```

A stable DID is the identity-level identifier. Sensitive attributes remain off-chain. The smart account provides the cryptographic control/execution principal.

## 2.8 RBAC architecture

```text
                         ADMIN
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          MANAGER       AUDITOR         USER
```

| Role | Identity | RBAC | Mint | Initial allocation | Transfer | Audit |
|---|---:|---:|---:|---:|---:|---:|
| Admin | ✓ | ✓ | ✓ | ✓ | Policy-controlled | ✓ |
| Manager | ✓ | Limited | ✗ | ✗ | Policy-controlled | ✓ |
| Auditor | ✓ | Read | ✗ | ✗ | ✗ | ✓ |
| User | ✓ | Self/read | ✗ | ✗ | Policy-controlled | Read |

**SIH invariant:** only authorized Admin principals can mint NFTs and perform initial allocation.

## 2.9 NFT asset architecture

```text
Asset Definition
      │
      ▼
Admin Authorization
      │
      ▼
NFT Mint
      │
      ▼
NFT → DID Allocation
      │
      ▼
ACTIVE
      │
      ├──► Authorized Transfer ─► New Identity
      │
      └──► Retire / Revoke
```

The NFT represents the enterprise asset/control record. It does **not** contain confidential document bytes.

A token record can contain/resolve:

- `tokenId`
- `assetClass`
- `assetStatus`
- `identitySubjectId / DID reference`
- non-sensitive metadata reference
- lifecycle timestamps

## 2.10 Confidential document architecture

```text
                    DOCUMENT SERVICE
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       MinIO Object Store         Proof Service
             │                         │
       ┌─────┼─────┐             ┌─────┼──────────┐
       ▼     ▼     ▼             ▼     ▼          ▼
    Original OCR Versions      SHA-256 Merkle  Polygon Anchor
```

### Version invariant

```text
Document D001
 ├── V1 → H1 → Merkle Batch B1 → Root R1 → Polygon TX1
 ├── V2 → H2 → Merkle Batch B2 → Root R2 → Polygon TX2
 └── V3 → H3 → Merkle Batch B3 → Root R3 → Polygon TX3

LATEST → V3
```

Historical versions are never overwritten.

## 2.11 Upload and proof architecture

### Synchronous critical path

```text
Authenticate
   ↓
Authorize
   ↓
Create upload session / idempotency key
   ↓
Multipart / resumable upload
   ↓
Durable MinIO write
   ↓
Streaming SHA-256
   ↓
Create documentId + versionId
   ↓
UPLOAD_ACKNOWLEDGED
```

The acknowledgement MUST NOT wait for OCR, Merkle batching, Polygon RPC or Polygon confirmation.

### Asynchronous path

```text
UPLOAD_ACKNOWLEDGED
        ↓
   Durable Queue
        │
   ┌────┼─────────────┐
   ▼    ▼             ▼
  OCR  Proof       Metadata
   │    │
   ▼    ▼
 MinIO  Merkle Leaf
            ↓
       Merkle Batcher
            ↓
        Merkle Root
            ↓
      Polygon Anchor
            ↓
       Confirmation
            ↓
        VERIFIABLE
```

## 2.12 Verification architecture

```text
Exact MinIO object
       ↓
SHA-256(object) = H
       ↓
Merkle inclusion proof
       ↓
Reconstruct Root R
       ↓
Compare R with Polygon anchor
       ↓
VALID / INVALID
```

`VALID` means the retrieved bytes match the recorded version hash, the hash is included in the recorded Merkle tree, and the reconstructed root matches the Polygon anchor.

## 2.13 Version and latest-document architecture

```text
documentId    = stable logical document identity
versionId     = immutable revision identity
objectVersion = exact MinIO object version
hash          = exact byte digest
```

```text
GET /documents/{documentId}/latest
              ↓
         Authorization
              ↓
       Resolve latestVersionId
              ↓
       Resolve MinIO objectVersion
              ↓
     Secure stream / short-lived URL
```

Ordinary latest retrieval does not scan Polygon history. Verification is an independent high-assurance operation.

## 2.14 Account recovery architecture

```text
User loses access
       ↓
Recovery request
       ↓
Approved Recovery Provider
       ↓
Valid proof + replay protection
       ↓
Smart Account recoverAccess()
       ↓
New access subject
       ↓
AccessRecovered event
```

Recovery changes account control only. It does not rewrite prior transactions, NFT history, document versions, hashes, Merkle roots or audit events.

**ERC-7947 note:** ERC-7947 is a draft interface for smart-account recovery. The implementation must identify the concrete smart-account and recovery provider.

## 2.15 Blockchain transaction architecture

```text
Application Service
      ↓
Policy Pre-check
      ↓
Transaction Builder
      ↓
Enterprise Signing / Custody
      ↓
Approved Polygon RPC
      ↓
Transaction Submitted
      ↓
Polygon Inclusion
      ↓
Receipt Reconciliation
      ↓
Indexer
      ↓
Derived Read Model
```

The transaction service handles nonce management, duplicate submission, RPC failure/failover, receipt polling, confirmation policy and restart reconciliation.

## 2.16 Indexer architecture

```text
Polygon
  ↓
Event Listener
  ↓
Block Checkpoint
  ↓
Event Decoder
  ↓
Idempotent Upsert
  ↓
┌───────────────┬────────────────┐
▼               ▼                │
Query DB     Search Index        │
└───────────────┴────────────────┘
                ↓
             Read API
```

The indexer is replayable and rebuildable from Polygon. It is never the final authority for roles, permissions, ownership or audit history.

## 2.17 Reliability and performance architecture

```text
                    API
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Identity     Asset    Document
                                │
                                ▼
                         Durable Queue
                     ┌────────┼────────┐
                     ▼        ▼        ▼
                    OCR     Proof    Anchor
                     │        │        │
                   retry    retry    retry
                     │        │        │
                    DLQ      DLQ      DLQ
```

Required mechanisms:

- resumable/multipart uploads;
- streaming SHA-256;
- bounded concurrency;
- queue backpressure;
- asynchronous OCR;
- Merkle batching;
- Polygon anchoring;
- multiple approved RPC providers;
- idempotent jobs;
- retries with backoff;
- dead-letter queues;
- indexer replay.

Do not promise zero latency. The engineering objective is **fast durable acknowledgement plus bounded downstream proof latency**.

## 2.18 Security architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                 BEL SECURITY CONTROL PLANE                   │
│ KMS/HSM/MPC │ Secrets │ Network Controls │ SIEM │ Monitoring │
└───────────────────────┬──────────────────────────────────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
     MinIO          Application       Smart Contracts
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                Audit / Observability
```

Controls include TLS/mTLS as appropriate, encrypted MinIO storage, least-privilege object policies, short-lived signed URLs, enterprise key custody, multisig governance, rate limiting, replay protection, dependency/container scanning, secret rotation, SIEM integration, backup and disaster recovery.

## 2.19 Deployment reference architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                       BEL ENTERPRISE NETWORK                     │
│                                                                  │
│ Users → WAF/LB/API Gateway → Application Cluster                │
│                              │                                   │
│                 ┌────────────┼──────────────┐                    │
│                 ▼            ▼              ▼                    │
│               MinIO       Queue/Workers   DB/Index               │
│             encrypted     OCR/Proof/     Query/Search            │
│                           Anchor                                  │
│                                                                  │
│                 KMS/HSM/Secrets/SIEM/Backup                      │
└──────────────────────────────┬───────────────────────────────────┘
                               │ approved blockchain connectivity
                               ▼
                    ┌─────────────────────┐
                    │ Polygon / EVM       │
                    │ Smart Contracts      │
                    └─────────────────────┘
```

### Prototype

- Polygon Amoy / approved EVM test environment;
- Solidity contracts;
- containerized services;
- MinIO;
- proof/read database;
- durable queue;
- indexer.

### Production

The same logical architecture can be deployed using BEL-approved network topology, key custody, storage, logging/SIEM, backup/DR, data-residency and blockchain connectivity controls.

## 2.20 Authoritative data model

| Domain | Authoritative source |
|---|---|
| Identity blockchain state | Polygon smart contract |
| Role/permission state | Polygon smart contract |
| NFT existence/ownership/allocation | Polygon smart contract |
| Blockchain audit events | Polygon |
| Original document bytes | MinIO |
| OCR output | MinIO |
| Object version | MinIO |
| SHA-256 proof record | Proof service/database + cryptographic anchor |
| Merkle root | Polygon |
| Inclusion proof | Proof service/database |
| Latest-version pointer | Authoritative application/domain state + audit |
| Search/index cache | Derived only |

**Conflict rule:** if UI/indexer/cache conflicts with Polygon for blockchain-controlled state, Polygon wins. If a document cache conflicts with the durable object, the exact MinIO object version is authoritative.

## 2.21 Golden end-to-end architecture

```text
USER
  ↓
Cryptographic Authentication
  ↓
DID / Identity Resolution
  ↓
RBAC Authorization
  ↓
┌───────────────────────────────┬──────────────────────────────┐
│                               │                              │
▼                               ▼                              │
ASSET PATH                 DOCUMENT PATH                       │
│                               │                              │
▼                               ▼                              │
NFT / Governance           MinIO Upload                        │
│                               │                              │
▼                               ▼                              │
Polygon Events             SHA-256 / Version                    │
                                │                              │
                                ▼                              │
                         Async Proof Pipeline                   │
                                │                              │
                                ▼                              │
                         Merkle Root / Polygon                  │
                                │                              │
└───────────────────────┬───────┴──────────────────────────────┘
                        ▼
               Read / Audit / Verify
                        │
                        ▼
                 Auditor Evidence
```

## 2.22 Non-negotiable architecture invariants

1. No confidential document bytes on Polygon.
2. No frontend-only authorization.
3. No indexer as blockchain source of truth.
4. No modification of historical document versions.
5. No ordinary EOA presented as inherently ERC-7947 recoverable.
6. No invisible privileged administrative mutation.
7. No unauthorized NFT minting.
8. No unauthorized initial asset allocation.
9. No upload acknowledgement before durable storage.
10. No synchronous dependency on OCR, Merkle batching or Polygon confirmation.
11. No single RPC provider as an unavoidable production dependency.
12. No private keys stored in application databases or exposed to clients.

## 2.23 Final reference-architecture decision

The solution consists of five coordinated systems:

```text
1. IDENTITY
   DID + Smart Account + Cryptographic Proof

2. AUTHORIZATION
   RBAC + Smart-Contract Policy Enforcement

3. ASSET
   ERC-721-compatible Enterprise NFT + Ownership Governance

4. CONFIDENTIAL EVIDENCE
   MinIO + SHA-256 + Versioning + OCR + Merkle + Polygon Anchor

5. TRUST / AUDIT
   Polygon Events + Replayable Indexer + Independent Verification
   + Governed Account Recovery
```

They are integrated through the application/policy layer but remain deliberately separated so that confidentiality, authorization, blockchain trust, performance and auditability do not become coupled into a single failure domain.


# 3. Data Plane
MinIO is the authoritative storage location for confidential document bytes and OCR outputs.

## 4. Trust Plane
Polygon provides immutable blockchain state and proof anchoring.

## 5. Compute Plane
Workers perform OCR, proof construction and Merkle batching asynchronously.

## 6. Read Plane
The indexer provides fast queries. It is not authoritative when blockchain state can be verified directly.

## 7. SHA-256
Hash the exact uploaded byte stream:
`H = SHA256(original_bytes)`

Use streaming hashing during ingestion where practical.

## 8. Proof Record
```text
documentId
versionId
sha256
originalObjectKey
originalObjectVersionId
ocrObjectKey
ocrObjectVersionId
merkleBatchId
merkleLeaf
merkleRoot
polygonChainId
anchorContract
anchorTransaction
anchorBlock
proofStatus
```

## 9. Merkle Design
Each version hash is a leaf. A batch produces one root.

```text
H1 H2 H3 H4
 \ /   \ /
 H12   H34
   \   /
    ROOT
      ↓
   Polygon
```

Retain inclusion proofs off-chain.

## 10. Anchor Contract
Logical operation:
`anchorRoot(bytes32 root, bytes32 batchId, uint64 leafCount, uint64 createdAt)`

Emit `MerkleRootAnchored`.

Prevent duplicate batch IDs.

## 11. Version State
```text
D001
 ├─ V1/H1/R1/TX1
 ├─ V2/H2/R2/TX2
 └─ V3/H3/R3/TX3
```

Never mutate historical hashes.

## 12. Latest Retrieval
Use stable `documentId` plus latest-version state/index. Retrieve the exact MinIO object version after authorization.

## 13. Verification
Verify:
1. exact object;
2. SHA-256;
3. Merkle inclusion;
4. Polygon root.

## 14. Performance Architecture
- multipart/resumable upload;
- parallel chunks;
- streaming SHA-256;
- asynchronous OCR;
- bounded queues;
- worker pools;
- backpressure;
- batch Merkle roots;
- multiple Polygon RPC providers;
- transaction reconciliation;
- indexer replay.

## 15. Smart Account / ERC-7947
ERC-7947 is a recovery interface for smart accounts. The architecture therefore requires a compatible smart-account implementation.

Recovery provider registration/removal must be authorized. Recovery proofs require validation and replay protection. Recovery must not alter historical document proof state.

## 16. Identity
EVM addresses are cryptographic principals. DID/VC may be added as an application interoperability layer. Sensitive PII remains off-chain.

## 17. RBAC
Smart-contract role enforcement:
- Admin;
- Manager;
- Auditor;
- User.

## 18. Digital Assets
Use ERC-721-compatible unique asset semantics where appropriate. Asset token state is separate from document payload.

## 19. Security
TLS, encryption at rest, least privilege, secure RPC, smart-contract access control, multisig governance for critical administration, secrets management, secure MinIO policies and contract security testing.

## 20. Reliability
Persist proof/batch state before blockchain submission. Retry through approved RPC providers. Reconcile pending transactions. Replay blockchain events to recover the indexer.

## 21. Deployment
```text
Edge/DMZ
 ├─ Web
 └─ API

Application Zone
 ├─ Ingestion
 ├─ OCR workers
 ├─ Proof/Merkle workers
 └─ Indexer

Secure Data Zone
 ├─ MinIO
 └─ KMS/secrets

Blockchain Connectivity
 └─ Polygon RPC
```

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

# FINAL TECHNICAL DESIGN CORRECTIONS

## Contract boundary

Recommended Solidity contract decomposition:

| Contract | Responsibility |
|---|---|
| `IdentityRegistry` | DID/identity registration, status, account binding, identity events |
| `RolePermissionRegistry` | roles, permissions, grants/revocations, policy events |
| `EnterpriseAssetNFT` | ERC-721-compatible minting, token identity, asset-DID binding |
| `AssetGovernance` | allocation/transfer policy and lifecycle rules |
| `DocumentAnchorRegistry` | Merkle root anchoring and batch metadata |
| `RecoveryAwareSmartAccount` | smart-account control and ERC-7947-compatible recovery |
| `Audit/Event layer` | emitted events across the above contracts |

Do not force all logic into one monolithic contract.

## DID model

Use a stable DID string/identifier at the application boundary. On-chain storage should use a privacy-preserving identifier/reference (for example, a digest or compact ID) rather than unnecessary PII.

Conceptual relationship:

`DID ↔ IdentityRegistry record ↔ Smart Account ↔ Roles ↔ NFT assets`

## Asset model

Each NFT record MUST expose or resolve:

- `tokenId`
- `assetClass`
- `assetStatus`
- `identitySubjectId / DID reference`
- `createdAt`
- `allocation state`
- `transfer history through events`
- optional non-sensitive metadata reference

Never store confidential payloads in token metadata on a public chain.

## Document proof model

For each version:

`documentId + versionId + SHA256 + objectVersion + MerkleBatchId + leafIndex + proof + chainAnchor`

The proof record is not itself the confidential document.

## Chain transaction policy

Do not create one Polygon transaction per uploaded document. Batch hashes with Merkle trees and anchor roots.

## Indexer rule

The indexer can accelerate queries but cannot authorize operations or become the system of record for blockchain state.

## Production key management

- Admin/deployer keys: HSM/MPC or enterprise custody where available.
- Backend services never receive raw user private keys.
- Contract administration must be multisig/governed.
- Recovery-provider registration/removal is privileged governance.
