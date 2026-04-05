import { z } from "zod";
import type { PreventivoFormOptions } from "@/lib/data/preventivo-form-options";

const optionSchema = z.object({
  value: z.string().trim().min(1).max(80),
  labelIt: z.string().trim().min(1).max(300),
  labelEn: z.string().trim().min(1).max(300),
});

const optionsSchema = z.object({
  workTypes: z.array(optionSchema).min(1),
  budgets: z.array(optionSchema).min(1),
  timelines: z.array(optionSchema).min(1),
});

export function safeParsePreventivoFormOptions(
  body: unknown,
):
  | { ok: true; data: PreventivoFormOptions }
  | { ok: false; message: string } {
  const r = optionsSchema.safeParse(body);
  if (!r.success) {
    return {
      ok: false,
      message: r.error.flatten().formErrors.join("; ") || "invalid",
    };
  }
  return { ok: true, data: r.data };
}
