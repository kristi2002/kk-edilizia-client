import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid } from "@/components/decor/Watermark";
import { MapPin } from "lucide-react";

/**
 * Where the firm actually goes, as a list instead of a sentence.
 *
 * The comuni and the Modena quarters were already named — buried mid-paragraph in
 * `body3`, which is the third screen of prose on the page. A visitor in Formigine
 * checking whether they are covered should not have to find them there, and the same
 * list set as discrete items is legible to a search engine reading the page for local
 * intent rather than for keyword density.
 *
 * Shared across the nine silos: the service area does not vary by trade.
 */
export async function ServiceSiloZones() {
  const t = await getTranslations("ServiceSilos");
  const zones = t.raw("zones") as string[];
  if (!Array.isArray(zones) || zones.length === 0) return null;

  return (
    <section className="rule-gold relative overflow-hidden bg-sunken px-4 py-20 sm:px-6">
      <WatermarkGrid />
      <div className="relative mx-auto max-w-5xl">
        <FadeIn>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            <MapPin className="h-4 w-4" aria-hidden />
            {t("zonesEyebrow")}
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-serif text-2xl text-ink-1 sm:text-3xl">
            {t("zonesTitle")}
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <ul className="mt-9 flex flex-wrap gap-2.5">
            {zones.map((zone) => (
              <li
                key={zone}
                className="rounded-full border border-line bg-raised px-4 py-2 text-sm font-medium text-ink-2 transition hover:border-accent/45 hover:text-accent-ink"
              >
                {zone}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.14}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-3">
            {t("zonesNote")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
