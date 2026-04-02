import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n-path";
import { getSiteUrl } from "@/lib/site";

const staticSegments = [
  "",
  "/portfolio",
  "/chi-siamo",
  "/contatti",
  "/preventivo",
  "/privacy",
  "/note-legali",
  "/virtual-tour",
  "/prenota",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().replace(/\/$/, "");
  const lastModified = new Date();

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
    }
  }

  return entries;
}
