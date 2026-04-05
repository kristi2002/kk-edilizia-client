import type { SiteData } from "@/lib/site";
import { getTranslations } from "next-intl/server";
import {
  formatAddressForMaps,
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
} from "@/lib/maps";

type Props = {
  site: SiteData;
};

/**
 * Mappa anteprima (embed) + overlay che apre Google Maps con indicazioni verso l’indirizzo del sito.
 * L’indirizzo viene da `getSite()` (Redis / admin o fallback `staticSite`).
 */
export async function ContactMap({ site }: Props) {
  const t = await getTranslations("ContactMap");
  const directionsUrl = googleMapsDirectionsUrl(site);
  const embedUrl = googleMapsEmbedUrl(site);
  const line = formatAddressForMaps(site);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950">
        <iframe
          title={t("iframeTitle", { city: site.address.city })}
          className="pointer-events-none h-full w-full opacity-90 grayscale contrast-125"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
        />
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex flex-col items-center justify-end bg-gradient-to-t from-black/55 via-black/10 to-transparent pb-5 text-center transition hover:from-black/65"
          aria-label={t("directionsAria")}
        >
          <span className="rounded-full bg-[#c9a227] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-md ring-1 ring-black/20">
            {t("directionsCta")}
          </span>
        </a>
      </div>
      <p className="border-t border-white/10 px-4 py-3 text-center text-xs leading-relaxed text-zinc-500">
        <span className="text-zinc-400">{line}</span>
        <span className="mt-1 block">{t("footerHint")}</span>
      </p>
    </div>
  );
}
