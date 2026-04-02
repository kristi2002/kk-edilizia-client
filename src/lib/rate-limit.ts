import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let warnedMissingUpstash = false;

const WINDOW = "1 m";
const MAX = 12;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return Redis.fromEnv();
}

let ratelimit: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX, WINDOW),
      prefix: "kk-edilizia",
      analytics: false,
    });
  }
  return ratelimit;
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

/** Throws if over limit. No-op when Upstash env is missing (logs once in production). */
export async function assertRateLimit(route: string, request: Request): Promise<void> {
  const limiter = getLimiter();
  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      if (!warnedMissingUpstash) {
        warnedMissingUpstash = true;
        console.warn(
          "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — form rate limiting disabled. Add Upstash Redis on Vercel for production.",
        );
      }
    }
    return;
  }
  const ip = getClientIp(request);
  const id = `${route}:${ip}`;
  const { success } = await limiter.limit(id);
  if (!success) {
    const err = new Error("RATE_LIMITED") as Error & { status: number };
    err.status = 429;
    throw err;
  }
}
