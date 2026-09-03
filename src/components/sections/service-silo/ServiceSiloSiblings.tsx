import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { WatermarkRing } from "@/components/decor/Watermark";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";
import { SERVICE_SILO_ROUTES, type ServiceSiloKey } from "@/lib/service-silos";
import { ArrowUpRight } from "lucide-react";

/**
 * The other eight silos, as picture cards.
 *
 * These were bare text rows — the only cross-links on the page, and the mechanism the
 * whole silo structure depends on to spread authority, rendered as the least clickable
 * thing on it.
 *
 * The photographs are `HOME_IMAGERY`, deliberately: that set is the *identity* picture
 * for each silo, the one the home grid already shows for the same destination, so a
 * visitor who saw "Impianti elettrici" on the home page recognises the card here. The
 * page's own photography (`SERVICE_IMAGERY`) stays unique to the page it belongs to.
 */
export async function ServiceSiloSiblings({ siloKey }: { siloKey: ServiceSiloKey }) {
  const t = await getTranslations("ServiceSilos");
  const tNav = await getTranslations("Nav");
  const tSilos = await getTranslations("HomeServiceSilos");
  const tMedia = await getTranslations("HomeMedia");

  const siblings = SERVICE_SILO_ROUTES.filter((r) => r.key !== siloKey);

  return (
    <section className="relative overflow-hidden border-t border-line bg-raised px-4 py-24 sm:px-6">
      <WatermarkRing position="bottom-left" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {tNav("services")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("siblingsTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-3">{t("siblingsIntro")}</p>
        </FadeIn>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {siblings.map((route, i) => {
            const image = HOME_IMAGERY[route.key as keyof typeof HOME_IMAGERY];
            return (
              <li key={route.path}>
                <FadeIn delay={i * 0.04}>
                  <Link
                    href={route.path}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised-2 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
                  >
                    {image ? (
                      <span className="photo-card relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={image.src}
                          alt={tMedia(image.alt)}
                          fill
                          quality={70}
                          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        <PhotoGleam />
                      </span>
                    ) : null}
                    <span
                      aria-hidden="true"
                      className="h-[3px] w-0 bg-gradient-to-r from-accent to-accent-deep transition-all duration-500 group-hover:w-full"
                    />
                    <span className="flex flex-1 flex-col p-5">
                      <span className="font-serif text-lg leading-tight text-ink-1 transition group-hover:text-accent-ink">
                        {tSilos(`${route.key}Title`)}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-ink">
                        {tSilos("readMore")}
                        <ArrowUpRight
                          className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </span>
                    </span>
                  </Link>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
