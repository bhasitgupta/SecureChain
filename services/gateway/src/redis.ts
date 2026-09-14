import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import { config } from './config.js';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
});

export const documentQueue = new Queue('document-pipeline', {
  connection: redis,
});
