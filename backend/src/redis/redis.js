import { Redis } from '@upstash/redis';

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  upstashUrl && upstashToken
    ? new Redis({
        url: upstashUrl,
        token: upstashToken,
      })
    : null;

export const initializeRedis = async () => {
  if (!redis) {
    console.warn('Upstash Redis is not configured. Caching is disabled.');
    return;
  }

  try {
    await redis.ping();
    console.log('Upstash Redis connected');
  } catch (error) {
    console.warn('Failed to connect to Upstash Redis. Caching is disabled.');
  }
};
