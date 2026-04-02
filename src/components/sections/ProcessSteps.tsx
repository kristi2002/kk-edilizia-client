import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ClipboardCheck, Ruler, FileText, Hammer } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export async function ProcessSteps() {
  const t = await getTranslations("ProcessSteps");
  const steps = [
    {
      icon: ClipboardCheck,
      title: t("s1t"),
      text: t("s1d"),
    },
    {
      icon: Ruler,
      title: t("s2t"),
      text: t("s2d"),
    },
    {
      icon: FileText,
      title: t("s3t"),
      text: t("s3d"),
    },
    {
      icon: Hammer,
      title: t("s4t"),
      text: t("s4d"),
    },
  ];

  return (
    <section
      id="come-lavoriamo"
      className="scroll-mt-24 border-y border-white/10 bg-[#0c0c0c] px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <li className="relative">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10 font-serif text-lg text-[#c9a227]">
                  {i + 1}
                </span>
                <div className="mb-3 inline-flex rounded-xl bg-white/[0.04] p-3 text-[#c9a227]">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {s.text}
                </p>
              </li>
            </FadeIn>
          ))}
        </ol>

        <FadeIn delay={0.2}>
          <p className="mt-14 text-center text-sm text-zinc-500">
            {t("cta")}{" "}
            <Link
              href="/preventivo"
              className="font-medium text-[#c9a227] hover:underline"
            >
              {t("ctaLink")}
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
