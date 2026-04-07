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

export default withNextIntl(nextConfig);
