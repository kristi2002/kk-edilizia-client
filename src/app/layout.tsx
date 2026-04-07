import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import {
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from "@/components/seo/GoogleTagManager";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
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
     * Favicon via Metadata API only (avoid duplicate `<link rel="icon">` in `<head>`).
     * Do not set `icon: '/favicon.ico'` here until `public/favicon.ico` exists (e.g. 32×32).
     * Until then, `next.config` rewrites `/favicon.ico` → `/logo.png` for default browser requests.
     */
    icons: {
      icon: [{ url: "/logo.png", type: "image/png", sizes: "any" }],
      apple: [{ url: "/logo.png", type: "image/png" }],
      shortcut: "/logo.png",
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
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="flex min-h-full flex-col bg-[#080808] font-sans">
        <GoogleTagManagerBody />
        <GoogleTagManagerHead />
        <GoogleAnalytics />
        <LocalBusinessJsonLd />
        {children}
      </body>
    </html>
  );
}
