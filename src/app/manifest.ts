import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brand,
    short_name: site.brand,
    description:
      "Ristrutturazioni e lavori edili a Modena: preventivi chiari e cantieri organizzati.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#c9a227",
    lang: "it",
  };
}
