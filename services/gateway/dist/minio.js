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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.minioClient = void 0;
exports.getPublicObjectUrl = getPublicObjectUrl;
exports.ensureBucketsExist = ensureBucketsExist;
exports.putObject = putObject;
exports.getObject = getObject;
exports.getPresignedDownloadUrl = getPresignedDownloadUrl;
const Minio = __importStar(require("minio"));
const config_js_1 = require("./config.js");
exports.minioClient = new Minio.Client({
    endPoint: config_js_1.config.minio.endPoint,
    port: config_js_1.config.minio.port,
    useSSL: config_js_1.config.minio.useSSL,
    accessKey: config_js_1.config.minio.accessKey,
    secretKey: config_js_1.config.minio.secretKey,
    region: config_js_1.config.minio.region,
});
function getPublicObjectUrl(bucket, objectKey) {
    if (config_js_1.config.minio.publicUrl) {
        const base = config_js_1.config.minio.publicUrl.replace(/\/$/, '');
        return `${base}/${bucket}/${objectKey}`;
    }
    const protocol = config_js_1.config.minio.useSSL ? 'https' : 'http';
    const port = (config_js_1.config.minio.port === 80 || config_js_1.config.minio.port === 443) ? '' : `:${config_js_1.config.minio.port}`;
    return `${protocol}://${config_js_1.config.minio.endPoint}${port}/${bucket}/${objectKey}`;
}
async function ensureBucketsExist() {
    const buckets = Object.values(config_js_1.config.minio.buckets);
    for (const bucket of buckets) {
        try {
            const exists = await exports.minioClient.bucketExists(bucket);
            if (!exists) {
                await exports.minioClient.makeBucket(bucket, config_js_1.config.minio.region);
                console.log(`[MinIO] Created bucket: ${bucket}`);
            }
            // Configure public read policy on asset-thumbnails and doc-thumbnails for external explorer / frontend visibility
            if (bucket === config_js_1.config.minio.buckets.assetThumbnails || bucket === config_js_1.config.minio.buckets.docThumbnails) {
                try {
                    const publicPolicy = {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Principal: { AWS: ['*'] },
                                Action: ['s3:GetObject'],
                                Resource: [`arn:aws:s3:::${bucket}/*`],
                            },
                        ],
                    };
                    await exports.minioClient.setBucketPolicy(bucket, JSON.stringify(publicPolicy));
                }
                catch {
                    // Ignore policy set errors on providers that don't support custom bucket policies via API
                }
            }
        }
        catch (err) {
            console.warn(`[MinIO] Bucket check warning for ${bucket}:`, err.message);
        }
    }
}
async function putObject(bucket, objectKey, streamOrBuffer, size, metaData) {
    return exports.minioClient.putObject(bucket, objectKey, streamOrBuffer, size, metaData);
}
async function getObject(bucket, objectKey) {
    return exports.minioClient.getObject(bucket, objectKey);
}
async function getPresignedDownloadUrl(bucket, objectKey, expirySeconds = 3600) {
    return exports.minioClient.presignedGetObject(bucket, objectKey, expirySeconds);
}
