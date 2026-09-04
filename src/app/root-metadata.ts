import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/data/site-store";

/**
 * Icons are the small derivatives written by `npm run generate:brand` (wired into
 * `prebuild`). They used to point at `logo.png` — a 2048x2048, 8.1 MB master that every
 * page request pulled down just to paint a 16px tab icon.
 */
const ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32" },
    { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
  ],
  apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  shortcut: "/favicon.ico",
};

/**
 * `metadataBase` + icons, shared by the two root layouts so a split root cannot mean
 * one half of the site quietly losing its favicon or resolving relative OG URLs wrong.
 */
export async function rootMetadata(): Promise<Metadata> {
  const url = await getSiteUrl();
  return {
    metadataBase: new URL(url),
    icons: ICONS,
  };
}

/**
 * `themeColor` belongs to the viewport export, not `metadata` — Next drops it from
 * `generateMetadata` with an "Unsupported metadata" warning. The value is `--page` from
 * globals.css, so mobile browser chrome sits on the same paper as the site.
 */
export const rootViewport: Viewport = {
  themeColor: "#f3f1eb",
};
