# SecureChain — Enterprise Test Strategy & Specification

## 1. Test Strategy
Test the complete system across unit, integration, system, security, performance, resilience and end-to-end levels.

## 2. Test Environments
- local EVM;
- Polygon test environment;
- production-like environment;
- isolated MinIO;
- dedicated role wallets;
- dedicated recovery provider.

## 3. Functional Tests
| ID | Test | Expected |
|---|---|---|
| TC-001 | First upload | D1/V1 |
| TC-002 | SHA-256 | Correct H1 |
| TC-003 | MinIO write | Durable |
| TC-004 | OCR | Sensitive OCR stored |
| TC-005 | Merkle leaf | Correct |
| TC-006 | Polygon root anchor | Success |
| TC-007 | V2 upload | H2; H1 unchanged |
| TC-008 | Latest lookup | V2 |
| TC-009 | Verify V1 | VALID |
| TC-010 | Verify V2 | VALID |
| TC-011 | Modify V2 | HASH_MISMATCH |
| TC-012 | Wrong Merkle path | INVALID |
| TC-013 | Indexer tamper | Polygon authoritative |

## 4. Identity/RBAC Tests
- unauthorized role grant;
- unauthorized mint;
- unauthorized transfer;
- auditor modification;
- manager admin operation;
- revoked identity access.

## 5. Document Tests
- empty file;
- binary file;
- large file;
- duplicate file;
- modified byte;
- deleted object;
- wrong MinIO version;
- concurrent uploads.

## 6. Version Tests
V1 → H1.  
V2 → H2.  
V3 → H3.

Verify all historical versions remain independently verifiable.

## 7. Merkle Tests
- one leaf;
- even leaves;
- odd leaves;
- large batch;
- valid proof;
- wrong leaf;
- wrong sibling;
- wrong root;
- duplicate batch.

## 8. Polygon Tests
- anchor success;
- RPC timeout;
- transaction revert;
- duplicate batch;
- delayed confirmation;
- provider failover;
- transaction reconciliation;
- event replay.

## 9. Performance Tests
Measure:
- upload MB/s;
- p50/p95/p99 durable-ack latency;
- SHA-256 throughput;
- MinIO throughput;
- OCR throughput;
- queue delay;
- Merkle batch delay;
- Polygon confirmation latency;
- latest lookup;
- verification latency.

## 10. Critical Latency Test
The upload response must not wait for OCR or Polygon.

```text
Upload
 ├→ MinIO durable write
 ├→ streaming SHA-256
 └→ ACK

Async
 ├→ OCR
 ├→ proof
 ├→ Merkle
 └→ Polygon
```

## 11. Failure Injection
- MinIO unavailable;
- OCR worker crash;
- queue outage;
- Polygon RPC outage;
- pending transaction;
- indexer outage;
- application restart;
- duplicate retry.

No silent data loss.

## 12. ERC-7947 Tests
- valid provider registration;
- unauthorized registration;
- provider removal;
- invalid provider;
- valid recovery;
- invalid proof;
- replayed proof;
- invalid recovery subject;
- recovery after simulated key loss;
- historical document verification after recovery.

## 13. Security Tests
Test proof manipulation, root manipulation, indexer tampering, object authorization, malicious upload, path traversal, contract bypass and recovery abuse.

## 14. Golden End-to-End Test
```text
Admin creates user
 → assigns role
 → user controls smart account
 → recovery provider configured
 → document V1 uploaded
 → SHA-256 H1
 → MinIO
 → Merkle root R1
 → Polygon anchor
 → Manager allocates asset
 → unauthorized transfer REVERT
 → authorized transfer SUCCESS
 → document revised as V2/H2
 → latest = V2
 → verify V2 = VALID
 → simulate wallet credential loss
 → valid recovery proof
 → access restored
 → audit history intact
```

## 15. Release Gate
Critical authorization, integrity, Merkle, Polygon, versioning, performance, recovery and security tests pass. No confidential document bytes are on-chain.

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

# FINAL TEST ADDITIONS — SecureChain REQUIREMENT COMPLETENESS

## 13. DID / Identity Tests

| ID | Test | Expected |
|---|---|---|
| TC-ID-01 | Register identity with valid cryptographic control | Identity created |
| TC-ID-02 | Register duplicate DID | Rejected |
| TC-ID-03 | Bind unauthorized account to identity | Rejected |
| TC-ID-04 | Change identity status | Event emitted |
| TC-ID-05 | Attempt identity mutation without Admin policy | Reverted |

## 14. NFT / Ownership Tests

| ID | Test | Expected |
|---|---|---|
| TC-NFT-01 | Admin mints unique asset | Success |
| TC-NFT-02 | User attempts mint | Reverted |
| TC-NFT-03 | Admin allocates asset to identity | Success + event |
| TC-NFT-04 | Non-admin attempts initial allocation | Reverted |
| TC-NFT-05 | Asset token resolves to intended DID | Match |
| TC-NFT-06 | Unauthorized transfer | Reverted |
| TC-NFT-07 | Authorized transfer | Success + immutable event |
| TC-NFT-08 | Duplicate token ID | Rejected |

## 15. Permission Audit Tests

Verify that identity creation, role assignment, role revocation, permission update, mint, allocation and transfer each produce the expected immutable event with actor, target, action and timestamp/block context.

## 16. Confidentiality Tests

- Attempt to retrieve a protected MinIO object without authorization → deny.
- Inspect Polygon transaction calldata/events → no raw document bytes.
- Attempt to leak sensitive metadata through NFT metadata → reject by schema/policy.
- Verify encrypted-at-rest configuration in the production-like environment.

## 17. Merkle / Version Tests

- V1 and V2 have distinct hashes.
- V1 hash never changes after V2 upload.
- V1 and V2 can each be independently verified.
- Latest pointer changes from V1 to V2 without deleting V1.
- Invalid inclusion proof → INVALID.
- Wrong Polygon root → INVALID.

## 18. Recovery Tests

- Unregistered provider → reject.
- Invalid proof → reject.
- Replayed proof → reject.
- Unauthorized provider registration → reject.
- Valid recovery → access subject changes + `AccessRecovered`.
- Historical asset/document/audit state remains unchanged.

## 19. Release Traceability Gate

No release is accepted unless every **mandatory** Core requirement in the final traceability matrix has at least one passing automated/integration/acceptance test.
