# SIH26125 — Security, Reliability & Compliance Controls (SRC)

## 1. Security Architecture
Security is implemented in layers:

```text
Identity
 ↓
Authentication
 ↓
Authorization
 ↓
Secure Ingestion
 ↓
Encrypted MinIO
 ↓
Cryptographic Proof
 ↓
Merkle Integrity
 ↓
Polygon Anchor
 ↓
Audit / Verification
```

## 2. Confidentiality
- Original documents remain in MinIO.
- OCR output is treated as sensitive.
- No raw document bytes on Polygon.
- Minimize PII in blockchain transactions.
- Use encryption in transit and at rest.
- Apply least-privilege object policies.

## 3. Integrity
For each version:
`SHA256(exact_original_bytes)`

Then:
`SHA256 → Merkle Leaf → Merkle Root → Polygon`

Any byte-level modification changes the SHA-256 and causes verification failure.

## 4. Version Integrity
Historical versions are append-only:
`V1/H1`, `V2/H2`, `V3/H3`.

No update operation may mutate a prior proof.

## 5. Availability
- MinIO redundancy/versioning.
- Durable queues.
- Worker retries.
- Multiple Polygon RPC providers.
- Transaction reconciliation.
- Indexer replay.

## 6. Recovery Security
ERC-7947-compatible recovery must:
- operate only on supported smart accounts;
- require an explicitly registered provider;
- validate recovery proof;
- prevent replay;
- validate recovery target;
- emit auditable events;
- protect provider configuration with strong governance.

## 7. Smart Contract Controls
- role separation;
- least privilege;
- checks-effects-interactions;
- reentrancy protection where applicable;
- replay protection;
- safe external calls;
- fuzz/property testing;
- multisig governance for critical administration.

## 8. Upload Security
- authenticated upload;
- authorization;
- MIME/type validation;
- size limits;
- malware scanning where required;
- resumable upload validation;
- idempotency;
- secure object naming;
- path traversal prevention.

## 9. Operational Security
Monitor:
- failed uploads;
- unauthorized access;
- proof failures;
- anchor failures;
- unusual recovery activity;
- RPC errors;
- queue backlogs;
- MinIO errors.

## 10. Evidence Retention
Maintain:
- original object/version;
- OCR object/version;
- SHA-256;
- Merkle proof;
- root;
- Polygon transaction;
- actor;
- timestamps;
- audit events.

Retention policy is configurable to organizational requirements.

## 11. Security Acceptance
No critical/high unresolved smart-contract security defect. No confidential document bytes on-chain. Unauthorized actions fail. Tampering is detected. Recovery abuse tests fail safely.
