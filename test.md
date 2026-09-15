# SIH26125 — Enterprise Test Strategy & Specification

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
