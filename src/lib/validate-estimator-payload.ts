import { z } from "zod";
import type { EstimatorCategoryRow } from "@/lib/data/cost-estimator";
import { formatZodIssues } from "@/lib/format-zod-error";

const rowSchema = z.object({
  id: z.string().min(1),
  minPerSqm: z.number().nonnegative(),
  maxPerSqm: z.number().nonnegative(),
  labelIt: z.string().min(1),
  descriptionIt: z.string(),
  labelEn: z.string().min(1),
  descriptionEn: z.string(),
});

const estimatorArraySchema = z.array(rowSchema);

export function parseEstimatorRowsPayload(body: unknown): EstimatorCategoryRow[] {
  return estimatorArraySchema.parse(body) as EstimatorCategoryRow[];
}

export function safeParseEstimatorRowsPayload(
  body: unknown,
): { ok: true; data: EstimatorCategoryRow[] } | { ok: false; message: string } {
  const r = estimatorArraySchema.safeParse(body);
  if (r.success) return { ok: true, data: r.data as EstimatorCategoryRow[] };
  return { ok: false, message: formatZodIssues(r.error) };
}
