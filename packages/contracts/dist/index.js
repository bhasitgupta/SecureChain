"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AMOY_RPC = exports.AMOY_CHAIN_ID = void 0;
exports.getProvider = getProvider;
__exportStar(require("./abis.js"), exports);
const ethers_1 = require("ethers");
exports.AMOY_CHAIN_ID = 80002;
exports.DEFAULT_AMOY_RPC = 'https://polygon-amoy.drpc.org';
function getProvider(rpcUrl) {
    return new ethers_1.ethers.JsonRpcProvider(rpcUrl || process.env.POLYGON_RPC_URL || exports.DEFAULT_AMOY_RPC);
}
