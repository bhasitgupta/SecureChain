# SIH26125 — Enterprise Secure Identity, Access Control, Digital Asset & Document Proof Platform
**Product Requirements Document (PRD)**  
**Organization:** Bharat Electronics Limited (BEL)  
**Architecture:** Polygon / EVM + MinIO + Merkle Proofs + ERC-7947-compatible Smart-Account Recovery

## 1. Executive Summary
The product unifies:
1. cryptographic identity;
2. RBAC and authorization;
3. digital asset/NFT-style ownership;
4. confidential document storage;
5. SHA-256 integrity proof;
6. Merkle-tree batching;
7. Polygon/EVM immutable anchoring;
8. immutable document versioning;
9. latest-version retrieval;
10. audit and verification;
11. controlled smart-account recovery using an ERC-7947-compatible recovery layer.

The core design separates **confidential data** from **blockchain proof**.

```text
MINIO = original documents + OCR + sensitive metadata
POLYGON = Merkle roots + controlled state + audit/proof anchors
INDEXER = derived search/read model
```

## 2. Core Product Questions
- **Who are you?** → EVM identity / smart account / optional DID-VC layer
- **What can you do?** → smart-contract RBAC
- **Which asset is yours?** → unique asset/NFT-style state
- **Is this document authentic?** → SHA-256 + Merkle proof + Polygon anchor
- **Which version is current?** → stable document ID + latest-version state
- **What happened?** → immutable blockchain events
- **What if access is lost?** → ERC-7947-compatible recovery for supported smart accounts

## 3. Product Vision
Create a trusted enterprise control plane in which identity, authorization, asset responsibility, document integrity, version history and account recovery can be independently verified.

## 4. Goals
- Enterprise-grade security.
- Fast durable document ingestion.
- Non-blocking upload path.
- Cryptographically verifiable document integrity.
- Immutable historical versions.
- Efficient blockchain anchoring through Merkle batching.
- Low-latency latest-version retrieval.
- Strong role enforcement.
- Controlled account recovery.
- EVM portability.

## 5. Non-Goals
- Cryptocurrency/DeFi.
- Public NFT marketplace.
- Storing document bytes on-chain.
- One blockchain transaction per document.
- Synchronous OCR before upload acknowledgement.
- Replacing a complete enterprise IAM/ERP.
- Treating an EOA as natively ERC-7947-recoverable.

## 6. Users
| Role | Responsibility |
|---|---|
| Admin | Identity, role, asset and governance administration |
| Manager | Operational allocation/transfer |
| Auditor | Independent verification and audit |
| User | Authorized operations |
| Recovery Provider | Validates recovery according to the configured smart-account policy |

## 7. Product Modules
### 7.1 Identity Management
- EVM wallet/smart-account identity.
- Optional DID/VC interoperability.
- Identity status and role association.
- No unnecessary PII on-chain.

### 7.2 RBAC & Access Control
Roles: Admin, Manager, Auditor, User. Contract authorization is the security boundary; frontend checks are only UX.

### 7.3 Digital Asset Registry
Unique enterprise assets can use ERC-721-compatible semantics. The token represents the enterprise asset/control record, not its confidential payload.

### 7.4 Secure Document Ingestion
- resumable/multipart upload;
- streaming SHA-256;
- durable MinIO write;
- idempotency;
- asynchronous processing.

### 7.5 OCR
OCR is a derived sensitive representation stored in MinIO. OCR does not replace the original-file hash.

### 7.6 Proof Engine
Per version:
`SHA-256 → Merkle leaf → Merkle proof → Merkle root → Polygon anchor`

### 7.7 Version Manager
A stable `documentId` owns immutable versions:
`V1 → V2 → V3`.
Every version has its own hash and proof.

### 7.8 Latest Version
Latest lookup resolves the current version without scanning blockchain history.

### 7.9 Verification
Verification checks exact MinIO bytes, SHA-256, Merkle inclusion and Polygon anchor.

### 7.10 Account Recovery
Supported smart accounts use an ERC-7947-compatible recovery interface/provider model. Recovery restores access; it does not rewrite document history.

### 7.11 Audit
Critical state changes emit blockchain events and are indexed.

## 8. MVP
- Admin/User/Manager/Auditor.
- Polygon deployment.
- Smart contracts.
- MinIO.
- SHA-256.
- OCR.
- Merkle batching.
- Immutable document versions.
- Latest-version retrieval.
- Verification.
- Audit.
- ERC-7947 recovery demonstration.

## 9. Product Constraints
- No sensitive document bytes on Polygon.
- Upload acknowledgement must not wait for blockchain confirmation.
- Blockchain state is authoritative for blockchain-controlled state.
- Indexer is derived.
- Every version is immutable.
- Recovery is restricted to supported smart accounts.

## 10. Success Criteria
- Unauthorized operations revert.
- First upload becomes V1.
- Revision becomes V2 with a new hash.
- V1 remains independently verifiable.
- Latest lookup returns V2.
- Tampering is detected.
- Merkle proof verifies.
- Polygon root is independently verifiable.
- Valid recovery restores the intended access subject.
