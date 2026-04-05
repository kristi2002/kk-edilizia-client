import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Services } from "@/components/sections/Services";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { HomeStimaTeaser } from "@/components/sections/HomeStimaTeaser";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { getProjects } from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { isCostEstimateEnabled } from "@/lib/features";

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
      <ProcessSteps />
      {isCostEstimateEnabled() ? <HomeStimaTeaser /> : null}
      <FeaturedProjects projects={projects} projectTypes={projectTypes} />
      <ReviewsStrip />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
