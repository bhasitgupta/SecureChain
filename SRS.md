# SIH26125 — Software Requirements Specification (SRS)

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
