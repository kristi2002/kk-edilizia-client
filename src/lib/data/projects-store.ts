import type { Project } from "@/lib/data/projects";
import { staticProjects } from "@/lib/data/projects";
import { getUpstashRedis } from "@/lib/upstash-redis";
import { withRetry } from "@/lib/with-retry";

const REDIS_KEY = "portfolio:projects_v1";

/**
 * Portfolio list: Upstash copy when present and valid, otherwise static `staticProjects`.
 * Enable Redis + “Sincronizza da codice” in admin to let non-devs edit via admin UI.
 */
function projectsFromRedisValue(raw: unknown): Project[] | null {
  if (raw == null) return null;
  // @upstash/redis deserializes JSON automatically — GET often returns an array, not a string.
  if (Array.isArray(raw) && raw.length > 0) {
    return raw as Project[];
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Project[];
      }
    } catch {
      return null;
    }
  }
  return null;
}

export async function getProjects(): Promise<Project[]> {
  const redis = getUpstashRedis();
  if (!redis) return staticProjects;
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const fromRedis = projectsFromRedisValue(raw);
    if (fromRedis) return fromRedis;
    return staticProjects;
  } catch {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

export async function saveProjectsToRedis(projects: Project[]): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(projects));
}

export function isProjectsRedisAvailable(): boolean {
  return getUpstashRedis() !== null;
}

/** True se esiste una copia portfolio valida in Redis (non il solo fallback da codice). */
export async function getPortfolioDataSource(): Promise<"redis" | "static"> {
  const redis = getUpstashRedis();
  if (!redis) return "static";
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const fromRedis = projectsFromRedisValue(raw);
    if (fromRedis) return "redis";
    return "static";
  } catch {
    return "static";
  }
}
