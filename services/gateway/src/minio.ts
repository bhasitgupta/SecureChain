import * as Minio from 'minio';
import { config } from './config.js';
import { Readable } from 'stream';

export const minioClient = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

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
