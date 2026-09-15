# SIH26125 — Implementation Plan

**Status:** proposed, awaiting sign-off
**Date:** 2026-09-14
**Scope of this plan:** smart contracts, backend services, asynchronous proof pipeline, indexer, verification tooling, tests, infrastructure, **and a developer-facing testing frontend**.
**Note on frontends:** a separate team is building the production portals. This plan adds a lightweight testing frontend so the full stack can be exercised from a browser during development. The API contract, ABI package and event catalogue remain first-class early deliverables so that the portal team is never blocked.

---

## 1. Document set analysis

### 1.1 What exists

| File | Role | Notes |
|---|---|---|
| `BRD.md` | Business requirements, KPIs, business risks | Adds business acceptance questions and role authority |
| `PRD.md` | Product requirements, modules, MVP, success criteria | Adds the mandatory MVP acceptance journey |
| `SRS.md` | Functional requirements with IDs, state machine, API, RBAC matrix, error codes | Adds `SRS-ID/ASSET/RBAC/CONF` requirement IDs |
| `TRD.md` | Technical design, contract decomposition, proof record, key management | Strict subset of the full reference architecture |
| `SIH26125_TRD_FULL_REFERENCE_ARCHITECTURE.md` | `TRD.md` plus expanded sections 2.1–2.23 | Authoritative architecture reference, including the 12 non-negotiable invariants |
| `SRC.md` | Security, reliability and compliance controls, recovery threat model | Compliance posture limits |
| `WPRD.md` | Operational workflow, upload ordering, P0/P1 priorities | UX rule on verification status |
| `workflow.md` | Master workflow, failure principle | Overlaps `WPRD.md` heavily |
| `test.md` | Test strategy, test cases, golden E2E, release gates | Adds `TC-ID`, `TC-NFT` cases |
| `REQUIREMENT_REVIEW.md` | Review verdict and four normalizations | States DID and NFT semantics are mandatory, not optional |

### 1.2 Structural observations

1. Eight of the ten files each append an identical copy of the *FINAL ARCHITECTURE DECISIONS* (sections A–E) and *FINAL REQUIREMENT TRACEABILITY* blocks — roughly 130 duplicated lines per file. Any future edit must be applied eight times or the corpus silently diverges.
   **Recommendation:** extract one `NORMATIVE.md` and replace the copies with a link. Do this only if the submission format allows it.
2. `TRD.md` is fully contained in `SIH26125_TRD_FULL_REFERENCE_ARCHITECTURE.md`.
   **Recommendation:** keep the full reference architecture as the single technical source and retire `TRD.md`, or mark it explicitly as an abridged summary.
3. `workflow.md` and `WPRD.md` overlap substantially. Keep both only if `WPRD.md` stays product-facing and `workflow.md` stays operations-facing.

### 1.3 Contradictions that must be resolved before coding

These are real conflicts between documents, not stylistic differences. Each has a proposed resolution.

| # | Conflict | Sources | Proposed resolution |
|---|---|---|---|
| C1 | Merkle batch granularity. Version-lineage diagrams show `V1→B1→R1→TX1`, `V2→B2→R2→TX2`, i.e. one batch, one root and one transaction per version. That is exactly the "one transaction per document" pattern the same corpus forbids. | Full ref. arch. §2.10, `TRD.md` §11 vs `PRD.md` §5 non-goals, "Chain transaction policy" | A batch spans many versions across many documents. Each version maps to `(batchId, leafIndex)`. The lineage diagrams are illustrations of version history, not of batching policy. Documented in ADR-004. |
| C2 | Manager mint rights. `SRS.md` §7 gives Manager `Mint = Policy`. The reference architecture gives Manager `Mint = ✗` and states the SIH invariant that only Admin may mint and perform initial allocation. | `SRS.md` §7 vs full ref. arch. §2.8, `SRS-ASSET-002/003` | Manager cannot mint and cannot perform initial allocation, enforced in contract with no policy escape hatch. `SRS.md` §7 to be corrected. |
| C3 | Manager transfer rights. `SRS.md` §7 gives Manager `Transfer = Yes` unconditionally. | `SRS.md` §7 vs full ref. arch. §2.8 | Transfer is policy-controlled for Manager and User, evaluated in `AssetGovernance`. |
| C4 | Golden E2E ordering. The golden test has "Manager allocates asset", which contradicts Admin-only initial allocation. | `test.md` §14 vs `SRS-ASSET-003` | Admin performs the initial allocation; Manager performs a later authorised transfer. Golden script corrected accordingly. |
| C5 | Latest-version pointer authority. Declared as "authoritative application/domain state with audit trail", i.e. an off-chain database row. Nothing on-chain then witnesses which version is current, so a direct database write could silently repoint `latest` with no cryptographic evidence — while the UX rule forbids trusting derived state. | Data authority tables vs `WPRD.md` UX rule, `BRD.md` KPIs | Keep the pointer in Postgres for fast retrieval, but (a) make the pointer table append-only with actor, timestamp and previous value, and (b) include `documentIdHash` and `versionId` in the Merkle leaf preimage so full version lineage is reconstructible from anchored roots plus the retained proof set. |
| C6 | Streaming SHA-256 versus resumable upload. The ordering requires "confirm SHA-256, then return receipt". If the client uploads parts directly to MinIO with presigned URLs, the backend never sees the bytes and cannot compute the digest; a MinIO multipart ETag is not a SHA-256. | `SRS-DOC-002/003`, `WPRD.md` §7 steps 6–8 | Prototype uses a proxy ingestion path: client streams to the gateway, the gateway hashes in the pass-through and writes to MinIO. Parts must arrive in order; rolling hash state is held per upload session. Direct-to-MinIO with a read-back verification worker is documented as the production alternative and degrades the receipt to `DURABLY_STORED` until `HASHED`. ADR-003. |

### 1.4 Specification gaps that block implementation

| # | Gap | Decision required | Proposed answer |
|---|---|---|---|
| G1 | Merkle construction is never pinned: internal-node hash function, leaf encoding, domain separation, odd-leaf handling, pair ordering. The contract, the backend and the independent verifier must agree byte for byte or verification fails for reasons unrelated to tampering. | Exact algorithm | Document digest stays `SHA-256(exact original bytes)` as required. Tree layer uses `@openzeppelin/merkle-tree` `StandardMerkleTree` (keccak256, double-hashed leaves, sorted pairs) so that on-chain `MerkleProof.verify` and the off-chain verifier are interoperable and second-preimage resistant. Leaf value tuple: `(documentIdHash, versionId, sha256Digest, objectVersionHash)`. ADR-004. |
| G2 | DID method unspecified, while DID is mandatory. | Method and on-chain representation | `did:pkh:eip155:80002:<smartAccountAddress>` — deterministic, registry-free, W3C conformant. On-chain store only `keccak256(did)`. Role attestations issued as W3C VC 2.0 (JWT-VC), stored in MinIO, only the VC hash on-chain. ADR-002. |
| G3 | ERC-7947 implementation not named, though the review explicitly requires naming it. | Concrete account and provider | We implement `RecoveryAwareSmartAccount` ourselves against an ERC-7947-compatible interface, with the interface reproduced verbatim in ADR-005, and state plainly that it is our own implementation of a draft interface, not an audited third-party account. |
| G4 | Recovery has no delay or veto. The threat model lists "malicious recovery provider" but the only stated control is allowlisting, so an approved-then-compromised provider could take an account instantly. | Timelock policy | `requestRecovery` → timelock → `finalizeRecovery`. Owner may cancel during the window. 24 h in production configuration, 5 min in the demo profile. Provider allowlist changes are governed by multisig. ADR-005. |
| G5 | API surface covers only four document endpoints. Nothing is specified for identity, RBAC, assets, recovery or audit — and the frontend is being built in parallel right now. | Full API contract | OpenAPI 3.1 specification, error-code table, event catalogue, generated TypeScript client and a mock server, all delivered in Phase 0. This is the highest-priority deliverable in the plan. |
| G6 | Thirteen error codes are listed with no meanings or HTTP mappings. | Code table | Proposed mapping in §6. |
| G7 | No performance targets. The documents require measuring p50/p95/p99 but set no numbers, so no test can fail. | Numeric targets | Proposed targets in §7, to be confirmed. |
| G8 | Idempotency semantics undefined. | Key scope, TTL, conflict behaviour | `Idempotency-Key` header, scoped per identity, 24 h TTL, stored with a request-body hash and a response snapshot. Replay returns the original response; same key with a different body returns `409 DOC-003`. |
| G9 | Empty-file and duplicate-file policies are tested but never specified. | Accept or reject | Reject 0-byte uploads with `DOC-002`. Accept byte-identical re-upload as a genuine new version: the digest repeats but the leaf stays unique because it includes `versionId`. |
| G10 | OCR engine unspecified, while OCR output is classified sensitive. | Engine and handling | Tesseract 5 in a worker container. Output written to MinIO under the same encryption and least-privilege policy as the original. OCR text never enters logs, traces or metrics labels. |
| G11 | Queue durability is asserted but not designed, while the failure-injection suite includes "queue outage". | Queue topology | Transactional outbox in Postgres written in the same transaction as the version record, drained by a dispatcher into BullMQ. A queue outage then cannot lose work, because the outbox row is the durable record. ADR-006. |
| G12 | Gas funding and signer split unstated. | Who signs what | Users sign their own operations from their EOA, which owns their smart account, and pay their own Amoy gas (confirmed decision). The backend holds only two service keys: the anchor key and the admin/governance key. The backend never receives a user private key. ADR-001. |

---

## 2. Confirmed technology decisions

| Area | Decision |
|---|---|
| Contracts | Solidity 0.8.26, Foundry (`forge` unit, fuzz and invariant tests), OpenZeppelin 5.x |
| Chain | Polygon Amoy, chainId 80002; contract addresses published as a JSON artifact per environment |
| Services | Node 20, TypeScript, Fastify, zod validation, viem for all chain access |
| Datastores | Postgres 16 (proof records, version lineage, latest pointer, read model, outbox, idempotency), Redis 7 (upload hash state, BullMQ), MinIO with bucket versioning and encryption at rest |
| OCR | Tesseract 5 worker |
| Thumbnails | `sharp` (images → 256 px WebP), `pdf-poppler` (PDF → first-page PNG → sharp resize), generic file-type icon fallback. Output stored in MinIO `thumbnails` bucket, keyed by `version_id` |
| Account model | User EOA owns `RecoveryAwareSmartAccount`; user signs and pays gas; no bundler and no paymaster |
| Verification | Shared `packages/merkle` used by backend, contract tests and the CLI, so all three agree by construction |
| Testing Frontend | React 18, Vite 6, React Router, viem, wagmi, `@tanstack/react-query`, vanilla CSS with design tokens. Consumes the generated TS client from `packages/api-spec`. Not a production portal — a developer/QA testing surface |

---

## 3. Repository layout

```text
sih26125/
  contracts/                 Foundry project
    src/  test/  script/
  packages/
    abi/                     generated ABIs, addresses, typed viem clients
    api-spec/                OpenAPI 3.1 + generated TS client
    merkle/                  leaf encoding, tree build, proof verify (shared)
    common/                  zod schemas, state machine, error codes, DID/VC helpers
  services/
    gateway/                 API, auth, policy enforcement point, ingestion
    workers/                 ocr, thumbnail, proof, batcher, anchor, dlq-admin
    indexer/                 event listener, checkpoints, read model
  frontend/                   developer testing portal (next.js 16 + React 19)
    src/
      pages/                 Dashboard, Identity, Assets, Documents, Recovery, Audit
      components/            shared UI: Sidebar, StatusBadge, Toast, Modal, DataTable
      hooks/                 useAuth, useContract, useDocuments, useWallet
      lib/                   api client wrapper, viem config, constants
      styles/                design tokens, global CSS, page-specific CSS
  tools/
    verifier-cli/            independent verification, no service dependency
    seed-demo/               golden end-to-end scenario driver
  db/migrations/
  infra/                     docker-compose, Dockerfiles, k6 load scripts
  docs/adr/                  ADR-001 … ADR-008
```

---

## 4. Contract design

| Contract | Responsibility | Key events |
|---|---|---|
| `IdentityRegistry` | DID hash registration, account binding, identity status | `IdentityRegistered`, `AccountBound`, `IdentityStatusChanged` |
| `RolePermissionRegistry` | `ADMIN`/`MANAGER`/`AUDITOR`/`USER`, permission bits | `RoleGranted`, `RoleRevoked`, `PermissionUpdated` |
| `EnterpriseAssetNFT` | ERC-721 asset registry, unique `tokenId`, DID binding | `AssetMinted`, `Transfer` |
| `AssetGovernance` | Admin-only initial allocation, policy-controlled transfer, retirement | `AssetAllocated`, `AssetTransferAuthorized`, `AssetRetired` |
| `DocumentAnchorRegistry` | Merkle root anchoring, duplicate-batch rejection, optional on-chain proof verification | `MerkleRootAnchored` |
| `RecoveryProviderRegistry` | Multisig-governed provider allowlist | `RecoveryProviderRegistered`, `RecoveryProviderRemoved` |
| `RecoveryAwareSmartAccount` | Owner execution, ERC-7947-compatible recovery with EIP-712 proof, nonce, expiry, timelock and owner veto | `RecoveryRequested`, `RecoveryCancelled`, `AccessRecovered` |
| `MultisigGuard` | Governance gate for privileged administration | `GovernanceExecuted` |

Enforcement rules applied uniformly: fail closed on every protected path, checks-effects-interactions ordering, no upgradeability unless a specific need is argued in an ADR, and every state transition named in the traceability matrix emits an event carrying actor, target and action.

Invariants to encode as Foundry invariant tests:

1. Only `ADMIN` can mint; no other role or policy path reaches `mint`.
2. Only `ADMIN` can perform an initial allocation.
3. `tokenId` is never reused.
4. `batchId` is never reused and an anchored root is never mutated.
5. A recovery cannot finalise before its timelock expires.
6. A recovery proof nonce is never accepted twice.
7. An `AUDITOR` cannot mutate any operational state.

---

## 5. Data model sketch

```text
identities(did_hash pk, did, subject_id, account, status, created_at)
documents(document_id pk, owner_did_hash, latest_version_id, created_at)
document_latest_history(id pk, document_id, from_version, to_version, actor, at)   -- append-only
document_versions(version_id pk, document_id, sha256, object_key, object_version_id,
                  size, mime, state, created_at)                                   -- immutable after insert
thumbnails(version_id pk, object_key, width, height, format, size, status, created_at)
  -- status: PENDING | GENERATED | FAILED | UNSUPPORTED
  -- one thumbnail per version; generated async by thumbnail worker
proof_records(version_id pk, leaf, batch_id, leaf_index, proof_json, status)
merkle_batches(batch_id pk, root, leaf_count, closed_at, anchor_tx, anchor_block, status)
anchor_attempts(id pk, batch_id, rpc_url, tx_hash, nonce, status, error, at)
outbox(id pk, aggregate, payload, available_at, attempts, locked_by, done_at)
idempotency_keys(key pk, identity, request_hash, response_json, expires_at)
indexer_checkpoints(stream pk, last_block, last_log_index)
audit_events(id pk, chain_event, block, tx_hash, log_index, decoded_json)          -- derived, rebuildable
```

`document_versions` rows are insert-only. A database trigger rejects `UPDATE` on `sha256`, `object_version_id` and `version_id`, so the "historical versions are never overwritten" invariant is enforced by the engine and not only by application code.

---

## 6. Error codes

| Code | Meaning | HTTP |
|---|---|---|
| `AUTH-001` | Unauthenticated, or signature verification failed | 401 |
| `AUTH-002` | Authenticated but not authorised for this operation | 403 |
| `DOC-001` | Document or version not found | 404 |
| `DOC-002` | Invalid upload: empty file, size limit, MIME rejected, unsafe object name | 400 |
| `DOC-003` | Idempotency key reused with a different request body | 409 |
| `MERKLE-001` | Inclusion proof invalid or leaf not in the recorded tree | 422 |
| `CHAIN-001` | No approved RPC provider available | 503 |
| `CHAIN-002` | Transaction reverted or failed on chain | 502 |
| `REC-001` | Recovery provider not registered | 403 |
| `REC-002` | Recovery proof invalid or expired | 400 |
| `REC-003` | Recovery proof replayed | 409 |
| `REC-004` | Recovery subject invalid or does not match the request | 400 |
| `AUDIT-001` | Indexer state disagrees with authoritative chain state | 409 |

---

## 7. Proposed performance targets

These fill gap G7 and need confirmation, since without numbers no performance test can fail.

| Metric | Target |
|---|---|
| Durable acknowledgement, 10 MB upload, LAN | p95 ≤ 1.5 s |
| Streaming SHA-256 throughput, single stream | ≥ 60 MB/s |
| Batch close policy | 256 leaves or 60 s, whichever comes first |
| Anchor confirmation on Amoy | p95 ≤ 90 s from batch close |
| Latest-version resolution | p95 ≤ 150 ms |
| Full verification, 10 MB | p95 ≤ 800 ms excluding object download |
| Indexer lag behind head | p95 ≤ 3 blocks |

---

## 8. Phased delivery, 6 weeks

### Phase 0 — Foundations and interface freeze (days 1–3)

- Monorepo with pnpm workspaces, Foundry project, shared tsconfig and lint.
- `infra/docker-compose.yml`: Postgres, Redis, MinIO, anvil.
- CI: lint, typecheck, `forge test`, `vitest`, migration check.
- ADR-001…ADR-008 covering every decision in §1.3, §1.4 and §2.
- **OpenAPI 3.1 specification, error-code table, event catalogue, generated TypeScript client and a Prism mock server.** Handed to the frontend team on day 3.
- Optional documentation hygiene: extract `NORMATIVE.md`, retire `TRD.md`.

**Exit:** frontend team can develop against a running mock. Every conflict in §1.3 has a written resolution.

### Phase 1 — Contracts (week 1 to mid week 2)

- All eight contracts, events complete, fail-closed authorisation.
- Foundry unit and revert tests for every `TC-ID-*` and `TC-NFT-*` case in `test.md`, plus the seven invariants in §4.
- Deploy scripts, Amoy deployment, address artifact, `packages/abi` published.

**Exit:** `forge test` green; unauthorised mint, unauthorised allocation, duplicate `tokenId` and duplicate `batchId` all revert; addresses published.

### Phase 2 — Backend core (mid week 2 to week 3)

- Gateway: EIP-4361 sign-in, session, policy enforcement point, zod validation, rate limiting, idempotency middleware, trace IDs.
- Identity service: DID derivation, VC issuance, `IdentityRegistry` calls.
- RBAC service and Asset service: unsigned transaction payloads for user-signed operations; admin operations signed by the governance signer.
- Document ingestion: upload session, ordered multipart proxy, streaming SHA-256, MinIO write with versioning, version record and outbox row in a single transaction, durable receipt.

**Exit:** first upload yields `D1/V1/H1` with a receipt that does not wait on OCR, Merkle or chain confirmation. `SRS-PERF-001` measurably satisfied.

### Phase 2.5 — Testing Frontend (week 3, parallel with Phase 3)

A developer-facing single-page application that exercises every backend endpoint and on-chain operation from the browser. Not a production portal — a QA/demo surface.

#### Screens

| Screen | Purpose | Backend endpoints exercised |
|---|---|---|
| **Dashboard** | Overview cards: identity count, document count, asset count, recent activity feed, pipeline health (batches pending/anchored) | `GET /stats`, `GET /audit/events?limit=20` |
| **Identity** | Register DID (EIP-4361 sign-in), view identity status, view bound account, display VC | `POST /identity`, `GET /identity/:didHash`, sign-in flow |
| **RBAC** | Grant/revoke roles (Admin only), view permission matrix per identity | `POST /roles/grant`, `POST /roles/revoke`, `GET /roles/:didHash` |
| **Assets** | Mint NFT (Admin), initial allocation (Admin), policy-controlled transfer, retire, view asset history. **Card grid with document thumbnail** — shows preview of uploaded image/PDF/file linked to asset. Fallback: file-type icon (📄/🖼️/📑) | `POST /assets/mint`, `POST /assets/allocate`, `POST /assets/transfer`, `GET /assets/:tokenId`, `GET /thumbnails/:versionId` |
| **Documents** | Upload file (streaming, progress bar), list documents, view version history, download version, view proof status with live state-machine badge (`UPLOADING → HASHED → BATCHED → ANCHORED → VERIFIABLE`). **Thumbnail preview** on document list cards + version history rows. Lightbox zoom on click | `POST /documents/upload`, `GET /documents`, `GET /documents/:id/versions`, `GET /documents/:id/versions/:vid/proof`, `GET /thumbnails/:versionId` |
| **Verification** | Pick a version → run full verify (hash check + inclusion proof + on-chain anchor), display step-by-step result with pass/fail per stage | `POST /verify/:versionId` |
| **Recovery** | Request recovery, view timelock countdown, cancel recovery (owner), finalise recovery | `POST /recovery/request`, `GET /recovery/:accountAddress`, `POST /recovery/cancel`, `POST /recovery/finalise` |
| **Audit** | Chronological event log with filters (event type, actor, date range), reconcile button comparing indexer vs chain | `GET /audit/events`, `GET /audit/reconcile` |

#### Design system

- Dark mode default, toggleable light mode.
- CSS custom properties for spacing scale, colour palette (slate/indigo/emerald/amber/rose), type scale, radius and shadow.
- Sidebar navigation with active-state indicator and role-based visibility (Admin sees RBAC; Auditor sees Audit; everyone sees Documents).
- Glassmorphism cards for dashboard stats.
- Status badges colour-coded to document state machine.
- Toast notifications for async events ("Batch anchored", "Recovery requested").
- Skeleton loaders during data fetch.
- Responsive: usable at 1024 px and above.

#### Wallet integration

- MetaMask / injected provider via wagmi.
- Auto-detect Amoy, prompt network switch if wrong chain.
- Display connected address, truncated, with Jazzicon identicon.
- Sign-in flow: EIP-4361 message → signature → session token stored in `httpOnly` cookie.

#### Key implementation details

- Vite dev server proxies `/api` to `gateway:3000`.
- All API calls go through the generated TypeScript client from `packages/api-spec` — no hand-written fetch calls.
- Contract reads (asset ownership, anchor roots) go through viem public client pointed at Amoy RPC.
- Upload uses `XMLHttpRequest` for progress events (not `fetch`).
- File drag-and-drop zone with MIME/size validation matching backend limits.
- Real-time pipeline status via polling (`@tanstack/react-query` with 5 s refetch on document detail).

**Exit:** every backend endpoint and every contract interaction from `test.md` golden scenario can be triggered from the browser. Upload → verify round-trip works end to end.

### Phase 3 — Asynchronous pipeline (week 3 to week 4)

- Outbox dispatcher, OCR worker, **thumbnail worker**, proof worker, Merkle batcher, anchor worker.
- **Thumbnail worker:** picks up `HASHED` versions from outbox → detects MIME → generates 256 px WebP preview:
  - Images (JPEG/PNG/WebP/TIFF/BMP): `sharp` resize + format convert.
  - PDF: `pdf-poppler` extracts page 1 as PNG → `sharp` resize.
  - Unsupported MIME: marks `thumbnails.status = UNSUPPORTED`, frontend falls back to file-type icon.
  - Output written to MinIO `thumbnails` bucket, keyed `{version_id}.webp`. Row inserted into `thumbnails` table.
  - Failure → retry 3×, then `FAILED` status + DLQ entry. Non-blocking: thumbnail failure never blocks proof pipeline.
- Anchor worker: multi-RPC failover, nonce management, receipt polling, restart reconciliation of in-flight transactions, DLQ with an admin requeue path.
- State machine enforced as a guarded transition table; per-stage metrics and structured logs.

**Exit:** `UPLOADING → … → VERIFIABLE` completes end to end on Amoy; killing any worker mid-flight loses no work and creates no duplicate version.

### Phase 4 — Read, verification and audit (week 4)

- Indexer: checkpointed log polling, confirmation depth for reorg safety, idempotent upserts, full rebuild-from-chain command.
- Read API: latest resolution, version fetch, audit history, `GET /audit/reconcile` comparing indexer state against direct RPC reads to satisfy `TC-013` and `AUDIT-001`.
- Verifier library and CLI: exact MinIO object → SHA-256 → inclusion proof → root → on-chain anchor, with no dependency on the application services. Auditor evidence bundle export.

**Exit:** `verify V1` and `verify V2` both report `VALID` after V2 exists; a single flipped byte reports `HASH_MISMATCH`; a tampered indexer row is reported by the reconcile endpoint while chain state stays authoritative.

### Phase 5 — Recovery and hardening (week 5)

- Recovery provider registry under multisig governance; request, timelock, owner veto, finalise; EIP-712 proof with nonce and expiry.
- All `test.md` §12 and §18 recovery cases, including replay, wrong subject, unregistered provider and unauthorised registration.
- Security suite: object authorisation, path traversal, malicious upload, contract bypass attempts, and a calldata/event scan asserting no document bytes ever reach the chain.
- k6 performance runs against §7; failure injection for MinIO, queue, RPC, indexer and process restart.

**Exit:** every recovery abuse test fails safely; historical hashes, versions, roots and anchors are provably unchanged after a successful recovery.

### Phase 6 — Demo and release gate (week 6)

- `tools/seed-demo` drives the corrected golden scenario: Admin creates the DID identity, verifies cryptographic control, assigns the USER role, mints the asset, **Admin performs the initial allocation**, an unauthorised operation reverts, a permission change is made, an authorised **Manager transfer** succeeds, V1 and V2 are uploaded and anchored, latest returns V2, credential loss is simulated, recovery restores access, and the Auditor reconstructs the whole history.
- Traceability matrix generated from test names: every mandatory requirement ID maps to at least one passing test, enforced in CI per the `test.md` §19 release gate.
- Runbooks: deployment, key handling, DLQ replay, indexer rebuild, disaster recovery.

**Exit:** release gate checklist fully green.

---

## 9. Requirement coverage map

| Requirement group | Phase | Primary artifacts |
|---|---|---|
| `SRS-ID-001…005` DID identity | 1, 2 | `IdentityRegistry`, identity service, DID/VC helpers |
| `SRS-RBAC-001…005` | 1, 2 | `RolePermissionRegistry`, policy enforcement point |
| `SRS-ASSET-001…006` | 1, 2 | `EnterpriseAssetNFT`, `AssetGovernance` |
| `SRS-DOC-001…010` | 2 | Ingestion path, `document_versions` |
| `SRS-PROOF-001…006` | 3 | Proof worker, batcher, anchor worker, `DocumentAnchorRegistry` |
| `SRS-VER-001…003` | 4 | Read API, verifier library and CLI |
| `SRS-AUD-001` | 1, 4 | Contract events, indexer, reconcile endpoint |
| `SRS-SEC-001`, `SRS-CONF-001…004` | 1, 2, 5 | Contract authorisation, MinIO policy, encryption, security suite |
| `SRS-REC-001…005` | 5 | Recovery registry and smart account |
| `SRS-PERF-001` | 2, 5 | Non-blocking receipt, k6 measurements |

---

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Frontend and backend contracts drift while both are built in parallel | High | OpenAPI spec frozen in Phase 0, generated client is the only integration path, breaking changes require a version bump and a note to the frontend team |
| Merkle encoding mismatch between contract, backend and verifier | High | One shared `packages/merkle` used by all three, plus a cross-check test that verifies the same proof on-chain and off-chain |
| Amoy congestion or RPC instability during the demo | High | Multiple approved RPC providers, anchor retry with reconciliation, and a pre-anchored fallback dataset for the live demo |
| ERC-7947 is a draft, so the interface may shift | Medium | Interface pinned verbatim in ADR-005; recovery logic isolated behind an adapter |
| Proxy ingestion becomes a throughput bottleneck | Medium | Bounded concurrency and backpressure; direct-to-MinIO with a read-back hash worker is the documented fallback |
| Scope creep from the eight duplicated normative blocks | Medium | Single `NORMATIVE.md`, and every ticket must cite an SRS requirement ID |
| Governance keys mishandled in a hurry before the demo | High | Separate anchor and governance keys, never in source control, loaded from the secrets manager, with a documented rotation step |
| Testing frontend scope creep toward a production portal | Medium | Strict rule: frontend is a developer testing surface only. No custom branding, no i18n, no a11y audit. If the portal team needs a feature, they build it in the production frontend |

---

## 11. Immediate next actions

1. Confirm the resolutions to C1–C6 and the answers to G1–G12, especially the performance targets in §7.
2. Correct `SRS.md` §7 (Manager mint and transfer) and `test.md` §14 (Admin performs the initial allocation) so the specification stops contradicting itself.
3. Approve Phase 0 so the OpenAPI specification and mock server reach the frontend team within three days.
4. Provision Amoy funding for the governance and anchor keys, and pick the RPC providers to be treated as approved.
5. Confirm testing frontend scope (Phase 2.5) — screens, wallet flow, design constraints — so it stays a dev tool and doesn't drift toward production portal territory.
