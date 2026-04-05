import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/data/site-store";
import { localizedPath } from "@/lib/i18n-path";

/**
 * Canonical URL + hreflang alternates for IT/EN (see Google guidance on duplicate
 * URLs across locales). Merges with existing `meta.alternates` if present.
 */
export async function withLocaleAlternates(
  locale: string,
  pathname: string,
  meta: Metadata,
): Promise<Metadata> {
  const base = await getSiteUrl();
  const origin = new URL(base).origin;
  const pathNorm =
    pathname === "" || pathname === "/"
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  const itPath = localizedPath("it", pathNorm);
  const enPath = localizedPath("en", pathNorm);
  const canonicalPath = localizedPath(locale, pathNorm);
  const canonical = `${origin}${canonicalPath}`;

  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      canonical,
      languages: {
        ...meta.alternates?.languages,
        it: `${origin}${itPath}`,
        en: `${origin}${enPath}`,
        "x-default": `${origin}${itPath}`,
      },
    },
    openGraph: {
      ...meta.openGraph,
      url: canonical,
    },
  };
}
