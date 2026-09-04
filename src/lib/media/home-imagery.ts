import type { StaticImageData } from "next/image";
import bagno from "../../../public/media/work/bagno.jpg";
import cartongesso from "../../../public/media/work/cartongesso.jpg";
import chiaviInMano from "../../../public/media/work/chiavi-in-mano.jpg";
import cucina from "../../../public/media/work/cucina.jpg";
import edilizia from "../../../public/media/work/edilizia.jpg";
import elettrico from "../../../public/media/work/elettrico.jpg";
import finiture from "../../../public/media/work/finiture.jpg";
import idraulico from "../../../public/media/work/idraulico.jpg";
import murarie from "../../../public/media/work/murarie.jpg";
import pavimenti from "../../../public/media/work/pavimenti.jpg";
import progetto from "../../../public/media/work/progetto.jpg";
import ristrutturazioni from "../../../public/media/work/ristrutturazioni.jpg";
import sheen from "../../../public/media/work/sheen.jpg";
import tetto from "../../../public/media/work/tetto.jpg";

/**
 * Photography used on the home page.
 *
 * Stock standing in until the company's own site photography exists — the same
 * arrangement the hero already runs on (see `HeroBackgroundLayers`), and one of the open
 * items in CHECKLIST.md. Source: Pexels (Pexels License — free commercial use, no
 * attribution required, no resale of the unaltered file). The `pexels` id below is the
 * photo each file came from, so any of them can be traced or re-licensed later.
 *
 * The set is deliberately material-led — trowels, cables, tiles, plaster, a facade —
 * rather than people. A stock photograph of an identifiable worker on a builder's own
 * site reads as a claim about who works there, which is not a claim we can make. It also
 * keeps the art direction coherent: every card shows the craft, not a model.
 *
 * To swap in real photography, replace the file at `src` keeping the 3:2 crop and roughly
 * 1200x800; nothing else needs to change. `alt` is a translation key under `HomeMedia`
 * in `messages/*.json`, not literal text, because it is crawlable copy in two locales.
 */
export type HomeImage = {
  /**
   * Imported, not a path string: the bundler emits it to
   * `/_next/static/media/<name>.<contenthash>.jpg`, so replacing the file changes the
   * URL and browsers holding the previous one actually see the new picture. A bare
   * `public/` path never changes, and they do not. See `hero-media.ts`.
   */
  src: StaticImageData;
  /** Pexels photo id this file was cut from. */
  pexels: number;
  /** Key under the `HomeMedia` namespace. */
  alt: string;
  /**
   * Tone correction for pictures used as a dimmed `.photo-card` ground.
   *
   * Only the Services row reads this; photographs shown at full strength are left
   * alone. It exists because a picture behind a white scrim only reads if it is
   * mid-toned: `progetto` is white drawings on white paper (luma 205, spread 17) and
   * was invisible at the same opacity that suited the facade shot (luma 83).
   *
   * Regenerate with `node scripts/compute-image-tone.mjs` after swapping a photo.
   */
  tone?: { brightness: number; contrast: number };
};

export const HOME_IMAGERY = {
  // Services cards — shown as dimmed grounds, so each carries a tone correction.
  ristrutturazioni: {
    src: ristrutturazioni, pexels: 8082227, alt: "altRistrutturazioni",
    tone: { brightness: 0.9, contrast: 1 },
  },
  edilizia: {
    src: edilizia, pexels: 36704212, alt: "altEdilizia",
    tone: { brightness: 1.15, contrast: 1 },
  },
  progetto: {
    src: progetto, pexels: 4458205, alt: "altProgetto",
    tone: { brightness: 0.58, contrast: 2.4 },
  },
  finiture: {
    src: finiture, pexels: 5583126, alt: "altFiniture",
    tone: { brightness: 0.63, contrast: 2.4 },
  },

  // Service silo cards, keyed by `SERVICE_SILO_ROUTES[].key`
  chiaviInMano: { src: chiaviInMano, pexels: 30386991, alt: "altChiaviInMano" },
  bagno: { src: bagno, pexels: 7018379, alt: "altBagno" },
  cucina: { src: cucina, pexels: 7166645, alt: "altCucina" },
  elettrico: { src: elettrico, pexels: 5691642, alt: "altElettrico" },
  idraulico: { src: idraulico, pexels: 12142829, alt: "altIdraulico" },
  murarie: { src: murarie, pexels: 12001528, alt: "altMurarie" },
  cartongessoIsolamento: { src: cartongesso, pexels: 11427055, alt: "altCartongesso" },
  pavimentiRivestimenti: { src: pavimenti, pexels: 11806490, alt: "altPavimenti" },
  tettoFacciate: { src: tetto, pexels: 31763541, alt: "altTetto" },

  /** Gold leaf, used as the specular ground behind the materials strip. Decorative. */
  sheen: { src: sheen, pexels: 6638269, alt: "" },
} as const satisfies Record<string, HomeImage>;

export type HomeImageKey = keyof typeof HOME_IMAGERY;
