"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnchorContract = exports.adminSigner = exports.provider = void 0;
const ethers_1 = require("ethers");
const config_js_1 = require("./config.js");
const contracts_1 = require("@sih26125/contracts");
exports.provider = new ethers_1.ethers.JsonRpcProvider(config_js_1.config.polygonRpcUrl || 'https://polygon-amoy.drpc.org');
exports.adminSigner = config_js_1.config.adminPrivateKey
    ? new ethers_1.ethers.Wallet(config_js_1.config.adminPrivateKey, exports.provider)
    : null;
const getAnchorContract = (runner = exports.adminSigner || exports.provider) => config_js_1.config.anchorAddress && runner ? new ethers_1.ethers.Contract(config_js_1.config.anchorAddress, contracts_1.DocumentAnchorRegistryAbi, runner) : null;
exports.getAnchorContract = getAnchorContract;
