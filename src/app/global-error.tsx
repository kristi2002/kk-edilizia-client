"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body className="flex min-h-screen flex-col items-center justify-center bg-page px-4 text-center text-ink-2">
        <main role="alert" aria-live="assertive" className="max-w-md">
          <h1 className="font-serif text-2xl text-ink-1">Errore dell&apos;applicazione</h1>
          <p className="mt-3 text-sm">
            Ricarica la pagina o riprova più tardi.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-on-accent"
          >
            Riprova
          </button>
        </main>
      </body>
    </html>
  );
}
