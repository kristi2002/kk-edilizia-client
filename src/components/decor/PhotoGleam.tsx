/**
 * The specular gleam, over a photograph shown at full strength.
 *
 * `.photo-card__gleam` sits at `z-index: -1` because it was written for `.photo-card`,
 * where the picture is a `.photo-card__media` layer at `-2` and the gleam has to come
 * between it and the copy. On a card whose photograph is a plain `next/image` — which
 * `fill` renders as `position: absolute`, so it paints with the positioned content —
 * that same `-1` puts the gleam *behind* the picture, where nothing can see it.
 *
 * The z-index is set inline rather than as another class so it beats the stylesheet
 * without depending on where Tailwind's utilities land in the cascade.
 */
export function PhotoGleam() {
  return (
    <span className="photo-card__gleam" style={{ zIndex: 2 }} aria-hidden="true" />
  );
}
