import { getTranslations } from "next-intl/server";
import { HeroBackgroundLayers } from "./HeroBackgroundLayers";
import { HeroClient } from "./HeroClient";
import { AREA_SERVED_CITY_NAMES } from "@/lib/constants/service-area";
import { heroVideoSources } from "@/lib/media/hero-media";

export async function Hero() {
  const t = await getTranslations("Hero");
  /**
   * Figures come from the StatsStrip namespace so the hero and the strip 800px below it
   * cannot drift apart again — they used to read "15+ / 120+" and "10+ / 40+" on the
   * same screen.
   */
  const tStats = await getTranslations("StatsStrip");

  return (
    <HeroClient
      badge={t("badge")}
      titleLine1={t("titleLine1")}
      titleHighlight={t("titleHighlight")}
      subtitle={t("subtitle")}
      ctaQuote={t("ctaQuote")}
      ctaBooking={t("ctaBooking")}
      townsLabel={t("townsLabel")}
      towns={AREA_SERVED_CITY_NAMES.slice(0, 6)}
      stats={[
        { value: tStats("v1"), label: t("statYears") },
        { value: tStats("v2"), label: t("statProjects") },
        { value: tStats("v4"), label: t("statCommitment") },
      ]}
    >
      {/* Hashed here rather than in the client component: the fingerprint is a disk read. */}
      <HeroBackgroundLayers video={heroVideoSources()} />
    </HeroClient>
  );
}
