import { z } from "zod";
import type { Project } from "@/lib/data/projects";
import { formatZodIssues } from "@/lib/format-zod-error";

const hotSpotSchema = z.object({
  pitch: z.number(),
  yaw: z.number(),
  type: z.literal("scene"),
  text: z.string(),
  textEn: z.string(),
  sceneId: z.string(),
});

const sceneSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  titleEn: z.string(),
  panorama: z.string().min(1),
  hotSpots: z.array(hotSpotSchema).optional(),
});

const virtualTourSchema = z.object({
  scenes: z.array(sceneSchema).min(1),
  firstSceneId: z.string().optional(),
  sceneFadeMs: z.number().optional(),
});

const projectSchema = z.object({
  slug: z.string().min(1),
  categoryId: z.string().optional(),
  title: z.string(),
  titleEn: z.string(),
  category: z.string(),
  categoryEn: z.string(),
  location: z.string(),
  locationEn: z.string(),
  year: z.string(),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish(),
  excerpt: z.string(),
  excerptEn: z.string(),
  description: z.string(),
  descriptionEn: z.string(),
  coverImage: z.string().min(1),
  gallery: z.array(z.string()),
  beforeAfter: z.object({
    before: z.string().min(1),
    after: z.string().min(1),
  }),
  virtualTour: virtualTourSchema,
});

const projectsArraySchema = z.array(projectSchema);

export function parseProjectsPayload(body: unknown): Project[] {
  const arr = projectsArraySchema.parse(body);
  return arr as Project[];
}

export function safeParseProjectsPayload(
  body: unknown,
): { ok: true; data: Project[] } | { ok: false; message: string } {
  const r = projectsArraySchema.safeParse(body);
  if (r.success) return { ok: true, data: r.data as Project[] };
  return { ok: false, message: formatZodIssues(r.error) };
}
