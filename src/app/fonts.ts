import { DM_Sans, Instrument_Serif } from "next/font/google";

/**
 * Shared by the two root layouts.
 *
 * There used to be a single root layout at `src/app/layout.tsx` that owned `<html>`,
 * `<body>` and these fonts — and hardcoded `lang="it"`, so every English URL served
 * Italian markup to anything that reads the response before hydration. Splitting the
 * root in two (`[locale]` and `admin`) is what lets `lang` be the actual locale; the
 * fonts are declared once here so both roots load the same two files.
 */
export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
  preload: true,
});

export const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  adjustFontFallback: true,
  preload: true,
});

/** Class list for the `<html>` element of either root. */
export const fontVariables = `${dmSans.variable} ${instrumentSerif.variable}`;
