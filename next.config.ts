import { withSentryConfig } from "@sentry/nextjs";
import { createRequire } from "node:module";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const require = createRequire(import.meta.url);
const slimPolyfillModule = path.join(
  process.cwd(),
  "src/lib/polyfills/next-polyfill-module.js",
);
const nextBundledPolyfillModule = require.resolve(
  "next/dist/build/polyfills/polyfill-module.js",
);

/** EU Sentry (DSN uses ingest.de.sentry.io); override with SENTRY_URL if needed. */
const sentryUrl = process.env.SENTRY_URL ?? "https://de.sentry.io";

const sentryPluginDebug =
  process.env.SENTRY_DEBUG_BUILD === "1" ||
  process.env.SENTRY_LOG_LEVEL === "debug";

/**
 * Legacy silo URLs → current silo URLs. Handled here (edge, 308 permanent) instead of
 * `redirect()` inside a page: a page-level redirect renders a full HTML document and
 * emits only a `<meta http-equiv="refresh">`, so crawlers saw HTTP 200 + no canonical.
 */
const LEGACY_SILO_REDIRECTS: { from: string; to: string }[] = [
  { from: "/cartongesso-modena", to: "/cartongesso-isolamento" },
  { from: "/ristrutturazioni-bagno", to: "/ristrutturazione-bagno" },
  { from: "/rifacimento-tetto", to: "/rifacimento-tetto-facciate" },
];

/**
 * Security response headers.
 *
 * Nothing set any: no CSP, no HSTS, no `Referrer-Policy`, no `Permissions-Policy`, and
 * `X-Powered-By: Next.js` on every response. These are the ones that cost nothing to
 * send and are hard to add later.
 *
 * The CSP ships as **report-only** on purpose. Two things on this site need explicit
 * allowances and would break silently if enforced before they are verified against a
 * production build: the Consent Mode v2 defaults, which are an inline `<script>` that
 * must run before any tag (so `'unsafe-inline'` is not optional here), and Sentry's
 * `/monitoring` tunnel. Next's own framework bootstrap also emits inline scripts. Watch
 * the violation reports on a real deployment, then rename the header to
 * `Content-Security-Policy`.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  /** Consent snippet + Next bootstrap are inline; GTM/GA4 load only after consent. */
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  /** `blob:` covers the OG image route; Vercel Blob serves uploaded portfolio media. */
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self'",
  "connect-src 'self' https://*.ingest.de.sentry.io https://www.google-analytics.com https://www.googletagmanager.com",
  /** Nothing on the site embeds a third-party frame today. */
  "frame-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
];

const nextConfig: NextConfig = {
  /** Multiple lockfiles exist above this repo; pin the root so build traces are correct. */
  outputFileTracingRoot: path.join(process.cwd()),
  experimental: {
    optimizePackageImports: ["framer-motion"],
    /**
     * Required by `src/app/global-not-found.tsx`. The public site and `/admin` now have
     * separate root layouts (so `<html lang>` can be the real locale), which means no
     * single layout sits above an unmatched URL — this is the flag that lets one file
     * render its own document for that case.
     */
    globalNotFound: true,
  },
  /** Do not advertise the framework and version on every response. */
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return LEGACY_SILO_REDIRECTS.flatMap(({ from, to }) => [
      { source: from, destination: to, permanent: true },
      { source: `/en${from}`, destination: `/en${to}`, permanent: true },
    ]);
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        [nextBundledPolyfillModule]: slimPolyfillModule,
      };
    }
    return config;
  },
  images: {
    /**
     * AVIF first is worth it here. Next encodes it at `quality - 20` with `effort: 3`,
     * which on this photography lands ~23% under WebP for a comparable encode time
     * (six heroes: 478 KB AVIF vs 621 KB WebP, ~200ms each) — not the usual "AVIF is
     * slow" tradeoff, because the effort dial is already low.
     */
    formats: ["image/avif", "image/webp"],
    /**
     * 60 is for the full-bleed hero grounds. Every one of them sits under a scrim that
     * is near-opaque where the type runs (`/prenota` also renders its own at
     * `opacity-30` through a grayscale/sepia filter), so the difference between 72 and
     * 60 is invisible while the file is ~38% smaller — 116 KB → 72 KB at 1920 for
     * `tetto-hero`. Anything shown at full strength stays at 72.
     */
    qualities: [75, 72, 70, 60],
    /**
     * Default runs to 2048 and 3840. No source on the site is wider than 1600, and
     * `withoutEnlargement` means both of those clamp to the same bytes as 1920 while
     * occupying two more cache entries each — a straight loss, since a cold entry is
     * the expensive case (see `minimumCacheTTL`). Capping here puts retina desktops on
     * the 1920 entry, which is the one most likely to already be warm.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    /**
     * A year, against Next's 4-hour default.
     *
     * At 4 hours every hero variant is re-transformed on the first request after each
     * window closes — a cold serverless invocation, a fetch of the source, and an
     * encode, all before the first byte reaches the browser. On a site with this much
     * traffic that cold path is what most visitors get, and it is the actual reason a
     * hero "takes a while": latency, not payload.
     *
     * Safe because every URL the optimizer sees is already content-addressed. Static
     * imports are emitted as `tetto-hero.<contenthash>.jpg`, so replacing a file
     * changes the URL; uploads go through `put(..., { addRandomSuffix: true })`, so
     * each one is unique. The single exception was `/logo-mark.png`, passed as a bare
     * string — it is a static import now, for exactly this reason. Keep it that way:
     * any `next/image` `src` that is a literal path under `public/` is a stale-cache
     * bug waiting for the next asset swap. `@/lib/media/hero-media` documents the same
     * hazard for the video, which cannot take this route.
     */
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG ?? "kk-edilizia",

  /** Must match the project slug in Sentry (Settings → Projects); override with SENTRY_PROJECT. */
  project: process.env.SENTRY_PROJECT ?? "javascript-nextjs",

  /** EU SaaS host; same as env `SENTRY_URL` (see SentryBuildOptions.sentryUrl). */
  sentryUrl,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  /** Set SENTRY_DEBUG_BUILD=1 or SENTRY_LOG_LEVEL=debug for sentry-cli details (also use SENTRY_LOG_LEVEL=info). */
  debug: sentryPluginDebug,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
