import type { SiteData } from "@/lib/site";

/** Indirizzo su una riga per query Google Maps (geocoding / indicazioni). */
export function formatAddressForMaps(site: SiteData): string {
  const a = site.address;
  return [a.street, a.postalCode, a.city, a.province, a.country]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}

/** Apre Google Maps con destinazione = sede (indicazioni). */
export function googleMapsDirectionsUrl(site: SiteData): string {
  const dest = encodeURIComponent(formatAddressForMaps(site));
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

/**
 * Embed senza API key (anteprima statica). L’interazione avviene tramite overlay link alle indicazioni.
 * Opzionale: incolla l’URL «Embed a map» da Google Maps in NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL.
 */
export function googleMapsEmbedUrl(site: SiteData): string {
  const custom = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL?.trim();
  if (custom) return custom;
  const q = encodeURIComponent(formatAddressForMaps(site));
  return `https://maps.google.com/maps?q=${q}&z=16&hl=it&output=embed`;
}
