"use client";

import { AlertCircle } from "lucide-react";

/**
 * Error and required-field affordances shared by the public forms.
 *
 * These lived only inside `PrenotaForm`, so `PreventivoForm` — the page every CTA on
 * the site points at — kept the older treatment: `text-red-400`, which measures 2.89:1
 * on the light ground against the 4.5:1 WCAG AA minimum, and no `role="alert"` at all,
 * so a screen reader announced nothing when validation failed. Sharing the components
 * is what stops the two from drifting apart again.
 *
 * `text-red-700` measures 6.42:1 on white.
 */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

/** Asterisk for sighted readers, a word for everyone else. */
export function RequiredMark({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden="true" className="text-accent-ink">
        {" *"}
      </span>
      <span className="sr-only">{` (${label})`}</span>
    </>
  );
}
