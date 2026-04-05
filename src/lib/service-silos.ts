/** Keyword-rich service URLs (topical authority / SEO silos). */
export const SERVICE_SILO_ROUTES = [
  { path: "/ristrutturazioni-bagno", key: "bagno" },
  { path: "/cartongesso-modena", key: "cartongesso" },
  { path: "/rifacimento-tetto", key: "tetto" },
] as const;

export type ServiceSiloKey = (typeof SERVICE_SILO_ROUTES)[number]["key"];

export function serviceSiloPathForKey(key: ServiceSiloKey): string {
  const row = SERVICE_SILO_ROUTES.find((r) => r.key === key);
  if (!row) throw new Error(`Unknown service silo: ${key}`);
  return row.path;
}
