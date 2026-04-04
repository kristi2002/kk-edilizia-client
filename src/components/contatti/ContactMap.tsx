import type { SiteData } from "@/lib/site";
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
export function ContactMap({ site }: Props) {
  const directionsUrl = googleMapsDirectionsUrl(site);
  const embedUrl = googleMapsEmbedUrl(site);
  const line = formatAddressForMaps(site);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-zinc-800 to-zinc-950">
        <iframe
          title={`Mappa — ${site.address.city}`}
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
          aria-label="Apri Google Maps con indicazioni stradali verso la sede"
        >
          <span className="rounded-full bg-[#c9a227] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-md ring-1 ring-black/20">
            Indicazioni stradali
          </span>
        </a>
      </div>
      <p className="border-t border-white/10 px-4 py-3 text-center text-xs leading-relaxed text-zinc-500">
        <span className="text-zinc-400">{line}</span>
        <span className="mt-1 block">
          Clicca sulla mappa per aprire Google Maps con le indicazioni.
        </span>
      </p>
    </div>
  );
}
