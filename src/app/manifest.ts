import type { MetadataRoute } from "next";
import { getSite } from "@/lib/data/site-store";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSite();
  return {
    name: site.brand,
    short_name: site.brand,
    description:
      "Ristrutturazioni e lavori edili a Modena: preventivi chiari e cantieri organizzati.",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    start_url: "/",
    display: "standalone",
    /**
     * `--page`, not the near-black this carried from the old dark palette — the splash
     * screen was flashing #080808 before a paper-white site.
     */
    background_color: "#f3f1eb",
    theme_color: "#c9a227",
    lang: "it",
  };
}
