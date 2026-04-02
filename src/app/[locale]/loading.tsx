export default function Loading() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-32"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#c9a227]/30 border-t-[#c9a227]"
        role="status"
      />
      <p className="text-sm text-zinc-500">Caricamento…</p>
    </div>
  );
}
