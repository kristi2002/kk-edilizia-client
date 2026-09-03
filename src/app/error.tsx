"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
        Errore
      </p>
      <h1 className="mt-4 font-serif text-3xl text-ink-1 md:text-4xl">
        Qualcosa è andato storto
      </h1>
      <p className="mt-3 max-w-md text-ink-4">
        Non siamo riusciti a completare l&apos;operazione. Riprova o torna alla
        home.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-on-accent hover:bg-accent-deep"
        >
          Riprova
        </button>
        <Link
          href="/"
          className="rounded-full border border-line-2 px-8 py-3 text-sm font-semibold text-ink-1 hover:bg-raised-2"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
