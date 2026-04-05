import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { HomeStimaTeaser } from "@/components/sections/HomeStimaTeaser";
import { getProjects } from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { isCostEstimateEnabled } from "@/lib/features";

const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => ({ default: m.Services })),
);
const HomeServiceSilos = dynamic(() =>
  import("@/components/sections/HomeServiceSilos").then((m) => ({
    default: m.HomeServiceSilos,
  })),
);
const FeaturedProjects = dynamic(() =>
  import("@/components/sections/FeaturedProjects").then((m) => ({
    default: m.FeaturedProjects,
  })),
);
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

export const metadata: Metadata = {
  verification: {
    google: "KdPU4_43HtR4glC64es63YrJvtPMXdz6xrq06E2iRkc",
  },
};

export default async function Home() {
  const [projects, projectTypes] = await Promise.all([
    getProjects(),
    getProjectTypes(),
  ]);
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <StatsStrip />
      <Services />
      <HomeServiceSilos />
      <ProcessSteps />
      {isCostEstimateEnabled() ? <HomeStimaTeaser /> : null}
      <FeaturedProjects projects={projects} projectTypes={projectTypes} />
      <ReviewsStrip />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
