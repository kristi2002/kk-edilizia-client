import { Redis } from "@upstash/redis";
import type { Project } from "@/lib/data/projects";
import { staticProjects } from "@/lib/data/projects";

const REDIS_KEY = "portfolio:projects_v1";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

/**
 * Portfolio list: Upstash copy when present and valid, otherwise static `staticProjects`.
 * Enable Redis + “Sincronizza da codice” in admin to let non-devs edit via admin UI.
 */
export async function getProjects(): Promise<Project[]> {
  const redis = getRedis();
  if (!redis) return staticProjects;
  try {
    const raw = await redis.get<string>(REDIS_KEY);
    if (!raw || typeof raw !== "string") return staticProjects;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return staticProjects;
    return parsed as Project[];
  } catch {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const list = await getProjects();
  return list.find((p) => p.slug === slug);
}

export async function saveProjectsToRedis(projects: Project[]): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(projects));
}

export function isProjectsRedisAvailable(): boolean {
  return getRedis() !== null;
}
