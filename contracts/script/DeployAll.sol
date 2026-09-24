// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../src/IdentityAndAccessManager.sol";
import "../src/EnterpriseAssetNFT.sol";
import "../src/DocumentAnchorRegistry.sol";
import "../src/RecoveryManager.sol";

/**
 * @title DeployAll
 * @notice Deploys the full SecureChain contract suite in correct dependency order
 */
contract DeployAll {
    struct Deployed {
        address iam;
        address nft;
        address anchor;
        address recovery;
    }

    event SuiteDeployed(Deployed addrs);

    function deploy(
        string memory nftName,
        string memory nftSymbol
    ) external returns (Deployed memory d) {
        // 1. Identity + Access Manager (RBAC + DID)
        IdentityAndAccessManager iam = new IdentityAndAccessManager(msg.sender);
        d.iam = address(iam);

        // 2. Enterprise Asset NFT (ERC-721 + governance)
        EnterpriseAssetNFT nft = new EnterpriseAssetNFT(nftName, nftSymbol, d.iam);
        d.nft = address(nft);

        // 3. Document Anchor Registry (Merkle roots)
        DocumentAnchorRegistry anchor = new DocumentAnchorRegistry(d.iam);
        d.anchor = address(anchor);

        // 4. Recovery Manager (provider registry + account recovery)
        RecoveryManager recovery = new RecoveryManager(d.iam);
        d.recovery = address(recovery);

        emit SuiteDeployed(d);
    }
}
