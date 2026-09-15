// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./IdentityAndAccessManager.sol";

/**
 * @title EnterpriseAssetNFT
 * @notice ERC-721 asset NFT with built-in governance (allocation, transfer, retirement)
 *
 * Merges: EnterpriseAssetNFT + AssetGovernance
 *
 * Invariants:
 *   1. Only ADMIN can mint
 *   2. Only ADMIN can perform initial allocation
 *   3. tokenId never reused (monotonic)
 *   4. AUDITOR cannot mutate any operational state
 */
contract EnterpriseAssetNFT {
    // ─── ERC-721 events ──────────────────────────────────────────────
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // ─── Business events ─────────────────────────────────────────────
    event AssetMinted(uint256 indexed tokenId, bytes32 indexed didHash, string assetClass);
    event AssetAllocated(uint256 indexed tokenId, address indexed to, bytes32 indexed toDidHash, address actor);
    event AssetTransferAuthorized(uint256 indexed tokenId, address indexed from, address indexed to, address actor);
    event AssetRetired(uint256 indexed tokenId, string reason, address actor);

    // ─── Types ───────────────────────────────────────────────────────
    enum AssetStatus { Uninitialized, Active, Transferred, Retired }

    struct AssetRecord {
        uint256 tokenId;
        bytes32 didHash;
        string  assetClass;
        AssetStatus status;
        string  metadataURI;
        uint256 mintedAt;
    }

    // ─── State ───────────────────────────────────────────────────────
    string public name;
    string public symbol;
    IdentityAndAccessManager public immutable iam;

    uint256 private _nextId = 1;
    mapping(uint256 => AssetRecord) private _assets;
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _approvals;
    mapping(address => mapping(address => bool)) private _opApprovals;

    // ─── Modifiers ───────────────────────────────────────────────────
    modifier onlyAdmin() {
        require(iam.hasRole(iam.ADMIN_ROLE(), msg.sender), "NFT: not admin");
        _;
    }

    modifier notAuditor() {
        require(!iam.hasRole(iam.AUDITOR_ROLE(), msg.sender), "NFT: auditor cannot mutate");
        _;
    }

    constructor(string memory _name, string memory _symbol, address _iam) {
        require(_iam != address(0), "NFT: zero IAM");
        name = _name;
        symbol = _symbol;
        iam = IdentityAndAccessManager(_iam);
    }

    // ═══════════════════ MINT (Admin only) ══════════════════════════
    function mint(
        address to,
        bytes32 didHash,
        string calldata assetClass,
        string calldata metadataURI
    ) external onlyAdmin returns (uint256 tokenId) {
        require(to != address(0), "NFT: mint to zero");
        require(didHash != bytes32(0), "NFT: zero didHash");

        tokenId = _nextId++;
        _owners[tokenId] = to;
        _balances[to] += 1;

        _assets[tokenId] = AssetRecord({
            tokenId: tokenId,
            didHash: didHash,
            assetClass: assetClass,
            status: AssetStatus.Active,
            metadataURI: metadataURI,
            mintedAt: block.timestamp
        });

        emit Transfer(address(0), to, tokenId);
        emit AssetMinted(tokenId, didHash, assetClass);
    }

    // ═══════════════════ GOVERNANCE ═════════════════════════════════

    /// @notice Initial allocation — Admin only
    function allocateInitial(uint256 tokenId, address to, bytes32 toDidHash) external onlyAdmin {
        require(to != address(0) && toDidHash != bytes32(0), "NFT: zero target");
        require(iam.isIdentityActive(toDidHash), "NFT: target identity inactive");

        address from = ownerOf(tokenId);
        _transfer(from, to, tokenId);
        _assets[tokenId].didHash = toDidHash;

        emit AssetAllocated(tokenId, to, toDidHash, msg.sender);
    }

    /// @notice Policy-controlled transfer — Admin, Manager, or asset owner
    function authorizeTransfer(
        uint256 tokenId,
        address from,
        address to,
        bytes32 toDidHash
    ) external notAuditor {
        bool isAdmin   = iam.hasRole(iam.ADMIN_ROLE(), msg.sender);
        bool isManager = iam.hasRole(iam.MANAGER_ROLE(), msg.sender);
        bool isOwner   = (msg.sender == from && _owners[tokenId] == from);
        require(isAdmin || isManager || isOwner, "NFT: unauthorized transfer");
        require(to != address(0) && toDidHash != bytes32(0), "NFT: zero target");
        require(iam.isIdentityActive(toDidHash), "NFT: target identity inactive");

        _transfer(from, to, tokenId);
        _assets[tokenId].didHash = toDidHash;
        _assets[tokenId].status = AssetStatus.Transferred;

        emit AssetTransferAuthorized(tokenId, from, to, msg.sender);
    }

    /// @notice Retire asset — Admin only
    function retireAsset(uint256 tokenId, string calldata reason) external onlyAdmin {
        require(_owners[tokenId] != address(0), "NFT: nonexistent");
        _assets[tokenId].status = AssetStatus.Retired;
        emit AssetRetired(tokenId, reason, msg.sender);
    }

    // ═══════════════════ ERC-721 READS ══════════════════════════════
    function ownerOf(uint256 tokenId) public view returns (address o) {
        o = _owners[tokenId];
        require(o != address(0), "NFT: nonexistent");
    }

    function balanceOf(address o) external view returns (uint256) {
        require(o != address(0), "NFT: zero addr query");
        return _balances[o];
    }

    function getAsset(uint256 tokenId) external view returns (AssetRecord memory) {
        require(_owners[tokenId] != address(0), "NFT: nonexistent");
        return _assets[tokenId];
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_owners[tokenId] != address(0), "NFT: nonexistent");
        return _assets[tokenId].metadataURI;
    }

    // ═══════════════════ ERC-721 TRANSFERS ══════════════════════════
    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "NFT: not authorized");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata) external {
        transferFrom(from, to, tokenId);
    }

    function approve(address to, uint256 tokenId) external {
        address o = ownerOf(tokenId);
        require(msg.sender == o || _opApprovals[o][msg.sender], "NFT: not authorized");
        _approvals[tokenId] = to;
        emit Approval(o, to, tokenId);
    }

    function setApprovalForAll(address op, bool ok) external {
        _opApprovals[msg.sender][op] = ok;
        emit ApprovalForAll(msg.sender, op, ok);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        require(_owners[tokenId] != address(0), "NFT: nonexistent");
        return _approvals[tokenId];
    }

    function isApprovedForAll(address o, address op) external view returns (bool) {
        return _opApprovals[o][op];
    }

    function supportsInterface(bytes4 id) external pure returns (bool) {
        return id == 0x80ac58cd || id == 0x5b5e139f || id == 0x01ffc9a7;
    }

    // ─── Internal ────────────────────────────────────────────────────
    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "NFT: wrong owner");
        require(to != address(0), "NFT: to zero");
        delete _approvals[tokenId];
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address s, uint256 tokenId) internal view returns (bool) {
        address o = ownerOf(tokenId);
        return s == o || _approvals[tokenId] == s || _opApprovals[o][s];
    }
}
