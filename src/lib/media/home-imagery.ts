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
  /** Path under `public/`. */
  src: string;
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

const dir = "/media/work";

export const HOME_IMAGERY = {
  // Services cards — shown as dimmed grounds, so each carries a tone correction.
  ristrutturazioni: {
    src: `${dir}/ristrutturazioni.jpg`, pexels: 8082227, alt: "altRistrutturazioni",
    tone: { brightness: 0.9, contrast: 1 },
  },
  edilizia: {
    src: `${dir}/edilizia.jpg`, pexels: 36704212, alt: "altEdilizia",
    tone: { brightness: 1.15, contrast: 1 },
  },
  progetto: {
    src: `${dir}/progetto.jpg`, pexels: 4458205, alt: "altProgetto",
    tone: { brightness: 0.58, contrast: 2.4 },
  },
  finiture: {
    src: `${dir}/finiture.jpg`, pexels: 5583126, alt: "altFiniture",
    tone: { brightness: 0.63, contrast: 2.4 },
  },

  // Service silo cards, keyed by `SERVICE_SILO_ROUTES[].key`
  chiaviInMano: { src: `${dir}/chiavi-in-mano.jpg`, pexels: 30386991, alt: "altChiaviInMano" },
  bagno: { src: `${dir}/bagno.jpg`, pexels: 7018379, alt: "altBagno" },
  cucina: { src: `${dir}/cucina.jpg`, pexels: 7166645, alt: "altCucina" },
  elettrico: { src: `${dir}/elettrico.jpg`, pexels: 5691642, alt: "altElettrico" },
  idraulico: { src: `${dir}/idraulico.jpg`, pexels: 12142829, alt: "altIdraulico" },
  murarie: { src: `${dir}/murarie.jpg`, pexels: 12001528, alt: "altMurarie" },
  cartongessoIsolamento: { src: `${dir}/cartongesso.jpg`, pexels: 11427055, alt: "altCartongesso" },
  pavimentiRivestimenti: { src: `${dir}/pavimenti.jpg`, pexels: 11806490, alt: "altPavimenti" },
  tettoFacciate: { src: `${dir}/tetto.jpg`, pexels: 31763541, alt: "altTetto" },

  /** Gold leaf, used as the specular ground behind the materials strip. Decorative. */
  sheen: { src: `${dir}/sheen.jpg`, pexels: 6638269, alt: "" },
} as const satisfies Record<string, HomeImage>;

export type HomeImageKey = keyof typeof HOME_IMAGERY;
