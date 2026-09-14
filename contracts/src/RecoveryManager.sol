// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityAndAccessManager.sol";

/**
 * @title RecoveryManager
 * @notice Unified recovery system: provider registry + ERC-7947 smart account recovery
 *         w/ EIP-712 proof, timelock, owner veto, nonce replay protection
 *
 * Merges: MultisigGuard + RecoveryProviderRegistry + RecoveryAwareSmartAccount
 *
 * Invariants:
 *   - Recovery cannot finalize before timelock expires
 *   - Nonce never accepted twice
 *   - Only governance (admin) can register/remove providers
 */
contract RecoveryManager {
    // ─── EIP-712 ─────────────────────────────────────────────────────
    bytes32 private constant DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    bytes32 private constant RECOVERY_TYPEHASH =
        keccak256("RecoveryProof(address account,address proposedOwner,bytes32 nonce,uint256 deadline)");

    // ─── Provider Registry ───────────────────────────────────────────
    IdentityAndAccessManager public immutable iam;
    mapping(address => bool) public approvedProviders;

    event ProviderRegistered(address indexed provider);
    event ProviderRemoved(address indexed provider);

    // ─── Per-Account Recovery State ──────────────────────────────────
    struct AccountState {
        address owner;
        address pendingOwner;
        uint256 unlockTime;
        uint256 timelockDuration;
    }

    // smart account address → state (for factory-created accounts)
    // For simplicity: each user registers their account here
    mapping(address => AccountState) public accounts;
    mapping(bytes32 => bool) public usedNonces;

    event AccountRegistered(address indexed account, address indexed owner, uint256 timelockDuration);
    event RecoveryRequested(address indexed account, address indexed proposedOwner, bytes32 indexed nonce, uint256 unlockTime);
    event RecoveryCancelled(address indexed account, address indexed owner);
    event AccessRecovered(address indexed account, address indexed oldOwner, address indexed newOwner);
    event Executed(address indexed account, address indexed target, uint256 value);

    modifier onlyAdmin() {
        require(iam.hasRole(iam.ADMIN_ROLE(), msg.sender), "Recovery: not admin");
        _;
    }

    modifier onlyAccountOwner(address account) {
        require(accounts[account].owner == msg.sender, "Recovery: not account owner");
        _;
    }

    constructor(address _iam) {
        require(_iam != address(0), "Recovery: zero IAM");
        iam = IdentityAndAccessManager(_iam);
    }

    // ═══════════════════ PROVIDER REGISTRY ══════════════════════════
    function registerProvider(address provider) external onlyAdmin {
        require(provider != address(0), "Recovery: zero provider");
        require(!approvedProviders[provider], "Recovery: already approved");
        approvedProviders[provider] = true;
        emit ProviderRegistered(provider);
    }

    function removeProvider(address provider) external onlyAdmin {
        require(approvedProviders[provider], "Recovery: not approved");
        approvedProviders[provider] = false;
        emit ProviderRemoved(provider);
    }

    // ═══════════════════ ACCOUNT REGISTRATION ═══════════════════════
    /// @notice Register a smart account with this recovery manager
    function registerAccount(uint256 timelockDuration) external {
        require(accounts[msg.sender].owner == address(0), "Recovery: already registered");
        require(timelockDuration > 0, "Recovery: zero timelock");

        accounts[msg.sender] = AccountState({
            owner: msg.sender,
            pendingOwner: address(0),
            unlockTime: 0,
            timelockDuration: timelockDuration
        });

        emit AccountRegistered(msg.sender, msg.sender, timelockDuration);
    }

    // ═══════════════════ RECOVERY FLOW ══════════════════════════════
    function DOMAIN_SEPARATOR() public view returns (bytes32) {
        return keccak256(abi.encode(
            DOMAIN_TYPEHASH,
            keccak256("RecoveryManager"),
            keccak256("1"),
            block.chainid,
            address(this)
        ));
    }

    /**
     * @notice Request recovery w/ provider EIP-712 signature
     */
    function requestRecovery(
        address account,
        address proposedOwner,
        bytes32 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(proposedOwner != address(0), "Recovery: zero proposed");
        AccountState storage s = accounts[account];
        require(s.owner != address(0), "Recovery: account not registered");
        require(proposedOwner != s.owner, "Recovery: same owner");
        require(block.timestamp <= deadline, "Recovery: proof expired");
        require(!usedNonces[nonce], "Recovery: nonce replayed");

        // Verify EIP-712 sig from approved provider
        bytes32 structHash = keccak256(abi.encode(
            RECOVERY_TYPEHASH, account, proposedOwner, nonce, deadline
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), structHash));
        address signer = _recover(digest, signature);
        require(approvedProviders[signer], "Recovery: provider not approved");

        usedNonces[nonce] = true;
        s.pendingOwner = proposedOwner;
        s.unlockTime = block.timestamp + s.timelockDuration;

        emit RecoveryRequested(account, proposedOwner, nonce, s.unlockTime);
    }

    function cancelRecovery(address account) external onlyAccountOwner(account) {
        AccountState storage s = accounts[account];
        require(s.pendingOwner != address(0), "Recovery: nothing pending");

        s.pendingOwner = address(0);
        s.unlockTime = 0;

        emit RecoveryCancelled(account, msg.sender);
    }

    function finalizeRecovery(address account) external {
        AccountState storage s = accounts[account];
        require(s.pendingOwner != address(0), "Recovery: nothing pending");
        require(block.timestamp >= s.unlockTime, "Recovery: timelock active");

        address oldOwner = s.owner;
        address newOwner = s.pendingOwner;
        s.owner = newOwner;
        s.pendingOwner = address(0);
        s.unlockTime = 0;

        emit AccessRecovered(account, oldOwner, newOwner);
    }

    // ─── ECDSA recover (inline, no lib needed) ──────────────────────
    function _recover(bytes32 hash, bytes calldata sig) internal pure returns (address) {
        require(sig.length == 65, "Recovery: bad sig len");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 0x20))
            v := byte(0, calldataload(add(sig.offset, 0x40)))
        }
        require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "Recovery: bad s");
        address signer = ecrecover(hash, v, r, s);
        require(signer != address(0), "Recovery: invalid sig");
        return signer;
    }
}
