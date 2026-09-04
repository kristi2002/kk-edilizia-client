import type { StaticImageData } from "next/image";
import type { HomeImage } from "@/lib/media/home-imagery";
import bagnoA from "../../../public/media/services/bagno-a.jpg";
import bagnoAside from "../../../public/media/services/bagno-aside.jpg";
import bagnoB from "../../../public/media/services/bagno-b.jpg";
import bagnoHero from "../../../public/media/services/bagno-hero.jpg";
import cartongessoA from "../../../public/media/services/cartongesso-a.jpg";
import cartongessoAside from "../../../public/media/services/cartongesso-aside.jpg";
import cartongessoB from "../../../public/media/services/cartongesso-b.jpg";
import cartongessoHero from "../../../public/media/services/cartongesso-hero.jpg";
import chiaviInManoA from "../../../public/media/services/chiavi-in-mano-a.jpg";
import chiaviInManoAside from "../../../public/media/services/chiavi-in-mano-aside.jpg";
import chiaviInManoB from "../../../public/media/services/chiavi-in-mano-b.jpg";
import chiaviInManoHero from "../../../public/media/services/chiavi-in-mano-hero.jpg";
import cucinaA from "../../../public/media/services/cucina-a.jpg";
import cucinaAside from "../../../public/media/services/cucina-aside.jpg";
import cucinaB from "../../../public/media/services/cucina-b.jpg";
import cucinaHero from "../../../public/media/services/cucina-hero.jpg";
import elettricoA from "../../../public/media/services/elettrico-a.jpg";
import elettricoAside from "../../../public/media/services/elettrico-aside.jpg";
import elettricoB from "../../../public/media/services/elettrico-b.jpg";
import elettricoHero from "../../../public/media/services/elettrico-hero.jpg";
import idraulicoA from "../../../public/media/services/idraulico-a.jpg";
import idraulicoAside from "../../../public/media/services/idraulico-aside.jpg";
import idraulicoB from "../../../public/media/services/idraulico-b.jpg";
import idraulicoHero from "../../../public/media/services/idraulico-hero.jpg";
import murarieA from "../../../public/media/services/murarie-a.jpg";
import murarieAside from "../../../public/media/services/murarie-aside.jpg";
import murarieB from "../../../public/media/services/murarie-b.jpg";
import murarieHero from "../../../public/media/services/murarie-hero.jpg";
import pavimentiA from "../../../public/media/services/pavimenti-a.jpg";
import pavimentiAside from "../../../public/media/services/pavimenti-aside.jpg";
import pavimentiB from "../../../public/media/services/pavimenti-b.jpg";
import pavimentiHero from "../../../public/media/services/pavimenti-hero.jpg";
import tettoA from "../../../public/media/services/tetto-a.jpg";
import tettoAside from "../../../public/media/services/tetto-aside.jpg";
import tettoB from "../../../public/media/services/tetto-b.jpg";
import tettoHero from "../../../public/media/services/tetto-hero.jpg";
import type { ServiceSiloKey } from "@/lib/service-silos";

/**
 * Photography for the nine service silos.
 *
 * Same licence and rules as `home-imagery.ts` and `about-imagery.ts` — Pexels (free
 * commercial use, no attribution), craft and materials rather than models, no
 * identifiable faces — but a third set, disjoint from both. A visitor who lands on
 * `/ristrutturazione-bagno` from search and then walks the site never meets the same
 * photograph twice; nothing here appears on `/` or `/chi-siamo`.
 *
 * Four frames per silo, and the crop of each is load-bearing:
 *
 * - `hero`   2:1  (2000x1000) — full-bleed behind the dark hero band.
 * - `aside`  4:5  (1000x1250) — the vertical that runs beside the opening copy.
 * - `a`, `b` 3:2  (1200x800)  — the gallery pair, shown at full strength with captions.
 *
 * Replacements must keep the ratio or the layout letterboxes. None of these are used as
 * a dimmed `.photo-card` ground, so none carries a `tone` correction — the hero dims
 * behind its own gradient scrim, which is tuned once for the whole set.
 *
 * `alt` is a key under the `ServiceMedia` namespace in `messages/*.json`, never literal
 * text: it is crawlable copy on the pages the entire search strategy points at.
 *
 * Regenerate the files with `node scripts/fetch-service-media.mjs`, which also records
 * the Pexels id behind each one.
 */
/** The four roles every silo fills. */
export type ServiceImageRole = "hero" | "aside" | "a" | "b";

type ServiceImageSet = Record<ServiceImageRole, HomeImage>;

/** One silo's four imported files, in `hero, aside, a, b` order. */
type ServiceImageFiles = [StaticImageData, StaticImageData, StaticImageData, StaticImageData];

/** Builds the four entries for one silo from its imported files and alt-key prefix. */
function set(files: ServiceImageFiles, key: string, ids: [number, number, number, number]): ServiceImageSet {
  return {
    hero: { src: files[0], pexels: ids[0], alt: `${key}Hero` },
    aside: { src: files[1], pexels: ids[1], alt: `${key}Aside` },
    a: { src: files[2], pexels: ids[2], alt: `${key}A` },
    b: { src: files[3], pexels: ids[3], alt: `${key}B` },
  };
}

export const SERVICE_IMAGERY: Record<ServiceSiloKey, ServiceImageSet> = {
  // Turnkey: a stripped flat, its structure, and the room handed back finished.
  chiaviInMano: set([chiaviInManoHero, chiaviInManoAside, chiaviInManoA, chiaviInManoB], "chiaviInMano", [36035073, 15798786, 4756489, 3958953]),
  bagno: set([bagnoHero, bagnoAside, bagnoA, bagnoB], "bagno", [7045908, 10827349, 19666087, 7018243]),
  cucina: set([cucinaHero, cucinaAside, cucinaA, cucinaB], "cucina", [37153451, 38311100, 20348123, 7601088]),
  elettrico: set([elettricoHero, elettricoAside, elettricoA, elettricoB], "elettrico", [257736, 3615735, 5767595, 8488029]),
  idraulico: set([idraulicoHero, idraulicoAside, idraulicoA, idraulicoB], "idraulico", [7937299, 9658236, 5691473, 14845870]),
  murarie: set([murarieHero, murarieAside, murarieA, murarieB], "murarie", [11746743, 13295698, 39325792, 32913797]),
  cartongessoIsolamento: set([cartongessoHero, cartongessoAside, cartongessoA, cartongessoB], "cartongesso", [6474313, 6124239, 11427092, 6473980]),
  pavimentiRivestimenti: set([pavimentiHero, pavimentiAside, pavimentiA, pavimentiB], "pavimenti", [3935327, 11126101, 11806482, 6175107]),
  // Roof and facade: the pitch, the ridge detail, new timber, a scaffolded elevation.
  tettoFacciate: set([tettoHero, tettoAside, tettoA, tettoB], "tetto", [19603110, 18349121, 8491084, 32652188]),
};
