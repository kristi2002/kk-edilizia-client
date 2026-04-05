import { getTranslations } from "next-intl/server";
import { HeroBackgroundLayers } from "./HeroBackgroundLayers";
import { HeroClient } from "./HeroClient";

export async function Hero() {
  const t = await getTranslations("Hero");
  return (
    <HeroClient
      badge={t("badge")}
      titleLine1={t("titleLine1")}
      titleHighlight={t("titleHighlight")}
      subtitle={t("subtitle")}
      ctaQuote={t("ctaQuote")}
      ctaWorks={t("ctaWorks")}
      statYears={t("statYears")}
      statProjects={t("statProjects")}
      statCommitment={t("statCommitment")}
    >
      <HeroBackgroundLayers />
    </HeroClient>
  );
}
