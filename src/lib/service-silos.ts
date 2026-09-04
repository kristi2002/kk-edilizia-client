/** Keyword-rich service URLs (topical authority / SEO silos). */
export const SERVICE_SILO_ROUTES = [
  /** Hubs (high-ticket) */
  { path: "/ristrutturazioni-chiavi-in-mano", key: "chiaviInMano" },
  { path: "/ristrutturazione-bagno", key: "bagno" },
  { path: "/ristrutturazione-cucina", key: "cucina" },

  /** Spokes (specific trades) */
  { path: "/impianti-elettrici-modena", key: "elettrico" },
  { path: "/idraulico-modena", key: "idraulico" },
  { path: "/opere-murarie", key: "murarie" },
  { path: "/cartongesso-isolamento", key: "cartongessoIsolamento" },
  { path: "/posa-pavimenti-rivestimenti", key: "pavimentiRivestimenti" },
  { path: "/rifacimento-tetto-facciate", key: "tettoFacciate" },
] as const;

export type ServiceSiloKey = (typeof SERVICE_SILO_ROUTES)[number]["key"];

export function serviceSiloPathForKey(key: ServiceSiloKey): string {
  const row = SERVICE_SILO_ROUTES.find((r) => r.key === key);
  if (!row) throw new Error(`Unknown service silo: ${key}`);
  return row.path;
}

/**
 * Hub and spoke relationships between the silos.
 *
 * Crawling the site, every one of the seventeen Italian routes received exactly
 * seventeen inbound links — one from every other page, all of them from the header and
 * footer, all with the navigation label as anchor text. The URL structure described a
 * silo; the link graph described a flat mesh, and nothing told a crawler which page owns
 * a topic and which supports it.
 *
 * `hub` is the page a silo belongs under; `related` is the handful of trades that
 * genuinely meet it on site — a bathroom needs a plumber and a tiler, a roof needs
 * masonry — rather than all eight siblings listed identically on all nine pages.
 */
export const SERVICE_SILO_RELATIONS: Record<
  ServiceSiloKey,
  { hub: ServiceSiloKey | null; related: ServiceSiloKey[] }
> = {
  chiaviInMano: {
    hub: null,
    related: [
      "bagno",
      "cucina",
      "murarie",
      "elettrico",
      "idraulico",
      "cartongessoIsolamento",
      "pavimentiRivestimenti",
      "tettoFacciate",
    ],
  },
  bagno: {
    hub: "chiaviInMano",
    related: ["idraulico", "pavimentiRivestimenti", "cartongessoIsolamento", "murarie"],
  },
  cucina: {
    hub: "chiaviInMano",
    related: ["elettrico", "idraulico", "pavimentiRivestimenti", "murarie"],
  },
  elettrico: {
    hub: "chiaviInMano",
    related: ["cucina", "cartongessoIsolamento", "idraulico", "murarie"],
  },
  idraulico: {
    hub: "chiaviInMano",
    related: ["bagno", "cucina", "murarie", "pavimentiRivestimenti"],
  },
  murarie: {
    hub: "chiaviInMano",
    related: ["cartongessoIsolamento", "tettoFacciate", "pavimentiRivestimenti", "bagno"],
  },
  cartongessoIsolamento: {
    hub: "chiaviInMano",
    related: ["murarie", "elettrico", "tettoFacciate", "pavimentiRivestimenti"],
  },
  pavimentiRivestimenti: {
    hub: "chiaviInMano",
    related: ["bagno", "cucina", "murarie", "cartongessoIsolamento"],
  },
  tettoFacciate: {
    hub: "chiaviInMano",
    related: ["murarie", "cartongessoIsolamento", "idraulico", "pavimentiRivestimenti"],
  },
};
