"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-4 text-center text-zinc-300">
        <h1 className="font-serif text-2xl text-white">Errore dell&apos;applicazione</h1>
        <p className="mt-3 max-w-md text-sm">
          Ricarica la pagina o riprova più tardi.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a]"
        >
          Riprova
        </button>
      </body>
    </html>
  );
}
