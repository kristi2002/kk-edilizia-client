/**
 * Decorative section furniture. Everything here is presentational only: it is
 * `aria-hidden`, never receives pointer events, and must never carry information.
 * The CSS lives in `globals.css` under "Decorative layer".
 */

type WordProps = {
  /** A single word. Phrases wrap badly at these sizes and stop reading as a mark. */
  children: string;
  className?: string;
};

/** Oversized hollow wordmark bleeding past the section edge. */
export function WatermarkWord({ children, className = "" }: WordProps) {
  return (
    <span aria-hidden="true" className={`wm-word ${className}`}>
      {children}
    </span>
  );
}

/** Running annotation set vertically in the gutter, like the edge of a drawing sheet. */
export function WatermarkGutter({ children }: { children: string }) {
  return (
    <span aria-hidden="true" className="wm-vert">
      {children}
    </span>
  );
}

/** Measured grid, masked so it dissolves before it reaches the text. */
export function WatermarkGrid() {
  return <span aria-hidden="true" className="wm-grid" />;
}

/** Oversized ring anchored off-canvas at a section corner. */
export function WatermarkRing({
  position = "bottom-left",
}: {
  position?: "bottom-left" | "bottom-right" | "top-right" | "top-left";
}) {
  const anchor = {
    "bottom-left": "-bottom-40 -left-36",
    "bottom-right": "-bottom-40 -right-36",
    "top-right": "-top-40 -right-36",
    "top-left": "-top-40 -left-36",
  }[position];
  return <span aria-hidden="true" className={`wm-ring ${anchor}`} />;
}
