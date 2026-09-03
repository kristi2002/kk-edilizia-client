import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getSite } from "@/lib/data/site-store";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutManifesto } from "@/components/sections/about/AboutManifesto";
import { AboutQuoteBand } from "@/components/sections/about/AboutQuoteBand";
import { AboutPillars } from "@/components/sections/about/AboutPillars";
import { AboutTerritory } from "@/components/sections/about/AboutTerritory";
import { AboutGallery } from "@/components/sections/about/AboutGallery";
import { AboutCredentials } from "@/components/sections/about/AboutCredentials";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, "/chi-siamo", {
    title: meta.aboutTitle,
    description: meta.aboutDescription,
  });
}

/**
 * `/chi-siamo`, rebuilt as a sequence of grounds rather than one column of prose.
 *
 * The page used to be a single `max-w-3xl` block on the paper ground: an `<h1>`, four
 * icon-and-paragraph rows, a bordered box, and two empty grey tiles with a camera glyph
 * where photographs should have been. It was the only page on the site with no dark band,
 * no photography and no rhythm — which on the page whose entire job is "who are you"
 * was the wrong thing to be thin about.
 *
 * It now runs the same alternation the home page does — dark, sunken, paper, dark,
 * raised, sunken, paper, raised, gold band — over seventeen photographs, **none** of
 * which appear anywhere else on the site (see `src/lib/media/about-imagery.ts`).
 *
 * `StatsStrip` and `CtaBanner` are reused rather than reimplemented: the figures come
 * from one namespace so this page cannot drift from the home page, and the closing band
 * is the same one every other route ends on.
 */
export default async function ChiSiamoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSite();

  return (
    <main className="flex flex-1 flex-col">
      <AboutHero site={site} locale={locale} />
      <StatsStrip />
      <AboutManifesto />
      <AboutQuoteBand />
      <AboutPillars />
      <AboutTerritory />
      <AboutGallery />
      <AboutCredentials site={site} />
      <CtaBanner />
    </main>
  );
}
