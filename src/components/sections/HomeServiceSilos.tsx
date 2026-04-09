import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { SERVICE_SILO_ROUTES } from "@/lib/service-silos";
import { ArrowUpRight } from "lucide-react";

export async function HomeServiceSilos() {
  const t = await getTranslations("HomeServiceSilos");

  return (
    <section
      id="servizi-modena"
      className="relative border-t border-white/10 bg-[#0a0a0a] px-4 py-24 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {SERVICE_SILO_ROUTES.map((route, i) => (
            <li key={route.path}>
              <FadeIn delay={i * 0.06}>
                <Link
                  href={route.path}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#c9a227]/40 hover:bg-white/[0.06]"
                >
                  <span className="font-serif text-xl text-white group-hover:text-[#c9a227]">
                    {t(`${route.key}Title`)}
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                    {t(`${route.key}Desc`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#c9a227]">
                    {t("readMore")}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
