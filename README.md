<div align="center">

![SecureChain Hero Banner](assets/hero-banner.svg)

# ⚡ SECURECHAIN (SIH-26125)
### *Next-Generation Zero-Knowledge Enterprise Identity, Verifiable Asset Ownership & Document Provenance Engine*

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=DC2626&center=true&vCenter=true&width=650&lines=Zero-Knowledge+Enterprise+Identity;Cryptographic+Document+Provenance;Immutable+Merkle+Roots+on+Polygon+Amoy;ERC-721+Monitored+Asset+NFTs;Cryptographic+RBAC+Governance)](https://github.com/bhasitgupta/SIH-26125)

<p align="center">
  <img src="https://img.shields.io/badge/Network-Polygon_Amoy_80002-8247E5?style=flat-square&logo=polygon&logoColor=white" alt="Polygon Amoy">
  <img src="https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity&logoColor=white" alt="Solidity">
  <img src="https://img.shields.io/badge/Backend-Fastify_v5-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify">
  <img src="https://img.shields.io/badge/Frontend-React_19_Vite-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Storage-MinIO_S3-C72C48?style=flat-square&logo=minio&logoColor=white" alt="MinIO">
  <img src="https://img.shields.io/badge/Queue-Redis_BullMQ-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-00E676?style=flat-square" alt="MIT License"></a>
  <a href="SECURITY.md"><img src="https://img.shields.io/badge/Security-Policy_Active-DC2626?style=flat-square&logo=shield" alt="Security Policy"></a>
  <a href="CODE_OF_CONDUCT.md"><img src="https://img.shields.io/badge/Contributor_Covenant-2.1-4baaaa.svg?style=flat-square" alt="Code of Conduct"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="Contributing"></a>
</p>

<p align="center">
  <b>🔒 Confidential Storage</b> • <b>🌲 SHA-256 Merkle Batches</b> • <b>🛡️ W3C DID PKH</b> • <b>💎 Monotonic ERC-721 Assets</b> • <b>🔑 Social Recovery</b>
</p>

</div>

---

## 🌟 Executive Overview

**SecureChain** is an enterprise-grade trust engine architected to resolve the trilemma between **data privacy**, **cryptographic integrity**, and **regulatory compliance** in critical defense and public-sector operations.

### 🛡️ The Core Problem Solved:
1. **Zero Confidential Bytes On-Chain**: Sensitive enterprise documents are NEVER leaked onto the public blockchain. Original encrypted files remain securely partitioned in private S3/MinIO buckets.
2. **Deterministic Cryptographic Provenance**: Every document ingestion generates an on-the-fly streaming SHA-256 digest, sequenced into an immutable Merkle tree whose root is anchored directly onto Polygon Amoy.
3. **Smart Contract-Enforced RBAC**: Strict separation of concerns ensuring that only verified **ADMIN** principals can mint NFTs and grant roles, while **MANAGERS** and **AUDITORS** operate within cryptographically gated boundary contexts.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer ["🎨 High-Performance Web Client (React + Vite)"]
        UI["Landing & Dashboard HUD"]
        RBAC["RBAC Admin Panel"]
        DOCS["Confidential Ingestion"]
        VERIFY["4-Step Cryptographic Verifier"]
    end

    subgraph GatewayLayer ["⚡ API Gateway (Fastify + TypeScript)"]
        GW["REST API Gateway (:3001)"]
        AUTH["DID Session & Role Guard"]
    end

    subgraph StorageLayer ["💾 Enterprise Storage & Cache"]
        DB[("PostgreSQL 16\n(Audit Trails & Metadata)")]
        MINIO[("MinIO S3\n(Encrypted Blobs)")]
        REDIS[("Redis 7\n(BullMQ Event Streams)")]
    end

    subgraph ProcessingLayer ["⚙️ Asynchronous Batch Pipeline"]
        WORKER["Background Workers\n(Streaming SHA-256 + Merkle Aggregator)"]
        INDEXER["Polygon Event Indexer\n(Live Re-Org Resilient Listener)"]
    end

    subgraph ChainLayer ["⛓️ Polygon Amoy Testnet (Chain ID 80002)"]
        IAM["IdentityAndAccessManager.sol\n(Role & DID Registry)"]
        NFT["EnterpriseAssetNFT.sol\n(Monotonic Monitored Assets)"]
        ANCHOR["DocumentAnchorRegistry.sol\n(Merkle Root Anchor)"]
        RECOVER["RecoveryManager.sol\n(Guardian Quorum Social Recovery)"]
    end

    UI -->|JSON-RPC / REST| GW
    DOCS -->|Streaming Multipart| GW
    GW --> MINIO
    GW --> DB
    GW --> REDIS
    REDIS --> WORKER
    WORKER --> ANCHOR
    INDEXER -->|Polls Logs| ChainLayer
    INDEXER --> DB
    VERIFY -->|Proof Verification| GW
    GW --> ChainLayer
```

---

## 🔐 Smart Contracts Suite

| Contract | Functionality | Invariants Enforced |
| :--- | :--- | :--- |
| **`IdentityAndAccessManager.sol`** | Master W3C DID-to-Wallet registry and RBAC authority matrix. | Only `ADMIN` can grant/revoke roles. Strict 1:1 binding between Ethereum address and DID hash. |
| **`EnterpriseAssetNFT.sol`** | ERC-721 asset tokens representing serialized equipment. | Only `ADMIN` can invoke `mint` and `allocateInitial`. Transfers are policy-controlled. Auditing is strictly read-only. |
| **`DocumentAnchorRegistry.sol`** | Anchors cryptographic Merkle roots of batched document records. | Only authorized accounts can anchor batches. Roots are immutable once sealed. |
| **`RecoveryManager.sol`** | Time-locked guardian recovery protocol for lost enterprise keys. | Quorum threshold required (e.g. 2 of 3 registered guardians) with configurable timelock windows. |

---

## 🔬 4-Step Cryptographic Verification Protocol

Every document anchored in SecureChain undergoes an uncompromising mathematical audit:

```
[1. MINIO RETRIEVAL] ──► [2. STREAMING SHA-256] ──► [3. MERKLE PROOF] ──► [4. POLYGON SCAN]
  Fetch exact bytes         Compute sha256(bytes)       Verify hash against         Match anchored root
  from encrypted S3         against version record     Merkle inclusion path        on Polygon Amoy
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- **Node.js**: `v20.0.0+`
- **Docker & Docker Compose**: `v24+`
- **MetaMask or Web3 Wallet**: Configured for Polygon Amoy (`Chain ID: 80002`)

### 2. Clone & Install
```bash
git clone https://github.com/bhasitgupta/SIH-26125.git
cd SIH-26125

# Install dependencies across all workspaces
npm install
```

### 3. Launch Local Infrastructure (PostgreSQL, MinIO, Redis)
```bash
npm run infra:up
```
- **MinIO Console**: `http://localhost:9001` (User: `minioadmin` / Pass: `minioadmin`)
- **PostgreSQL**: `localhost:5432` (`sih:sih26125`)
- **Redis**: `localhost:6379`

### 4. Start Development Servers
```bash
# Terminal 1: Run High-Speed Frontend (Vite)
npm run dev

# Terminal 2: Run Microservices Gateway
npm run dev:backend

# Terminal 3: Run Batch Workers & Indexer
npm run dev:workers
npm run dev:indexer
```
- **Frontend HUD**: `http://localhost:5173`
- **Gateway API**: `http://localhost:3001`

---

## 🔑 Initial Admin Wallet Allocation

The contract suite and governance system enforce strict administrative authority:

```json
{
  "ADMIN_ROLE": [
    "0x8292040fb8adbe10333a74b2bf79ebfbf3b0e41c",
    "0xFF00D19Db6668537116Ecda91ac07Fa448A2223e"
  ]
}
```
*Note: Roles are bound cryptographically to wallet addresses. To assign or revoke roles, use the **Access Control (RBAC)** portal (`/rbac`). Full role mechanics are specified in [Docs/ROLE_MANAGEMENT_GUIDE.md](Docs/ROLE_MANAGEMENT_GUIDE.md).*

---

## 📚 Governance & Security Documentation

- 🛡️ [`SECURITY.md`](SECURITY.md) — Responsible disclosure policy & contact guidelines
- 📜 [`Docs/ROLE_MANAGEMENT_GUIDE.md`](Docs/ROLE_MANAGEMENT_GUIDE.md) — RBAC authority matrix, permission tiers, and wallet assignment guide
- 📐 [`Docs/TRD.md`](Docs/TRD.md) — Technical Requirements Document & Reference Architecture

---

## 📦 Monorepo Structure

```
SIH-26125/
├── assets/                  # Hero vector banners, circuit art & animated dividers
├── contracts/               # Solidity 0.8.20 Smart Contracts
│   ├── src/                 # Core contract implementations
│   └── script/              # Deployment automation scripts
├── frontend/                # High-Performance Cyberpunk React SPA (Vite)
│   ├── src/pages/           # Dashboard, RBAC, Assets, Verification, Documents
│   ├── src/components/      # Reusable HUD elements & Role-Bound Guards
│   └── src/lib/api.js       # Fastify Gateway integration client
├── services/
│   ├── gateway/             # Fastify REST microservice API
│   ├── indexer/             # Real-time Polygon blockchain log listener
│   └── workers/             # Asynchronous streaming Merkle batch processor
├── packages/
│   ├── common/              # Shared schemas, DIDs, and TypeScript types
│   ├── contracts/           # Generated typed contract ABIs
│   └── merkle/              # High-throughput Merkle tree algorithms
└── infra/                   # Docker Compose & container configurations
```

---

<div align="center">

  <img src="assets/section-divider.svg" alt="section divider" width="80%">

  <br>

  <h3>⚡ SIH-26125 — Immutably Anchored. Forever Provable.</h3>

  <p>
    <a href="https://github.com/bhasitgupta/SIH-26125"><img src="https://img.shields.io/badge/GitHub-bhasitgupta%2FSIH--26125-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
    <a href="mailto:bhasitgupta@gmail.com"><img src="https://img.shields.io/badge/Contact-Email-3B82F6?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
    <a href="SECURITY.md"><img src="https://img.shields.io/badge/Security-Policy-DC2626?style=for-the-badge&logo=shield&logoColor=white" alt="Security Policy"></a>
    <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributing-Guide-10B981?style=for-the-badge&logo=gitbook&logoColor=white" alt="Contributing"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge" alt="License"></a>
  </p>

  <p>
    <a href="#-securechain-sih-26125"><img src="https://img.shields.io/badge/Back_to_Top-%E2%96%B2-0B0E14?style=for-the-badge" alt="Back to top"></a>
  </p>

  <p>⭐ If you find this project useful, <b>give it a star</b>!</p>

  <sub>© 2026 SIH-26125 (SecureChain) · Immutably anchored. Forever provable. ⚡</sub>

</div>
