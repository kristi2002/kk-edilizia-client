import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/data/site-store";
import { localizedPath } from "@/lib/i18n-path";

const SITE_NAME = "K.K Edilizia";

/**
 * Referenced explicitly rather than relying on the `opengraph-image.tsx` file
 * convention: nested `[locale]` segments did not inherit it, so no page ever emitted
 * an `og:image` and every share rendered as a bare text card.
 */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "K.K Edilizia — Ristrutturazioni Modena",
} as const;

/**
 * Canonical URL + hreflang alternates for IT/EN (see Google guidance on duplicate
 * URLs across locales). Merges with existing `meta.alternates` if present.
 *
 * Also re-applies the shared Open Graph / Twitter fields. Next merges `metadata` per
 * key, so a page that sets its own `openGraph` object replaces the layout's entirely —
 * which silently dropped `og:type`, `og:site_name` and `og:locale`, and downgraded
 * `twitter:card` to `summary`. Setting them here keeps every page complete.
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
  /** Next normalises the root canonical without a trailing slash; keep every absolute URL identical. */
  const abs = (p: string) => `${origin}${p === "/" ? "" : p}`;
  const canonical = abs(canonicalPath);

  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      canonical,
      languages: {
        ...meta.alternates?.languages,
        it: abs(itPath),
        en: abs(enPath),
        "x-default": abs(itPath),
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "it_IT",
      images: [OG_IMAGE],
      ...meta.openGraph,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      images: [OG_IMAGE.url],
      ...meta.twitter,
    },
  };
}
