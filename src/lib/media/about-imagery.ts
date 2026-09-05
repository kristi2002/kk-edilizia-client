import type { HomeImage } from "@/lib/media/home-imagery";
import bancoLavoro from "../../../public/media/about/banco-lavoro.jpg";
import cantiereInterno from "../../../public/media/about/cantiere-interno.jpg";
import consegna from "../../../public/media/about/consegna.jpg";
import documenti from "../../../public/media/about/documenti.jpg";
import facciataStorica from "../../../public/media/about/facciata-storica.jpg";
import ghirlandina from "../../../public/media/about/ghirlandina.jpg";
import intonaco from "../../../public/media/about/intonaco.jpg";
import lavorazioneLegno from "../../../public/media/about/lavorazione-legno.jpg";
import mansarda from "../../../public/media/about/mansarda.jpg";
import modenaSkyline from "../../../public/media/about/modena-skyline.jpg";
import muraturaDettaglio from "../../../public/media/about/muratura-dettaglio.jpg";
import ponteggio from "../../../public/media/about/ponteggio.jpg";
import porticiModena from "../../../public/media/about/portici-modena.jpg";
import posaMattoni from "../../../public/media/about/posa-mattoni.jpg";
import progettoTavolo from "../../../public/media/about/progetto-tavolo.jpg";
import sicurezza from "../../../public/media/about/sicurezza.jpg";
import utensili from "../../../public/media/about/utensili.jpg";

/**
 * Photography used on `/chi-siamo`.
 *
 * Same arrangement, licence and rules as `home-imagery.ts` — Pexels (free commercial
 * use, no attribution), materials and workmanship only, no identifiable faces — but a
 * separate set on purpose: **nothing here is reused from the home page**, so a visitor
 * moving from `/` to `/chi-siamo` never meets the same picture twice.
 *
 * Three things are true of this set that are not true of the home one:
 *
 * 1. Three photographs are of Modena itself (`modenaSkyline`, `porticiModena`,
 *    `ghirlandina`). They are the only images on the site that make a *place* claim
 *    rather than a work claim, and it is one we can make: the firm operates here.
 * 2. The crops are not uniform. The hero is 16:9, the quote band 21:9, two verticals are
 *    4:5, one inset is 1:1, and the rest are the 3:2 the home set uses. Replacements
 *    must keep the ratio noted on each entry or the layout will letterbox.
 * 3. Only the four pillar grounds are dimmed behind a scrim, so only those carry `tone`.
 *    Regenerate with `node scripts/compute-image-tone.mjs about` after swapping one.
 *
 * `alt` is a key under the `AboutMedia` namespace in `messages/*.json`, not literal
 * text: it is crawlable copy and has to exist in both locales.
 */
export const ABOUT_IMAGERY = {
  /** Hero ground, 16:9 (1600x900). Modena rooftops with the Ghirlandina — the only wide file here. */
  modenaSkyline: {
    src: modenaSkyline,
    pexels: 29201587,
    alt: "altSkyline",
  },

  /** Manifesto pair: a 4:5 vertical with a 1:1 inset overlapping its lower corner. */
  intonaco: { src: intonaco, pexels: 5691603, alt: "altIntonaco" },
  muraturaDettaglio: {
    src: muraturaDettaglio,
    pexels: 39325790,
    alt: "altMuratura",
  },

  // Pillar cards — dimmed grounds behind copy, so each carries a tone correction.
  bancoLavoro: {
    src: bancoLavoro,
    pexels: 6790031,
    alt: "altBanco",
    tone: { brightness: 0.88, contrast: 1.07 },
  },
  sicurezza: {
    src: sicurezza,
    pexels: 8488037,
    alt: "altSicurezza",
    tone: { brightness: 0.95, contrast: 1 },
  },
  lavorazioneLegno: {
    src: lavorazioneLegno,
    pexels: 5711774,
    alt: "altLavorazione",
    tone: { brightness: 1.15, contrast: 1 },
  },
  progettoTavolo: {
    src: progettoTavolo,
    pexels: 4792480,
    alt: "altProgettoTavolo",
    tone: { brightness: 0.94, contrast: 1 },
  },

  /** Quote band ground, 21:9. Dark to begin with, which is why the band works. */
  utensili: { src: utensili, pexels: 5974028, alt: "" },

  // Territory block: 3:2 beside a 4:5.
  porticiModena: {
    src: porticiModena,
    pexels: 36739215,
    alt: "altPortici",
  },
  ghirlandina: {
    src: ghirlandina,
    pexels: 36494223,
    alt: "altGhirlandina",
  },

  // Gallery mosaic, in build order: site → masonry → scaffold → facade → shell → handover.
  cantiereInterno: {
    src: cantiereInterno,
    pexels: 36035072,
    alt: "altCantiere",
  },
  posaMattoni: {
    src: posaMattoni,
    pexels: 19688828,
    alt: "altPosaMattoni",
  },
  ponteggio: {
    src: ponteggio,
    pexels: 5820968,
    alt: "altPonteggio",
  },
  facciataStorica: {
    src: facciataStorica,
    pexels: 9784173,
    alt: "altFacciata",
  },
  mansarda: { src: mansarda, pexels: 8082327, alt: "altMansarda" },
  consegna: { src: consegna, pexels: 7031621, alt: "altConsegna" },

  /** Certifications panel, 3:2. */
  documenti: {
    src: documenti,
    pexels: 8470801,
    alt: "altDocumenti",
  },
} as const satisfies Record<string, HomeImage>;

export type AboutImageKey = keyof typeof ABOUT_IMAGERY;
