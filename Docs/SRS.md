# SecureChain — Software Requirements Specification (SRS)

## 1. Scope
The system shall provide identity, RBAC, digital assets, secure document ingestion, SHA-256 proof, OCR, Merkle batching, Polygon anchoring, immutable versioning, latest-version retrieval, verification, audit and ERC-7947-compatible smart-account recovery.

## 2. Functional Requirements
| ID | Requirement |
|---|---|
| SRS-DOC-001 | Accept authenticated document uploads |
| SRS-DOC-002 | Support resumable/multipart upload |
| SRS-DOC-003 | Calculate SHA-256 for every accepted version |
| SRS-DOC-004 | Preserve exact bytes used for hashing |
| SRS-DOC-005 | Store original in MinIO |
| SRS-DOC-006 | Generate OCR asynchronously |
| SRS-DOC-007 | Create stable document ID |
| SRS-DOC-008 | Create V1 on first upload |
| SRS-DOC-009 | Create new version for each revision |
| SRS-DOC-010 | Never overwrite historical hashes |
| SRS-PROOF-001 | Create proof record |
| SRS-PROOF-002 | Generate Merkle leaf |
| SRS-PROOF-003 | Batch leaves |
| SRS-PROOF-004 | Anchor Merkle root on Polygon |
| SRS-PROOF-005 | Preserve inclusion proof |
| SRS-PROOF-006 | Verify root against Polygon |
| SRS-VER-001 | Resolve latest version |
| SRS-VER-002 | Verify exact object hash |
| SRS-VER-003 | Detect tampering |
| SRS-AUD-001 | Emit/index critical events |
| SRS-SEC-001 | Enforce RBAC |
| SRS-REC-001 | Register recovery provider |
| SRS-REC-002 | Remove recovery provider |
| SRS-REC-003 | Verify recovery proof |
| SRS-REC-004 | Prevent proof replay |
| SRS-REC-005 | Restore intended access subject |
| SRS-PERF-001 | Upload acknowledgement shall not wait for Polygon confirmation |

## 3. State Machine
`UPLOADING → DURABLY_STORED → HASHED → OCR_PROCESSING → PROOF_READY → MERKLE_BATCHED → ANCHOR_PENDING → ANCHORED → VERIFIABLE`

## 4. Version Requirements
- Stable `documentId`.
- Unique monotonic `versionId`.
- Independent SHA-256 per version.
- Immutable historical versions.
- Explicit latest pointer/state.

## 5. Proof Requirements
Proof record shall include document/version identifiers, SHA-256, MinIO object/version references, Merkle data and Polygon anchor metadata.

## 6. API Requirements
`POST /documents`  
`GET /documents/{documentId}/latest`  
`GET /documents/{documentId}/versions/{versionId}`  
`POST /documents/{documentId}/versions/{versionId}/verify`

## 7. RBAC
| Role | Identity | Roles | Mint | Transfer | Verify |
|---|---:|---:|---:|---:|---:|
| Admin | Yes | Yes | Yes | Yes | Yes |
| Manager | No | No | Policy | Yes | Yes |
| Auditor | No | No | No | No | Yes |
| User | No | No | No | Policy | Policy |

## 8. Security Requirements
No sensitive document bytes on Polygon. Contract authorization is mandatory. Private keys never enter backend services. MinIO requires encryption and authorization. Recovery requires registered provider + valid proof + replay protection.

## 9. Non-Functional Requirements
### Availability
Downstream processing failures must not destroy durable documents.

### Performance
Use asynchronous processing and benchmark p50/p95/p99.

### Scalability
OCR and Merkle workers scale horizontally.

### Maintainability
Separate ingestion, proof, OCR, blockchain and verification services.

### Recoverability
Persist queue/proof state and support blockchain event replay.

## 10. Error Codes
`AUTH-001`, `AUTH-002`, `DOC-001`, `DOC-002`, `DOC-003`, `MERKLE-001`, `CHAIN-001`, `CHAIN-002`, `REC-001`, `REC-002`, `REC-003`, `REC-004`, `AUDIT-001`.

## 11. Acceptance Scenarios
- First upload → V1/H1.
- Revision → V2/H2, H1 unchanged.
- Latest → V2.
- Verification → SHA + Merkle + Polygon = VALID.
- Tamper → INVALID.
- Polygon delay → upload remains durably accepted.
- OCR delay → original remains available.
- Recovery → valid ERC-7947-compatible proof restores access.

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

# FINAL SRS CORRECTIONS AND TRACEABILITY

## Identity requirements

| ID | Requirement |
|---|---|
| SRS-ID-001 | Every registered user SHALL have a stable DID. |
| SRS-ID-002 | DID control SHALL be cryptographically associated with the user's supported smart account. |
| SRS-ID-003 | Identity registration SHALL be authorization controlled. |
| SRS-ID-004 | Identity creation/status changes SHALL emit auditable events. |
| SRS-ID-005 | Raw sensitive identity attributes SHALL NOT be written to Polygon. |

## Asset requirements

| ID | Requirement |
|---|---|
| SRS-ASSET-001 | Every enterprise asset SHALL have a unique NFT/token ID. |
| SRS-ASSET-002 | Only authorized Admin principals SHALL mint enterprise NFTs. |
| SRS-ASSET-003 | Initial NFT allocation SHALL be Admin-controlled. |
| SRS-ASSET-004 | NFT records SHALL resolve to the responsible identity/DID reference. |
| SRS-ASSET-005 | Unauthorized mint/allocation/transfer operations SHALL fail closed. |
| SRS-ASSET-006 | Mint, allocation and transfer SHALL emit immutable audit events. |

## RBAC requirements

| ID | Requirement |
|---|---|
| SRS-RBAC-001 | Roles SHALL include Admin, Manager, Auditor and User. |
| SRS-RBAC-002 | Admin SHALL manage roles and permissions. |
| SRS-RBAC-003 | Auditor SHALL NOT mutate operational state. |
| SRS-RBAC-004 | Effective authorization SHALL be enforced outside the UI and at the protected operation boundary. |
| SRS-RBAC-005 | Role/permission changes SHALL be auditable. |

## Document confidentiality requirements

| ID | Requirement |
|---|---|
| SRS-CONF-001 | Original document bytes SHALL remain in protected MinIO storage. |
| SRS-CONF-002 | Polygon SHALL contain no raw confidential document bytes. |
| SRS-CONF-003 | MinIO access SHALL be authenticated and authorized. |
| SRS-CONF-004 | Document encryption at rest and protected transport SHALL be enabled in enterprise deployment. |

## Requirement traceability rule

Every implementation ticket, smart-contract function, API, and release test MUST reference at least one SRS requirement ID.

## Critical clarification

`latest` is a retrieval optimization, not a replacement for historical evidence. The latest pointer changes; prior versions and their hashes never do.
