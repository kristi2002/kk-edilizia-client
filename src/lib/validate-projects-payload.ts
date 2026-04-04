import { z } from "zod";
import type { Project } from "@/lib/data/projects";

const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string(),
  titleEn: z.string(),
  category: z.string(),
  categoryEn: z.string(),
  location: z.string(),
  locationEn: z.string(),
  year: z.string(),
  excerpt: z.string(),
  excerptEn: z.string(),
  description: z.string(),
  descriptionEn: z.string(),
  coverImage: z.string().min(1),
  gallery: z.array(z.string()),
  beforeAfter: z
    .object({ before: z.string().min(1), after: z.string().min(1) })
    .optional(),
  virtualTour: z.any().optional(),
});

export function parseProjectsPayload(body: unknown): Project[] {
  const arr = z.array(projectSchema).parse(body);
  return arr as Project[];
}
