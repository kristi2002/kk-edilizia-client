/**
 * Ensures equirectangular assets respond before Pannellum runs (avoids opaque
 * viewer failures when files are missing from public/).
 */
export function preloadPanoramaImages(
  urls: string[],
): Promise<{ ok: true } | { ok: false; url: string }> {
  return new Promise((resolve) => {
    let pending = urls.length;
    if (pending === 0) {
      resolve({ ok: true });
      return;
    }
    let settled = false;
    function doneOk() {
      if (settled) return;
      pending -= 1;
      if (pending === 0) {
        settled = true;
        resolve({ ok: true });
      }
    }
    function fail(url: string) {
      if (settled) return;
      settled = true;
      resolve({ ok: false, url });
    }
    for (const url of urls) {
      const img = new Image();
      img.onload = doneOk;
      img.onerror = () => fail(url);
      img.src = url;
    }
  });
}
