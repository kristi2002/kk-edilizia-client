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
        className="flex w-full min-h-[46px] items-stretch overflow-hidden rounded-xl border border-white/15 bg-black/40 text-left text-sm text-white transition focus-within:border-[#c9a227] focus-within:outline-none focus-within:ring-1 focus-within:ring-[#c9a227] mt-1.5"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`flex min-w-0 flex-1 items-center px-4 py-3 ${
            selected ? "text-white" : "text-zinc-500"
          }`}
        >
          {label}
        </span>
        <span
          className="flex w-11 shrink-0 items-center justify-center border-l border-white/10 text-zinc-400"
          aria-hidden
        >
          <Calendar className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </button>

      {open ? (
        <div
          id={calendarId}
          className="booking-date-popover absolute left-0 right-0 top-full z-30 mt-1.5 rounded-xl border border-white/15 bg-[#0a0a0a] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
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
