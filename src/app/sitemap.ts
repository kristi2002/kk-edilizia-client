/**
 * Programmatic sitemap (`/sitemap.xml`). Next.js serializes this with
 * `<?xml version="1.0" encoding="UTF-8"?>` first, then `<urlset xmlns="…">` (see
 * `next/dist/build/webpack/loaders/metadata/resolve-route-data.js`).
 */
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n-path";
import { getSiteUrl } from "@/lib/data/site-store";
import { getProjects } from "@/lib/data/projects-store";
import { isCostEstimateEnabled } from "@/lib/features";
import { SERVICE_SILO_ROUTES } from "@/lib/service-silos";
import {
  getStaticSitemapLastmod,
  lastmodFromProject,
  maxIsoDate,
} from "@/lib/sitemap-lastmod";

function staticSegments(): string[] {
  return [
    "",
    ...SERVICE_SILO_ROUTES.map((r) => r.path),
    "/portfolio",
    ...(isCostEstimateEnabled() ? ["/stima-costi"] : []),
    "/chi-siamo",
    "/contatti",
    "/preventivo",
    "/privacy",
    "/note-legali",
    "/prenota",
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getSiteUrl()).replace(/\/$/, "");
  const projects = await getProjects();
  const staticLastmod = getStaticSitemapLastmod();
  const projectDates = projects.map((p) => lastmodFromProject(p));
  const latestProject = projectDates.length ? maxIsoDate(projectDates) : staticLastmod;
  /** Home + portfolio index: reflect newest portfolio activity without faking per-page edits. */
  const homeAndPortfolioIndexMod = maxIsoDate([staticLastmod, latestProject]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const seg of staticSegments()) {
      const path = localizedPath(locale, seg === "" ? "/" : seg);
      const url = path === "/" ? `${base}/` : `${base}${path}`;
      const lastModified =
        seg === ""
          ? homeAndPortfolioIndexMod
          : seg === "/portfolio"
            ? homeAndPortfolioIndexMod
            : staticLastmod;
      entries.push({
        url,
        lastModified,
        changeFrequency: seg === "" ? "weekly" : "monthly",
        priority: seg === "" ? 1 : 0.8,
      });
    }

    for (const p of projects) {
      const path = localizedPath(locale, `/portfolio/${p.slug}`);
      const pMod = lastmodFromProject(p);
      entries.push({
        url: `${base}${path}`,
        lastModified: pMod,
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
          lastModified: pMod,
          changeFrequency: "monthly",
          priority: 0.65,
        });
      }
    }
  }

  return entries;
}
