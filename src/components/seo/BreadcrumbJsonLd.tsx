import { getSiteUrl } from "@/lib/data/site-store";

type Crumb = { name: string; path: string };

function crumbUrl(base: string, path: string) {
  const normalized = base.replace(/\/$/, "");
  return path === "/" ? `${normalized}/` : `${normalized}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const base = (await getSiteUrl()).replace(/\/$/, "");
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: crumbUrl(base, it.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
