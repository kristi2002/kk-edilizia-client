import { routing } from "@/i18n/routing";

/** Path for links and JSON-LD (respects localePrefix as-needed). */
export function localizedPath(locale: string, pathname: string): string {
  const path =
    pathname === "" || pathname === "/"
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : `/${pathname}`;
  if (locale === routing.defaultLocale && routing.localePrefix === "as-needed") {
    return path;
  }
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
