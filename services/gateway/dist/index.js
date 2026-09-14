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
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
    },
});
async function main() {
    // Plugins
    await fastify.register(cors_1.default, {
        origin: [config_js_1.config.frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
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
    // Health check
    fastify.get('/health', async () => ({
        status: 'ok',
        service: 'sih26125-gateway',
        timestamp: new Date().toISOString(),
    }));
    // Route registration
    await fastify.register(auth_js_1.authRoutes, { prefix: '/api/auth' });
    await fastify.register(identity_js_1.identityRoutes, { prefix: '/api/identity' });
    await fastify.register(roles_js_1.rolesRoutes, { prefix: '/api/roles' });
    await fastify.register(assets_js_1.assetRoutes, { prefix: '/api/assets' });
    await fastify.register(documents_js_1.documentRoutes, { prefix: '/api/documents' });
    await fastify.register(verify_js_1.verifyRoutes, { prefix: '/api/verify' });
    await fastify.register(recovery_js_1.recoveryRoutes, { prefix: '/api/recovery' });
    await fastify.register(audit_js_1.auditRoutes, { prefix: '/api/audit' });
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
