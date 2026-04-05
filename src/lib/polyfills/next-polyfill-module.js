/**
 * Slim replacement for `next/dist/build/polyfills/polyfill-module.js`.
 * Next’s default bundle adds ~1.4 KiB of no-op checks for APIs already
 * present in our browserslist; Lighthouse flags that as “legacy JavaScript”.
 * Safari 16.4 lacks `URL.canParse` (Next uses it in normalized-asset-prefix).
 */
if (typeof URL !== "undefined" && !("canParse" in URL)) {
  URL.canParse = function canParse(url, base) {
    try {
      return !!new URL(url, base);
    } catch {
      return false;
    }
  };
}
