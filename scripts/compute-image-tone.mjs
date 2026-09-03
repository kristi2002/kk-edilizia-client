/**
 * Computes the per-image tone correction used by `.photo-card` grounds.
 *
 * A photograph dimmed behind a white scrim only reads if it is mid-toned to begin with.
 * The stock set ranges from luma 83 (a stone facade) to 205 (architect's drawings —
 * white paper photographed on white paper, standard deviation 17). At one shared
 * opacity the dark ones look right and the pale ones disappear entirely, which is
 * exactly what happened on the Services row.
 *
 * So each ground gets its own `brightness()` / `contrast()` pushing it toward a common
 * target, and the card carries those as CSS custom properties. Values are baked into
 * `src/lib/media/home-imagery.ts` rather than computed at runtime — it is a property of
 * the file, not of the request.
 *
 * Run after replacing any photo used as a card ground. The set is an argument — a
 * directory under `public/media/` — because two pages now keep their own:
 *   node scripts/compute-image-tone.mjs work    → src/lib/media/home-imagery.ts
 *   node scripts/compute-image-tone.mjs about   → src/lib/media/about-imagery.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SET = process.argv[2] ?? "work";
const DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "media",
  SET,
);

/** Mid-tone the grounds converge on, and the spread that keeps detail legible. */
const TARGET_LUMA = 118;
const TARGET_SD = 46;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const round = (v) => Math.round(v * 100) / 100;

const rows = [];
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".jpg")).sort()) {
  const { channels } = await sharp(path.join(DIR, file)).stats();
  const [r, g, b] = channels;
  // Rec. 709 luma, and the same weighting over per-channel spread.
  const luma = 0.2126 * r.mean + 0.7152 * g.mean + 0.0722 * b.mean;
  const sd = 0.2126 * r.stdev + 0.7152 * g.stdev + 0.0722 * b.stdev;

  // Brightness lands the average tone on target; contrast then restores the spread
  // that dimming costs. CSS contrast() pivots on mid-grey, so it is applied after.
  const brightness = clamp(TARGET_LUMA / luma, 0.55, 1.15);
  const contrast = clamp(TARGET_SD / (sd * brightness), 1, 2.4);

  rows.push({
    key: file.replace(".jpg", ""),
    luma: Math.round(luma),
    sd: Math.round(sd),
    brightness: round(brightness),
    contrast: round(contrast),
  });
}

const w = Math.max(...rows.map((r) => r.key.length));
console.log(`${"image".padEnd(w)}  luma   sd   brightness  contrast`);
for (const r of rows) {
  console.log(
    `${r.key.padEnd(w)}  ${String(r.luma).padStart(4)}  ${String(r.sd).padStart(3)}` +
      `   ${r.brightness.toFixed(2).padStart(9)}  ${r.contrast.toFixed(2).padStart(8)}`,
  );
}
const MANIFEST = SET === "about" ? "about-imagery.ts" : "home-imagery.ts";
console.log(
  "\nPaste `tone: { brightness, contrast }` into the matching entries in" +
    `\nsrc/lib/media/${MANIFEST}. Only entries used as \`.photo-card\` grounds` +
    "\nread it; photographs shown at full strength are left untouched.",
);
