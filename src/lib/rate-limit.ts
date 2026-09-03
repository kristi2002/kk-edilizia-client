import { Ratelimit } from "@upstash/ratelimit";
import { getUpstashRedis } from "@/lib/upstash-redis";

let warnedMissingUpstash = false;

const WINDOW = "1 m";
const MAX = 12;

/**
 * Per-route overrides. Admin login is the only brute-forceable endpoint on the site and
 * previously had no limit at all, while every public form did.
 */
type Budget = { max: number; windowMs: number; window: `${number} ${"s" | "m"}` };

const DEFAULT_BUDGET: Budget = { max: MAX, windowMs: 60_000, window: WINDOW };

const ROUTE_BUDGETS: Record<string, Budget> = {
  "admin-login": { max: 5, windowMs: 15 * 60_000, window: "900 s" },
};

function budgetFor(route: string): Budget {
  return ROUTE_BUDGETS[route] ?? DEFAULT_BUDGET;
}

/** Fallback in-memory (per istanza serverless): stesso limite, non condiviso tra regioni. */
const MEMORY_MAX_WINDOW_MS = 15 * 60_000;
const memoryHits = new Map<string, number[]>();

function pruneMemorySamples(): void {
  if (Math.random() > 0.02) return;
  const now = Date.now();
  const cutoff = now - MEMORY_MAX_WINDOW_MS * 2;
  for (const [k, arr] of memoryHits) {
    const next = arr.filter((t) => t > cutoff);
    if (next.length === 0) memoryHits.delete(k);
    else memoryHits.set(k, next);
  }
}

function assertMemoryRateLimit(route: string, request: Request): void {
  pruneMemorySamples();
  const { max, windowMs } = budgetFor(route);
  const ip = getClientIp(request);
  const key = `${route}:${ip}`;
  const now = Date.now();
  const arr = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    const err = new Error("RATE_LIMITED") as Error & { status: number };
    err.status = 429;
    throw err;
  }
  arr.push(now);
  memoryHits.set(key, arr);
}

const limiters = new Map<string, Ratelimit>();

function getLimiter(route: string): Ratelimit | null {
  const redis = getUpstashRedis();
  if (!redis) return null;
  const cached = limiters.get(route);
  if (cached) return cached;
  const { max, window } = budgetFor(route);
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix: `kk-edilizia:${route}`,
    analytics: false,
  });
  limiters.set(route, limiter);
  return limiter;
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
  const limiter = getLimiter(route);
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
