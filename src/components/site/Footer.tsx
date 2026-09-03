"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeSectionLink } from "@/components/site/HomeSectionLink";
import { Phone, Mail, MapPin, Star, HardHat } from "lucide-react";
import { type SiteData } from "@/lib/site";
import { isCostEstimateEnabled, isPortfolioEnabled } from "@/lib/features";
import { SERVICE_SILO_ROUTES, type ServiceSiloKey } from "@/lib/service-silos";

type Props = { site: SiteData };

export function Footer({ site }: Props) {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const area = locale === "en" ? site.serviceAreaEn : site.serviceArea;
  const linkLabels: Record<ServiceSiloKey, string> = {
    chiaviInMano: t("linkChiaviInMano"),
    bagno: t("linkBagno"),
    cucina: t("linkCucina"),
    elettrico: t("linkElettrico"),
    idraulico: t("linkIdraulico"),
    murarie: t("linkMurarie"),
    cartongessoIsolamento: t("linkCartongessoIsolamento"),
    pavimentiRivestimenti: t("linkPavimentiRivestimenti"),
    tettoFacciate: t("linkTettoFacciate"),
  };

  return (
    <footer className="on-dark border-t border-line bg-inverse">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-h-0 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <p className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink-1">
              {site.brand}
            </p>
          </div>
          <p className="mt-3 max-w-xs min-h-[7.5rem] text-pretty text-sm leading-relaxed text-ink-3 sm:min-h-[6.5rem]">
            {t("tagline", { area })}
          </p>
        </div>
        <div className="space-y-3 text-sm text-ink-3">
          <p className="font-medium uppercase tracking-wider text-accent-ink">
            {t("contacts")}
          </p>
          <a
            href={`tel:${site.phoneTel}`}
            className="flex items-center gap-2 transition-colors hover:text-ink-1"
          >
            <Phone className="h-4 w-4 shrink-0 text-accent-ink" />
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 transition-colors hover:text-ink-1"
          >
            <Mail className="h-4 w-4 shrink-0 text-accent-ink" />
            {site.email}
          </a>
          {site.streetAddress?.trim() ? (
            <p className="flex items-start gap-2 text-sm not-italic text-ink-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
              <span>
                {site.streetAddress}
                <br />
                {[site.postalCode, site.addressLocality, site.addressRegion]
                  .filter(Boolean)
                  .join(" ")}
              </span>
            </p>
          ) : null}
          {site.publicReviewUrl?.trim() ? (
            <a
              href={site.publicReviewUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-ink-1"
            >
              <Star className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
              {t("reviewsLink")}
            </a>
          ) : null}
          <p className="text-xs leading-relaxed text-ink-3">{t("napAreas")}</p>
        </div>
        <div>
          <p className="font-medium uppercase tracking-wider text-accent-ink">
            {t("zonesTitle")}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-4">
            {t("zonesIntro")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-3">
            {SERVICE_SILO_ROUTES.map((route) => {
              const linkLabel = linkLabels[route.key];
              return (
                <li key={route.path}>
                  <Link href={route.path} className="hover:text-ink-1">
                    {linkLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 font-medium uppercase tracking-wider text-accent-ink">
            {t("quick")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink-3">
            <li>
              <Link href="/impresa-edile-modena" className="hover:text-ink-1">
                {t("linkImpresaEdileModena")}
              </Link>
            </li>
            {isPortfolioEnabled() ? (
              <li>
                <Link href="/portfolio" className="hover:text-ink-1">
                  {tNav("portfolio")}
                </Link>
              </li>
            ) : null}
            <li>
              <Link href="/contatti" className="hover:text-ink-1">
                {tNav("contacts")}
              </Link>
            </li>
            <li>
              <Link href="/prenota" className="hover:text-ink-1">
                {tNav("booking")}
              </Link>
            </li>
            <li>
              <Link href="/preventivo" className="hover:text-ink-1">
                {tNav("quote")}
              </Link>
            </li>
            {isCostEstimateEnabled() ? (
              <li>
                <Link href="/stima-costi" className="hover:text-ink-1">
                  {tNav("estimate")}
                </Link>
              </li>
            ) : null}
            <li>
              <HomeSectionLink sectionId="faq" className="hover:text-ink-1">
                FAQ
              </HomeSectionLink>
            </li>
            <li>
              <HomeSectionLink
                sectionId="come-lavoriamo"
                className="hover:text-ink-1"
              >
                {t("howWeWork")}
              </HomeSectionLink>
            </li>
            <li>
              <Link href="/chi-siamo" className="hover:text-ink-1">
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-ink-1">
                {t("privacyLink")}
              </Link>
            </li>
            <li>
              <Link href="/note-legali" className="hover:text-ink-1">
                {t("legalLink")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-xs leading-relaxed text-ink-3">
          <p className="font-medium uppercase tracking-wider text-accent-ink">
            {t("legalData")}
          </p>
          <p className="mt-3 text-ink-3">{site.legalName}</p>
          <p className="mt-2">P.IVA {site.vatId}</p>
          <p>C.F. {site.fiscalCode}</p>
          <p>REA {site.rea}</p>
          {site.vatEu.trim() ? (
            <p className="mt-2">
              {t("vatEu")} {site.vatEu}
            </p>
          ) : null}
          <p className="mt-2">
            {t("legalForm")} {site.legalForm}
          </p>
          <p className="mt-2">
            {t("pec")}:{" "}
            <a
              href={`mailto:${site.pec}`}
              className="text-ink-3 underline hover:text-ink-1"
            >
              {site.pec}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 text-center sm:flex-row sm:gap-6 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <HardHat
              className="h-4 w-4 shrink-0 text-accent-ink"
              aria-hidden
            />
            <span>
              © {new Date().getFullYear()} {site.legalName} — {t("rights")}
            </span>
          </div>
          <span
            className="hidden h-4 w-px bg-raised-2 sm:block"
            aria-hidden
          />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-4">
            {t("craftMark")}
          </p>
        </div>
      </div>
    </footer>
  );
}
