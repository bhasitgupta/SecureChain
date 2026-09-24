# SecureChain — Business Requirements Document (BRD)

## 1. Business Purpose
BEL requires a trusted mechanism to manage identity, access, digital assets and sensitive documents while maintaining verifiable historical evidence.

## 2. Business Problem
Centralized or fragmented systems can make it difficult to prove:
- who performed an action;
- who is authorized;
- which asset/version is authoritative;
- whether a document changed;
- what happened historically;
- and how access is restored after credential loss.

## 3. Strategic Objectives
1. Strong identity assurance.
2. Least-privilege access.
3. Traceable asset responsibility.
4. Tamper-evident document evidence.
5. Immutable version history.
6. Efficient enterprise ingestion.
7. Independent verification.
8. Controlled account recovery.

## 4. Business Capabilities
| Capability | Outcome |
|---|---|
| Identity | Verifiable actor |
| Access governance | Enforced authorization |
| Asset governance | Traceable ownership |
| Document proof | Integrity assurance |
| Versioning | Historical lineage |
| Merkle anchoring | Efficient immutable proof |
| Latest retrieval | Operational efficiency |
| Audit | Independent evidence |
| Recovery | Business continuity |

## 5. Business Rules
- Every version receives a SHA-256.
- First upload is V1.
- Revised upload is a new version.
- Historical versions are never overwritten.
- Original/OCR remain sensitive off-chain.
- Merkle roots are anchored on Polygon.
- Latest version is explicitly identifiable.
- Confidential bytes never go on-chain.
- Unauthorized operations fail.
- Recovery requires an authorized provider and valid proof.

## 6. Business Processes
### Identity lifecycle
Register → assign role → operate → revoke/update.

### Document lifecycle
Upload → hash → store → OCR → proof → Merkle batch → Polygon anchor → verify.

### Version lifecycle
V1 → V2 → V3; each independently verifiable.

### Access recovery
Configure provider → credential loss → proof → recover access → audit.

## 7. Performance Business Requirement
Users must not wait for blockchain confirmation merely to finish uploading a document.

The system must provide durable acknowledgement quickly while downstream proof processing continues asynchronously.

## 8. BEL Product Context
Publicly described BEL offerings such as SecureDoc, SecureLedger and Enterprise Access Control System provide relevant context. The SecureChain solution should be positioned as an integrated architecture combining identity, access control, digital assets, confidential document proof/versioning and programmable recovery, without making unsupported claims about undocumented internal capabilities.

## 9. Scope
### In scope
Identity, RBAC, assets/NFTs, MinIO, OCR, SHA-256, Merkle proofs, Polygon anchoring, versioning, latest lookup, verification, audit and ERC-7947-compatible recovery.

### Out of scope
DeFi, crypto payments, NFT marketplace, raw documents on-chain, arbitrary EOA recovery and full ERP/IAM replacement.

## 10. KPIs
- 100% critical versions receive hashes.
- 100% anchored versions have verifiable Merkle paths.
- 100% historical versions remain immutable.
- 100% controlled tampering is detected.
- 0 confidential document bytes stored on Polygon.
- Upload acknowledgement independent of Polygon confirmation.
- 100% replayed recovery proofs rejected.

## 11. Business Risks
| Risk | Mitigation |
|---|---|
| Wallet/key loss | ERC-7947-compatible recovery |
| Recovery abuse | Provider governance + proof validation |
| RPC outage | Multiple providers |
| OCR failure | Independent retry pipeline |
| Storage failure | MinIO redundancy/versioning |
| Contract bug | Security testing/audit |
| PII leakage | Off-chain sensitive storage |
| Indexer corruption | Rebuild from blockchain |

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

# FINAL BUSINESS REQUIREMENT CORRECTIONS

## Business acceptance

BEL stakeholders should be able to answer, for any controlled asset:

1. **Who is the identity?** — DID + cryptographic account.
2. **What may the identity do?** — effective role/permission.
3. **Which asset is assigned?** — NFT/token ID linked to identity.
4. **Who created/allocated/transferred it?** — immutable event history.
5. **Was the confidential document altered?** — independent cryptographic verification.
6. **What is the latest document version?** — stable document ID and latest pointer.
7. **What happens if access is lost?** — governed smart-account recovery.

## Separation of concerns

The blockchain supplies shared trust and tamper-evident state. It is not the confidential document repository and not a replacement for every BEL enterprise system.

## Business-level authority

The Admin role controls identity/role governance and initial asset issuance/allocation. Manager permissions are deliberately narrower and policy-controlled. Auditor is read/verify oriented and cannot mutate operational state.

## Enterprise deployment acceptance

A production deployment must be capable of operating with BEL-approved network, identity, key-management, storage, logging, backup and security-governance controls without changing the core business model.
