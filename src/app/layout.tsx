import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export async function generateMetadata(): Promise<Metadata> {
  const url = await getSiteUrl();
  return {
    metadataBase: new URL(url),
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
      <body className="flex min-h-full flex-col bg-[#080808] font-sans">
        <GoogleTagManagerBody />
        <GoogleTagManagerHead />
        <GoogleAnalytics />
        <LocalBusinessJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
