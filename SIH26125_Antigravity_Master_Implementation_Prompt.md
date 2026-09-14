# ANTIGRAVITY MASTER IMPLEMENTATION PROMPT — SIH26125 / BEL

## ROLE

You are an elite principal software architect, blockchain engineer, backend engineer, frontend engineer, DevSecOps engineer, QA engineer, and product implementation lead.

You are implementing a **fully working enterprise-grade prototype** for:

**SIH26125 — Blockchain-Based Secure Platform for Identity, Access Control, and Digital Asset Management**

**Organization:** Bharat Electronics Limited (BEL)  
**Department:** Bharat Electronics Limited  
**Theme:** Blockchain & Cybersecurity  
**Prototype blockchain:** Polygon / EVM-compatible environment  
**Confidential data plane:** MinIO  
**Blockchain:** Solidity smart contracts  
**Asset semantics:** ERC-721-compatible enterprise NFT semantics  
**Document integrity:** SHA-256  
**Efficient anchoring:** Merkle trees + Polygon anchor contract  
**Account recovery:** ERC-7947-compatible smart-account recovery/provider model  
**Architecture target:** enterprise/defence-grade prototype, not a toy Web3 application.

The user has already created/compiled and started deploying the Solidity smart contracts in Remix. **Do not assume contracts must be redeployed. First inspect the existing repository, Solidity contracts, ABI/build artifacts, deployment information, and environment configuration. Reuse already deployed contracts whenever their ABI and behavior satisfy the requirements. Do not replace working deployed contracts merely for stylistic reasons.**

---

# 1. SOURCE OF TRUTH

The repository contains the following specification documents. READ ALL OF THEM BEFORE IMPLEMENTING:

- `PRD.md`
- `WPRD.md`
- `TRD.md`
- `BRD.md`
- `SRS.md`
- `test.md`
- `workflow.md`
- `SRC.md`
- `REQUIREMENT_REVIEW.md`
- `SIH26125_TRD_FULL_REFERENCE_ARCHITECTURE.md`

Treat these documents as the product/architecture specification.

## Priority if documents appear duplicated

The documents contain deliberately repeated normative architecture decisions. Preserve them.

If two statements conflict:

1. `REQUIREMENT_REVIEW.md`
2. normative/final architecture decisions in `TRD.md`
3. `SRS.md`
4. `BRD.md`
5. `PRD.md`
6. `WPRD.md`
7. `workflow.md`
8. `SRC.md`
9. `test.md`

Do not silently remove a requirement. Resolve conflicts explicitly and document the decision.

---

# 2. CORE SIH REQUIREMENTS — THESE ARE MANDATORY

The prototype is considered incomplete if any of these are missing.

## 2.1 Decentralized Identity

Implement a real, demonstrable identity model.

Every registered organizational identity must have:

- stable DID;
- cryptographic controller/account association;
- identity status;
- auditable registration/status changes;
- supported EVM smart-account association;
- no unnecessary sensitive PII on-chain.

The backend must NEVER trust a frontend-supplied user ID as proof of identity.

Conceptual model:

```text
DID
 ↓
Identity Registry
 ↓
Smart Account / Cryptographic Controller
 ↓
Role / Permission State
 ↓
Enterprise Assets
```

DID/VC interoperability may be implemented at the application boundary, but DID cannot merely be a label displayed in the UI.

Sensitive identity attributes stay off-chain.

---

# 3. CRYPTOGRAPHIC IDENTITY PROOF

Users must prove control of their cryptographic account through wallet/smart-account signing.

Do not store user private keys in:

- frontend local application databases;
- backend databases;
- source code;
- environment variables;
- logs.

The backend may verify signatures but must never receive raw user private keys.

Frontend authorization is UX only.

The protected operation must ultimately be controlled by application policy and/or smart-contract authorization.

---

# 4. RBAC — MANDATORY

Implement these baseline roles:

```text
ADMIN
MANAGER
AUDITOR
USER
```

Minimum intended semantics:

| Capability | ADMIN | MANAGER | AUDITOR | USER |
|---|---:|---:|---:|---:|
| Identity administration | ✓ | ✗ | ✗ | ✗ |
| Role/permission administration | ✓ | Limited | Read | ✗ |
| NFT minting | ✓ | ✗ | ✗ | ✗ |
| Initial asset allocation | ✓ | ✗ | ✗ | ✗ |
| Operational transfer | Policy-controlled | ✓/Policy | ✗ | Policy |
| Verification | ✓ | ✓ | ✓ | Policy |
| Audit viewing | ✓ | ✓ | ✓ | Policy |

The exact permission matrix must be derived from the existing Solidity contracts and specifications rather than invented independently.

Critical invariant:

> **Only authorized Admin principals can mint NFTs and perform initial allocation.**

Unauthorized operations must fail closed/revert.

Do not implement security only with frontend route guards.

---

# 5. ENTERPRISE NFT DIGITAL ASSET MODEL

The NFT is NOT a marketplace collectible.

It represents an enterprise asset/control record.

Implement unique ERC-721-compatible semantics.

Each asset should resolve to:

```text
tokenId
assetClass
assetStatus
identitySubjectId / DID reference
allocation state
creation metadata
lifecycle timestamps
non-sensitive metadata reference
```

The NFT must be linked to the responsible identity/DID.

Required lifecycle:

```text
Admin authorization
      ↓
NFT mint
      ↓
Admin-controlled initial allocation
      ↓
ACTIVE
      ↓
Authorized transfer
      ↓
New identity
      ↓
Retire/Revoke
```

Required auditable events:

- mint;
- allocation;
- transfer;
- status change where implemented.

Never store confidential document bytes in NFT metadata or calldata.

---

# 6. CONFIDENTIAL DOCUMENT SECURITY — MANDATORY ENTERPRISE EXTENSION

This is a BEL enterprise/defence-oriented prototype.

## NEVER put confidential document bytes on Polygon.

Use:

```text
MINIO
 ├── Original documents
 ├── OCR output
 └── immutable object versions
```

Polygon stores only minimal, non-sensitive trust/proof state.

The application must support:

- authenticated uploads;
- authorization;
- resumable/multipart upload;
- durable storage;
- streaming SHA-256;
- stable document ID;
- immutable version ID;
- asynchronous OCR;
- proof generation;
- Merkle batching;
- Polygon root anchoring;
- verification;
- latest-version retrieval.

---

# 7. DOCUMENT VERSIONING

Logical document identity remains stable:

```text
Document D001
 ├── V1 → H1 → Merkle Root R1 → Polygon TX1
 ├── V2 → H2 → Merkle Root R2 → Polygon TX2
 └── V3 → H3 → Merkle Root R3 → Polygon TX3

LATEST → V3
```

Rules:

- first accepted upload = V1;
- every revision = new version;
- every version = new SHA-256;
- historical versions are immutable;
- V1 must remain independently verifiable after V2/V3;
- latest pointer changes without modifying historical versions.

Never overwrite V1 to create V2.

---

# 8. DOCUMENT PROOF PIPELINE

For every accepted document version:

```text
Exact original bytes
      ↓
SHA-256
      ↓
Proof record
      ↓
Merkle leaf
      ↓
Merkle batch
      ↓
Merkle root
      ↓
Polygon anchor
      ↓
Inclusion proof retained
      ↓
VERIFIABLE
```

A proof record must be able to associate at least:

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
leafIndex
merkleRoot
polygonChainId
anchorContract
anchorTransaction
anchorBlock
proofStatus
```

Use database storage for proof metadata and inclusion proofs.

Do not store sensitive payloads on-chain.

---

# 9. MERKLE BATCHING

Do NOT submit one Polygon transaction for every document.

Use:

```text
H1 H2 H3 H4
 \ /   \ /
 H12   H34
   \   /
    ROOT
      ↓
   Polygon
```

The root is anchored through the document anchor contract.

Logical contract operation:

```solidity
anchorRoot(
    bytes32 root,
    bytes32 batchId,
    uint64 leafCount,
    uint64 createdAt
)
```

Expected event:

```text
MerkleRootAnchored
```

Prevent duplicate batch IDs.

Batch flushing must support at least:

- maximum leaf count;
- maximum waiting time;
- optional urgent/high-assurance flush.

Do not hard-code an arbitrary "perfect" batch size without benchmarking. Make it configurable.

---

# 10. UPLOAD PERFORMANCE — VERY IMPORTANT

Do not promise zero latency.

The engineering goal is:

> **non-blocking ingestion + bounded downstream latency + measurable throughput + durable state + idempotent processing + independent verification**

## Synchronous critical path

```text
Authenticate
 ↓
Authorize
 ↓
Create upload session / idempotency key
 ↓
Resumable/multipart upload
 ↓
Durable MinIO write
 ↓
Streaming SHA-256
 ↓
Create document/version record
 ↓
UPLOAD_ACKNOWLEDGED
```

The upload acknowledgement MUST NOT wait for:

- OCR;
- Merkle batching;
- Polygon RPC;
- Polygon transaction confirmation.

## Asynchronous path

```text
UPLOAD_ACKNOWLEDGED
       ↓
Durable Queue
       ├── OCR Worker
       ├── Proof Worker
       └── Merkle Batcher
                    ↓
             Polygon Anchor Worker
                    ↓
              Confirmation
                    ↓
                VERIFIABLE
```

Use:

- durable queues;
- bounded worker pools;
- retries with backoff;
- dead-letter queues;
- idempotency;
- backpressure;
- transaction reconciliation;
- multiple approved RPC providers;
- indexer replay.

---

# 11. DOCUMENT STATE MACHINE

Implement and expose meaningful states:

```text
UPLOADING
    ↓
DURABLY_STORED
    ↓
HASHED
    ↓
OCR_PROCESSING
    ↓
PROOF_READY
    ↓
MERKLE_BATCHED
    ↓
ANCHOR_PENDING
    ↓
ANCHORED
    ↓
VERIFIABLE
```

Failures must not corrupt previous durable state.

Examples:

- OCR failure → original remains available; retry OCR.
- Merkle failure → proof record remains pending.
- Polygon RPC failure → batch remains pending; retry/failover.
- indexer failure → rebuild from Polygon.
- storage failure before durable persistence → do NOT acknowledge upload.

---

# 12. LATEST VERSION RETRIEVAL

Implement:

```text
GET /documents/{documentId}/latest
```

Expected logic:

```text
documentId
   ↓
latestVersionId
   ↓
authorize
   ↓
exact MinIO object version
   ↓
secure stream / short-lived access
```

Do NOT scan Polygon blocks to find the latest version.

The latest pointer is an operational optimization.

Historical evidence remains immutable.

---

# 13. VERIFICATION

Implement:

```text
Exact MinIO object
       ↓
SHA-256(object)
       ↓
compare stored version hash
       ↓
Merkle inclusion proof
       ↓
reconstruct Merkle root
       ↓
compare against Polygon anchor
       ↓
VALID / INVALID
```

A UI must never show "Verified" merely because an indexer says so.

Verification must derive from actual cryptographic evidence.

Verification should clearly report:

- object retrieved;
- SHA-256 match;
- Merkle inclusion match;
- Polygon anchor match;
- final result.

---

# 14. ACCOUNT RECOVERY

Use an actual supported smart-account architecture.

ERC-7947 is a **draft recovery interface**, not a magical recovery feature for ordinary EOAs.

Use:

```text
User
 ↓
Smart Account
 ↓
ERC-7947-compatible Recovery Interface
 ↓
Approved Recovery Provider
```

Implement/provider-adapt:

- provider registration;
- provider removal;
- proof validation;
- replay protection;
- recovery target validation;
- recovery execution;
- `AccessRecovered` event;
- privileged provider governance.

Recovery changes account access/control.

Recovery MUST NOT change:

- historical transactions;
- document versions;
- SHA-256 hashes;
- Merkle roots;
- Polygon anchors;
- previous audit events.

If the existing contracts only demonstrate the interface and not production-grade recovery, label the prototype behavior accurately instead of falsely claiming universal ERC-7947 support.

---

# 15. CONTRACT ARCHITECTURE

Prefer separate contracts:

```text
IdentityRegistry
RolePermissionRegistry
EnterpriseAssetNFT
AssetGovernance
DocumentAnchorRegistry
RecoveryAwareSmartAccount
```

Responsibilities:

| Contract | Responsibility |
|---|---|
| IdentityRegistry | DID/identity registration, controller/account binding, status |
| RolePermissionRegistry | roles, permissions, grants/revocations |
| EnterpriseAssetNFT | unique ERC-721-compatible asset/token state |
| AssetGovernance | allocation and transfer policy |
| DocumentAnchorRegistry | Merkle root/batch anchoring |
| RecoveryAwareSmartAccount | smart-account control/recovery |

Do not create a monolithic contract merely to reduce file count.

---

# 16. EXISTING DEPLOYED CONTRACTS — CRITICAL

The user has already created/deployed or is deploying contracts through Remix.

Before writing replacement contracts:

1. inspect the current Solidity source;
2. inspect constructor parameters;
3. inspect inherited contracts;
4. inspect ABI/build artifacts;
5. inspect deployment addresses;
6. inspect chain/network;
7. inspect environment variables;
8. inspect frontend contract configuration;
9. inspect event names;
10. inspect access-control roles;
11. inspect contract-to-contract dependencies.

Create a clear contract registry configuration, e.g.:

```text
IDENTITY_REGISTRY_ADDRESS
ROLE_PERMISSION_REGISTRY_ADDRESS
ENTERPRISE_ASSET_NFT_ADDRESS
ASSET_GOVERNANCE_ADDRESS
DOCUMENT_ANCHOR_REGISTRY_ADDRESS
RECOVERY_ACCOUNT_ADDRESS
```

Do not invent addresses.

Do not silently deploy new copies.

If an address is absent, tell the user exactly which contract must be deployed/configured and why.

---

# 17. REMIX / GAS ISSUE CONTEXT

A previous `EnterpriseAssetNFT` deployment attempt produced:

```text
out of gas
The transaction ran out of gas.
```

The constructor had:

```text
_name
_symbol
_iam
```

and the gas limit was approximately 3,000,008.

The user was advised to test a larger deployment gas limit, but the implementation must NOT blindly increase gas forever.

When working with deployment:

- distinguish gas limit from actual gas used;
- inspect constructor complexity;
- identify loops/storage-heavy initialization;
- inspect `_iam` dependency;
- do not use a huge gas limit to hide inefficient code;
- record actual gas used after successful deployment.

If the current deployed contract is already valid, integrate it rather than redeploying it.

---

# 18. DATA AUTHORITY — ABSOLUTE

Use these authorities:

| Data | Authority |
|---|---|
| Blockchain identity state | Smart contract |
| Role/permission state | Smart contract |
| NFT existence/ownership/allocation | Smart contract |
| Blockchain audit events | Polygon/EVM |
| Original document bytes | MinIO |
| OCR | MinIO |
| Object version | MinIO |
| SHA-256 proof record | Proof service/database + cryptographic anchor |
| Merkle root | DocumentAnchorRegistry |
| Inclusion proof | Proof service/database |
| Latest-version pointer | Authoritative application/domain state |
| Search/index cache | Derived only |

If indexer/cache/UI conflicts with Polygon-controlled state:

> Polygon wins.

If a cached document conflicts with the exact durable object:

> exact MinIO object version wins.

---

# 19. INDEXER

Implement a replayable indexer:

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
Query DB / Search Index
 ↓
Read API
```

The indexer must:

- handle restart;
- persist checkpoints;
- avoid duplicate processing;
- support replay;
- rebuild derived state from Polygon;
- never become the authorization authority.

---

# 20. REFERENCE SYSTEM ARCHITECTURE

Build the implementation around these logical planes:

```text
┌────────────────────────────────────────────────────────────────────┐
│ PRESENTATION                                                       │
│ Admin Portal │ Manager Portal │ Auditor Portal │ User Portal      │
│ Independent Verification Tool                                     │
└───────────────────────────────┬────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ APPLICATION / POLICY                                               │
│ API Gateway / BFF                                                  │
│ Authentication │ Signature Verification │ PEP │ Validation        │
│ Identity Service │ RBAC Service │ Asset Service │ Document Service │
│ Blockchain Gateway / Transaction Service                           │
└──────────────┬───────────────────────┬─────────────────────────────┘
               │                       │
               ▼                       ▼
┌───────────────────────────┐   ┌────────────────────────────────────┐
│ CONFIDENTIAL DATA PLANE   │   │ ASYNC PROCESSING                   │
│ MinIO                     │   │ Durable Queue                      │
│ Original                  │   │ OCR Workers                       │
│ OCR                       │   │ Proof Workers                     │
│ Object Versions           │   │ Merkle Batcher                    │
│ Proof DB                  │   │ Polygon Anchor Workers            │
└───────────────────────────┘   └────────────────────────────────────┘
               │                       │
               └──────────────┬────────┘
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ TRUST / BLOCKCHAIN PLANE                                           │
│ Polygon / EVM                                                      │
│ IdentityRegistry │ RolePermissionRegistry │ EnterpriseAssetNFT    │
│ AssetGovernance │ DocumentAnchorRegistry │ Smart Account          │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│ READ / VERIFICATION                                                │
│ Indexer → Query DB/Search → Read API                               │
│ Independent Verifier: MinIO → SHA-256 → Merkle → Polygon           │
└────────────────────────────────────────────────────────────────────┘

SECURITY / OPERATIONS:
KMS/HSM/MPC │ Secrets Manager │ TLS/mTLS │ WAF │ SIEM
Logs │ Metrics │ Tracing │ Backup │ Disaster Recovery
```

Maintain clear trust boundaries.

---

# 21. FRONTEND REQUIREMENTS

Build a polished enterprise dashboard, not a generic crypto/NFT UI.

Recommended sections:

## Dashboard

Show:

- identity status;
- connected smart account;
- current role;
- asset count;
- document count;
- verification status;
- proof pipeline status;
- pending anchors;
- recent audit events.

## Identity

Show:

- DID;
- cryptographic controller;
- smart-account address;
- role;
- status;
- registration event;
- verification status.

## Asset Management

Show:

- token ID;
- asset class;
- current responsible identity;
- status;
- allocation;
- lifecycle events;
- ownership history.

Actions must appear according to role.

## Documents

Show:

- document ID;
- latest version;
- version count;
- file name;
- upload time;
- uploader;
- current status;
- SHA-256;
- proof status;
- anchor status.

Actions:

- upload;
- upload revision;
- retrieve latest;
- view version history;
- verify;
- download only if authorized.

## Verification

Provide a dedicated evidence-oriented page.

Show a clear verification chain:

```text
Object Retrieved          ✓
SHA-256 Match             ✓
Merkle Inclusion          ✓
Polygon Root Match        ✓
-----------------------------
DOCUMENT INTEGRITY: VALID
```

If any step fails:

```text
DOCUMENT INTEGRITY: INVALID
```

Explain exactly which check failed.

## Audit

Show:

- actor;
- DID/account;
- role;
- action;
- target;
- timestamp;
- block;
- transaction hash;
- contract;
- result.

## Recovery

Show:

- smart account;
- registered recovery providers;
- recovery status;
- recovery event history;
- recovery action where authorized.

Do not expose recovery secrets.

---

# 22. API REQUIREMENTS

Implement documented APIs aligned with the SRS.

At minimum:

```text
POST /documents
GET /documents/{documentId}/latest
GET /documents/{documentId}/versions/{versionId}
POST /documents/{documentId}/versions/{versionId}/verify
```

Also implement practical APIs for:

```text
identity registration / lookup
role lookup / administration
asset mint
asset allocation
asset transfer
audit history
Merkle/proof status
recovery status
```

Use:

- validation;
- authentication;
- authorization;
- consistent error format;
- request IDs;
- idempotency keys where required;
- safe logging.

---

# 23. ERROR MODEL

Use structured errors.

Examples:

```text
AUTH-001
AUTH-002
DOC-001
DOC-002
DOC-003
MERKLE-001
CHAIN-001
CHAIN-002
REC-001
REC-002
REC-003
REC-004
AUDIT-001
```

Do not leak secrets or sensitive document content through errors/logs.

---

# 24. SECURITY

Implement:

- TLS;
- secure cookies/session strategy where applicable;
- wallet signature verification;
- RBAC;
- least privilege;
- secure MinIO policies;
- encryption at rest;
- short-lived signed object URLs;
- upload size/type validation;
- malware scanning integration point;
- path traversal protection;
- rate limiting;
- CORS/CSRF protection where applicable;
- secrets management;
- dependency scanning;
- container scanning;
- smart-contract access control;
- reentrancy protection where applicable;
- checks-effects-interactions;
- replay protection;
- secure external calls;
- multisig/governed critical administration;
- audit logging;
- backup/DR.

Never log:

- private keys;
- recovery secrets;
- confidential document contents;
- raw sensitive PII;
- secret tokens.

---

# 25. SECURITY / COMPLIANCE CLAIMS

Do NOT falsely claim:

- BEL certification;
- classified-system accreditation;
- regulatory compliance;
- production approval;
- formal security audit.

Instead say:

> "The prototype implements the specified security controls and is designed for adaptation to BEL-approved production security, network, key-management, data-residency and governance requirements."

---

# 26. TECHNOLOGY RULES

Use the existing repository stack where reasonable.

Preferred architecture:

```text
Frontend:
React / Next.js or existing project framework

Backend:
Node.js / TypeScript or existing project backend

Blockchain:
EVM + ethers.js/viem according to existing repository

Contracts:
Solidity + OpenZeppelin where appropriate

Storage:
MinIO

Database:
PostgreSQL or existing project database

Queue:
Redis/BullMQ, RabbitMQ, or existing durable queue

OCR:
Asynchronous worker with a replaceable OCR adapter

Blockchain:
Polygon Amoy for prototype if that is the configured target
```

Do not introduce unnecessary technologies.

If the repository already has a framework, preserve it.

---

# 27. DO NOT FAKE FUNCTIONALITY

A button must not merely show:

```text
Success
```

unless the underlying operation actually succeeded.

Do not mock:

- wallet connection;
- contract calls;
- NFT mint;
- allocation;
- transfer;
- document upload;
- SHA-256;
- Merkle proof;
- Polygon anchor;
- verification;
- recovery.

Mocks are acceptable only for explicitly unavailable external infrastructure, and the UI must clearly distinguish simulation/demo mode from real mode.

---

# 28. IMPLEMENTATION STRATEGY

Do NOT immediately start generating random files.

First perform:

## PHASE 0 — REPOSITORY AUDIT

Inspect:

- directory tree;
- package files;
- existing frontend;
- backend;
- Solidity;
- ABI;
- deployment artifacts;
- environment files;
- database schema;
- queue configuration;
- storage configuration;
- existing tests.

Create:

```text
IMPLEMENTATION_AUDIT.md
```

containing:

- current architecture;
- what already works;
- deployed contract addresses;
- contract dependencies;
- missing requirements;
- broken requirements;
- integration points;
- risks;
- recommended implementation order.

Do not expose secrets in this audit.

---

# 29. PHASE 1 — REQUIREMENT TRACEABILITY

Create:

```text
REQUIREMENT_TRACEABILITY.md
```

Map every mandatory SIH requirement to:

```text
Requirement
→ Contract
→ Backend/API
→ Frontend
→ Test
→ Evidence/demo step
```

No mandatory requirement may be left without implementation/test evidence.

---

# 30. PHASE 2 — CONTRACT INTEGRATION

Before modifying contracts:

- compare current implementation against the specifications;
- identify gaps;
- preserve valid deployed contracts;
- only change/redeploy when necessary;
- maintain migration/deployment scripts;
- generate ABI artifacts;
- create deployment registry;
- verify network/chain ID.

If contract behavior is incompatible with the architecture, explain why and fix it safely.

---

# 31. PHASE 3 — BACKEND

Implement:

```text
Authentication
Authorization
Identity
RBAC
Asset
Document
Version
Hash
OCR
Proof
Merkle
Polygon Anchor
Indexer
Verification
Recovery
Audit
```

Use clear service boundaries.

Persist durable state before asynchronous processing.

---

# 32. PHASE 4 — FRONTEND

Build the enterprise UI.

The demo should be understandable to a BEL/SIH judge within minutes.

Avoid:

- neon crypto aesthetics;
- trading charts;
- fake marketplace pages;
- unnecessary token price displays;
- cryptocurrency balances;
- DeFi concepts.

The product is an enterprise security/trust platform.

---

# 33. PHASE 5 — TESTING

Implement tests from `test.md`.

Minimum categories:

```text
Unit
Integration
Contract
Identity
RBAC
NFT
Document
Version
SHA-256
Merkle
Polygon
Indexer
Recovery
Security
Performance
Failure Injection
End-to-End
```

Mandatory tests include:

- Admin can mint;
- User cannot mint;
- Admin can allocate;
- unauthorized allocation fails;
- authorized transfer works;
- unauthorized transfer fails;
- DID is created/bound;
- duplicate DID is rejected;
- document V1 created;
- document V2 created;
- V1 remains unchanged;
- latest returns V2;
- modified bytes produce HASH_MISMATCH;
- wrong Merkle proof produces INVALID;
- wrong root produces INVALID;
- Polygon anchor is verifiable;
- OCR failure does not destroy original;
- RPC outage does not destroy proof state;
- indexer rebuild works;
- replayed recovery proof fails;
- valid recovery restores access;
- recovery does not modify historical evidence.

---

# 34. GOLDEN END-TO-END DEMO

The finished prototype MUST support this demonstrable flow:

```text
Admin connects wallet/smart account
        ↓
Create DID identity
        ↓
Cryptographic identity verification
        ↓
Assign USER role
        ↓
User signs/authenticates
        ↓
Admin mints enterprise NFT
        ↓
Admin allocates NFT → user identity
        ↓
User sees assigned asset
        ↓
Unauthorized user attempts restricted operation
        ↓
REVERT / DENIED
        ↓
Authorized operation succeeds
        ↓
Audit event appears
        ↓
Authorized user uploads confidential document V1
        ↓
MinIO durable storage
        ↓
SHA-256 H1
        ↓
Immediate upload acknowledgement
        ↓
Async OCR
        ↓
Merkle batching
        ↓
Polygon root anchor
        ↓
Verification = VALID
        ↓
User uploads revised document V2
        ↓
SHA-256 H2
        ↓
V1 remains immutable
        ↓
Latest = V2
        ↓
Verify V1 = VALID
        ↓
Verify V2 = VALID
        ↓
Tamper with retrieved bytes
        ↓
Verification = INVALID
        ↓
Recovery provider configured
        ↓
Simulated credential/key loss
        ↓
Valid recovery proof
        ↓
Access restored
        ↓
Historical assets/documents/audit evidence unchanged
```

This is the primary acceptance journey.

---

# 35. OBSERVABILITY

Implement useful operational visibility.

Metrics:

```text
upload_bytes_total
upload_ack_latency
sha256_duration
ocr_duration
proof_duration
merkle_batch_size
merkle_wait_time
anchor_submission_count
anchor_confirmation_latency
rpc_error_count
queue_depth
dlq_count
indexer_lag
verification_latency
recovery_attempts
```

Logs should include correlation/request IDs.

Do not log confidential content.

---

# 36. RELIABILITY

Implement:

- idempotency;
- retries;
- backoff;
- dead-letter queues;
- transaction reconciliation;
- multiple RPC providers;
- persistent job state;
- restart recovery;
- indexer replay;
- MinIO versioning;
- database backups;
- health checks.

The system must not lose a document because an asynchronous worker or RPC provider fails.

---

# 37. DEPLOYMENT

Create reproducible deployment/configuration.

Prototype topology:

```text
Client
 ↓
WAF / Reverse Proxy
 ↓
Web / API
 ↓
Application Services
 ├── Identity
 ├── RBAC
 ├── Asset
 ├── Document
 ├── Proof
 └── Verification
 ↓
PostgreSQL
Queue
MinIO
OCR workers
Indexer
 ↓
Polygon RPC
 ↓
Polygon smart contracts
```

Production-oriented security plane:

```text
KMS/HSM/MPC
Secrets Manager
SIEM
Monitoring
Backup / DR
```

The prototype may use local/test infrastructure, but architecture must keep these boundaries clear.

---

# 38. DOCUMENTATION TO PRODUCE

Do not destroy the existing specification files.

Add implementation documentation as necessary:

```text
IMPLEMENTATION_AUDIT.md
REQUIREMENT_TRACEABILITY.md
DEPLOYMENT.md
CONTRACT_REGISTRY.md
DEMO_RUNBOOK.md
API.md
SECURITY.md
TROUBLESHOOTING.md
```

If these already exist, update them instead of duplicating them.

---

# 39. DEMO MODE VS REAL MODE

The prototype may provide a controlled demo mode for unavailable infrastructure, but:

```text
REAL
```

and

```text
SIMULATED
```

must be visually and technically distinguishable.

For SIH judging, prioritize real execution for:

- wallet signing;
- contract state;
- NFT mint;
- asset allocation;
- Polygon transaction;
- SHA-256;
- Merkle proof;
- verification.

---

# 40. FINAL VALIDATION LOOP — DO THIS REPEATEDLY

You are explicitly instructed to use an iterative engineering loop.

```text
READ SPEC
   ↓
AUDIT REPOSITORY
   ↓
MAP REQUIREMENTS
   ↓
IMPLEMENT
   ↓
RUN TESTS
   ↓
RUN BUILD/LINT/TYPECHECK
   ↓
RUN END-TO-END
   ↓
INSPECT FAILURES
   ↓
FIX ROOT CAUSE
   ↓
RUN AGAIN
   ↓
SECURITY REVIEW
   ↓
PERFORMANCE REVIEW
   ↓
UX REVIEW
   ↓
REQUIREMENT TRACEABILITY REVIEW
   ↓
REPEAT UNTIL ACCEPTANCE CRITERIA PASS
```

Do not stop after the first successful build.

A successful build is NOT proof that the product works.

---

# 41. SELF-REVIEW CHECKLIST

Before declaring completion, answer YES/NO for every item:

## SIH core

- [ ] Blockchain framework implemented
- [ ] DID implemented
- [ ] Cryptographic identity proof implemented
- [ ] NFT asset implemented
- [ ] NFT linked to DID/identity
- [ ] Admin-only minting
- [ ] Admin-controlled initial allocation
- [ ] Admin/Manager/Auditor/User RBAC
- [ ] Smart-contract authorization
- [ ] Identity lifecycle audit
- [ ] NFT creation audit
- [ ] Asset allocation audit
- [ ] Ownership transfer audit
- [ ] Permission update audit
- [ ] Immutable audit evidence

## Enterprise document security

- [ ] Confidential bytes only in MinIO
- [ ] Encryption at rest configured/documented
- [ ] Authorized document access
- [ ] Resumable upload
- [ ] Streaming SHA-256
- [ ] Stable document ID
- [ ] Immutable versions
- [ ] Async OCR
- [ ] Merkle batching
- [ ] Polygon root anchor
- [ ] Inclusion proof
- [ ] Latest version retrieval
- [ ] Independent verification
- [ ] Tamper detection

## Recovery

- [ ] Smart account
- [ ] ERC-7947-compatible interface/provider model
- [ ] Provider governance
- [ ] Proof validation
- [ ] Replay protection
- [ ] Recovery target validation
- [ ] AccessRecovered event
- [ ] Historical evidence unchanged

## Enterprise engineering

- [ ] Durable queues
- [ ] Retries
- [ ] DLQ
- [ ] Idempotency
- [ ] RPC failover
- [ ] Transaction reconciliation
- [ ] Indexer replay
- [ ] Secrets management
- [ ] Secure logging
- [ ] Security tests
- [ ] Performance tests
- [ ] Failure injection
- [ ] Reproducible deployment

---

# 42. ABSOLUTE NON-GOALS

Do not turn the project into:

- cryptocurrency;
- DeFi;
- NFT marketplace;
- token trading;
- raw document blockchain storage;
- generic Web3 social app;
- AI anomaly detection;
- facial recognition;
- IoT/RFID/geofencing;
- full ERP replacement;
- full enterprise IAM replacement;
- ordinary EOA falsely presented as ERC-7947-recoverable.

---

# 43. IMPORTANT ARCHITECTURAL INVARIANTS

These must never be violated:

1. No confidential document bytes on Polygon.
2. No frontend-only authorization.
3. No indexer as blockchain authority.
4. No historical document version mutation.
5. No ordinary EOA presented as inherently ERC-7947 recoverable.
6. No unauthorized NFT minting.
7. No unauthorized initial allocation.
8. No upload acknowledgement before durable storage.
9. No synchronous dependency on OCR/Polygon confirmation.
10. No single unavoidable Polygon RPC provider.
11. No private keys in backend databases.
12. No fake "Verified" state.
13. No silent contract redeployment replacing existing deployed contracts.
14. No fabricated contract addresses.
15. No fake transaction success.
16. No sensitive document content in logs.
17. No unsupported BEL certification/compliance claims.

---

# 44. FINAL DELIVERABLE STANDARD

Do not tell the user "the prototype is complete" until:

- the application builds;
- tests pass;
- contract integration is verified;
- the frontend talks to the actual backend;
- backend talks to MinIO/database/queue;
- blockchain calls work against the configured network;
- the golden E2E flow works;
- unauthorized operations fail;
- document verification works;
- versioning works;
- latest retrieval works;
- tampering is detected;
- recovery behavior is demonstrated accurately;
- requirement traceability has no unimplemented mandatory requirement;
- deployment instructions work from a clean environment.

If something cannot be made real because an external dependency is unavailable, isolate it behind an adapter, document it clearly, and provide the closest real implementation possible. Never hide it behind a fake success state.

---

# 45. FINAL OUTPUT FROM YOU

After implementation, provide:

1. concise implementation summary;
2. architecture actually implemented;
3. changed files;
4. contract addresses actually used;
5. network/chain ID;
6. environment variables required;
7. setup commands;
8. deployment commands;
9. test commands and results;
10. golden demo procedure;
11. known limitations;
12. explicit list of any requirement that remains incomplete.

If all requirements pass, provide a final:

```text
SIH26125 IMPLEMENTATION STATUS: ACCEPTANCE READY
```

Otherwise, provide:

```text
SIH26125 IMPLEMENTATION STATUS: NOT READY
```

with the exact blockers.

---

# FINAL PRINCIPLE

Build this as an **enterprise trust, identity, authorization, asset governance, and confidential document integrity platform for BEL**.

The NFT is an enterprise asset-control primitive.

Polygon is the trust/proof layer.

MinIO is the confidential data plane.

SHA-256 proves exact bytes.

Merkle trees make blockchain anchoring efficient.

The indexer is derived.

Smart contracts enforce critical blockchain state.

DID provides the identity layer.

RBAC governs access.

ERC-7947-compatible recovery governs smart-account recovery.

The user experience must make all of this understandable without exposing confidential information.

**Do not simplify away the difficult requirements. Implement them, test them, connect them, and iterate until the complete prototype actually works.**
