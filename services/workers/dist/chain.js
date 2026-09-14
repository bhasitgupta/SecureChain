"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletClient = exports.adminAccount = exports.publicClient = exports.polygonAmoy = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const config_js_1 = require("./config.js");
exports.polygonAmoy = (0, viem_1.defineChain)({
    id: config_js_1.config.chainId,
    name: 'Polygon Amoy',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        default: { http: [config_js_1.config.polygonRpcUrl] },
        public: { http: [config_js_1.config.polygonRpcUrl] },
    },
    testnet: true,
});
exports.publicClient = (0, viem_1.createPublicClient)({
    chain: exports.polygonAmoy,
    transport: (0, viem_1.http)(config_js_1.config.polygonRpcUrl),
});
exports.adminAccount = config_js_1.config.adminPrivateKey
    ? (0, accounts_1.privateKeyToAccount)(config_js_1.config.adminPrivateKey)
    : null;
exports.walletClient = exports.adminAccount
    ? (0, viem_1.createWalletClient)({
        account: exports.adminAccount,
        chain: exports.polygonAmoy,
        transport: (0, viem_1.http)(config_js_1.config.polygonRpcUrl),
    })
    : null;
