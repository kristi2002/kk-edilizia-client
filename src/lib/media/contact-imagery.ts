import type { HomeImage } from "@/lib/media/home-imagery";
import piantaHero from "../../../public/media/contatti/pianta-hero.jpg";

/**
 * The one photograph on `/contatti`.
 *
 * Its own module for the same reason `booking-imagery.ts` is: the page needs a picture
 * that belongs to it, not a borrowed frame. `/contatti` had no photograph at all — the
 * band was drawn, because every image in the repo already belonged to another surface
 * and the rule the sets are built on is that a visitor never meets the same one twice.
 * This is a fifth set of one, disjoint from the home, about, silo and booking sets.
 *
 * Same licence as the rest — Pexels (free commercial use, no attribution, no resale of
 * the unaltered file). It is one of only two images on the site that show people, and it
 * can be: the hands are anonymous, no face is in frame, so it makes no claim about who
 * works at the firm. What it does claim is the thing this page exists for — a plan on a
 * table being marked up together, which is what a first phone call turns into.
 *
 * 2:1 (2000x1000), matching the silo and booking heroes because it is used the same way:
 * full-bleed behind the dark band. Cut from a 2400x1600 original, a 1200px band taken
 * 300px down so the marked-up plan and both pairs of hands stay in frame. A replacement
 * has to keep the ratio or the band letterboxes.
 *
 * No `tone`: the hero dims it with its own gradient scrims, not a flat `.photo-card`
 * overlay. `alt` is empty because `ContactHero` renders it as a ground behind
 * `aria-hidden` — the heading beside it already says what the page is — so there is no
 * `ContactMedia` namespace in `messages/*.json` to match the other three sets.
 */
export const CONTACT_IMAGERY = {
  /** Hero ground, 2:1. Two people marking up a floor plan in red, hands only. */
  pianta: {
    src: piantaHero,
    pexels: 9052547,
    alt: "",
  },
} as const satisfies Record<string, HomeImage>;
