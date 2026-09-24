"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecoveryContract = exports.getAnchorContract = exports.getNftContract = exports.getIamContract = exports.adminSigner = exports.provider = void 0;
const ethers_1 = require("ethers");
const config_js_1 = require("./config.js");
const contracts_1 = require("@securechain/contracts");
exports.provider = new ethers_1.ethers.JsonRpcProvider(config_js_1.config.polygonRpcUrl || 'https://polygon-amoy.drpc.org', undefined, { batchMaxCount: 1 });
exports.adminSigner = config_js_1.config.adminPrivateKey
    ? new ethers_1.ethers.Wallet(config_js_1.config.adminPrivateKey, exports.provider)
    : null;
const getIamContract = (runner = exports.adminSigner || exports.provider) => config_js_1.config.iamAddress && runner ? new ethers_1.ethers.Contract(config_js_1.config.iamAddress, contracts_1.IdentityAndAccessManagerAbi, runner) : null;
exports.getIamContract = getIamContract;
const getNftContract = (runner = exports.adminSigner || exports.provider) => config_js_1.config.nftAddress && runner ? new ethers_1.ethers.Contract(config_js_1.config.nftAddress, contracts_1.EnterpriseAssetNFTAbi, runner) : null;
exports.getNftContract = getNftContract;
const getAnchorContract = (runner = exports.adminSigner || exports.provider) => config_js_1.config.anchorAddress && runner ? new ethers_1.ethers.Contract(config_js_1.config.anchorAddress, contracts_1.DocumentAnchorRegistryAbi, runner) : null;
exports.getAnchorContract = getAnchorContract;
const getRecoveryContract = (runner = exports.adminSigner || exports.provider) => config_js_1.config.recoveryAddress && runner ? new ethers_1.ethers.Contract(config_js_1.config.recoveryAddress, contracts_1.RecoveryManagerAbi, runner) : null;
exports.getRecoveryContract = getRecoveryContract;
