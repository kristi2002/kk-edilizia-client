/**
 * Shared by `LogoMark` (which sizes the DOM box) and `LogoMarkScene` (which places the
 * camera). Its own module so the wrapper can read it without statically importing the
 * scene — that import edge is what keeps three.js out of the main bundle.
 */

/** Art height as a fraction of the canvas height; the rest is room to tilt into. */
export const ART_FILL = 0.74;

/**
 * How much larger the canvas is than the logo box. The crest has to render at exactly the
 * size the flat PNG did — the two cross-fade — so the canvas grows around it instead.
 */
export const OVERSCAN = 1 / ART_FILL;
