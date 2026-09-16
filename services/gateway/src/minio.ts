import * as Minio from 'minio';
import { config } from './config.js';
import { Readable } from 'stream';

export const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
  region: config.minio.region,
});

export function getPublicObjectUrl(bucket: string, objectKey: string): string {
  if (config.minio.publicUrl) {
    const base = config.minio.publicUrl.replace(/\/$/, '');
    return `${base}/${bucket}/${objectKey}`;
  }
  const protocol = config.minio.useSSL ? 'https' : 'http';
  const port = (config.minio.port === 80 || config.minio.port === 443) ? '' : `:${config.minio.port}`;
  return `${protocol}://${config.minio.endPoint}${port}/${bucket}/${objectKey}`;
}

export async function ensureBucketsExist(): Promise<void> {
  const buckets = Object.values(config.minio.buckets);
  for (const bucket of buckets) {
    try {
      const exists = await minioClient.bucketExists(bucket);
      if (!exists) {
        await minioClient.makeBucket(bucket, config.minio.region);
        console.log(`[MinIO] Created bucket: ${bucket}`);
      }
      // Configure public read policy on asset-thumbnails and doc-thumbnails for external explorer / frontend visibility
      if (bucket === config.minio.buckets.assetThumbnails || bucket === config.minio.buckets.docThumbnails) {
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
          await minioClient.setBucketPolicy(bucket, JSON.stringify(publicPolicy));
        } catch {
          // Ignore policy set errors on providers that don't support custom bucket policies via API
        }
      }
    } catch (err: any) {
      console.warn(`[MinIO] Bucket check warning for ${bucket}:`, err.message);
    }
  }
}

export async function putObject(
  bucket: string,
  objectKey: string,
  streamOrBuffer: Readable | Buffer,
  size?: number,
  metaData?: Minio.ItemBucketMetadata
): Promise<any> {
  return minioClient.putObject(bucket, objectKey, streamOrBuffer, size, metaData);
}

export async function getObject(bucket: string, objectKey: string): Promise<Readable> {
  return minioClient.getObject(bucket, objectKey);
}

export async function getPresignedDownloadUrl(
  bucket: string,
  objectKey: string,
  expirySeconds: number = 3600
): Promise<string> {
  return minioClient.presignedGetObject(bucket, objectKey, expirySeconds);
}
