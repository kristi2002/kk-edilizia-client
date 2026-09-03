import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CLIENT_MESSAGE_NAMESPACES,
  pickClientMessages,
} from "@/lib/i18n-client-messages";
import itMessages from "../../messages/it.json";
import enMessages from "../../messages/en.json";

const SRC = path.resolve(__dirname, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

/** Namespaces requested by components that run in the browser. */
function namespacesUsedByClientComponents(): Map<string, string[]> {
  const found = new Map<string, string[]>();
  for (const file of walk(SRC)) {
    const source = readFileSync(file, "utf8");
    if (!source.includes('"use client"')) continue;
    for (const m of source.matchAll(/useTranslations\(\s*"([A-Za-z]+)"\s*\)/g)) {
      const ns = m[1];
      found.set(ns, [...(found.get(ns) ?? []), path.relative(SRC, file)]);
    }
  }
  return found;
}

describe("client message allowlist", () => {
  /**
   * The provider serialises whatever it is handed into every page's RSC payload, so this
   * list is a performance boundary. A client component that starts using a namespace
   * outside it throws at runtime in that component only — easy to miss in review.
   */
  it("covers every namespace a client component asks for", () => {
    const used = namespacesUsedByClientComponents();
    const missing = [...used.entries()]
      .filter(([ns]) => !CLIENT_MESSAGE_NAMESPACES.includes(ns as never))
      .map(([ns, files]) => `${ns} (used in ${files.join(", ")})`);
    expect(missing).toEqual([]);
  });

  it("does not ship namespaces no client component reads", () => {
    const used = namespacesUsedByClientComponents();
    const unused = CLIENT_MESSAGE_NAMESPACES.filter((ns) => !used.has(ns));
    expect(unused).toEqual([]);
  });

  it("excludes the server-only silo copy that dominated the payload", () => {
    const picked = pickClientMessages(itMessages as Record<string, unknown>);
    expect(picked).not.toHaveProperty("ServiceSilos");
    expect(picked).not.toHaveProperty("Metadata");
  });

  it("keeps the client payload far below the full bundle", () => {
    for (const bundle of [itMessages, enMessages]) {
      const full = JSON.stringify(bundle).length;
      const picked = JSON.stringify(
        pickClientMessages(bundle as Record<string, unknown>),
      ).length;
      expect(picked).toBeLessThan(full * 0.25);
    }
  });

  it("returns only known keys and tolerates a missing namespace", () => {
    const picked = pickClientMessages({ Nav: { home: "Home" }, Other: {} });
    expect(Object.keys(picked)).toEqual(["Nav"]);
  });
});
