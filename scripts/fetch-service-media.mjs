/**
 * Downloads and crops the service-silo photography from Pexels.
 *
 *   node scripts/fetch-service-media.mjs
 *
 * Four pictures per silo: a 2:1 hero, a 4:5 vertical for the copy aside, and two 3:2
 * frames for the gallery pair. The crops are committed under `public/media/services/`;
 * the originals are only cached in the OS temp directory, so a rerun re-downloads
 * anything that has been cleared.
 *
 * The ids below are the record of where each file came from, and they are mirrored in
 * `src/lib/media/service-imagery.ts` alongside the alt-text keys. `curl` rather than
 * `fetch` because Pexels answers Node's fetch with a 403.
 *
 * Pexels licence: free for commercial use, no attribution required, no resale of the
 * unaltered file. Replacing one of these with the firm's own photography means dropping
 * a file at the same path with the same ratio — nothing else has to change.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
/** Originals are cached outside the repo; only the crops are committed. */
const SRC = path.join(os.tmpdir(), "kk-service-media");
const OUT = "public/media/services";
fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

/** slug → [hero, aside, gallery-a, gallery-b] ids, with the sharp crop strategy. */
const SETS = {
  "chiavi-in-mano": [36035073, 15798786, 4756489, 3958953],
  bagno: [7045908, 10827349, 19666087, 7018243],
  cucina: [37153451, 38311100, 20348123, 7601088],
  elettrico: [257736, 3615735, 5767595, 8488029],
  idraulico: [7937299, 9658236, 5691473, 14845870],
  murarie: [11746743, 13295698, 39325792, 32913797],
  cartongesso: [6474313, 6124239, 11427092, 6473980],
  pavimenti: [3935327, 11126101, 11806482, 6175107],
  tetto: [19603110, 18349121, 8491084, 32652188],
};

/** role → [width, height, position]. */
const ROLES = [
  /**
   * 1600 wide, not 2000. `deviceSizes` in `next.config.ts` tops out at 1920 and the
   * hero band is roughly 600px tall full-bleed, so `object-cover` crops the height away
   * — the extra 400px of width was never rendered and only made every transform bigger
   * on both ends. Changing this means re-running the script; the committed files are
   * already at 1600.
   */
  ["hero", 1600, 800, "entropy"],
  ["aside", 1000, 1250, "attention"],
  ["a", 1200, 800, "attention"],
  ["b", 1200, 800, "attention"],
];

for (const [slug, ids] of Object.entries(SETS)) {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const [role, w, h, pos] = ROLES[i];
    const src = path.join(SRC, `${id}.jpg`);
    const ok = () => fs.existsSync(src) && fs.readFileSync(src).subarray(0, 2).toString("hex") === "ffd8";
    for (let a = 0; a < 4 && !ok(); a++) {
      execFileSync("curl", ["-sL", "--retry", "2", "-A", UA, "-o", src,
        `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`]);
    }
    if (!ok()) { console.log(`!! ${slug}-${role} ${id} FAILED`); continue; }
    const info = await sharp(src)
      .resize(w, h, { fit: "cover", position: sharp.strategy[pos] })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(OUT, `${slug}-${role}.jpg`));
    console.log(`${`${slug}-${role}`.padEnd(24)} ${String(id).padEnd(9)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kB`);
  }
}
