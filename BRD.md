# SIH26125 — Business Requirements Document (BRD)

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
Publicly described BEL offerings such as SecureDoc, SecureLedger and Enterprise Access Control System provide relevant context. The SIH solution should be positioned as an integrated architecture combining identity, access control, digital assets, confidential document proof/versioning and programmable recovery, without making unsupported claims about undocumented internal capabilities.

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
