/**
 * Comuni di provincia (non Modena città) usati per:
 * - cross-link SEO dalla pagina progetto verso il silo bagno a Modena (`shouldOfferModenaServiceLinks`).
 *
 * Aggiungi qui nuovi comuni quando servono anche in copy/schema (`LocalBusinessJsonLd`, footer, `ServiceSilos.modenaArea`).
 */
export const PROVINCE_TOWNS_FOR_MODENA_CROSS_LINK = [
  "Sassuolo",
  "Carpi",
  "Formigine",
  "Spilamberto",
  "Maranello",
  "Vignola",
  "Castelfranco Emilia",
  "Castelnuovo Rangone",
  "San Prospero",
  "Nonantola",
  "Mirandola",
  "Pavullo",
  "Fiorano Modenese",
  "Soliera",
  "Campogalliano",
] as const;

function townNameToPatternSegment(name: string): string {
  return name.replace(/\s+/g, "\\s+");
}

/** Pattern con word boundary; usato solo tramite `shouldOfferModenaServiceLinks`. */
const PROVINCE_TOWN_MODENA_CROSS_LINK_RE = new RegExp(
  `\\b(${PROVINCE_TOWNS_FOR_MODENA_CROSS_LINK.map(townNameToPatternSegment).join("|")})\\b`,
  "i",
);

/** True se la location del progetto cita un comune di provincia: mostra il link verso ristrutturazioni bagno Modena. */
export function shouldOfferModenaServiceLinks(location: string): boolean {
  return PROVINCE_TOWN_MODENA_CROSS_LINK_RE.test(location);
}
