import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProjectLocalized } from "@/lib/data/projects";
import { getProjects } from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { FadeIn } from "@/components/motion/FadeIn";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PortfolioPage");
  const [projects, projectTypes] = await Promise.all([
    getProjects(),
    getProjectTypes(),
  ]);
  const tourProject = projects.find((p) => p.virtualTour);

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
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

        {tourProject && (
          <FadeIn delay={0.06}>
            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {t("tourBannerTitle")}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {t("tourBannerText")}
                </p>
              </div>
              <Link
                href={`/portfolio/${tourProject.slug}/virtual-tour`}
                className="inline-flex shrink-0 justify-center rounded-full border border-[#c9a227]/50 bg-[#c9a227]/15 px-6 py-2.5 text-sm font-semibold text-[#c9a227] transition hover:bg-[#c9a227]/25"
              >
                {t("tourBannerCta")}
              </Link>
            </div>
          </FadeIn>
        )}

        <ul className="mt-16 grid gap-8 sm:grid-cols-2">
          {projects.map((p, i) => {
            const loc = getProjectLocalized(p, locale, projectTypes);
            return (
              <li key={p.slug}>
                <FadeIn delay={i * 0.05}>
                  <Link
                    href={`/portfolio/${p.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-[#c9a227]/35"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.coverImage}
                        alt=""
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xs font-medium uppercase tracking-wider text-[#c9a227]">
                          {loc.category} · {loc.location}
                        </p>
                        <h2 className="mt-2 font-serif text-2xl text-white">
                          {loc.title}
                        </h2>
                      </div>
                    </div>
                    <p className="p-6 text-sm leading-relaxed text-zinc-500">
                      {loc.excerpt}
                    </p>
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
