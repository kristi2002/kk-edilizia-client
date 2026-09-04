/**
 * Content-fingerprinted URLs for the hero video.
 *
 * The hero media lives at fixed paths under `public/` — `hero.webm`, `hero.mp4` — so
 * replacing the footage leaves the URL untouched. A browser that already holds the old
 * response has no reason to ask again, and keeps playing the previous clip: after the
 * angle-grinder footage replaced the scaffolding shot, a cached copy of the old poster
 * was still being served to an already-warm browser under an identical
 * `/_next/image?url=%2Fmedia%2Fhero-poster.jpg&w=1920&q=72` key, long after the file on
 * disk had changed. Restarting the server does not help — nothing about the URL changed,
 * so there is nothing for the cache to miss on.
 *
 * Appending the file's own content hash makes the URL change whenever the bytes do, which
 * is the only thing a cache reliably keys on. Swapping a file is still "drop it at the
 * same path"; the fingerprint follows by itself.
 *
 * The poster does NOT come through here — `next/image` rejects a local `src` carrying a
 * query string with a 400 unless the exact search string is listed in
 * `images.localPatterns`, which cannot express a hash that changes. It is a static import
 * in `HeroBackgroundLayers` instead, so the bundler emits it to
 * `/_next/static/media/hero-poster.<contenthash>.jpg` and fingerprints it natively.
 * Plain static files under `public/` ignore the query string and serve normally, so the
 * two video sources take the `?v=` route.
 *
 * Server-only: it reads from disk, and is imported by `Hero`, a server component. The
 * page is statically rendered (`revalidate = 3600`), so the reads happen at build.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

export type HeroVideoSources = { webm: string; mp4: string };

/** Paths relative to `public/`. */
const VIDEO_FILES = {
  webm: "media/hero.webm",
  mp4: "media/hero.mp4",
} as const;

/**
 * `/media/hero.mp4` → `/media/hero.mp4?v=<8 hex>`.
 *
 * Eight hex characters of SHA-256: enough that two hand-picked clips will not collide,
 * short enough to stay readable in a network log. A file that cannot be read falls back
 * to the bare URL — losing the fingerprint costs a stale cache, whereas returning null
 * would drop the footage from the hero entirely, so the quiet failure is the milder one.
 */
function versioned(publicPath: string): string {
  const url = `/${publicPath}`;
  try {
    const bytes = readFileSync(path.join(process.cwd(), "public", publicPath));
    return `${url}?v=${createHash("sha256").update(bytes).digest("hex").slice(0, 8)}`;
  } catch {
    return url;
  }
}

let cached: HeroVideoSources | null = null;

export function heroVideoSources(): HeroVideoSources {
  const read = () => ({
    webm: versioned(VIDEO_FILES.webm),
    mp4: versioned(VIDEO_FILES.mp4),
  });
  /** Re-read in dev so dropping in a new clip shows up without restarting the server. */
  if (process.env.NODE_ENV === "development") return read();
  return (cached ??= read());
}
