// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityAndAccessManager
 * @notice Unified DID identity registry + RBAC + permission bitmask system
 *
 * Merges: IdentityRegistry + RolePermissionRegistry
 *
 * Invariants:
 *   - Only ADMIN can grant/revoke roles
 *   - 1:1 account ↔ DID mapping
 *   - AUDITOR never mutates operational state (enforced by consumers)
 */
contract IdentityAndAccessManager {
    // ─── Roles ───────────────────────────────────────────────────────
    bytes32 public constant ADMIN_ROLE    = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE  = keccak256("MANAGER_ROLE");
    bytes32 public constant AUDITOR_ROLE  = keccak256("AUDITOR_ROLE");
    bytes32 public constant USER_ROLE     = keccak256("USER_ROLE");

    // ─── Permission bits ─────────────────────────────────────────────
    uint256 public constant PERM_MINT     = 1 << 0;
    uint256 public constant PERM_ALLOCATE = 1 << 1;
    uint256 public constant PERM_TRANSFER = 1 << 2;
    uint256 public constant PERM_ANCHOR   = 1 << 3;
    uint256 public constant PERM_AUDIT    = 1 << 4;

    // ─── Identity types ──────────────────────────────────────────────
    enum IdentityStatus { Inactive, Active, Suspended, Revoked }

    struct IdentityRecord {
        bytes32 didHash;
        address account;
        string  subjectId;
        IdentityStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    // ─── Storage ─────────────────────────────────────────────────────
    mapping(bytes32 => mapping(address => bool)) private _roles;
    mapping(bytes32 => uint256) private _rolePerms;

    mapping(bytes32 => IdentityRecord) private _ids;
    mapping(address => bytes32) private _acctToDid;

    // ─── Events ──────────────────────────────────────────────────────
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event PermissionUpdated(bytes32 indexed role, uint256 newPerms, address indexed sender);

    event IdentityRegistered(bytes32 indexed didHash, address indexed account, string subjectId);
    event AccountBound(bytes32 indexed didHash, address indexed oldAcct, address indexed newAcct);
    event IdentityStatusChanged(bytes32 indexed didHash, IdentityStatus oldStatus, IdentityStatus newStatus);

    // ─── Modifiers ───────────────────────────────────────────────────
    modifier onlyAdmin() {
        require(_roles[ADMIN_ROLE][msg.sender], "IAM: not admin");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────
    constructor(address initialAdmin) {
        require(initialAdmin != address(0), "IAM: zero admin");

        _roles[ADMIN_ROLE][initialAdmin] = true;
        emit RoleGranted(ADMIN_ROLE, initialAdmin, msg.sender);

        // Default permission matrix per spec §2.8
        _rolePerms[ADMIN_ROLE]   = PERM_MINT | PERM_ALLOCATE | PERM_TRANSFER | PERM_ANCHOR | PERM_AUDIT;
        _rolePerms[MANAGER_ROLE] = PERM_TRANSFER | PERM_AUDIT;
        _rolePerms[AUDITOR_ROLE] = PERM_AUDIT;
        _rolePerms[USER_ROLE]    = PERM_TRANSFER;
    }

    // ═══════════════════ RBAC ═══════════════════════════════════════
    function hasRole(bytes32 role, address acct) public view returns (bool) {
        return _roles[role][acct];
    }

    function getPermissions(bytes32 role) external view returns (uint256) {
        return _rolePerms[role];
    }

    function hasPermission(address acct, uint256 bit) public view returns (bool) {
        bytes32[4] memory r = [ADMIN_ROLE, MANAGER_ROLE, AUDITOR_ROLE, USER_ROLE];
        for (uint256 i; i < 4; i++) {
            if (_roles[r[i]][acct] && (_rolePerms[r[i]] & bit) != 0) return true;
        }
        return false;
    }

    function grantRole(bytes32 role, address acct) external onlyAdmin {
        require(acct != address(0), "IAM: zero addr");
        require(!_roles[role][acct], "IAM: already granted");
        _roles[role][acct] = true;
        emit RoleGranted(role, acct, msg.sender);
    }

    function revokeRole(bytes32 role, address acct) external onlyAdmin {
        require(_roles[role][acct], "IAM: not held");
        _roles[role][acct] = false;
        emit RoleRevoked(role, acct, msg.sender);
    }

    function updateRolePermissions(bytes32 role, uint256 perms) external onlyAdmin {
        _rolePerms[role] = perms;
        emit PermissionUpdated(role, perms, msg.sender);
    }

    // ═══════════════════ IDENTITY ═══════════════════════════════════
    function registerIdentity(bytes32 didHash, address acct, string calldata subjectId) external {
        require(didHash != bytes32(0), "IAM: zero didHash");
        require(acct != address(0), "IAM: zero acct");
        require(_ids[didHash].didHash == bytes32(0), "IAM: already registered");
        require(_acctToDid[acct] == bytes32(0), "IAM: acct already bound");

        bool isAdmin = _roles[ADMIN_ROLE][msg.sender];
        require(msg.sender == acct || isAdmin, "IAM: unauthorized");

        _ids[didHash] = IdentityRecord({
            didHash: didHash,
            account: acct,
            subjectId: subjectId,
            status: IdentityStatus.Active,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        _acctToDid[acct] = didHash;

        emit IdentityRegistered(didHash, acct, subjectId);
        emit IdentityStatusChanged(didHash, IdentityStatus.Inactive, IdentityStatus.Active);
    }

    function bindAccount(bytes32 didHash, address newAcct) external {
        require(newAcct != address(0), "IAM: zero newAcct");
        require(_acctToDid[newAcct] == bytes32(0), "IAM: newAcct bound");
        IdentityRecord storage rec = _ids[didHash];
        require(rec.status == IdentityStatus.Active, "IAM: not active");

        bool isAdmin = _roles[ADMIN_ROLE][msg.sender];
        require(msg.sender == rec.account || isAdmin, "IAM: unauthorized");

        address old = rec.account;
        delete _acctToDid[old];
        rec.account = newAcct;
        rec.updatedAt = block.timestamp;
        _acctToDid[newAcct] = didHash;

        emit AccountBound(didHash, old, newAcct);
    }

    function updateIdentityStatus(bytes32 didHash, IdentityStatus s) external onlyAdmin {
        IdentityRecord storage rec = _ids[didHash];
        require(rec.didHash != bytes32(0), "IAM: not found");
        IdentityStatus old = rec.status;
        rec.status = s;
        rec.updatedAt = block.timestamp;
        emit IdentityStatusChanged(didHash, old, s);
    }

    function getIdentity(bytes32 didHash) external view returns (IdentityRecord memory) {
        require(_ids[didHash].didHash != bytes32(0), "IAM: not found");
        return _ids[didHash];
    }

    function getDidByAccount(address acct) external view returns (bytes32) {
        return _acctToDid[acct];
    }

    function isIdentityActive(bytes32 didHash) external view returns (bool) {
        return _ids[didHash].status == IdentityStatus.Active;
    }
}
