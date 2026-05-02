import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { HomeLocalIntro } from "@/components/sections/HomeLocalIntro";
import { HomeInternalHub } from "@/components/sections/HomeInternalHub";
import { BrandEcosystemStrip } from "@/components/seo/BrandEcosystemStrip";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { HomeStimaTeaser } from "@/components/sections/HomeStimaTeaser";
// import { getProjects } from "@/lib/data/projects-store";
// import { getProjectTypes } from "@/lib/data/project-types-store";
import { getSite } from "@/lib/data/site-store";
import { isCostEstimateEnabled } from "@/lib/features";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../messages/en.json";
import itMessages from "../../../messages/it.json";

const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => ({ default: m.Services })),
);
const HomeServiceSilos = dynamic(() =>
  import("@/components/sections/HomeServiceSilos").then((m) => ({
    default: m.HomeServiceSilos,
  })),
);
// Progetti recenti / portfolio strip: restore when photos are ready.
// const FeaturedProjects = dynamic(() =>
//   import("@/components/sections/FeaturedProjects").then((m) => ({
//     default: m.FeaturedProjects,
//   })),
// );
const ReviewsStrip = dynamic(() =>
  import("@/components/sections/ReviewsStrip").then((m) => ({
    default: m.ReviewsStrip,
  })),
);
const FaqSection = dynamic(() =>
  import("@/components/sections/FaqSection").then((m) => ({
    default: m.FaqSection,
  })),
);
const CtaBanner = dynamic(() =>
  import("@/components/sections/CtaBanner").then((m) => ({
    default: m.CtaBanner,
  })),
);

export const revalidate = 60;

type HomeParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: HomeParams): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  const keywords = meta.homeKeywords
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return withLocaleAlternates(locale, "/", {
    verification: {
      google: "KdPU4_43HtR4glC64es63YrJvtPMXdz6xrq06E2iRkc",
    },
    title: { absolute: meta.homeAbsoluteTitle },
    description: meta.homeAbsoluteDescription,
    keywords,
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

export default async function Home() {
  // const [projects, projectTypes, site] = await Promise.all([
  //   getProjects(),
  //   getProjectTypes(),
  //   getSite(),
  // ]);
  const site = await getSite();
  const reviewUrl = site.publicReviewUrl?.trim() || undefined;
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <StatsStrip />
      <HomeLocalIntro />
      <HomeInternalHub />
      <BrandEcosystemStrip />
      <Services />
      <HomeServiceSilos />
      <ProcessSteps />
      {isCostEstimateEnabled() ? <HomeStimaTeaser /> : null}
      {/* <FeaturedProjects projects={projects} projectTypes={projectTypes} /> */}
      <ReviewsStrip reviewUrl={reviewUrl} />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
