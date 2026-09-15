# SIH26125 — Master Enterprise Workflow

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
