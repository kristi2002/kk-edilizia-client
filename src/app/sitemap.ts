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
import { isCostEstimateEnabled, isPortfolioEnabled } from "@/lib/features";
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
    ...(isPortfolioEnabled() ? ["/portfolio"] : []),
    ...(isCostEstimateEnabled() ? ["/stima-costi"] : []),
    "/chi-siamo",
    "/contatti",
    "/preventivo",
    "/privacy",
    "/note-legali",
    "/prenota",
    "/impresa-edile-modena",
  ];
}

/**
 * `xhtml:link` alternates for one logical page.
 *
 * The sitemap listed the Italian and English URLs as thirty-four unrelated entries: the
 * page `<head>` carried a correct hreflang triple, but nothing in the sitemap said the
 * two were the same document in two languages, which is the pairing Google prefers to
 * read from here.
 */
function alternatesFor(base: string, seg: string): Record<string, string> {
  const abs = (locale: string) => {
    const path = localizedPath(locale, seg);
    return path === "/" ? base : `${base}${path}`;
  };
  return { it: abs("it"), en: abs("en"), "x-default": abs("it") };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getSiteUrl()).replace(/\/$/, "");
  /** With the portfolio flag off these pages are noindex, so they stay out of the sitemap. */
  const projects = isPortfolioEnabled() ? await getProjects() : [];
  const staticLastmod = getStaticSitemapLastmod();
  const projectDates = projects.map((p) => lastmodFromProject(p));
  const latestProject = projectDates.length ? maxIsoDate(projectDates) : staticLastmod;
  /** Home + portfolio index: reflect newest portfolio activity without faking per-page edits. */
  const homeAndPortfolioIndexMod = maxIsoDate([staticLastmod, latestProject]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const seg of staticSegments()) {
      const path = localizedPath(locale, seg === "" ? "/" : seg);
      /** Bare origin: Next normalises the root canonical without a trailing slash. */
      const url = path === "/" ? base : `${base}${path}`;
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
        priority:
          seg === "" || seg === "/ristrutturazioni-chiavi-in-mano"
            ? 1
            : seg === "/impresa-edile-modena"
              ? 0.9
              : 0.8,
        alternates: { languages: alternatesFor(base, seg === "" ? "/" : seg) },
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
        alternates: { languages: alternatesFor(base, `/portfolio/${p.slug}`) },
      });
      if (p.virtualTour.scenes.length > 0) {
        const vtPath = localizedPath(
          locale,
          `/portfolio/${p.slug}/virtual-tour`,
        );
        entries.push({
          url: `${base}${vtPath}`,
          lastModified: pMod,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: {
            languages: alternatesFor(
              base,
              `/portfolio/${p.slug}/virtual-tour`,
            ),
          },
        });
      }
    }
  }

  return entries;
}
