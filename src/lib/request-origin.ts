/**
 * Origine pubblica della richiesta corrente (es. stesso host del deploy senza /admin).
 * Utile quando canonical/env non sono ancora configurati.
 */
export function inferPublicOriginFromHeaders(headersList: Headers): string | null {
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  if (!host) return null;
  const proto = headersList.get("x-forwarded-proto");
  const inferredProto =
    proto ??
    (host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
      ? "http"
      : "https");
  return `${inferredProto}://${host}`;
}
