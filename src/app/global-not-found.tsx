import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "Pagina non trovata | K.K Edilizia",
  robots: { index: false, follow: false },
};

/**
 * 404 for URLs that never reach a root layout.
 *
 * With the root split into `[locale]` and `admin`, there is no longer a layout above
 * both to render an unmatched URL, so this file supplies its own `<html>`/`<body>` —
 * the same job `global-error.tsx` does for uncaught errors.
 *
 * In practice almost nothing lands here: `proxy.ts` rewrites every non-API, non-asset
 * path into `/it/...` or `/en/...`, where the localised `[locale]/not-found.tsx`
 * handles it with real translated copy. This is the floor under the rest.
 */
export default function GlobalNotFound() {
  return (
    <html lang="it" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-page font-sans">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-ink">
            404
          </p>
          <h1 className="mt-4 font-serif text-4xl text-ink-1">
            Pagina non trovata
          </h1>
          <p className="mt-3 max-w-md text-ink-4">
            Il contenuto che cerchi non esiste o è stato spostato.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex rounded-full border border-line-2 px-8 py-3 text-sm font-semibold text-ink-1 hover:bg-raised-2"
          >
            Torna alla home
          </Link>
        </main>
      </body>
    </html>
  );
}
