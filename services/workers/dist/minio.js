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
exports.putObject = putObject;
exports.getObject = getObject;
const Minio = __importStar(require("minio"));
const client_s3_1 = require("@aws-sdk/client-s3");
const config_js_1 = require("./config.js");
const isS3Provider = config_js_1.config.minio.endPoint.includes('supabase') ||
    config_js_1.config.minio.endPoint.includes('amazonaws.com') ||
    config_js_1.config.minio.endPoint.includes('r2.cloudflarestorage.com') ||
    config_js_1.config.minio.endPoint.startsWith('http');
let s3Client = null;
let minioClientRaw = null;
if (isS3Provider) {
    let endpointUrl = config_js_1.config.minio.endPoint;
    if (!endpointUrl.startsWith('http')) {
        endpointUrl = `${config_js_1.config.minio.useSSL ? 'https' : 'http'}://${endpointUrl}`;
    }
    s3Client = new client_s3_1.S3Client({
        endpoint: endpointUrl,
        region: config_js_1.config.minio.region || 'us-east-1',
        credentials: {
            accessKeyId: config_js_1.config.minio.accessKey,
            secretAccessKey: config_js_1.config.minio.secretKey,
        },
        forcePathStyle: true,
    });
}
else {
    try {
        minioClientRaw = new Minio.Client({
            endPoint: config_js_1.config.minio.endPoint,
            port: config_js_1.config.minio.port,
            useSSL: config_js_1.config.minio.useSSL,
            accessKey: config_js_1.config.minio.accessKey,
            secretKey: config_js_1.config.minio.secretKey,
            region: config_js_1.config.minio.region,
        });
    }
    catch { }
}
async function putObject(bucket, objectKey, streamOrBuffer, size, metaData) {
    if (s3Client) {
        const contentType = metaData?.['Content-Type'] || metaData?.contentType || 'application/octet-stream';
        const cmd = new client_s3_1.PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: streamOrBuffer,
            ContentType: contentType,
        });
        return s3Client.send(cmd);
    }
    if (minioClientRaw) {
        return minioClientRaw.putObject(bucket, objectKey, streamOrBuffer, size, metaData);
    }
    throw new Error('Storage client not initialized');
}
async function getObject(bucket, objectKey) {
    if (s3Client) {
        const cmd = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: objectKey });
        const res = await s3Client.send(cmd);
        return res.Body;
    }
    if (minioClientRaw) {
        return minioClientRaw.getObject(bucket, objectKey);
    }
    throw new Error('Storage client not initialized');
}
