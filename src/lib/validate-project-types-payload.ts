import { z } from "zod";
import type { ProjectTypeDef } from "@/lib/data/project-types";
import { formatZodIssues } from "@/lib/format-zod-error";

const rowSchema = z.object({
  id: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, "id: lettere, numeri, _ e -"),
  labelIt: z.string().min(1),
  labelEn: z.string().min(1),
});

const typesArraySchema = z.array(rowSchema);

export function parseProjectTypesPayload(body: unknown): ProjectTypeDef[] {
  return typesArraySchema.parse(body) as ProjectTypeDef[];
}

export function safeParseProjectTypesPayload(
  body: unknown,
): { ok: true; data: ProjectTypeDef[] } | { ok: false; message: string } {
  const r = typesArraySchema.safeParse(body);
  if (r.success) return { ok: true, data: r.data as ProjectTypeDef[] };
  return { ok: false, message: formatZodIssues(r.error) };
}
