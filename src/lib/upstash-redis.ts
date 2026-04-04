import { Redis } from "@upstash/redis";

/** Shared Upstash client for portfolio, site settings, rate limit, etc. */
export function getUpstashRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

export function isUpstashRedisConfigured(): boolean {
  return getUpstashRedis() !== null;
}
