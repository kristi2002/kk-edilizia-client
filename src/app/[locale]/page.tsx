import { Hero } from "@/components/sections/Hero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { Services } from "@/components/sections/Services";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CostEstimator } from "@/components/sections/CostEstimator";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default async function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <StatsStrip />
      <Services />
      <ProcessSteps />
      <CostEstimator />
      <FeaturedProjects />
      <ReviewsStrip />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
