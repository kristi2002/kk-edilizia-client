import Link from "next/link";

/** Global 404 (outside [locale]); keep free of next-intl server APIs. */
export default function GlobalNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-page px-4 py-32 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent-ink">
        404
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink-1">Pagina non trovata</h1>
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
  );
}
