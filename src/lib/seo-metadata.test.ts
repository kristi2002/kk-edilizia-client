import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/data/site-store", () => ({
  getSiteUrl: async () => "https://kkedilizia.it",
}));

import { withLocaleAlternates } from "@/lib/seo-metadata";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("withLocaleAlternates", () => {
  it("emits the bare origin for the Italian home page", async () => {
    const meta = await withLocaleAlternates("it", "/", { title: "Home" });
    // Must match sitemap.ts exactly; a trailing-slash mismatch splits the signal.
    expect(meta.alternates?.canonical).toBe("https://kkedilizia.it");
    expect(meta.alternates?.languages).toMatchObject({
      it: "https://kkedilizia.it",
      en: "https://kkedilizia.it/en",
      "x-default": "https://kkedilizia.it",
    });
  });

  it("prefixes only the non-default locale", async () => {
    const it = await withLocaleAlternates("it", "/ristrutturazione-bagno", {});
    const en = await withLocaleAlternates("en", "/ristrutturazione-bagno", {});
    expect(it.alternates?.canonical).toBe(
      "https://kkedilizia.it/ristrutturazione-bagno",
    );
    expect(en.alternates?.canonical).toBe(
      "https://kkedilizia.it/en/ristrutturazione-bagno",
    );
  });

  it("normalises a path given without a leading slash", async () => {
    const meta = await withLocaleAlternates("it", "contatti", {});
    expect(meta.alternates?.canonical).toBe("https://kkedilizia.it/contatti");
  });

  it("keeps og:type, site name, locale and an image on pages with their own openGraph", async () => {
    const meta = await withLocaleAlternates("it", "/contatti", {
      openGraph: { title: "Contatti" },
    });
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: "K.K Edilizia",
      locale: "it_IT",
      title: "Contatti",
      url: "https://kkedilizia.it/contatti",
    });
    // Regression guard: no page emitted an og:image before this was set explicitly.
    expect(meta.openGraph).toHaveProperty("images");
  });

  it("keeps the large twitter card even when a page sets its own twitter block", async () => {
    const meta = await withLocaleAlternates("it", "/preventivo", {
      twitter: { title: "Preventivo" },
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Preventivo",
    });
  });

  it("maps the English locale for Open Graph", async () => {
    const meta = await withLocaleAlternates("en", "/contatti", {});
    expect(meta.openGraph).toMatchObject({ locale: "en_US" });
  });

  it("passes other metadata through untouched", async () => {
    const meta = await withLocaleAlternates("it", "/", {
      description: "desc",
      robots: { index: false, follow: false },
    });
    expect(meta.description).toBe("desc");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
