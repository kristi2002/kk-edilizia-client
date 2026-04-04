import { getUpstashRedis } from "@/lib/upstash-redis";
import { withRetry } from "@/lib/with-retry";
import {
  getFallbackSiteUrl,
  normalizePublicSiteUrl,
  staticSite,
  type SiteData,
} from "@/lib/site";
import { tryParseStoredSite } from "@/lib/validate-site-payload";

const REDIS_KEY = "site:settings_v1";

function siteFromRedisValue(raw: unknown): SiteData | null {
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return tryParseStoredSite(raw);
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return tryParseStoredSite(p);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getSite(): Promise<SiteData> {
  const redis = getUpstashRedis();
  if (!redis) return staticSite;
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const fromRedis = siteFromRedisValue(raw);
    if (fromRedis) return fromRedis;
    return staticSite;
  } catch {
    return staticSite;
  }
}

/** URL canonico: campo admin, altrimenti env, altrimenti fallback da site.ts. */
export async function getSiteUrl(): Promise<string> {
  const s = await getSite();
  const c = s.canonicalUrl?.trim();
  if (c) return normalizePublicSiteUrl(c);
  return getFallbackSiteUrl();
}

export async function saveSiteToRedis(site: SiteData): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(site));
}
