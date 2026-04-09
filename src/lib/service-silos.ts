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
