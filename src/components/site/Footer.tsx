"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeSectionLink } from "@/components/site/HomeSectionLink";
import { Phone, Mail, MapPin } from "lucide-react";
import { formatLegalAddress, type SiteData } from "@/lib/site";
import { isCostEstimateEnabled } from "@/lib/features";
import { SERVICE_SILO_ROUTES } from "@/lib/service-silos";

type Props = { site: SiteData };

export function Footer({ site }: Props) {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const area = locale === "en" ? site.serviceAreaEn : site.serviceArea;

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-h-0 lg:col-span-1">
          <p className="text-balance text-2xl font-semibold leading-tight tracking-tight text-white">
            {site.brand}
          </p>
          <p className="mt-3 max-w-xs min-h-[7.5rem] text-pretty text-sm leading-relaxed text-zinc-400 sm:min-h-[6.5rem]">
            {t("tagline", { area })}
          </p>
        </div>
        <div className="space-y-3 text-sm text-zinc-400">
          <p className="font-medium uppercase tracking-wider text-[#c9a227]">
            {t("contacts")}
          </p>
          <a
            href={`tel:${site.phoneTel}`}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4 shrink-0 text-[#c9a227]" />
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <Mail className="h-4 w-4 shrink-0 text-[#c9a227]" />
            {site.email}
          </a>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
            <span>
              <span className="block text-zinc-300">{formatLegalAddress(site)}</span>
              <span className="mt-2 block text-xs leading-relaxed text-zinc-400">
                {t("napAreas")}
              </span>
            </span>
          </p>
        </div>
        <div>
          <p className="font-medium uppercase tracking-wider text-[#c9a227]">
            {t("quick")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>
              <Link href="/portfolio" className="hover:text-white">
                {tNav("portfolio")}
              </Link>
            </li>
            <li className="pt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {t("serviceLinks")}
            </li>
            {SERVICE_SILO_ROUTES.map((route) => {
              const linkLabel =
                route.key === "bagno"
                  ? t("linkBagno")
                  : route.key === "cartongesso"
                    ? t("linkCartongesso")
                    : t("linkTetto");
              return (
                <li key={route.path}>
                  <Link href={route.path} className="hover:text-white">
                    {linkLabel}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/contatti" className="hover:text-white">
                {tNav("contacts")}
              </Link>
            </li>
            <li>
              <Link href="/prenota" className="hover:text-white">
                {tNav("booking")}
              </Link>
            </li>
            <li>
              <Link href="/preventivo" className="hover:text-white">
                {tNav("quote")}
              </Link>
            </li>
            {isCostEstimateEnabled() ? (
              <li>
                <Link href="/stima-costi" className="hover:text-white">
                  {tNav("estimate")}
                </Link>
              </li>
            ) : null}
            <li>
              <HomeSectionLink sectionId="faq" className="hover:text-white">
                FAQ
              </HomeSectionLink>
            </li>
            <li>
              <HomeSectionLink
                sectionId="come-lavoriamo"
                className="hover:text-white"
              >
                {t("howWeWork")}
              </HomeSectionLink>
            </li>
            <li>
              <Link href="/chi-siamo" className="hover:text-white">
                {tNav("about")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                {t("privacyLink")}
              </Link>
            </li>
            <li>
              <Link href="/note-legali" className="hover:text-white">
                {t("legalLink")}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-xs leading-relaxed text-zinc-400">
          <p className="font-medium uppercase tracking-wider text-[#c9a227]">
            {t("legalData")}
          </p>
          <p className="mt-3 text-zinc-400">{site.legalName}</p>
          <p className="mt-2">P.IVA {site.vatId}</p>
          <p>C.F. {site.fiscalCode}</p>
          <p>REA {site.rea}</p>
          <p className="mt-2">
            {t("legalForm")} {site.legalForm}
          </p>
          <p className="mt-2">
            {t("pec")}:{" "}
            <a
              href={`mailto:${site.pec}`}
              className="text-zinc-400 underline hover:text-white"
            >
              {site.pec}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} {site.legalName} — {t("rights")}
      </div>
    </footer>
  );
}
