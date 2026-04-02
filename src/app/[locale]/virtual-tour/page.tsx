import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { VirtualTourView } from "@/components/virtual-tour/VirtualTourView";
import { site } from "@/lib/site";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";
import "./virtual-tour.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const vt =
    locale === "en" ? enMessages.VirtualTour : itMessages.VirtualTour;
  return {
    title: vt.metaTitle,
    description: vt.metaDescription,
  };
}

export default async function VirtualTourPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("VirtualTour");

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-16 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-10">
            <VirtualTourView />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-zinc-500">
            <p className="font-medium text-zinc-300">{t("howTitle")}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{t("howLi1")}</li>
              <li>{t("howLi2")}</li>
              <li>{t("howLi3")}</li>
            </ul>
          </div>
        </FadeIn>

        <p className="mt-10 text-center text-sm text-zinc-600">
          <Link href="/portfolio" className="text-[#c9a227] hover:underline">
            {t("backPortfolio")}
          </Link>
          <span className="mx-2 text-zinc-700">·</span>
          <Link href="/contatti" className="text-[#c9a227] hover:underline">
            {t("backContacts")} {site.brand}
          </Link>
        </p>
      </div>
    </main>
  );
}
