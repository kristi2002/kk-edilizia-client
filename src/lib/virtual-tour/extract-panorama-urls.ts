/**
 * Collects `panorama` URLs from a Pannellum multi-scene config for preloading.
 */
export function extractPanoramaUrlsFromPannellumConfig(
  config: Record<string, unknown>,
): string[] {
  const raw = config.scenes;
  if (!raw || typeof raw !== "object") return [];
  const urls: string[] = [];
  for (const scene of Object.values(raw as Record<string, unknown>)) {
    if (scene && typeof scene === "object" && "panorama" in scene) {
      const p = (scene as { panorama?: unknown }).panorama;
      if (typeof p === "string" && p.length > 0) urls.push(p);
    }
  }
  return [...new Set(urls)];
}
