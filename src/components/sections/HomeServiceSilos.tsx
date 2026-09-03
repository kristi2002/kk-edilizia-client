import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";
import { SERVICE_SILO_ROUTES } from "@/lib/service-silos";
import { ArrowUpRight } from "lucide-react";

/**
 * The nine silo entry points.
 *
 * These carry a real photograph rather than the ghosted ground used on the Services
 * cards: the picture is shown at full strength, so its `alt` is genuine content and
 * earns its place in the markup. The gold gleam rakes across the image on hover — the
 * "reflective" treatment — while the card body stays flat so the copy is legible.
 */
export async function HomeServiceSilos() {
  const t = await getTranslations("HomeServiceSilos");
  const tMedia = await getTranslations("HomeMedia");

  return (
    <section
      id="servizi-modena"
      className="relative border-t border-line bg-page px-4 py-24 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(201,162,39,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-3">{t("intro")}</p>
        </FadeIn>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SILO_ROUTES.map((route, i) => {
            const image = HOME_IMAGERY[route.key as keyof typeof HOME_IMAGERY];
            return (
              <li key={route.path}>
                <FadeIn delay={i * 0.06}>
                  <Link
                    href={route.path}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
                  >
                    {image ? (
                      <span className="photo-card relative block aspect-[16/10] overflow-hidden">
                        <Image
                          src={image.src}
                          alt={tMedia(image.alt)}
                          fill
                          quality={72}
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        <span className="photo-card__gleam" aria-hidden="true" />
                        {/* Keeps the gold rule below readable against a light photo. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent"
                        />
                      </span>
                    ) : null}

                    <span
                      aria-hidden="true"
                      className="h-[3px] w-0 bg-gradient-to-r from-accent to-accent-deep transition-all duration-500 group-hover:w-full"
                    />

                    <span className="flex flex-1 flex-col p-6">
                      <span className="font-serif text-xl text-ink-1 transition group-hover:text-accent-ink">
                        {t(`${route.key}Title`)}
                      </span>
                      <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-3">
                        {t(`${route.key}Desc`)}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-ink">
                        {t("readMore")}
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
