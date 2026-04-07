import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { Shield, Users, Award, FileCheck } from "lucide-react";
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

const workPhoto =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80";
const sitePhoto =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";

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
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              {t("intro", { brand: site.brand })}
            </p>
          </FadeIn>

          <ul className="mt-16 space-y-12">
            {pillars.map((item, i) => (
              <li key={item.title}>
                <FadeIn delay={i * 0.08}>
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#c9a227]">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl text-white">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-zinc-500">{item.text}</p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn delay={0.35}>
            <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="font-serif text-lg text-white">
                {t("certificationsTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {t("certificationsHint", { base: site.certifications })}
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("galleryEyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
              {t("galleryTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              {t.rich("galleryIntro", {
                code: (chunks) => (
                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-300">
                    {chunks}
                  </code>
                ),
              })}
            </p>
            <p className="mt-2 text-xs text-zinc-600">{t("galleryFooterNote")}</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={workPhoto}
                    alt={t("fig1Alt")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-zinc-500">
                  {t("fig1Caption")}
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={sitePhoto}
                    alt={t("fig2Alt")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-zinc-500">
                  {t("fig2Caption")}
                </figcaption>
              </figure>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
