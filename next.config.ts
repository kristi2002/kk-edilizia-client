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

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion"],
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
    formats: ["image/avif", "image/webp"],
    qualities: [75, 72, 70],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pannellum.org",
        pathname: "/images/**",
      },
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
