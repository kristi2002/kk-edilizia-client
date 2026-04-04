import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/data/site-store";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: `${base.replace(/\/$/, "")}/sitemap.xml`,
  };
}
