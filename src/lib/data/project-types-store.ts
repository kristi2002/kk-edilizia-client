import { getUpstashRedis } from "@/lib/upstash-redis";
import { withRetry } from "@/lib/with-retry";
import { staticProjectTypes, type ProjectTypeDef } from "@/lib/data/project-types";
import { parseProjectTypesPayload } from "@/lib/validate-project-types-payload";

const REDIS_KEY = "portfolio:project_types_v1";

function typesFromRedis(raw: unknown): ProjectTypeDef[] | null {
  if (raw == null) return null;
  if (Array.isArray(raw) && raw.length > 0) {
    try {
      return parseProjectTypesPayload(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return parseProjectTypesPayload(p);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getProjectTypes(): Promise<ProjectTypeDef[]> {
  const redis = getUpstashRedis();
  if (!redis) return staticProjectTypes;
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const list = typesFromRedis(raw);
    if (list && list.length > 0) return list;
    return staticProjectTypes;
  } catch {
    return staticProjectTypes;
  }
}

export async function saveProjectTypesToRedis(types: ProjectTypeDef[]): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(types));
}
