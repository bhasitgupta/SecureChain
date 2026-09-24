# Security Policy — SECURECHAIN

## 🛡️ Supported Versions

We actively maintain and provide security updates for the following releases of SecureChain:

| Version | Supported | Status |
| :--- | :---: | :--- |
| **2.x.x (Current)** | ✅ | Active support & continuous auditing |
| **1.x.x** | ❌ | Deprecated |
| **< 1.0** | ❌ | Unsupported prototype |

---

## 🚨 Reporting a Vulnerability

### How to Report

If you discover an architectural security vulnerability or cryptographic defect in SecureChain, please report it directly via email to:

📧 **bhasitgupta@gmail.com**

> [!CAUTION]
> **DO NOT** disclose vulnerabilities publicly or open public GitHub issues for sensitive security defects. All reports must go through the private security channel.

### What to Include in Your Report

To help us investigate and patch vulnerabilities swiftly, please provide:

1. **Vulnerability Summary**: A concise description of the exploit vector or flaw.
2. **Impact & Severity**: Estimated impact on confidentiality, integrity, or system availability (e.g., CVSS estimate).
3. **Step-by-Step Reproduction**: Detailed proof-of-concept (PoC) scripts, transactions, or HTTP payloads to reproduce the issue.
4. **Target Component**: Specify whether the vulnerability affects:
   - Solidity Smart Contracts (`contracts/src/`)
   - Fastify Gateway API (`services/gateway/`)
   - Asynchronous Merkle Worker / Indexer (`services/workers/`, `services/indexer/`)
   - Confidential Storage & MinIO Encrypted Blobs
   - Web Client (`frontend/`)
5. **Remediation Suggestion**: If known, suggested patch or configuration hardening.

### Response & Patch Timeline

- **Initial Acknowledgment**: Within **24 to 48 hours**
- **Severity Triage & Impact Assessment**: Within **5 business days**
- **Status Updates**: Periodic email briefings every **7 days** until resolved
- **Resolution Target**: Critical exploits within **7 days**; standard issues within **30 days**

---

## 🎯 Security Scope

### In Scope

- **Smart Contract Layer**:
  - `IdentityAndAccessManager.sol`: Role escalation, DID manipulation, unauthorized access.
  - `EnterpriseAssetNFT.sol`: Unauthorized minting, asset seizure, transfer invariant violations.
  - `DocumentAnchorRegistry.sol`: Malicious Merkle root anchoring, front-running, batch tampering.
  - `RecoveryManager.sol`: Guardian quorum evasion, premature timelock bypass.
- **Microservices & API Gateway**:
  - REST API endpoint authentication & authorization bypasses (`/identity`, `/assets`, `/documents`, `/audit`).
  - Merkle tree proof forgery in `@securechain/merkle`.
  - Rate limiting evasion and Denial of Service on Fastify gateway.
- **Confidential Storage & Data Ingestion**:
  - MinIO S3 bucket traversal or leakage of plaintext unencrypted document blobs.
  - SQL injection or parameter pollution in PostgreSQL queries.
  - Redis BullMQ job injection or poisoning.
- **Client Application**:
  - Cross-Site Scripting (XSS), Content Security Policy bypasses, or wallet session hijack.

### Out of Scope

- Flaws in third-party blockchain RPC nodes (e.g. Polygon Amoy public node outages).
- Compromise of user's private keys or local browser extension malware (MetaMask, Coinbase Wallet).
- Physical access attacks on end-user machines.
- Distributed Denial of Service (DDoS) against testnet network infrastructure.

---

## 🔒 Implemented Security Protections

- **Zero Confidential Bytes On-Chain**: Documents remain encrypted in private storage; only cryptographic SHA-256 Merkle roots are committed to Polygon Amoy.
- **Non-Escalation RBAC Invariants**: Only verified `ADMIN` addresses can alter role matrices or execute root configurations.
- **Least Privilege Access**: Unassigned wallet connections are strictly locked to `USER` permissions.
- **Parameterized Database Queries**: Eliminates SQL injection across all audit and identity stores.
- **Strict CORS & Helmet Security Headers**: Hardened API gateway with origin validation and TLS headers.
- **4-Step Cryptographic Verification**: Byte-level SHA-256 recalculation, Merkle inclusion proof traversal, and on-chain root cross-referencing.

---

## ⚡ Vulnerability Severity Matrix

| Severity | Description | Examples | Target SLA |
| :--- | :--- | :--- | :---: |
| **CRITICAL** | Direct loss of governance, fund theft, or unauthorized minting | RBAC bypass to Admin, smart contract reentrancy, unauthenticated RCE | 7 Days |
| **HIGH** | Confidential data leakage or unauthorized state mutation | S3 bucket unauthorized read, Merkle proof collision, unauthorized asset transfer | 14 Days |
| **MEDIUM** | Limited impact vulnerabilities or configuration weakness | Missing rate limits, verbose error disclosure, gateway DoS | 30 Days |
| **LOW** | Minor information leakage or non-exploitable edge cases | Minor UI clickjacking, missing informative security headers | 45 Days |

---

## 🤝 Responsible Disclosure & Safe Harbor

We fully support responsible security researchers. If you follow these guidelines:

1. You act in good faith to identify vulnerabilities without disrupting service.
2. You do not access, view, or modify private user data or assets.
3. You allow reasonable time for remediation before any public disclosure.
4. You adhere to relevant cybersecurity legislation.

Then **SecureChain will not initiate legal action** against you, and will formally acknowledge your contribution in our Security Hall of Fame (upon your consent).

---

## 📬 Contact Information

- **Lead Security Contact**: Bhasit Gupta
- **Email**: [bhasitgupta@gmail.com](mailto:bhasitgupta@gmail.com)
- **Subject Prefix**: `[SECURITY] SecureChain Vulnerability Report`
- **PGP Key**: Available on request

---

<sub>© 2026 SecureChain · Immutably anchored. Forever provable. ⚡</sub>
