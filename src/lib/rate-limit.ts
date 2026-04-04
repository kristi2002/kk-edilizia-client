import { Ratelimit } from "@upstash/ratelimit";
import { getUpstashRedis } from "@/lib/upstash-redis";

let warnedMissingUpstash = false;

const WINDOW = "1 m";
const MAX = 12;

/** Fallback in-memory (per istanza serverless): stesso limite, non condiviso tra regioni. */
const MEMORY_WINDOW_MS = 60_000;
const memoryHits = new Map<string, number[]>();

function pruneMemorySamples(): void {
  if (Math.random() > 0.02) return;
  const now = Date.now();
  const cutoff = now - MEMORY_WINDOW_MS * 2;
  for (const [k, arr] of memoryHits) {
    const next = arr.filter((t) => t > cutoff);
    if (next.length === 0) memoryHits.delete(k);
    else memoryHits.set(k, next);
  }
}

function assertMemoryRateLimit(route: string, request: Request): void {
  pruneMemorySamples();
  const ip = getClientIp(request);
  const key = `${route}:${ip}`;
  const now = Date.now();
  const arr = (memoryHits.get(key) ?? []).filter(
    (t) => now - t < MEMORY_WINDOW_MS,
  );
  if (arr.length >= MAX) {
    const err = new Error("RATE_LIMITED") as Error & { status: number };
    err.status = 429;
    throw err;
  }
  arr.push(now);
  memoryHits.set(key, arr);
}

let ratelimit: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  const redis = getUpstashRedis();
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

/**
 * Throws if over limit.
 * Usa Upstash se configurato; altrimenti limite in-memory per IP (stesso tetto, meno preciso in multi-istanza).
 */
export async function assertRateLimit(route: string, request: Request): Promise<void> {
  const limiter = getLimiter();
  if (!limiter) {
    if (process.env.NODE_ENV === "production" && !warnedMissingUpstash) {
      warnedMissingUpstash = true;
      console.warn(
        "[rate-limit] Upstash assente — uso limite in-memory per modulo (per istanza). Configura Redis per limiti globali.",
      );
    }
    assertMemoryRateLimit(route, request);
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
