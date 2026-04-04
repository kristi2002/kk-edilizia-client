/**
 * Fixed HH:mm slots for sopralluogo (no native time input — avoids invalid step errors).
 * 15-minute steps, 08:00–18:45 (typical working hours).
 */
export const BOOKING_TIME_SLOT_VALUES: string[] = (() => {
  const out: string[] = [];
  for (let h = 8; h <= 18; h++) {
    for (const m of [0, 15, 30, 45]) {
      out.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }
  return out;
})();
