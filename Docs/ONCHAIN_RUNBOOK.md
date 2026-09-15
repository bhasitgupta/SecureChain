# SecureChain (SIH26125) — On-Chain Runbook

Comprehensive operations guide for Polygon Amoy on-chain infrastructure and service orchestration.

---

## 1. Startup & Deployment Order

Run commands in this exact sequence from repository root:

```bash
# 1. Start storage, database, and cache infrastructure (Docker)
npm run infra:up

# 2. Verify blockchain connectivity and contract readiness
npm run onchain:status

# 3. Execute idempotent on-chain bootstrapping (sends gas txs if not already initialized)
npm run onchain:bootstrap

# 4. Verify on-chain state with zero-gas read-only assertions
npm run onchain:smoke

# 5. Launch Fastify Gateway Relayer Service (Port 3001)
npm run dev:backend

# 6. Launch Vite Frontend Application (Port 3000 / 5173)
npm run dev:frontend
```

---

## 2. Environment Configuration Matrix

| Variable | Local Development | Vercel Production | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | `https://api.yourdomain.com/api` | Gateway backend API base URL |
| `VITE_NETWORK_NAME` | `Polygon Amoy Testnet` | `Polygon Amoy Testnet` | Network name for wallet prompt |
| `VITE_CHAIN_ID` | `80002` | `80002` | Polygon Amoy EIP-155 Chain ID |
| `VITE_RPC_URL` | `https://polygon-amoy.drpc.org` | `https://polygon-amoy.drpc.org` | Public RPC endpoint |
| `VITE_BLOCK_EXPLORER` | `https://amoy.polygonscan.com` | `https://amoy.polygonscan.com` | Block explorer base URL |
| `VITE_CONTRACT_IAM` | `0x0Ca09ba889727bE9FbBAA53d2fE1541bF2f8cee6` | Same | Identity & Access Manager |
| `VITE_CONTRACT_NFT` | `0xE97E0ea3a452a5099fd126721Db0DAfa96455e7D` | Same | Enterprise Asset NFT |
| `VITE_CONTRACT_ANCHOR` | `0x8921960116d0D4a8A26aad7eA330E3f098C7F58F` | Same | Document Anchor Registry |
| `VITE_CONTRACT_RECOVERY` | `0xf3F590b6DFA67a8453c62C8E065cdb5127518b90` | Same | Social Recovery Manager |
| `ADMIN_PRIVATE_KEY` | Hex private key | Secret Environment Var | Relayer signer key holding ADMIN_ROLE |
| `DATABASE_URL` | `postgresql://sih:sih26125@localhost:5433/sih26125` | Managed Postgres connection string | Metadata & cache database |
| `REDIS_URL` | `redis://localhost:6379` | Managed Redis URL | Cache & pubsub queue |
| `CORS_ORIGINS` | Comma-delimited origins | `https://your-app.vercel.app` | Allowed frontend origins for CORS |

---

## 3. Interpreting `npm run onchain:status`

| Diagnostic Check | Target Expected | Failure Cause & Remedy |
|---|---|---|
| **RPC Connectivity** | Chain ID 80002 | RPC endpoint down/rate-limited. Update `POLYGON_RPC_URL` to alternate (e.g. `https://polygon-amoy.drpc.org`). |
| **Contract Bytecode** | > 0 bytes per contract | Contract address incorrect or undeployed on target chain. |
| **Relayer Balance** | > 0.01 POL | Relayer depleted. Faucet needed from `faucet.polygon.technology`. |
| **Relayer Admin Role** | `true` | Relayer address lacks `ADMIN_ROLE` on `IAM_ADDRESS`. |
| **Inter-Contract Wiring** | `.iam() == IAM_ADDRESS` | NFT, Anchor, or Recovery pointing to mismatching IAM. Redeploy with `deploy.mjs`. |

---

## 4. Key Architectural Models

1. **Relayer Signing Model**:
   - Web browser never holds admin private keys or pays gas for enterprise actions.
   - Admin connects wallet and signs an off-chain SIWE (Sign-In with Ethereum) authentication challenge.
   - Fastify Gateway validates signature, checks caller's role on-chain via `IdentityAndAccessManager.hasRole()`, and issues an httpOnly JWT session.
   - Authorized actions (`/mint`, `/allocate`, `/transfer`, `/roles/grant`) are dispatched by the configured relayer wallet.

2. **Pre-Flight Validation**:
   - Gateway routes call `contract.method.staticCall(...)` before broadcasting transactions to capture explicit revert errors (e.g. `"NFT: target identity inactive"`, `"IAM: unauthorized"`) without consuming gas or dropping failed transactions on-chain.

3. **Authoritative On-Chain Truth**:
   - Roles in the UI reflect actual on-chain permissions queried directly from the contract or gateway cache, flagged with `✔ On-Chain` badges.

---

## 5. Emergency Procedures

### Relayer Gas Depletion
If `npm run onchain:status` flags low relayer balance:
1. Copy relayer address: `0xFF00D19Db6668537116Ecda91ac07Fa448A2223e`
2. Request testnet POL from Polygon Amoy Faucet: `https://faucet.polygon.technology/`
3. Re-run `npm run onchain:status` to verify new balance.

### Contract Redeployment
If deploying a new suite of contracts:
```bash
node scripts/deploy.mjs
```
Then update the contract addresses in root `.env` and `frontend/.env`, followed by:
```bash
npm run onchain:bootstrap
```

---

## 6. Security Notice
- `ADMIN_PRIVATE_KEY` must never be checked into public repositories or exposed to client-side bundles.
- `VITE_*` environment variables are embedded into frontend assets at build time and are public.
