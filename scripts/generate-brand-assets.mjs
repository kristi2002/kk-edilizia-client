/**
 * Generates every served brand image from the single master in `assets/brand/`.
 * Run: npm run generate:favicon  (also wired into `prebuild`)
 *
 * The master is deliberately NOT in `public/`: it is 2048x2048 / ~8 MB, and while it
 * lived there it was referenced directly as the favicon, apple-touch-icon and PWA icon,
 * so every page load pulled 8 MB down to paint a 16px tab icon.
 *
 *   public/favicon.ico     16 + 32   browser tab
 *   public/icon-192.png    192       PWA / Android
 *   public/icon-512.png    512       PWA / splash
 *   public/apple-icon.png  180       iOS home screen
 *   public/logo-mark.png   256       the mark rendered in the site header
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const masterPath = path.join(root, "assets", "brand", "logo-master.png");
const publicDir = path.join(root, "public");

if (!fs.existsSync(masterPath)) {
  console.error("Missing assets/brand/logo-master.png");
  process.exit(1);
}

/** Transparent padding is trimmed once so the small sizes are not mostly empty. */
const base = sharp(masterPath).trim({ threshold: 10 });
const trimmed = await base.png().toBuffer();

const png = (size) =>
  sharp(trimmed)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

const outputs = [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-icon.png", 180],
  ["logo-mark.png", 256],
];

for (const [name, size] of outputs) {
  const buf = await png(size);
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Wrote public/${name} (${size}px, ${(buf.length / 1024).toFixed(1)} kB)`);
}

const ico = await toIco([await png(32), await png(16)]);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
console.log(`Wrote public/favicon.ico (${(ico.length / 1024).toFixed(1)} kB)`);
