/**
 * Generates public/favicon.ico from public/logo.png (32×32 + 16×16).
 * Run: npm run generate:favicon
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoPath = path.join(root, "public", "logo.png");
const outPath = path.join(root, "public", "favicon.ico");

if (!fs.existsSync(logoPath)) {
  console.error("Missing public/logo.png");
  process.exit(1);
}

const buf32 = await sharp(logoPath).resize(32, 32).png().toBuffer();
const buf16 = await sharp(logoPath).resize(16, 16).png().toBuffer();
const ico = await toIco([buf32, buf16]);
fs.writeFileSync(outPath, ico);
console.log("Wrote", outPath);
