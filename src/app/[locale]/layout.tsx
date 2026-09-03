import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { LocaleHtmlLang } from "@/components/site/LocaleHtmlLang";
import { Shell } from "@/components/site/Shell";
import { routing } from "@/i18n/routing";
import { pickClientMessages } from "@/lib/i18n-client-messages";
import enMessages from "../../../messages/en.json";
import itMessages from "../../../messages/it.json";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Marketing pages are static and refreshed on a timer. This previously carried
 * `dynamic = "force-dynamic"`, which made every public route server-render on demand
 * (no CDN caching, and each page's own `revalidate` silently ignored). The prerender
 * problem it worked around was a missing `setRequestLocale()` on the home route, which
 * is now called there like every other page.
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return {
    title: {
      default: meta.siteTitle,
      template: `%s | K.K Edilizia`,
    },
    description: meta.siteDescription,
    openGraph: {
      title: meta.siteTitle,
      description: meta.siteDescription,
      locale: locale === "en" ? "en_US" : "it_IT",
      type: "website",
      siteName: "K.K Edilizia",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.siteTitle,
      description: meta.siteDescription,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = locale === "en" ? enMessages : itMessages;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={pickClientMessages(messages)}
    >
      <LocaleHtmlLang />
      <Shell>{children}</Shell>
    </NextIntlClientProvider>
  );
}
