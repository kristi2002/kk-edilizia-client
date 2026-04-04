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
        className="mt-1.5 flex w-full min-h-[46px] items-stretch overflow-hidden rounded-xl border border-white/15 bg-black/40 text-left text-sm text-white transition focus-within:border-[#c9a227] focus-within:outline-none focus-within:ring-1 focus-within:ring-[#c9a227]"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`flex min-w-0 flex-1 items-center px-4 py-3 ${
            value ? "text-white" : "text-zinc-500"
          }`}
        >
          {label}
        </span>
        <span
          className="flex w-11 shrink-0 items-center justify-center border-l border-white/10 text-zinc-400"
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
          className="absolute bottom-full left-0 right-0 z-30 mb-1.5 max-h-[min(11rem,40vh)] overflow-y-auto overscroll-contain rounded-xl border border-white/15 bg-[#0a0a0a] py-1 shadow-[0_-8px_32px_rgba(0,0,0,0.55)] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
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
                      ? "bg-[#c9a227]/15 text-[#c9a227]"
                      : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
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
