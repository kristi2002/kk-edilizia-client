import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { HomeLocalIntro } from "@/components/sections/HomeLocalIntro";
import { FaqPageJsonLd } from "@/components/seo/FaqPageJsonLd";
import { visibleFaqByLocale } from "@/lib/data/faq";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { MaterialsMarquee } from "@/components/sections/MaterialsMarquee";
import { HomeStimaTeaser } from "@/components/sections/HomeStimaTeaser";
import { isCostEstimateEnabled } from "@/lib/features";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../messages/en.json";
import itMessages from "../../../messages/it.json";

const Services = dynamicImport(() =>
  import("@/components/sections/Services").then((m) => ({ default: m.Services })),
);
const HomeServiceSilos = dynamicImport(() =>
  import("@/components/sections/HomeServiceSilos").then((m) => ({
    default: m.HomeServiceSilos,
  })),
);
// Progetti recenti / portfolio strip: restore when photos are ready.
// const FeaturedProjects = dynamicImport(() =>
//   import("@/components/sections/FeaturedProjects").then((m) => ({
//     default: m.FeaturedProjects,
//   })),
// );
const FaqSection = dynamicImport(() =>
  import("@/components/sections/FaqSection").then((m) => ({
    default: m.FaqSection,
  })),
);
const CtaBanner = dynamicImport(() =>
  import("@/components/sections/CtaBanner").then((m) => ({
    default: m.CtaBanner,
  })),
);

export const revalidate = 3600;

type HomeParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: HomeParams): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, "/", {
    verification: {
      google: "KdPU4_43HtR4glC64es63YrJvtPMXdz6xrq06E2iRkc",
    },
    title: { absolute: meta.homeAbsoluteTitle },
    description: meta.homeAbsoluteDescription,
    openGraph: {
      title: meta.homeAbsoluteTitle,
      description: meta.homeAbsoluteDescription,
    },
    twitter: {
      title: meta.homeAbsoluteTitle,
      description: meta.homeAbsoluteDescription,
    },
  });
}

export default async function Home({ params }: HomeParams) {
  const { locale } = await params;
  /** Required for static rendering; its absence here is why the layout carried force-dynamic. */
  setRequestLocale(locale);

  /**
   * FAQPage for `/`. The block was already on the page but emitted no schema — only the
   * silos and `/impresa-edile-modena` did — so the questions here were invisible as
   * structured data. It mirrors the rendered accordion exactly, which is what Google
   * requires: both read `visibleFaqByLocale`, so an entry flagged `hidden` leaves the
   * schema at the same time it leaves the page, and `FaqSection` ships every answer it
   * does render into the HTML rather than mounting only the open one.
   */
  const faqItems =
    visibleFaqByLocale[locale === "en" ? "en" : "it"] ?? visibleFaqByLocale.it;

  /*
   * Section order alternates grounds (deep → base → warm → base …) so the page reads as
   * a sequence rather than one 13.000px block. The reviews block that used to sit before
   * the FAQ was removed: its own copy described the testimonials as demonstrative.
   * `BrandEcosystemStrip` is gone too — it repeated the Materials caveat in different
   * words, and its outbound manufacturer links moved into `MaterialsMarquee`. So is
   * `HomeInternalHub`: its "Da dove iniziare" cards retold the process the section above
   * it had just walked through, and it now closes `ProcessSteps` as an index.
   */
  return (
    <>
      <FaqPageJsonLd
        items={faqItems.map((item) => ({ question: item.q, answer: item.a }))}
      />
      <main className="flex flex-1 flex-col">
        <Hero />
        <StatsStrip />
        <HomeLocalIntro />
        <Services />
        <MaterialsMarquee />
        <HomeServiceSilos />
        <ProcessSteps />
        {isCostEstimateEnabled() ? <HomeStimaTeaser /> : null}
        {/* <FeaturedProjects projects={projects} projectTypes={projectTypes} /> */}
        <FaqSection />
        <CtaBanner />
      </main>
    </>
  );
}
