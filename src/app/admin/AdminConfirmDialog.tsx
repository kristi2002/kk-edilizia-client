"use client";

import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** danger = pulsante conferma evidenziato come azione rischiosa */
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
};

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Sì, confermo",
  cancelLabel = "Annulla",
  confirmVariant = "danger",
  onConfirm,
}: Props) {
  const titleId = useId();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, pending]);

  if (!open) return null;

  const confirmClass =
    confirmVariant === "danger"
      ? "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400/50"
      : "bg-[#c9a227] text-[#0a0a0a] hover:bg-[#ddb92e] focus-visible:ring-[#c9a227]/40";

  const handleConfirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      /* Errore già gestito dal componente (setError); modale resta aperto */
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Chiudi"
        disabled={pending}
        onClick={() => !pending && onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[#121212] p-6 shadow-2xl shadow-black/50"
      >
        <h2 id={titleId} className="font-serif text-xl text-white">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-400">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-2 border-white/20 bg-white/[0.06] px-5 py-3 text-base font-medium text-zinc-100 transition hover:bg-white/12 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleConfirm()}
            className={`rounded-xl px-5 py-3 text-base font-semibold shadow-lg transition focus:outline-none focus-visible:ring-2 disabled:opacity-60 ${confirmClass}`}
          >
            {pending ? "Attendere…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
