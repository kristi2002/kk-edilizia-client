"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, startOfDay } from "date-fns";
import { it, enUS } from "date-fns/locale";
import { Calendar } from "lucide-react";
import "react-day-picker/style.css";
import "./booking-pickers.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  id?: string;
  locale: string;
  /** Error state, for the trigger's outline. */
  invalid?: boolean;
  /** Id of the error paragraph, so the trigger announces the message. */
  describedBy?: string;
};

function parseYmd(s: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const d = parse(s, "yyyy-MM-dd", new Date());
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Custom date picker with themed calendar (browser date input popups are not styleable). */
export function BookingDatePicker({
  value,
  onChange,
  onBlur,
  placeholder,
  id,
  locale,
  invalid = false,
  describedBy,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const calendarId = useId();
  const dfLocale = locale === "en" ? enUS : it;

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

  const selected = parseYmd(value);
  const label = selected
    ? format(selected, "PPP", { locale: dfLocale })
    : placeholder;

  const todayStart = startOfDay(new Date());

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
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={calendarId}
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
            selected ? "text-ink-1" : "text-ink-4"
          }`}
        >
          {label}
        </span>
        <span
          className="flex w-11 shrink-0 items-center justify-center border-l border-line text-ink-3"
          aria-hidden
        >
          <Calendar className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </button>

      {open ? (
        <div
          id={calendarId}
          className="booking-date-popover absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-line bg-raised p-3 shadow-[0_24px_50px_-20px_rgba(20,23,26,0.45)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              onChange(d ? format(d, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            disabled={{ before: todayStart }}
            locale={dfLocale}
            defaultMonth={selected ?? todayStart}
            className="mx-auto p-0 bg-transparent border-0"
          />
        </div>
      ) : null}
    </div>
  );
}
