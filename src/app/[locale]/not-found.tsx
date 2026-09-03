import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default async function NotFound() {
  let locale: string;
  try {
    locale = await getLocale();
  } catch {
    locale = routing.defaultLocale;
  }
  setRequestLocale(locale);
  const t = await getTranslations("NotFound");

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-page px-4 py-32 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-ink">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink-1">{t("title")}</h1>
      <p className="mt-3 max-w-md text-ink-4">{t("text")}</p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-full border border-line-2 px-8 py-3 text-sm font-semibold text-ink-1 hover:bg-raised-2"
      >
        {t("home")}
      </Link>
    </main>
  );
}
