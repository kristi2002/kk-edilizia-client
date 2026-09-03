"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  slots: readonly string[];
  placeholder: string;
  id?: string;
  /** Error state, for the trigger's outline. */
  invalid?: boolean;
  /** Id of the error paragraph, so the trigger announces the message. */
  describedBy?: string;
};

/**
 * Custom time slot picker — matches date field: label + trailing icon slot.
 */
export function BookingTimeSelect({
  value,
  onChange,
  onBlur,
  slots,
  placeholder,
  id,
  invalid = false,
  describedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const label = value || placeholder;

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onBlur();
        }
      }}
    >
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        // No aria-invalid: the trigger is a button, and that role does not take it.
        // The error paragraph is wired through aria-describedby instead.
        aria-describedby={describedBy}
        className={`flex min-h-[46px] w-full items-stretch overflow-hidden rounded-xl border bg-page text-left text-sm text-ink-1 transition focus:outline-none focus-within:bg-raised focus-within:ring-1 ${
          invalid
            ? "border-red-600 focus-within:border-red-600 focus-within:ring-red-600"
            : "border-control-line focus-within:border-accent focus-within:ring-accent"
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`flex min-w-0 flex-1 items-center px-4 py-3 ${
            value ? "text-ink-1" : "text-ink-4"
          }`}
        >
          {label}
        </span>
        <span
          className="flex w-11 shrink-0 items-center justify-center border-l border-line text-ink-3"
          aria-hidden
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            strokeWidth={1.75}
          />
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute bottom-full left-0 right-0 z-30 mb-2 max-h-[min(11rem,40vh)] overflow-y-auto overscroll-contain rounded-xl border border-line bg-raised py-1 shadow-[0_-24px_50px_-20px_rgba(20,23,26,0.45)] [scrollbar-color:rgba(20,23,26,0.25)_transparent] [scrollbar-width:thin]"
        >
          {slots.map((slot) => {
            const selected = value === slot;
            return (
              <li key={slot} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`w-full px-3 py-1.5 text-left text-sm transition ${
                    selected
                      ? "bg-accent/15 text-accent-ink"
                      : "text-ink-3 hover:bg-raised-2 hover:text-ink-1"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(slot);
                    setOpen(false);
                  }}
                >
                  {slot}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
