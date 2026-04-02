import { getSiteUrl } from "@/lib/site";

type Crumb = { name: string; path: string };

function crumbUrl(path: string) {
  const base = getSiteUrl().replace(/\/$/, "");
  return path === "/" ? `${base}/` : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: crumbUrl(it.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
