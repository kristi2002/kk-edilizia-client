"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LogoMark } from "@/components/brand/LogoMark";
import { Phone, Mail, MapPin, Star, HardHat } from "lucide-react";
import { type SiteData } from "@/lib/site";
import { SERVICE_SILO_ROUTES, type ServiceSiloKey } from "@/lib/service-silos";

type Props = { site: SiteData };

/**
 * Column heading. Each column set its own text size, so one shared
 * `font-medium uppercase` class rendered the three headings at 16px, 14px and 12px
 * depending on which parent they sat in. Fixing the size here also brings them onto
 * the eyebrow the rest of the site uses.
 */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
      {children}
    </p>
  );
}

/** One label/value pair in the fiscal legend. */
function Datum({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[0.625rem] font-medium uppercase tracking-[0.16em] text-ink-4">
        {label}
      </dt>
      <dd className="mt-1 text-xs text-ink-3">{children}</dd>
    </div>
  );
}

export function Footer({ site }: Props) {
  const t = useTranslations("Footer");
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
    /*
     * `rule-gold` rather than `border-t border-line`: on a dark ground `--line` is white
     * at 12%, the same hairline the section dividers already abandoned for being
     * invisible. The gold rule is what every other band on the site opens with.
     */
    <footer className="rule-gold on-dark relative isolate overflow-hidden bg-inverse">
      {/* Warm falloff carrying the gold band above into the dark, so the slab has a top. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_65%_100%_at_20%_0%,rgba(201,162,39,0.11),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-12">
          {/* Letterhead: mark, name, trade, blurb. */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-4">
              <LogoMark size={72} />
              <span className="text-balance font-serif text-2xl leading-tight tracking-tight text-ink-1">
                {site.brand}
              </span>
            </div>
            {/* The trade sits on its own line: beside the wordmark it broke over two. */}
            <p className="mt-5 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-accent-ink">
              {t("craftMark")}
            </p>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink-3">
              {t("tagline", { area })}
            </p>
            {site.publicReviewUrl?.trim() ? (
              <a
                href={site.publicReviewUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-ink transition-colors hover:bg-accent/20"
              >
                <Star className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("reviewsLink")}
              </a>
            ) : null}
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>{t("contacts")}</FooterHeading>
            <ul className="mt-5 space-y-3.5 text-sm text-ink-3">
              <li>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-ink-1"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2.5 break-all transition-colors hover:text-ink-1"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
                  {site.email}
                </a>
              </li>
              {site.streetAddress?.trim() ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
                  <span className="leading-relaxed">
                    {site.streetAddress}
                    <br />
                    {[site.postalCode, site.addressLocality, site.addressRegion]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </li>
              ) : null}
            </ul>
            <p className="mt-6 border-t border-accent/15 pt-4 text-xs leading-relaxed text-ink-4">
              {t("napAreas")}
            </p>
          </div>

          <div className="lg:col-span-5">
            <FooterHeading>{t("zonesTitle")}</FooterHeading>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-ink-4">
              {t("zonesIntro")}
            </p>
            {/*
             * Nine links stacked in one column made this the tallest thing in the footer
             * by 100px. CSS columns balance the two halves on their own.
             */}
            <ul className="mt-5 space-y-2.5 text-sm leading-snug text-ink-3 lg:columns-2 lg:gap-x-8 lg:space-y-0">
              {SERVICE_SILO_ROUTES.map((route) => (
                <li key={route.path} className="lg:mb-2.5 lg:break-inside-avoid">
                  <Link href={route.path} className="transition-colors hover:text-ink-1">
                    {linkLabels[route.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/*
       * Fine print sits on its own darker plinth. As the fourth column it was a wall of
       * 12px type competing with the navigation; as a legend it is where a visitor looks
       * for a VAT number, and the footer reads as two zones instead of one flat slab.
       */}
      <div className="relative border-t border-accent/15 bg-sunken">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <FooterHeading>{t("legalData")}</FooterHeading>
            <p className="text-sm text-ink-2">{site.legalName}</p>
          </div>
          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            <Datum label="P.IVA">{site.vatId}</Datum>
            <Datum label="C.F.">{site.fiscalCode}</Datum>
            <Datum label="REA">{site.rea}</Datum>
            {site.vatEu.trim() ? <Datum label={t("vatEu")}>{site.vatEu}</Datum> : null}
            <Datum label={t("legalForm")}>{site.legalForm}</Datum>
            <Datum label={t("pec")}>
              <a
                href={`mailto:${site.pec}`}
                className="underline underline-offset-2 transition-colors hover:text-ink-1"
              >
                {site.pec}
              </a>
            </Datum>
          </dl>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-xs text-ink-3 sm:flex-row sm:justify-between sm:px-6">
            <p className="flex items-center gap-2 text-center sm:text-left">
              <HardHat className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
              <span>
                © {new Date().getFullYear()} {site.legalName} — {t("rights")}
              </span>
            </p>
            {/* Only link to the legal notice anywhere on the site once quick links went. */}
            <nav className="flex items-center gap-6">
              <Link href="/privacy" className="transition-colors hover:text-ink-1">
                {t("privacyLink")}
              </Link>
              <Link href="/note-legali" className="transition-colors hover:text-ink-1">
                {t("legalLink")}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
