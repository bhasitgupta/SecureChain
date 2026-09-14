"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentQueue = exports.redis = void 0;
const ioredis_1 = require("ioredis");
const bullmq_1 = require("bullmq");
const config_js_1 = require("./config.js");
exports.redis = new ioredis_1.Redis(config_js_1.config.redisUrl, {
    maxRetriesPerRequest: null,
});
exports.documentQueue = new bullmq_1.Queue('document-pipeline', {
    connection: exports.redis,
});
