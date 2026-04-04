/** Fuso orario usato per i saluti nelle email (Italia). */
const ROME = "Europe/Rome";

function hourInTimeZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const raw = parts.find((p) => p.type === "hour")?.value ?? "12";
  const h = parseInt(raw, 10);
  return Number.isFinite(h) ? h % 24 : 12;
}

/**
 * Saluto in base all’ora locale italiana al momento dell’invio.
 * Buonasera: 18:00–05:59 · Buongiorno: 06:00–17:59
 */
export function getItalianDaytimeGreeting(
  date: Date = new Date(),
): "Buongiorno" | "Buonasera" {
  const h = hourInTimeZone(date, ROME);
  if (h >= 18 || h < 6) return "Buonasera";
  return "Buongiorno";
}

/** Parità inglese (stessa finestra oraria Roma). */
export function getEnglishDaytimeGreeting(
  date: Date = new Date(),
): "Good morning" | "Good evening" {
  const h = hourInTimeZone(date, ROME);
  if (h >= 18 || h < 6) return "Good evening";
  return "Good morning";
}
