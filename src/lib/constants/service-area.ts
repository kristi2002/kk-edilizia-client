/**
 * Single source for:
 * - JSON-LD `LocalBusiness` / `HomeAndConstructionBusiness` → `areaServed`
 * - Portfolio project page → `shouldOfferModenaServiceLinks` (province towns ≠ Modena city)
 *
 * When you add a comune: update this list, then align footer copy and `ServiceSilos.modenaArea` in messages if needed.
 */
export const AREA_SERVED_CITY_NAMES = [
  "Modena",
  "Sassuolo",
  "Carpi",
  "Formigine",
  "Castelfranco Emilia",
  "Spilamberto",
  "Maranello",
  "Vignola",
  "Castelnuovo Rangone",
  "San Prospero",
  "Nonantola",
  "Mirandola",
  "Pavullo nel Frignano",
  "Fiorano Modenese",
  "Soliera",
  "Campogalliano",
  "Concordia sulla Secchia",
  "Finale Emilia",
] as const;

export type AreaServedCityName = (typeof AREA_SERVED_CITY_NAMES)[number];

type AreaServedEntry =
  | { "@type": "City"; name: string }
  | { "@type": "AdministrativeArea"; name: string };

/** Schema.org nodes for `areaServed` (cities + provincia). */
export function buildLocalBusinessAreaServed(): AreaServedEntry[] {
  const cities = AREA_SERVED_CITY_NAMES.map((name) => ({
    "@type": "City" as const,
    name,
  }));
  return [
    ...cities,
    {
      "@type": "AdministrativeArea" as const,
      name: "Provincia di Modena",
    },
  ];
}

const PROVINCE_NAMES = AREA_SERVED_CITY_NAMES.filter((n) => n !== "Modena");

function escapeTownPattern(name: string): string {
  if (name === "Pavullo nel Frignano") {
    return "(?:Pavullo(?:\\s+nel\\s+Frignano)?)";
  }
  return name.replace(/\s+/g, "\\s+");
}

const PROVINCE_LOCATION_RE = new RegExp(
  `\\b(${PROVINCE_NAMES.map(escapeTownPattern).join("|")})\\b`,
  "i",
);

/** True when project `location` names a provincial comune → show Modena bathroom silo cross-link. */
export function shouldOfferModenaServiceLinks(location: string): boolean {
  return PROVINCE_LOCATION_RE.test(location);
}
