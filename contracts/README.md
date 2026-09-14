# SIH26125 — Smart Contract Suite (Consolidated)

4 contracts. Solidity 0.8.26. Zero external dependencies.

## Structure

```text
contracts/
├── src/
│   ├── IdentityAndAccessManager.sol   ← DID registry + RBAC + permissions
│   ├── EnterpriseAssetNFT.sol         ← ERC-721 + governance (mint/allocate/transfer/retire)
│   ├── DocumentAnchorRegistry.sol     ← Merkle root anchoring + inclusion verification
│   └── RecoveryManager.sol            ← Provider registry + ERC-7947 recovery + timelock
└── script/
    └── DeployAll.sol                  ← Deploy orchestrator
```

## Contract Map

| Contract | Merges | Key Invariants |
|---|---|---|
| `IdentityAndAccessManager` | IdentityRegistry + RolePermissionRegistry | Only ADMIN grants roles. 1:1 account↔DID. |
| `EnterpriseAssetNFT` | EnterpriseAssetNFT + AssetGovernance | Only ADMIN mints/allocates. AUDITOR cannot mutate. tokenId monotonic. |
| `DocumentAnchorRegistry` | standalone | batchId never reused. Roots immutable. Inline Merkle verify. |
| `RecoveryManager` | MultisigGuard + RecoveryProviderRegistry + RecoveryAwareSmartAccount | Nonce never replayed. Timelock must expire. Owner veto. |

## Deploy Order

```
1. IdentityAndAccessManager(adminAddress)
2. EnterpriseAssetNFT(name, symbol, iamAddress)
3. DocumentAnchorRegistry(iamAddress)
4. RecoveryManager(iamAddress)
```

## Dependency Graph

```
IdentityAndAccessManager (standalone)
        │
        ├──► EnterpriseAssetNFT
        ├──► DocumentAnchorRegistry
        └──► RecoveryManager
```

All 3 downstream contracts import IAM for auth. No circular deps.
