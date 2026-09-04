import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import "../globals.css";
import { Analytics } from "@/components/seo/Analytics";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { Shell } from "@/components/site/Shell";
import { CONSENT_DEFAULTS_SNIPPET } from "@/lib/consent";
import { routing } from "@/i18n/routing";
import { pickClientMessages } from "@/lib/i18n-client-messages";
import { fontVariables } from "../fonts";
import { rootMetadata, rootViewport } from "../root-metadata";
import enMessages from "../../../messages/en.json";
import itMessages from "../../../messages/it.json";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Root layout for the public site.
 *
 * It owns `<html>` and `<body>` because nothing above it can know the locale. The
 * previous single root at `src/app/layout.tsx` hardcoded `lang="it"` and left a client
 * component to patch `document.documentElement.lang` in an effect after hydration — so
 * every `/en` URL served `<html lang="it">` to crawlers, social scrapers and a screen
 * reader's first pass, and only agents that ran the JavaScript ever saw the correction.
 *
 * `/admin` has its own root (`src/app/admin/layout.tsx`); the two are siblings, so every
 * route still resolves through exactly one root layout.
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = rootViewport;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return {
    ...(await rootMetadata()),
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
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-page font-sans">
        {/* Consent Mode v2 defaults must be in place before any tag can fire. */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {CONSENT_DEFAULTS_SNIPPET}
        </Script>
        <Analytics />
        <LocalBusinessJsonLd />
        <NextIntlClientProvider
          locale={locale}
          messages={pickClientMessages(messages)}
        >
          <Shell>{children}</Shell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
