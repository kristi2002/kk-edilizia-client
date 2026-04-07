import type { Project } from "@/lib/data/projects";

/**
 * Last modification date (YYYY-MM-DD) for static marketing routes when copy changes.
 * Set in Vercel / env when you ship content updates (homepage, silos, chi-siamo, etc.).
 */
export function getStaticSitemapLastmod(): string {
  const raw = process.env.NEXT_PUBLIC_SITEMAP_STATIC_LASTMOD?.trim();
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  return "2026-04-02";
}

/** Portfolio / virtual-tour URLs: prefer explicit admin `updatedAt`, else infer from `year`. */
export function lastmodFromProject(p: Project): string {
  const u = p.updatedAt?.trim();
  if (u && /^\d{4}-\d{2}-\d{2}/.test(u)) {
    return u.slice(0, 10);
  }
  const y = parseInt(p.year, 10);
  if (!Number.isNaN(y) && y >= 1990 && y <= 2100) {
    return `${y}-12-01`;
  }
  return getStaticSitemapLastmod();
}

export function maxIsoDate(dates: string[]): string {
  if (dates.length === 0) return getStaticSitemapLastmod();
  return dates.reduce((a, b) => (a >= b ? a : b));
}
