import { getTranslations } from "next-intl/server";
import { HeroBackgroundLayers } from "./HeroBackgroundLayers";
import { HeroClient } from "./HeroClient";
import { AREA_SERVED_CITY_NAMES } from "@/lib/constants/service-area";

export async function Hero() {
  const t = await getTranslations("Hero");
  return (
    <HeroClient
      badge={t("badge")}
      titleLine1={t("titleLine1")}
      titleHighlight={t("titleHighlight")}
      subtitle={t("subtitle")}
      ctaQuote={t("ctaQuote")}
      ctaBooking={t("ctaBooking")}
      ctaWorks={t("ctaWorks")}
      townsLabel={t("townsLabel")}
      towns={AREA_SERVED_CITY_NAMES.slice(0, 6)}
      statYears={t("statYears")}
      statProjects={t("statProjects")}
      statCommitment={t("statCommitment")}
    >
      <HeroBackgroundLayers />
    </HeroClient>
  );
}
