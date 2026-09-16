import * as Minio from 'minio';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { config } from './config.js';
import { Readable } from 'stream';

const isS3Provider =
  config.minio.endPoint.includes('supabase') ||
  config.minio.endPoint.includes('amazonaws.com') ||
  config.minio.endPoint.includes('r2.cloudflarestorage.com') ||
  config.minio.endPoint.startsWith('http');

let s3Client: S3Client | null = null;
let minioClientRaw: Minio.Client | null = null;

if (isS3Provider) {
  let endpointUrl = config.minio.endPoint;
  if (!endpointUrl.startsWith('http')) {
    endpointUrl = `${config.minio.useSSL ? 'https' : 'http'}://${endpointUrl}`;
  }
  s3Client = new S3Client({
    endpoint: endpointUrl,
    region: config.minio.region || 'us-east-1',
    credentials: {
      accessKeyId: config.minio.accessKey,
      secretAccessKey: config.minio.secretKey,
    },
    forcePathStyle: true,
  });
} else {
  try {
    minioClientRaw = new Minio.Client({
      endPoint: config.minio.endPoint,
      port: config.minio.port,
      useSSL: config.minio.useSSL,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
      region: config.minio.region,
    });
  } catch {}
}

export async function putObject(
  bucket: string,
  objectKey: string,
  streamOrBuffer: Readable | Buffer,
  size?: number,
  metaData?: any
): Promise<any> {
  if (s3Client) {
    const contentType = metaData?.['Content-Type'] || metaData?.contentType || 'application/octet-stream';
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: streamOrBuffer as any,
      ContentType: contentType,
    });
    return s3Client.send(cmd);
  }
  if (minioClientRaw) {
    return minioClientRaw.putObject(bucket, objectKey, streamOrBuffer, size, metaData);
  }
  throw new Error('Storage client not initialized');
}

export async function getObject(bucket: string, objectKey: string): Promise<Readable> {
  if (s3Client) {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
    const res = await s3Client.send(cmd);
    return res.Body as Readable;
  }
  if (minioClientRaw) {
    return minioClientRaw.getObject(bucket, objectKey);
  }
  throw new Error('Storage client not initialized');
}
