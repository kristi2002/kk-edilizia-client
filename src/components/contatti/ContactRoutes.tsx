import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Calculator,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid } from "@/components/decor/Watermark";
import { isCostEstimateEnabled } from "@/lib/features";
import { AREA_SERVED_CITY_NAMES } from "@/lib/constants/service-area";
import type { SiteData } from "@/lib/site";

/**
 * The closing band: the routes that are faster than a free-form message, and the comuni
 * we cover.
 *
 * Rows on a raised panel rather than a second grid of cards — the same index device that
 * closes `ProcessSteps` — so it reads as a list of alternatives to the form above it and
 * not as a rival set of calls to action. The page's only CTA button used to be a lone
 * "Richiedi preventivo online" under the contact list; it is the first row here.
 *
 * The comuni strip is the one piece of genuinely local copy on the page, and it is the
 * same list that feeds `areaServed` in the LocalBusiness schema, so the two cannot drift.
 */
type Route = {
  href: "/preventivo" | "/prenota" | "/stima-costi" | "/impresa-edile-modena" | "/chi-siamo";
  icon: LucideIcon;
  titleKey:
    | "routeQuoteTitle"
    | "routeBookingTitle"
    | "routeEstimateTitle"
    | "routeImpresaTitle"
    | "routeAboutTitle";
  descKey:
    | "routeQuoteDesc"
    | "routeBookingDesc"
    | "routeEstimateDesc"
    | "routeImpresaDesc"
    | "routeAboutDesc";
};

export async function ContactRoutes({
  site,
  locale,
}: {
  site: SiteData;
  locale: string;
}) {
  const t = await getTranslations("ContactsPage");
  const area = locale === "en" ? site.serviceAreaEn : site.serviceArea;

  const routes: Route[] = [
    {
      href: "/preventivo",
      icon: FileText,
      titleKey: "routeQuoteTitle",
      descKey: "routeQuoteDesc",
    },
    {
      href: "/prenota",
      icon: CalendarCheck,
      titleKey: "routeBookingTitle",
      descKey: "routeBookingDesc",
    },
    ...(isCostEstimateEnabled()
      ? ([
          {
            href: "/stima-costi",
            icon: Calculator,
            titleKey: "routeEstimateTitle",
            descKey: "routeEstimateDesc",
          },
        ] satisfies Route[])
      : []),
    {
      href: "/impresa-edile-modena",
      icon: Building2,
      titleKey: "routeImpresaTitle",
      descKey: "routeImpresaDesc",
    },
    {
      href: "/chi-siamo",
      icon: Users,
      titleKey: "routeAboutTitle",
      descKey: "routeAboutDesc",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-sunken px-4 py-20 sm:px-6 md:py-24">
      <WatermarkGrid />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <div className="rounded-3xl border border-line bg-raised p-6 sm:p-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
                  {t("routesLabel")}
                </p>
                <h2 className="mt-3 text-balance font-serif text-2xl text-ink-1 sm:text-3xl">
                  {t("routesTitle")}
                </h2>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-[2px] w-20 bg-gradient-to-r from-accent to-accent/10"
                />
                <p className="mt-5 text-sm leading-relaxed text-ink-3">
                  {t("routesIntro")}
                </p>
              </div>

              <ul className="mt-8 divide-y divide-line border-t border-line lg:col-span-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12">
                {routes.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="group flex items-center gap-4 py-5"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-page text-accent-ink transition group-hover:border-accent/50 group-hover:bg-accent/10">
                        <route.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink-1 transition group-hover:text-accent-ink">
                          {t(route.titleKey)}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-3">
                          {t(route.descKey)}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-accent-ink opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-14 border-t border-line pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("townsLabel")}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {AREA_SERVED_CITY_NAMES.map((town) => (
                <li
                  key={town}
                  className="rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-ink-2"
                >
                  {town}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-2xl text-sm text-ink-4">{area}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
