import { getUpstashRedis } from "@/lib/upstash-redis";
import { withRetry } from "@/lib/with-retry";
import {
  defaultPreventivoFormOptions,
  type PreventivoFormOptions,
} from "@/lib/data/preventivo-form-options";
import { safeParsePreventivoFormOptions } from "@/lib/validate-preventivo-options-payload";
import type { PreventivoInput } from "@/lib/validations/preventivo";

const REDIS_KEY = "preventivo:form_options_v1";

function parseStored(raw: unknown): PreventivoFormOptions | null {
  if (raw == null) return null;
  let parsed: unknown = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  const r = safeParsePreventivoFormOptions(parsed);
  return r.ok ? r.data : null;
}

export async function getPreventivoFormOptions(): Promise<PreventivoFormOptions> {
  const redis = getUpstashRedis();
  if (!redis) return defaultPreventivoFormOptions;
  try {
    const raw = await withRetry(() => redis.get<unknown>(REDIS_KEY), {
      maxAttempts: 3,
      baseDelayMs: 250,
    });
    const list = parseStored(raw);
    if (list) return list;
  } catch {
    /* fallback */
  }
  return defaultPreventivoFormOptions;
}

export async function savePreventivoFormOptionsToRedis(
  data: PreventivoFormOptions,
): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) {
    throw new Error("UPSTASH_REDIS_REST_URL / TOKEN mancanti");
  }
  await redis.set(REDIS_KEY, JSON.stringify(data));
}

/** Etichette IT per email ufficio e log. */
export async function resolvePreventivoLabelsForEmail(data: PreventivoInput): Promise<{
  work: string;
  budget: string;
  timeline: string;
  sqm: string;
  notes: string;
}> {
  const opts = await getPreventivoFormOptions();
  const work =
    opts.workTypes.find((x) => x.value === data.workType)?.labelIt ?? data.workType;
  const budget =
    opts.budgets.find((x) => x.value === data.budget)?.labelIt ?? data.budget;
  const timeline =
    opts.timelines.find((x) => x.value === data.timeline)?.labelIt ?? data.timeline;
  const sqm = data.sqm?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  return { work, budget, timeline, sqm, notes };
}
