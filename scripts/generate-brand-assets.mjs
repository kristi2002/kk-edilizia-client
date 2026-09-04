/**
 * Generates every served brand image from the single master in `assets/brand/`.
 * Run: npm run generate:brand  (also wired into `prebuild`)
 *
 * The master is deliberately NOT in `public/`: it is 2048x2048 / ~8 MB, and while it
 * lived there it was referenced directly as the favicon, apple-touch-icon and PWA icon,
 * so every page load pulled 8 MB down to paint a 16px tab icon.
 *
 * The master is also a *flattened* render: the gold crest sits on an opaque cream
 * square. Pasted onto the dark footer that square read as a white sticker behind the
 * mark, so every derivative below is cut out of its background first (see `cutout`).
 *
 *   public/favicon.ico            16 + 32   browser tab
 *   public/icon-192.png           192       PWA / Android
 *   public/icon-512.png           512       PWA / splash
 *   public/apple-icon.png         180       iOS home screen
 *   public/logo-mark.png           256      flat mark: SSR + no-WebGL fallback
 *   public/media/logo/albedo.webp  384      colour map for the WebGL mark
 *   public/media/logo/normal.webp  256      tangent-space normals for the same
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
const logoDir = path.join(publicDir, "media", "logo");

if (!fs.existsSync(masterPath)) {
  console.error("Missing assets/brand/logo-master.png");
  process.exit(1);
}

/**
 * The cream the crest was rendered onto. Sampled off the master's border, which drifts
 * between 237 and 246 per channel because the render carries a faint vignette — the
 * brightest reading is used so the vignette lands *above* `FLOOR` and gets clipped
 * rather than surviving as a grey wash around the mark.
 */
const PAPER = [245, 245, 241];
/** Alpha below this is paper grain, vignette or JPEG-ish mush, not ink. */
const FLOOR = 0.075;
/** Deepest strokes key out at ~0.95; the lift puts them at a solid 1.0. */
const GAIN = 1.18;

/**
 * Un-mattes gold-on-cream line art into straight RGBA.
 *
 * For a pixel `P` composited as `A*C + (1-A)*PAPER`, the most-darkened channel gives
 * the tightest lower bound on coverage, so `A = max((PAPER-P)/PAPER)`; the ink colour
 * `C` then falls out of the same equation. Keying on darkening rather than on hue
 * distance keeps the antialiased stroke edges — a hue key turns them into a fringe.
 */
async function cutout(source) {
  const { data, info } = await sharp(source)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (PAPER[c] - data[i + c]) / PAPER[c]);

    // Smoothstep off the floor so the paper dies without hard-edging the faint strokes.
    const t = Math.min(1, Math.max(0, (a - FLOOR) / (1 - FLOOR)));
    a = Math.min(1, t * t * (3 - 2 * t) * GAIN) * (data[i + 3] / 255);

    if (a <= 0.002) continue; // buffer is already zeroed
    for (let c = 0; c < 3; c++) {
      const v = (data[i + c] - PAPER[c] * (1 - a)) / a;
      out[o + c] = Math.min(255, Math.max(0, Math.round(v)));
    }
    out[o + 3] = Math.round(a * 255);
  }

  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/**
 * Turns the mark's coverage into a tangent-space normal map.
 *
 * Coverage doubles as height: the crest is line art, so "where there is ink" is also
 * "where the metal stands proud". Sobel over a blurred copy gives the slope; the blur
 * radius sets how wide the bevel on each stroke reads, and matters more than the
 * strength — sharp gradients on 1px strokes shimmer once the mark starts turning.
 */
async function normalMap(markPng, size, { blur = 1.3, strength = 2.6 } = {}) {
  const { data } = await sharp(markPng)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extractChannel("alpha")
    .blur(blur)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const at = (x, y) =>
    data[Math.min(size - 1, Math.max(0, y)) * size + Math.min(size - 1, Math.max(0, x))] / 255;
  const out = Buffer.alloc(size * size * 3);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
      const dy =
        at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));

      // GL tangent space is +Y up, image space is +Y down, hence the negated dy.
      let nx = -dx * strength;
      let ny = dy * strength;
      const len = Math.hypot(nx, ny, 1);
      const o = (y * size + x) * 3;
      out[o] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      out[o + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      out[o + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255);
    }
  }

  return sharp(out, { raw: { width: size, height: size, channels: 3 } })
    .webp({ quality: 92, effort: 6 })
    .toBuffer();
}

fs.mkdirSync(logoDir, { recursive: true });

/** Cut out first, then trim: trimming the master only ever found the transparent rim. */
const trimmed = await sharp(await cutout(masterPath))
  .trim({ threshold: 2 })
  .png()
  .toBuffer();

const square = (size, opts = {}) =>
  sharp(trimmed)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, ...opts })
    .toBuffer();

const write = (file, buf) => {
  fs.writeFileSync(file, buf);
  console.log(`Wrote ${path.relative(root, file)} (${(buf.length / 1024).toFixed(1)} kB)`);
};

for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["apple-icon.png", 180],
  ["logo-mark.png", 256],
]) {
  write(path.join(publicDir, name), await square(size, { palette: true }));
}

write(path.join(publicDir, "favicon.ico"), await toIco([await square(32), await square(16)]));

/**
 * The WebGL maps are square so the mesh can be a 1:1 plane with the letterboxing simply
 * alpha-clipped, and WebP because a palette would band the gold's gradients while a
 * full-colour PNG pair costs ~660 kB. The normal map is the coarser of the two: it is
 * built from a blurred height field, so 256 carries every gradient 384 would.
 */
write(
  path.join(logoDir, "albedo.webp"),
  await sharp(await square(384)).webp({ quality: 90, effort: 6 }).toBuffer(),
);
write(path.join(logoDir, "normal.webp"), await normalMap(trimmed, 256));
