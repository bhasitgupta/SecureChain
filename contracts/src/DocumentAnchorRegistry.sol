// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityAndAccessManager.sol";

/**
 * @title DocumentAnchorRegistry
 * @notice On-chain Merkle root anchoring w/ duplicate batch rejection + inclusion proof verification
 *
 * Invariants:
 *   - batchId never reused
 *   - Anchored root never mutated
 */
contract DocumentAnchorRegistry {
    struct BatchRecord {
        bytes32 merkleRoot;
        uint256 leafCount;
        uint256 anchoredBlock;
        uint256 anchoredTime;
        address anchoredBy;
        bool    exists;
    }

    event MerkleRootAnchored(
        bytes32 indexed batchId,
        bytes32 indexed merkleRoot,
        uint256 leafCount,
        address indexed anchorer
    );

    IdentityAndAccessManager public immutable iam;
    mapping(bytes32 => BatchRecord) private _batches;

    constructor(address _iam) {
        require(_iam != address(0), "Anchor: zero IAM");
        iam = IdentityAndAccessManager(_iam);
    }

    function anchorBatch(bytes32 batchId, bytes32 root, uint256 leafCount) external {
        require(
            iam.hasRole(iam.ADMIN_ROLE(), msg.sender) || iam.hasPermission(msg.sender, iam.PERM_ANCHOR()),
            "Anchor: unauthorized"
        );
        require(batchId != bytes32(0) && root != bytes32(0) && leafCount > 0, "Anchor: bad input");
        require(!_batches[batchId].exists, "Anchor: duplicate batchId");

        _batches[batchId] = BatchRecord({
            merkleRoot: root,
            leafCount: leafCount,
            anchoredBlock: block.number,
            anchoredTime: block.timestamp,
            anchoredBy: msg.sender,
            exists: true
        });

        emit MerkleRootAnchored(batchId, root, leafCount, msg.sender);
    }

    /// @notice Verify leaf inclusion against anchored root (sorted-pair keccak256)
    function verifyProof(bytes32 batchId, bytes32[] calldata proof, bytes32 leaf) external view returns (bool) {
        BatchRecord memory b = _batches[batchId];
        if (!b.exists) return false;

        bytes32 hash = leaf;
        for (uint256 i; i < proof.length; i++) {
            bytes32 p = proof[i];
            hash = hash < p
                ? keccak256(abi.encodePacked(hash, p))
                : keccak256(abi.encodePacked(p, hash));
        }
        return hash == b.merkleRoot;
    }

    function getBatch(bytes32 batchId) external view returns (BatchRecord memory) {
        require(_batches[batchId].exists, "Anchor: not found");
        return _batches[batchId];
    }

    function isBatchAnchored(bytes32 batchId) external view returns (bool) {
        return _batches[batchId].exists;
    }
}
