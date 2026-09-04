import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../fonts";
import { rootMetadata } from "../root-metadata";

/**
 * Root layout for `/admin`.
 *
 * The public site's root moved into `src/app/[locale]/layout.tsx` so that `<html lang>`
 * can be the actual locale rather than a hardcoded `it` patched up after hydration.
 * `/admin` sits outside `[locale]`, so it needs a root of its own; it is Italian-only
 * and always `noindex`.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await rootMetadata()),
    title: "Pannello di controllo",
    robots: { index: false, follow: false },
  };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${fontVariables} h-full`}>
      <body className="min-h-screen bg-[#060606] font-sans text-ink-2 antialiased">
        {children}
      </body>
    </html>
  );
}
