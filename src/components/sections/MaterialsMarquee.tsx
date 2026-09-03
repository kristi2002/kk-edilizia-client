import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkRing } from "@/components/decor/Watermark";

/**
 * Materials strip. The brands were already named throughout the copy and in the
 * `knowsAbout` JSON-LD but never shown, so the claim carried no visual weight.
 *
 * Set as text rather than logos on purpose: reproducing manufacturer marks is a
 * trademark question, and the accompanying note keeps the claim accurate ("or certified
 * equivalents") instead of implying a partnership that does not exist.
 */
export async function MaterialsMarquee() {
  const t = await getTranslations("Materials");
  const items = t("items")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="rule-gold relative overflow-hidden bg-surface-warm px-4 py-16 sm:px-6">
      <WatermarkRing position="top-right" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-2xl text-white sm:text-3xl">
            {t("title")}
          </h2>
        </FadeIn>

        <div className="marq mt-10">
          {/* The list is duplicated so the -50% keyframe loops seamlessly. */}
          <ul className="marq-track" aria-hidden="true">
            {[...items, ...items].map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="whitespace-nowrap px-7 font-sans text-lg font-semibold uppercase tracking-[0.14em] text-ink-3 sm:text-xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        {/* Readable, non-animated copy of the same list for assistive tech. */}
        <p className="sr-only">{items.join(", ")}</p>

        <FadeIn delay={0.08}>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-4">
            {t("intro")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
