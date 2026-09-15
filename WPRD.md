# SIH26125 — Workflow/Product Requirements Document (WPRD)

## 1. Purpose
Define the complete operational workflow from document upload through proof creation, versioning, Polygon anchoring, retrieval, verification and recovery-aware access.

## 2. Master Workflow

```text
AUTHENTICATE
    ↓
AUTHORIZE
    ↓
RESUMABLE UPLOAD
    ↓
DURABLE MINIO WRITE + STREAMING SHA-256
    ↓
CREATE DOCUMENT/VERSION RECORD
    ↓
IMMEDIATE UPLOAD RECEIPT
    ↓
ASYNC OCR
    ↓
PROOF RECORD
    ↓
MERKLE BATCH
    ↓
POLYGON ROOT ANCHOR
    ↓
INDEX / RECONCILE
    ↓
VERIFIABLE
```

## 3. First Upload
First accepted upload:
`D001/V1/H1`

Original bytes are stored in MinIO. OCR is generated asynchronously. H1 becomes a Merkle leaf. The root is anchored on Polygon.

## 4. Revision
A revised document:
`D001/V2/H2`

H1 is never changed. V2 receives its own proof and later anchor.

## 5. Latest-Version Workflow
```text
GET /documents/D001/latest
        ↓
latestVersion = V2
        ↓
authorize
        ↓
resolve MinIO V2
        ↓
secure stream / URL
```

Do not scan blockchain blocks for normal retrieval.

## 6. Verification Workflow
```text
Retrieve exact MinIO version
        ↓
SHA-256
        ↓
compare stored hash
        ↓
Merkle inclusion proof
        ↓
reconstruct root
        ↓
compare Polygon anchor
        ↓
VALID / INVALID
```

## 7. Enterprise Upload Ordering
1. Authenticate.
2. Authorize.
3. Start resumable upload.
4. Write chunks to durable staging/object storage.
5. Finalize object.
6. Confirm SHA-256.
7. Create version record.
8. Return durable receipt.
9. Queue OCR.
10. Queue Merkle proof.
11. Batch.
12. Anchor Polygon root.
13. Reconcile transaction.
14. Mark proof verifiable.

## 8. Latency Principle
Do not claim zero latency. Instead:

**remove unnecessary latency from the critical path.**

The user waits only for durable ingestion and trusted hash completion. OCR, Merkle construction and Polygon confirmation are asynchronous.

## 9. Failure States
- `UPLOADING`
- `DURABLY_STORED`
- `HASHED`
- `OCR_PROCESSING`
- `PROOF_READY`
- `MERKLE_BATCHED`
- `ANCHOR_PENDING`
- `ANCHORED`
- `VERIFIABLE`

Failure at one downstream stage must not destroy earlier durable state.

## 10. Idempotency
Every upload uses an idempotency key. Retries with the same key must not create duplicate versions. Merkle batches use unique batch IDs.

## 11. Recovery-Aware Access
Account recovery occurs independently of document proof:
`lost credential → recovery provider → valid proof → smart-account access restored`.

Historical document hashes, versions, Merkle roots and Polygon anchors remain unchanged.
