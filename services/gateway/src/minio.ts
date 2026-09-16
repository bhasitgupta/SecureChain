import * as Minio from 'minio';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CreateBucketCommand,
  ListBucketsCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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
  } catch (err: any) {
    console.warn('[Storage] Local MinIO client initialization deferred:', err.message);
  }
}

export const minioClient = {
  async listBuckets(): Promise<{ name: string }[]> {
    if (s3Client) {
      const res = await s3Client.send(new ListBucketsCommand({}));
      return (res.Buckets || []).map((b) => ({ name: b.Name || '' }));
    }
    if (minioClientRaw) {
      const buckets = await minioClientRaw.listBuckets();
      return buckets.map((b) => ({ name: b.name }));
    }
    return [];
  },
};

export function getPublicObjectUrl(bucket: string, objectKey: string): string {
  if (config.minio.publicUrl) {
    const base = config.minio.publicUrl.replace(/\/$/, '');
    return `${base}/${bucket}/${objectKey}`;
  }
  if (config.minio.endPoint.includes('supabase')) {
    // Supabase standard public storage URL format: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<key>
    const match = config.minio.endPoint.match(/([a-z0-9_-]+)\.supabase\.co/i);
    if (match) {
      const projectRef = match[1];
      return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucket}/${objectKey}`;
    }
  }
  const protocol = config.minio.useSSL ? 'https' : 'http';
  const port = (config.minio.port === 80 || config.minio.port === 443) ? '' : `:${config.minio.port}`;
  return `${protocol}://${config.minio.endPoint}${port}/${bucket}/${objectKey}`;
}

export async function ensureBucketsExist(): Promise<void> {
  const buckets = Object.values(config.minio.buckets);
  for (const bucket of buckets) {
    try {
      if (s3Client) {
        try {
          await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
        } catch {
          await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
          console.log(`[Storage] Created bucket: ${bucket}`);
        }
      } else if (minioClientRaw) {
        const exists = await minioClientRaw.bucketExists(bucket);
        if (!exists) {
          await minioClientRaw.makeBucket(bucket, config.minio.region);
          console.log(`[Storage] Created bucket: ${bucket}`);
        }
      }
    } catch (err: any) {
      console.warn(`[Storage] Bucket ensure warning for ${bucket}:`, err.message);
    }
  }
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

export async function getPresignedDownloadUrl(
  bucket: string,
  objectKey: string,
  expirySeconds: number = 3600
): Promise<string> {
  if (s3Client) {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: objectKey });
    return getSignedUrl(s3Client, cmd, { expiresIn: expirySeconds });
  }
  if (minioClientRaw) {
    return minioClientRaw.presignedGetObject(bucket, objectKey, expirySeconds);
  }
  throw new Error('Storage client not initialized');
}
