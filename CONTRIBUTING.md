# Contributing to SECURECHAIN (SIH-26125)

Thank you for your interest in contributing to **SECURECHAIN**! We welcome contributions from developers, researchers, auditors, and community members of all backgrounds.

Please take a few moments to review this guide before submitting issues or pull requests.

---

## 📜 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [Reporting Security Issues](#-reporting-security-issues)
3. [How Can I Contribute?](#-how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Submitting Pull Requests](#submitting-pull-requests)
4. [Development Environment Setup](#-development-environment-setup)
5. [Monorepo Structure](#-monorepo-structure)
6. [Coding Standards & Commit Conventions](#-coding-standards--commit-conventions)
7. [Testing & Verification](#-testing--verification)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **bhasitgupta@gmail.com**.

---

## 🛡️ Reporting Security Issues

> [!CAUTION]
> **DO NOT** open public GitHub issues for security vulnerabilities or cryptographic defects.
> 
> Please follow our [Security Policy](SECURITY.md) and report vulnerabilities privately to **bhasitgupta@gmail.com**.

---

## 💡 How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:
1. Search existing GitHub Issues to see if the problem has already been reported.
2. Verify you are using the latest version on the `main` branch.

When opening an issue, please include:
- A clear, descriptive title.
- Steps to reproduce the behavior.
- Expected vs. actual behavior.
- Environment details (Node.js version, browser, OS, connected MetaMask wallet network).
- Relevant terminal or console error logs.

### Suggesting Enhancements

Feature requests are tracked as GitHub Issues. When suggesting enhancements:
- Use a clear and descriptive title.
- Explain the motivation and use case behind the feature.
- Describe how the proposed feature fits into SECURECHAIN's Zero-Knowledge and on-chain architecture.

### Submitting Pull Requests

1. **Fork** the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Make your changes**: Adhere to existing coding styles and architectural patterns.
4. **Ensure clean compilation and tests**:
   ```bash
   npm run build
   ```
5. **Commit your changes**: Use [Conventional Commits](#-coding-standards--commit-conventions).
6. **Push to your fork** and submit a **Pull Request** to `main`.
7. Fill out the PR description with:
   - Summary of changes
   - Associated issue numbers (`Fixes #123`)
   - Verification steps and screenshots/recordings for UI changes.

---

## 🛠️ Development Environment Setup

### Prerequisites

- **Node.js**: `v20.x` or `v22.x`
- **npm**: `v10+`
- **Docker & Docker Compose** (for MinIO, PostgreSQL, Redis)
- **MetaMask or Web3 Wallet** (configured with Polygon Amoy Testnet RPC)

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhasitgupta/SIH-26125.git
   cd SIH-26125
   ```

2. **Install root & workspace dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in necessary keys:
   ```bash
   cp .env.example .env
   ```

4. **Start Infrastructure Services**:
   ```bash
   npm run infra:up
   ```

5. **Start Dev Servers**:
   ```bash
   # Start frontend client
   npm run dev:frontend

   # Start Fastify backend gateway
   npm run dev:backend

   # Start async workers and indexer
   npm run dev:workers
   npm run dev:indexer
   ```

---

## 📂 Monorepo Structure

```text
SIH-26125/
├── contracts/               # Solidity smart contracts & Foundry/Hardhat configs
├── frontend/                # React 19 + Vite web client & HUD interface
├── services/
│   ├── gateway/             # Fastify REST microservice API
│   ├── indexer/             # Polygon blockchain log listener
│   └── workers/             # Asynchronous streaming Merkle batch processor
├── packages/
│   ├── common/              # Shared schemas, DIDs, and TypeScript types
│   ├── contracts/           # Generated typed contract ABIs
│   └── merkle/              # High-throughput Merkle tree algorithms
└── infra/                   # Docker Compose & container configurations
```

---

## 📐 Coding Standards & Commit Conventions

### Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clear and automated changelogs:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation updates
- `refactor:` Code restructuring without behavioral change
- `perf:` Performance improvements
- `test:` Adding or fixing test suites
- `chore:` Dependency bumps, CI/CD, or repository maintenance

*Example:* `feat(rbac): add polygon amoy wallet network switch confirmation`

### Code Quality

- **TypeScript**: Strict type-safety across all packages and services. Avoid `any`.
- **Solidity**: Adhere to OpenZeppelin standard design patterns, strict access controls, and reentrancy protection.
- **Frontend**: Clean component architecture, accessible HTML semantics, and responsive design.

---

## 🧪 Testing & Verification

Before opening a pull request, run relevant verification scripts:

```bash
# Verify on-chain status
npm run onchain:status

# Run smoke test suite
npm run onchain:smoke

# Frontend build verification
npm run build
```

---

## ⚖️ License

By contributing to SECURECHAIN, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
