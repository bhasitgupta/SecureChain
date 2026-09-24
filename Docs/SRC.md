# SecureChain — Security, Reliability & Compliance Controls (SRC)

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

# FINAL SECURITY / RELIABILITY / COMPLIANCE CONTROLS

## Identity security

- Cryptographic account control is required.
- DID binding changes are privileged.
- Identity status supports revocation/suspension.
- Sensitive attributes remain off-chain.

## Access security

- Least privilege.
- Explicit role matrix.
- Fail-closed authorization.
- Admin governance separated from Auditor verification.
- Recovery-provider governance protected by privileged control, preferably multisig/HSM-backed administration.

## Confidentiality

- TLS for service communication.
- Encryption at rest for MinIO.
- Bucket/object policies enforce least privilege.
- Short-lived signed access URLs where direct object access is needed.
- No sensitive document bytes in chain calldata, token metadata or events.
- Secrets stored in an enterprise secrets manager; never in source control.

## Integrity

- SHA-256 over exact original bytes.
- Immutable version IDs.
- Merkle inclusion proofs.
- Polygon root anchors.
- Independent verification path.

## Smart-contract security

- OpenZeppelin primitives where applicable.
- Reentrancy protections where external calls exist.
- Strict access control.
- Checks-effects-interactions.
- Event completeness.
- Fuzz/property testing for state transitions.
- Upgradeability only if there is a strong reason; upgrade authority must be governed and auditable.

## Reliability

- Durable queues.
- Idempotency keys.
- Retries with backoff.
- Dead-letter handling.
- Multiple approved RPC providers.
- Indexer replay/rebuild.
- MinIO redundancy/versioning.
- Backup and disaster-recovery procedures.

## Compliance posture

The prototype SHALL demonstrate security controls, but SHALL NOT claim formal BEL certification, classified-system accreditation, or regulatory compliance unless independently assessed and approved by BEL.

## Recovery threat model

Protect against:

- malicious recovery provider;
- unauthorized provider registration;
- replayed recovery proof;
- recovery target substitution;
- stolen recovery credential;
- compromised administrator.

Controls include provider allowlisting/governance, proof validation, nonce/replay protection, explicit subject validation, privileged administration and immutable recovery events.
