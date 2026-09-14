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
exports.amoyChain = void 0;
exports.getPublicClient = getPublicClient;
__exportStar(require("./abis.js"), exports);
const viem_1 = require("viem");
exports.amoyChain = (0, viem_1.defineChain)({
    id: 80002,
    name: 'Polygon Amoy',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc-amoy.polygon.technology'] },
        public: { http: ['https://rpc-amoy.polygon.technology'] },
    },
    blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
    },
    testnet: true,
});
function getPublicClient(rpcUrl) {
    return (0, viem_1.createPublicClient)({
        chain: exports.amoyChain,
        transport: (0, viem_1.http)(rpcUrl || process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
    });
}
