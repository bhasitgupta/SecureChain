export declare const IdentityAndAccessManagerAbi: readonly [{
    readonly name: "ADMIN_ROLE";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "MANAGER_ROLE";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "AUDITOR_ROLE";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "USER_ROLE";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "PERM_MINT";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "PERM_ALLOCATE";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "PERM_TRANSFER";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "PERM_ANCHOR";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "PERM_AUDIT";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "hasRole";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
    }, {
        readonly type: "address";
        readonly name: "acct";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "getPermissions";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "hasPermission";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "acct";
    }, {
        readonly type: "uint256";
        readonly name: "bit";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "grantRole";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
    }, {
        readonly type: "address";
        readonly name: "acct";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "revokeRole";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
    }, {
        readonly type: "address";
        readonly name: "acct";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "updateRolePermissions";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
    }, {
        readonly type: "uint256";
        readonly name: "perms";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "registerIdentity";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
    }, {
        readonly type: "address";
        readonly name: "acct";
    }, {
        readonly type: "string";
        readonly name: "subjectId";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "bindAccount";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
    }, {
        readonly type: "address";
        readonly name: "newAcct";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "updateIdentityStatus";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
    }, {
        readonly type: "uint8";
        readonly name: "s";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "getIdentity";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
    }];
    readonly outputs: readonly [{
        readonly type: "tuple";
        readonly components: readonly [{
            readonly type: "bytes32";
            readonly name: "didHash";
        }, {
            readonly type: "address";
            readonly name: "account";
        }, {
            readonly type: "string";
            readonly name: "subjectId";
        }, {
            readonly type: "uint8";
            readonly name: "status";
        }, {
            readonly type: "uint256";
            readonly name: "createdAt";
        }, {
            readonly type: "uint256";
            readonly name: "updatedAt";
        }];
    }];
}, {
    readonly name: "getDidByAccount";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "acct";
    }];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "isIdentityActive";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "RoleGranted";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "sender";
        readonly indexed: true;
    }];
}, {
    readonly name: "RoleRevoked";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "sender";
        readonly indexed: true;
    }];
}, {
    readonly name: "PermissionUpdated";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "role";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "newPerms";
    }, {
        readonly type: "address";
        readonly name: "sender";
        readonly indexed: true;
    }];
}, {
    readonly name: "IdentityRegistered";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "string";
        readonly name: "subjectId";
    }];
}, {
    readonly name: "AccountBound";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "oldAcct";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "newAcct";
        readonly indexed: true;
    }];
}, {
    readonly name: "IdentityStatusChanged";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "didHash";
        readonly indexed: true;
    }, {
        readonly type: "uint8";
        readonly name: "oldStatus";
    }, {
        readonly type: "uint8";
        readonly name: "newStatus";
    }];
}];
export declare const EnterpriseAssetNFTAbi: readonly [{
    readonly name: "name";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "string";
    }];
}, {
    readonly name: "symbol";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "string";
    }];
}, {
    readonly name: "iam";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
}, {
    readonly name: "mint";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "bytes32";
        readonly name: "didHash";
    }, {
        readonly type: "string";
        readonly name: "assetClass";
    }, {
        readonly type: "string";
        readonly name: "metadataURI";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
}, {
    readonly name: "allocateInitial";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }, {
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "bytes32";
        readonly name: "toDidHash";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "authorizeTransfer";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }, {
        readonly type: "address";
        readonly name: "from";
    }, {
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "bytes32";
        readonly name: "toDidHash";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "retireAsset";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }, {
        readonly type: "string";
        readonly name: "reason";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "ownerOf";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
}, {
    readonly name: "balanceOf";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "o";
    }];
    readonly outputs: readonly [{
        readonly type: "uint256";
    }];
}, {
    readonly name: "getAsset";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [{
        readonly type: "tuple";
        readonly components: readonly [{
            readonly type: "uint256";
            readonly name: "tokenId";
        }, {
            readonly type: "bytes32";
            readonly name: "didHash";
        }, {
            readonly type: "string";
            readonly name: "assetClass";
        }, {
            readonly type: "uint8";
            readonly name: "status";
        }, {
            readonly type: "string";
            readonly name: "metadataURI";
        }, {
            readonly type: "uint256";
            readonly name: "mintedAt";
        }];
    }];
}, {
    readonly name: "exists";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "tokenURI";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [{
        readonly type: "string";
    }];
}, {
    readonly name: "approve";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "setApprovalForAll";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "op";
    }, {
        readonly type: "bool";
        readonly name: "ok";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "getApproved";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
}, {
    readonly name: "isApprovedForAll";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "o";
    }, {
        readonly type: "address";
        readonly name: "op";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "transferFrom";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "from";
    }, {
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "safeTransferFrom";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "from";
    }, {
        readonly type: "address";
        readonly name: "to";
    }, {
        readonly type: "uint256";
        readonly name: "tokenId";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "Transfer";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "from";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "to";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }];
}, {
    readonly name: "AssetMinted";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }, {
        readonly type: "bytes32";
        readonly name: "didHash";
        readonly indexed: true;
    }, {
        readonly type: "string";
        readonly name: "assetClass";
    }];
}, {
    readonly name: "AssetAllocated";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "to";
        readonly indexed: true;
    }, {
        readonly type: "bytes32";
        readonly name: "toDidHash";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "actor";
    }];
}, {
    readonly name: "AssetTransferAuthorized";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "from";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "to";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "actor";
    }];
}, {
    readonly name: "AssetRetired";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "tokenId";
        readonly indexed: true;
    }, {
        readonly type: "string";
        readonly name: "reason";
    }, {
        readonly type: "address";
        readonly name: "actor";
    }];
}];
export declare const DocumentAnchorRegistryAbi: readonly [{
    readonly name: "iam";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
}, {
    readonly name: "anchorBatch";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "batchId";
    }, {
        readonly type: "bytes32";
        readonly name: "root";
    }, {
        readonly type: "uint256";
        readonly name: "leafCount";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "verifyProof";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "batchId";
    }, {
        readonly type: "bytes32[]";
        readonly name: "proof";
    }, {
        readonly type: "bytes32";
        readonly name: "leaf";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "getBatch";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "batchId";
    }];
    readonly outputs: readonly [{
        readonly type: "tuple";
        readonly components: readonly [{
            readonly type: "bytes32";
            readonly name: "merkleRoot";
        }, {
            readonly type: "uint256";
            readonly name: "leafCount";
        }, {
            readonly type: "uint256";
            readonly name: "anchoredBlock";
        }, {
            readonly type: "uint256";
            readonly name: "anchoredTime";
        }, {
            readonly type: "address";
            readonly name: "anchoredBy";
        }, {
            readonly type: "bool";
            readonly name: "exists";
        }];
    }];
}, {
    readonly name: "isBatchAnchored";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "batchId";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "MerkleRootAnchored";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "bytes32";
        readonly name: "batchId";
        readonly indexed: true;
    }, {
        readonly type: "bytes32";
        readonly name: "merkleRoot";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "leafCount";
    }, {
        readonly type: "address";
        readonly name: "anchorer";
        readonly indexed: true;
    }];
}];
export declare const RecoveryManagerAbi: readonly [{
    readonly name: "iam";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "address";
    }];
}, {
    readonly name: "approvedProviders";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "accounts";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly type: "address";
        readonly name: "owner";
    }, {
        readonly type: "address";
        readonly name: "pendingOwner";
    }, {
        readonly type: "uint256";
        readonly name: "unlockTime";
    }, {
        readonly type: "uint256";
        readonly name: "timelockDuration";
    }];
}, {
    readonly name: "usedNonces";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly type: "bool";
    }];
}, {
    readonly name: "registerProvider";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "provider";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "removeProvider";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "provider";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "registerAccount";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "uint256";
        readonly name: "timelockDuration";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "DOMAIN_SEPARATOR";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly type: "bytes32";
    }];
}, {
    readonly name: "requestRecovery";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
    }, {
        readonly type: "address";
        readonly name: "proposedOwner";
    }, {
        readonly type: "bytes32";
        readonly name: "nonce";
    }, {
        readonly type: "uint256";
        readonly name: "deadline";
    }, {
        readonly type: "bytes";
        readonly name: "signature";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "cancelRecovery";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "finalizeRecovery";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "ProviderRegistered";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "provider";
        readonly indexed: true;
    }];
}, {
    readonly name: "ProviderRemoved";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "provider";
        readonly indexed: true;
    }];
}, {
    readonly name: "AccountRegistered";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "owner";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "timelockDuration";
    }];
}, {
    readonly name: "RecoveryRequested";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "proposedOwner";
        readonly indexed: true;
    }, {
        readonly type: "bytes32";
        readonly name: "nonce";
        readonly indexed: true;
    }, {
        readonly type: "uint256";
        readonly name: "unlockTime";
    }];
}, {
    readonly name: "RecoveryCancelled";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "owner";
        readonly indexed: true;
    }];
}, {
    readonly name: "AccessRecovered";
    readonly type: "event";
    readonly inputs: readonly [{
        readonly type: "address";
        readonly name: "account";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "oldOwner";
        readonly indexed: true;
    }, {
        readonly type: "address";
        readonly name: "newOwner";
        readonly indexed: true;
    }];
}];
