# SecureChain — Master Enterprise Workflow

## 1. System Principle
The platform is designed around:

**Fast durable ingestion → asynchronous processing → efficient Merkle batching → Polygon anchoring → immutable versions → fast latest retrieval → cryptographic verification**

## 2. Complete Workflow
```text
USER
 ↓
AUTHENTICATION
 ↓
AUTHORIZATION
 ↓
RESUMABLE/MULTIPART UPLOAD
 ↓
MINIO DURABLE STORAGE
 +
STREAMING SHA-256
 ↓
DOCUMENT/VERSION RECORD
 ↓
UPLOAD RECEIPT
 ↓
ASYNC OCR
 ↓
PROOF RECORD
 ↓
MERKLE LEAF
 ↓
MERKLE BATCH
 ↓
MERKLE ROOT
 ↓
POLYGON ANCHOR
 ↓
TRANSACTION RECONCILIATION
 ↓
VERIFIABLE
```

## 3. First Upload
`D001/V1`

Store exact original bytes. Compute H1. Generate OCR copy. Create proof. Batch H1 into a Merkle tree. Anchor root on Polygon.

## 4. Version 2
`D001/V2`

A revised file produces H2. H1 is immutable. V2 gets its own proof and anchor.

## 5. Latest Version
```text
D001 → latestVersion → V2 → MinIO V2
```

Normal retrieval uses the latest-version state/index rather than scanning blockchain history.

## 6. Verification
```text
MinIO exact object
 ↓
SHA-256
 ↓
stored hash comparison
 ↓
Merkle proof
 ↓
root reconstruction
 ↓
Polygon anchor
 ↓
VALID
```

## 7. Why Merkle?
Without batching, every document requires an anchor transaction.

With batching:
`many SHA-256 leaves → one Merkle root → one Polygon anchor`

This reduces blockchain transaction volume while preserving individual inclusion proofs.

## 8. Performance Ordering
### Critical path
Authenticate → authorize → upload → durable MinIO → SHA-256 → acknowledgement.

### Async path
OCR → proof → Merkle → Polygon → indexing.

This prevents blockchain/OCR latency from blocking ingestion.

## 9. Upload Optimization
- multipart/resumable;
- parallel chunks;
- streaming SHA-256;
- bounded concurrency;
- backpressure;
- durable queues;
- idempotency;
- direct MinIO paths;
- asynchronous OCR;
- Merkle batching;
- RPC failover.

## 10. Processing State
`UPLOADING → DURABLY_STORED → HASHED → OCR_PROCESSING → PROOF_READY → MERKLE_BATCHED → ANCHOR_PENDING → ANCHORED → VERIFIABLE`

## 11. Failure Handling
Storage failure blocks durable acknowledgement. OCR failure does not destroy the original. Merkle failure preserves the proof record. Polygon failure leaves the batch pending for retry. Indexer failure is recoverable from chain events.

## 12. Account Recovery
```text
Normal smart account
 ↓
Recovery provider configured
 ↓
credential lost
 ↓
valid recovery proof
 ↓
ERC-7947-compatible recovery
 ↓
access subject restored
 ↓
AccessRecovered/audit event
```

Recovery never changes:
- historical document hashes;
- document versions;
- Merkle roots;
- Polygon anchors.

## 13. Data Separation
### MinIO
Originals, OCR, sensitive metadata.

### Polygon
Merkle roots and minimal non-sensitive proof/state metadata.

### Indexer
Fast query projections.

## 14. Enterprise Design Rule
Do not promise zero latency. The engineering objective is:

**non-blocking ingestion + bounded downstream latency + measurable throughput + durable state + idempotent recovery + independent verification.**

# FINAL ARCHITECTURE DECISIONS — SecureChain / BEL

> This section is normative. It resolves ambiguities found during the final requirement-to-design review.

## A. Strict SecureChain requirement interpretation

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

The following are deliberate enterprise extensions, not substitutions for Core requirements:

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

| SecureChain requirement | Final implementation | Status |
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

**The merged solution is requirement-complete for SecureChain after the decisions above.**

The additions do not replace any explicit Core requirement. They harden the solution for BEL's enterprise/defence context.

# FINAL MASTER WORKFLOW — SecureChain REQUIREMENT PATH

## 1. Identity + Access + Asset core workflow

```text
Admin
  ↓
Create DID identity
  ↓
Bind / verify smart account cryptographically
  ↓
Assign role
  ↓
Smart-contract authorization
  ↓
Mint unique enterprise NFT
  ↓
Admin allocates NFT → identity/DID
  ↓
User performs permitted operation
  ↓
Unauthorized operation → REVERT
  ↓
Authorized transfer/change
  ↓
Immutable blockchain events
  ↓
Auditor independently verifies history
```

## 2. Confidential document workflow

```text
Authorized user
  ↓
Resumable upload
  ↓
Encrypted MinIO object
  +
Streaming SHA-256
  ↓
Create documentId/versionId
  ↓
Immediate durable acknowledgement
  ↓
Async OCR
  ↓
Proof record
  ↓
Merkle leaf
  ↓
Batch
  ↓
Merkle root
  ↓
Polygon anchor
  ↓
Inclusion proof retained
  ↓
VERIFIABLE
```

## 3. Revision workflow

```text
D001/V1/H1
      ↓ revised document
D001/V2/H2
      ↓
LATEST → V2

H1, V1 and their proof remain immutable.
```

## 4. Recovery workflow

```text
Smart Account
  ↓
Approved recovery provider
  ↓
Credential loss
  ↓
Valid non-replayable proof
  ↓
ERC-7947-compatible recoverAccess
  ↓
New access subject
  ↓
AccessRecovered
  ↓
Existing assets, document versions and audit history remain unchanged
```

## 5. Failure principle

A downstream failure MUST NOT corrupt a durable accepted document or authoritative blockchain state.

- OCR failure → retry; original remains available.
- Merkle failure → proof record remains pending.
- RPC failure → retry/failover; anchor remains pending.
- Indexer failure → rebuild from chain.
- Storage failure before durability → do not acknowledge upload.
