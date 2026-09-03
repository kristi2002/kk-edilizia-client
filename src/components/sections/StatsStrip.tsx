import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * Server component: it only reads translations, so it does not need to ship the
 * `StatsStrip` namespace to the client. The values here are the single source of truth —
 * the hero reads the same keys.
 */
export async function StatsStrip() {
  const t = await getTranslations("StatsStrip");
  const stats = [
    { value: t("v1"), label: t("years") },
    { value: t("v2"), label: t("projects") },
    { value: t("v3"), label: t("referent") },
    { value: t("v4"), label: t("quotes") },
  ];

  return (
    <section className="rule-gold border-b border-line bg-sunken px-4 py-14 sm:px-6">
      <dl className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <FadeIn key={s.label}>
            <div className="text-center lg:text-left">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-serif text-4xl text-accent-ink sm:text-5xl">
                  {s.value}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-auto mt-3 block h-px w-10 bg-accent/35 lg:mx-0"
                />
                <span className="mt-3 block text-sm font-medium uppercase tracking-wider text-ink-3">
                  {s.label}
                </span>
              </dd>
            </div>
          </FadeIn>
        ))}
      </dl>
    </section>
  );
}
