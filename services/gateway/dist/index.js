"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const config_js_1 = require("./config.js");
const auth_js_1 = require("./routes/auth.js");
const identity_js_1 = require("./routes/identity.js");
const roles_js_1 = require("./routes/roles.js");
const assets_js_1 = require("./routes/assets.js");
const documents_js_1 = require("./routes/documents.js");
const verify_js_1 = require("./routes/verify.js");
const recovery_js_1 = require("./routes/recovery.js");
const audit_js_1 = require("./routes/audit.js");
const ethers_1 = require("ethers");
const common_1 = require("@sih26125/common");
const chain_js_1 = require("./chain.js");
const minio_js_1 = require("./minio.js");
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
});
async function main() {
    // Plugins
    const envOrigins = (process.env.CORS_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const origins = Array.from(new Set([
        config_js_1.config.frontendUrl,
        ...envOrigins,
        'https://securechain1.vercel.app',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]));
    await fastify.register(cors_1.default, {
        origin: origins,
        credentials: true,
    });
    await fastify.register(cookie_1.default, {
        secret: config_js_1.config.jwtSecret,
    });
    await fastify.register(multipart_1.default, {
        limits: {
            fileSize: 100 * 1024 * 1024, // 100 MB max
        },
    });
    // Health check with on-chain diagnostics
    fastify.get('/health', async () => {
        let relayerData = null;
        if (chain_js_1.adminSigner) {
            try {
                const [balance, iam] = await Promise.all([
                    chain_js_1.provider.getBalance(chain_js_1.adminSigner.address),
                    Promise.resolve((0, chain_js_1.getIamContract)(chain_js_1.provider)),
                ]);
                const isAdmin = iam ? await iam.hasRole(common_1.Roles.ADMIN, chain_js_1.adminSigner.address) : false;
                relayerData = {
                    address: chain_js_1.adminSigner.address,
                    balance: ethers_1.ethers.formatEther(balance),
                    isAdmin,
                };
            }
            catch (err) {
                relayerData = {
                    address: chain_js_1.adminSigner.address,
                    error: err.message,
                };
            }
        }
        let minioStatus = null;
        try {
            const buckets = await minio_js_1.minioClient.listBuckets();
            minioStatus = {
                connected: true,
                endPoint: config_js_1.config.minio.endPoint,
                port: config_js_1.config.minio.port,
                ssl: config_js_1.config.minio.useSSL,
                buckets: buckets.map((b) => b.name),
                publicUrl: config_js_1.config.minio.publicUrl || 'Direct S3 / Gateway streaming',
            };
        }
        catch (err) {
            minioStatus = {
                connected: false,
                endPoint: config_js_1.config.minio.endPoint,
                port: config_js_1.config.minio.port,
                ssl: config_js_1.config.minio.useSSL,
                error: err.code || err.message,
            };
        }
        return {
            status: 'ok',
            service: 'sih26125-gateway',
            chainId: config_js_1.config.chainId,
            contracts: {
                iam: config_js_1.config.iamAddress,
                nft: config_js_1.config.nftAddress,
                anchor: config_js_1.config.anchorAddress,
                recovery: config_js_1.config.recoveryAddress,
            },
            minio: minioStatus,
            relayer: relayerData,
            timestamp: new Date().toISOString(),
        };
    });
    // Route registration
    await fastify.register(auth_js_1.authRoutes, { prefix: '/api/auth' });
    await fastify.register(identity_js_1.identityRoutes, { prefix: '/api/identity' });
    await fastify.register(roles_js_1.rolesRoutes, { prefix: '/api/roles' });
    await fastify.register(assets_js_1.assetRoutes, { prefix: '/api/assets' });
    await fastify.register(documents_js_1.documentRoutes, { prefix: '/api/documents' });
    await fastify.register(verify_js_1.verifyRoutes, { prefix: '/api/verify' });
    await fastify.register(recovery_js_1.recoveryRoutes, { prefix: '/api/recovery' });
    await fastify.register(audit_js_1.auditRoutes, { prefix: '/api/audit' });
    // Initialize MinIO storage buckets safely in background
    (0, minio_js_1.ensureBucketsExist)().catch((err) => {
        fastify.log.warn(`[MinIO] Bucket initialization skipped (storage offline/unreachable): ${err.message}`);
    });
    // Start listening
    try {
        const address = await fastify.listen({ port: config_js_1.config.port, host: config_js_1.config.host });
        console.log(`🚀 Gateway listening on ${address}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
main();
