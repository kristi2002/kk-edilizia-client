import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@/components/seo/Analytics";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { CONSENT_DEFAULTS_SNIPPET } from "@/lib/consent";
import { getSiteUrl } from "@/lib/data/site-store";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  adjustFontFallback: true,
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const url = await getSiteUrl();
  return {
    metadataBase: new URL(url),
    /**
     * Icons are the small derivatives written by `npm run generate:favicon` (wired into
     * `prebuild`). They used to point at `logo.png` — a 2048x2048, 8.1 MB master that
     * every page request pulled down just to paint a 16px tab icon.
     */
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
      shortcut: "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="it"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/*
          Scroll-reveal wrappers render with an inline `opacity: 0` that only
          framer-motion clears, so without JS everything below the fold stayed blank.
        */}
        <noscript>
          <style>{`[data-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-page font-sans">
        {/* Consent Mode v2 defaults must be in place before any tag can fire. */}
        <Script id="consent-defaults" strategy="beforeInteractive">
          {CONSENT_DEFAULTS_SNIPPET}
        </Script>
        <Analytics />
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
