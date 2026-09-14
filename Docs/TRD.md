# SIH26125 — Technical Requirements & Design Document (TRD)

## 1. Technical Objective
Implement an enterprise EVM architecture using Polygon, Solidity smart contracts, MinIO, asynchronous processing, Merkle batching, blockchain event indexing and ERC-7947-compatible smart-account recovery.

## 2. Reference Architecture

```text
                         CLIENTS
                            |
                    Web / Mobile UI
                            |
                    API / Ingestion Gateway
                     /                \
                    /                  \
          Streaming SHA-256          MinIO
                    |             Original + OCR
                    |             + Object Versions
                    +--------+---------+
                             |
                        Durable Queue
                   /         |          \
                  /          |           \
             OCR Workers  Proof Workers  Metadata
                              |
                        Merkle Batcher
                              |
                       Polygon Adapter
                              |
                        Polygon / EVM
                              |
                     Anchor / State Contracts
                              |
                         Event Indexer
                              |
                     Query / Verification API

Smart Account
      |
ERC-7947-compatible Recovery Adapter
      |
Recovery Provider
```

## 3. Data Plane
MinIO is the authoritative storage location for confidential document bytes and OCR outputs.

## 4. Trust Plane
Polygon provides immutable blockchain state and proof anchoring.

## 5. Compute Plane
Workers perform OCR, proof construction and Merkle batching asynchronously.

## 6. Read Plane
The indexer provides fast queries. It is not authoritative when blockchain state can be verified directly.

## 7. SHA-256
Hash the exact uploaded byte stream:
`H = SHA256(original_bytes)`

Use streaming hashing during ingestion where practical.

## 8. Proof Record
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
merkleRoot
polygonChainId
anchorContract
anchorTransaction
anchorBlock
proofStatus
```

## 9. Merkle Design
Each version hash is a leaf. A batch produces one root.

```text
H1 H2 H3 H4
 \ /   \ /
 H12   H34
   \   /
    ROOT
      ↓
   Polygon
```

Retain inclusion proofs off-chain.

## 10. Anchor Contract
Logical operation:
`anchorRoot(bytes32 root, bytes32 batchId, uint64 leafCount, uint64 createdAt)`

Emit `MerkleRootAnchored`.

Prevent duplicate batch IDs.

## 11. Version State
```text
D001
 ├─ V1/H1/R1/TX1
 ├─ V2/H2/R2/TX2
 └─ V3/H3/R3/TX3
```

Never mutate historical hashes.

## 12. Latest Retrieval
Use stable `documentId` plus latest-version state/index. Retrieve the exact MinIO object version after authorization.

## 13. Verification
Verify:
1. exact object;
2. SHA-256;
3. Merkle inclusion;
4. Polygon root.

## 14. Performance Architecture
- multipart/resumable upload;
- parallel chunks;
- streaming SHA-256;
- asynchronous OCR;
- bounded queues;
- worker pools;
- backpressure;
- batch Merkle roots;
- multiple Polygon RPC providers;
- transaction reconciliation;
- indexer replay.

## 15. Smart Account / ERC-7947
ERC-7947 is a recovery interface for smart accounts. The architecture therefore requires a compatible smart-account implementation.

Recovery provider registration/removal must be authorized. Recovery proofs require validation and replay protection. Recovery must not alter historical document proof state.

## 16. Identity
EVM addresses are cryptographic principals. DID/VC may be added as an application interoperability layer. Sensitive PII remains off-chain.

## 17. RBAC
Smart-contract role enforcement:
- Admin;
- Manager;
- Auditor;
- User.

## 18. Digital Assets
Use ERC-721-compatible unique asset semantics where appropriate. Asset token state is separate from document payload.

## 19. Security
TLS, encryption at rest, least privilege, secure RPC, smart-contract access control, multisig governance for critical administration, secrets management, secure MinIO policies and contract security testing.

## 20. Reliability
Persist proof/batch state before blockchain submission. Retry through approved RPC providers. Reconcile pending transactions. Replay blockchain events to recover the indexer.

## 21. Deployment
```text
Edge/DMZ
 ├─ Web
 └─ API

Application Zone
 ├─ Ingestion
 ├─ OCR workers
 ├─ Proof/Merkle workers
 └─ Indexer

Secure Data Zone
 ├─ MinIO
 └─ KMS/secrets

Blockchain Connectivity
 └─ Polygon RPC
```

# FINAL ARCHITECTURE DECISIONS — SIH26125 / BEL

> This section is normative. It resolves ambiguities found during the final requirement-to-design review.

## A. Strict SIH26125 requirement interpretation

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

The following are deliberate enterprise extensions, not substitutions for SIH requirements:

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

| SIH26125 requirement | Final implementation | Status |
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

**The merged solution is requirement-complete for SIH26125 after the decisions above.**

The additions do not replace any explicit SIH requirement. They harden the solution for BEL's enterprise/defence context.

# FINAL TECHNICAL DESIGN CORRECTIONS

## Contract boundary

Recommended Solidity contract decomposition:

| Contract | Responsibility |
|---|---|
| `IdentityRegistry` | DID/identity registration, status, account binding, identity events |
| `RolePermissionRegistry` | roles, permissions, grants/revocations, policy events |
| `EnterpriseAssetNFT` | ERC-721-compatible minting, token identity, asset-DID binding |
| `AssetGovernance` | allocation/transfer policy and lifecycle rules |
| `DocumentAnchorRegistry` | Merkle root anchoring and batch metadata |
| `RecoveryAwareSmartAccount` | smart-account control and ERC-7947-compatible recovery |
| `Audit/Event layer` | emitted events across the above contracts |

Do not force all logic into one monolithic contract.

## DID model

Use a stable DID string/identifier at the application boundary. On-chain storage should use a privacy-preserving identifier/reference (for example, a digest or compact ID) rather than unnecessary PII.

Conceptual relationship:

`DID ↔ IdentityRegistry record ↔ Smart Account ↔ Roles ↔ NFT assets`

## Asset model

Each NFT record MUST expose or resolve:

- `tokenId`
- `assetClass`
- `assetStatus`
- `identitySubjectId / DID reference`
- `createdAt`
- `allocation state`
- `transfer history through events`
- optional non-sensitive metadata reference

Never store confidential payloads in token metadata on a public chain.

## Document proof model

For each version:

`documentId + versionId + SHA256 + objectVersion + MerkleBatchId + leafIndex + proof + chainAnchor`

The proof record is not itself the confidential document.

## Chain transaction policy

Do not create one Polygon transaction per uploaded document. Batch hashes with Merkle trees and anchor roots.

## Indexer rule

The indexer can accelerate queries but cannot authorize operations or become the system of record for blockchain state.

## Production key management

- Admin/deployer keys: HSM/MPC or enterprise custody where available.
- Backend services never receive raw user private keys.
- Contract administration must be multisig/governed.
- Recovery-provider registration/removal is privileged governance.
