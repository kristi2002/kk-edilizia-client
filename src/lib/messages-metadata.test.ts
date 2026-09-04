import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import itMessages from "../../messages/it.json";
import { CLIENT_MESSAGE_NAMESPACES } from "@/lib/i18n-client-messages";
import {
  SERVICE_SILO_RELATIONS,
  SERVICE_SILO_ROUTES,
  type ServiceSiloKey,
} from "@/lib/service-silos";

const it_ = itMessages as Record<string, unknown>;
const en_ = en as Record<string, unknown>;
const BUNDLES: [string, Record<string, unknown>][] = [
  ["it", it_],
  ["en", en_],
];

/** Google renders roughly 155-160 characters of a description before truncating. */
const DESCRIPTION_LIMIT = 160;

/** `[locale]/layout.tsx` applies `%s | K.K Edilizia`, so no title may carry it too. */
const BRAND_SUFFIX = / \| K\.K Edilizia$/;

type Node = Record<string, unknown>;

function collectDescriptions(bundle: Node, path = ""): [string, string][] {
  const out: [string, string][] = [];
  for (const [key, value] of Object.entries(bundle)) {
    const here = path ? `${path}.${key}` : key;
    if (typeof value === "string") {
      if (/[Dd]escription$/.test(key)) out.push([here, value]);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...collectDescriptions(value as Node, here));
    }
  }
  return out;
}

function collectTitles(bundle: Node, path = ""): [string, string][] {
  const out: [string, string][] = [];
  for (const [key, value] of Object.entries(bundle)) {
    const here = path ? `${path}.${key}` : key;
    if (typeof value === "string") {
      if (/^(metaTitle|.*Title)$/.test(key) && /^meta/i.test(key)) {
        out.push([here, value]);
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      out.push(...collectTitles(value as Node, here));
    }
  }
  return out;
}

function flatKeys(bundle: Node, path = ""): string[] {
  return Object.entries(bundle).flatMap(([key, value]) => {
    const here = path ? `${path}.${key}` : key;
    return value && typeof value === "object" && !Array.isArray(value)
      ? flatKeys(value as Node, here)
      : [here];
  });
}

describe("message bundles", () => {
  it.each(BUNDLES)("%s keeps every description within the snippet budget", (_, bundle) => {
    const tooLong = collectDescriptions(bundle)
      .filter(([, value]) => value.length > DESCRIPTION_LIMIT)
      .map(([key, value]) => `${key} (${value.length})`);
    expect(tooLong).toEqual([]);
  });

  it.each(BUNDLES)("%s never repeats the brand suffix the title template adds", (_, bundle) => {
    const duplicated = collectTitles(bundle)
      .filter(([, value]) => BRAND_SUFFIX.test(value))
      .map(([key]) => key);
    expect(duplicated).toEqual([]);
  });

  it("keeps the two locales structurally identical", () => {
    expect(flatKeys(en_).sort()).toEqual(flatKeys(it_).sort());
  });

  it.each(BUNDLES)("%s has a block for every routed service silo", (_, bundle) => {
    const silos = bundle.ServiceSilos as Node;
    for (const route of SERVICE_SILO_ROUTES) {
      expect(silos[route.key], `missing ServiceSilos.${route.key}`).toBeTruthy();
    }
  });

  it.each(BUNDLES)("%s carries no silo block that no route renders", (_, bundle) => {
    const routed = new Set<string>(SERVICE_SILO_ROUTES.map((r) => r.key));
    /**
     * Shared copy sits beside the per-silo blocks: strings (faqTitle, siblingsTitle,
     * partOfLabel, …) and arrays (`process`, `zones`). Only a plain object keyed by a
     * silo name is a silo, so anything else here is not an orphan.
     */
    const orphans = Object.entries(bundle.ServiceSilos as Node)
      .filter(
        ([key, value]) =>
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          !routed.has(key),
      )
      .map(([key]) => key);
    expect(orphans).toEqual([]);
  });

  it.each(BUNDLES)("%s defines every namespace shipped to the client", (_, bundle) => {
    for (const ns of CLIENT_MESSAGE_NAMESPACES) {
      expect(bundle[ns], `missing namespace ${ns}`).toBeTruthy();
    }
  });
});

describe("service silo relations", () => {
  it("covers every routed silo exactly once", () => {
    const routed = SERVICE_SILO_ROUTES.map((r) => r.key).sort();
    expect(Object.keys(SERVICE_SILO_RELATIONS).sort()).toEqual(routed);
  });

  it("only points at silos that exist, and never at itself", () => {
    const routed = new Set<ServiceSiloKey>(
      SERVICE_SILO_ROUTES.map((r) => r.key),
    );
    for (const [key, relation] of Object.entries(SERVICE_SILO_RELATIONS)) {
      if (relation.hub !== null) {
        expect(routed.has(relation.hub), `${key}.hub`).toBe(true);
        expect(relation.hub).not.toBe(key);
      }
      for (const related of relation.related) {
        expect(routed.has(related), `${key}.related -> ${related}`).toBe(true);
        expect(related).not.toBe(key);
      }
    }
  });

  it("gives the hub no hub of its own, so the hierarchy has one root", () => {
    const roots = Object.entries(SERVICE_SILO_RELATIONS).filter(
      ([, r]) => r.hub === null,
    );
    expect(roots.map(([key]) => key)).toEqual(["chiaviInMano"]);
  });
});
