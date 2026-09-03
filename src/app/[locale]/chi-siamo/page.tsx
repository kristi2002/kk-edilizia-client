import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { Shield, Users, Award, FileCheck, Camera } from "lucide-react";
import { getSite } from "@/lib/data/site-store";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, "/chi-siamo", {
    title: meta.aboutTitle,
    description: meta.aboutDescription,
  });
}


export default async function ChiSiamoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutPage");
  const site = await getSite();
  const pillars = [
    {
      icon: Users,
      title: t("p1t"),
      text: t("p1d"),
    },
    {
      icon: Shield,
      title: t("p2t"),
      text: t("p2d"),
    },
    {
      icon: Award,
      title: t("p3t"),
      text: t("p3d"),
    },
    {
      icon: FileCheck,
      title: t("p4t"),
      text: t("p4d", {
        insurance: site.insurance,
        compliance: site.compliance,
      }),
    },
  ];

  return (
    <main className="flex flex-1 flex-col bg-page px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ink-1 md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-3">
              {t("intro", { brand: site.brand })}
            </p>
          </FadeIn>

          <ul className="mt-16 space-y-12">
            {pillars.map((item, i) => (
              <li key={item.title}>
                <FadeIn delay={i * 0.08}>
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-ink">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl text-ink-1">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-ink-4">{item.text}</p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn delay={0.35}>
            <div className="mt-16 rounded-2xl border border-line bg-raised p-6">
              <h2 className="font-serif text-lg text-ink-1">
                {t("certificationsTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-4">
                {t("certificationsHint", { base: site.certifications })}
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("galleryEyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-2xl text-ink-1 sm:text-3xl">
              {t("galleryTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-4">
              {t.rich("galleryIntro", {
                code: (chunks) => (
                  <code className="rounded bg-raised-2 px-1.5 py-0.5 text-xs text-ink-2">
                    {chunks}
                  </code>
                ),
              })}
            </p>
            <p className="mt-2 text-xs text-ink-4">{t("galleryFooterNote")}</p>
            {/*
              Placeholders, not photographs. These two slots hotlinked Unsplash — one of
              them the same stranger's face the old hero used — presented as this
              company’s work. Swap each tile for an <Image> once real site photos exist.
            */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[t("fig1Caption"), t("fig2Caption")].map((caption) => (
                <figure
                  key={caption}
                  className="overflow-hidden rounded-2xl border border-line bg-raised"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-sunken">
                    <span aria-hidden="true" className="wm-grid" />
                    <span aria-hidden="true" className="wm-ring -bottom-40 -right-36" />
                    <Camera className="relative h-8 w-8 text-accent-ink opacity-50" aria-hidden />
                  </div>
                  <figcaption className="border-t border-line px-4 py-3 text-xs text-ink-4">
                    {caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
