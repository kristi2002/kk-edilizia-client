import { getUpstashRedis } from "@/lib/upstash-redis";
import { withRetry } from "@/lib/with-retry";
import {
  getStaticEstimatorRows,
  toEstimatorCategory,
  type EstimatorCategory,
  type EstimatorCategoryRow,
} from "@/lib/data/cost-estimator";
import { parseEstimatorRowsPayload } from "@/lib/validate-estimator-payload";

const REDIS_KEY = "estimator:categories_v1";

function rowsFromRedis(raw: unknown): EstimatorCategoryRow[] | null {
  if (raw == null) return null;
  if (Array.isArray(raw) && raw.length > 0) {
    try {
      return parseEstimatorRowsPayload(raw);
    } catch {
      return null;
    }
  }
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw) as unknown;
      return parseEstimatorRowsPayload(p);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getEstimatorCategories(
  locale: string,
): Promise<EstimatorCategory[]> {
  const redis = getUpstashRedis();
  if (!redis) {
    return getStaticEstimatorRows().map((r) => toEstimatorCategory(locale, r));
  }
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const list = rowsFromRedis(raw);
    if (list && list.length > 0) {
      return list.map((r) => toEstimatorCategory(locale, r));
    }
  } catch {
    /* fallback */
  }
  return getStaticEstimatorRows().map((r) => toEstimatorCategory(locale, r));
}

export async function getEstimatorRows(): Promise<EstimatorCategoryRow[]> {
  const redis = getUpstashRedis();
  if (!redis) return getStaticEstimatorRows();
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const list = rowsFromRedis(raw);
    if (list && list.length > 0) return list;
  } catch {
    /* fallback */
  }
  return getStaticEstimatorRows();
}

export async function saveEstimatorRowsToRedis(
  rows: EstimatorCategoryRow[],
): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(rows));
}
