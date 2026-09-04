import type { HomeImage } from "@/lib/media/home-imagery";
import sopralluogoHero from "../../../public/media/booking/sopralluogo-hero.jpg";

/**
 * Photography used on `/prenota`.
 *
 * One picture, but its own module rather than a borrowed entry from `home-imagery.ts`.
 * The booking page had been reusing `HOME_IMAGERY.progetto` — the same blueprint frame
 * the Services grid on `/` shows — which broke the rule the other three sets are built
 * on: a visitor moving between surfaces never meets the same photograph twice. It also
 * meant a 1200x800 file stretched across a full-bleed band, upscaled on any desktop
 * wider than 1200px.
 *
 * Same licence and rules as the other sets — Pexels (free commercial use, no
 * attribution), craft and materials rather than models, no identifiable faces.
 *
 * `hero` is 2:1 (2000x1000), matching the service-silo heroes, because it is used the
 * same way: full-bleed behind the dark band. Replacements must keep the ratio or the
 * layout letterboxes.
 *
 * The band clears to near-solid ink across the copy and only opens up at the right edge
 * (`linear-gradient(105deg, …0.97 → 0.66)`), so the picture has to survive being read
 * through roughly a third of its strength. That rules out the flat, near-white frames
 * that suit a `.photo-card` ground: this one is luma 172 with a spread of 62 — hard
 * raked sunlight, true blacks — and holds its shape under the scrim. No `tone`
 * correction: the band is tuned once, in the page.
 *
 * `alt` is empty because the page renders this decoratively, behind `aria-hidden`; the
 * heading carries the meaning. That is why there is no `BookingMedia` namespace in
 * `messages/*.json` to match the other three sets.
 */
export const BOOKING_IMAGERY = {
  /**
   * Hero ground, 2:1. A survey laid out on a concrete slab — two floor plans, a spirit
   * level, a helmet and a set of keys — which is the page's subject rather than a
   * decoration: `/prenota` books a sopralluogo, and this is what one leaves behind.
   */
  sopralluogo: {
    src: sopralluogoHero,
    pexels: 7937319,
    alt: "",
  },
} as const satisfies Record<string, HomeImage>;
