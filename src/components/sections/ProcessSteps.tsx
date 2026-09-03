import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ClipboardCheck, Ruler, FileText, Hammer } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid } from "@/components/decor/Watermark";

export async function ProcessSteps() {
  const t = await getTranslations("ProcessSteps");
  const steps = [
    { icon: ClipboardCheck, title: t("s1t"), text: t("s1d") },
    { icon: Ruler, title: t("s2t"), text: t("s2d") },
    { icon: FileText, title: t("s3t"), text: t("s3d") },
    { icon: Hammer, title: t("s4t"), text: t("s4d") },
  ];

  return (
    <section
      id="come-lavoriamo"
      className="rule-gold relative scroll-mt-24 overflow-hidden bg-sunken px-4 py-24 sm:px-6"
    >
      <WatermarkGrid />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="process-steps-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">{t("intro")}</p>
        </FadeIn>

        <div className="relative mt-16">
          {/*
            The steps are a genuine sequence, so they get a connecting rule rather than
            four detached cards. Desktop only — it would cross the gaps when stacked.
          */}
          <span
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-gradient-to-r from-accent/10 via-accent/45 to-accent/10 lg:block"
          />
          <ol
            aria-labelledby="process-steps-heading"
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <FadeIn delay={i * 0.06}>
                  <span
                    aria-hidden="true"
                    className="relative z-10 mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-sunken font-serif text-lg text-accent-ink"
                  >
                    {i + 1}
                  </span>
                  <div className="mb-3 inline-flex rounded-xl bg-raised p-3 text-accent-ink">
                    <s.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl text-ink-1">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-3">
                    {s.text}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-14 text-center text-sm text-ink-3">
            {t("cta")}{" "}
            <Link
              href="/preventivo"
              className="font-medium text-accent-ink underline-offset-4 hover:underline"
            >
              {t("ctaLink")}
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
