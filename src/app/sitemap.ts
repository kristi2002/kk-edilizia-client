import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n-path";
import { getSiteUrl } from "@/lib/data/site-store";
import { getProjects } from "@/lib/data/projects-store";

const staticSegments = [
  "",
  "/portfolio",
  "/stima-costi",
  "/chi-siamo",
  "/contatti",
  "/preventivo",
  "/privacy",
  "/note-legali",
  "/prenota",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getSiteUrl()).replace(/\/$/, "");
  const lastModified = new Date();
  const projects = await getProjects();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const seg of staticSegments) {
      const path = localizedPath(locale, seg === "" ? "/" : seg);
      const url = path === "/" ? `${base}/` : `${base}${path}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: seg === "" ? "weekly" : "monthly",
        priority: seg === "" ? 1 : 0.8,
      });
    }

    for (const p of projects) {
      const path = localizedPath(locale, `/portfolio/${p.slug}`);
      entries.push({
        url: `${base}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
      if (p.virtualTour) {
        const vtPath = localizedPath(
          locale,
          `/portfolio/${p.slug}/virtual-tour`,
        );
        entries.push({
          url: `${base}${vtPath}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  }

  return entries;
}
