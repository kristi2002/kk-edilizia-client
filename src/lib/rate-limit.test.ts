import { beforeEach, describe, expect, it, vi } from "vitest";

/** No Upstash env in tests, so `assertRateLimit` exercises the in-memory fallback. */
async function loadFresh() {
  vi.resetModules();
  return import("@/lib/rate-limit");
}

function requestFrom(ip: string): Request {
  return new Request("https://kkedilizia.it/api/preventivo", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
  });
}

async function hit(
  assertRateLimit: (route: string, r: Request) => Promise<void>,
  route: string,
  ip: string,
): Promise<"ok" | number> {
  try {
    await assertRateLimit(route, requestFrom(ip));
    return "ok";
  } catch (e) {
    return (e as { status?: number }).status ?? -1;
  }
}

beforeEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe("getClientIp", () => {
  it("takes the first entry of x-forwarded-for", async () => {
    const { getClientIp } = await loadFresh();
    const r = new Request("https://kkedilizia.it/", {
      headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
    });
    expect(getClientIp(r)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip, then to a sentinel", async () => {
    const { getClientIp } = await loadFresh();
    expect(
      getClientIp(
        new Request("https://kkedilizia.it/", {
          headers: { "x-real-ip": "198.51.100.4" },
        }),
      ),
    ).toBe("198.51.100.4");
    expect(getClientIp(new Request("https://kkedilizia.it/"))).toBe("unknown");
  });
});

describe("assertRateLimit", () => {
  it("allows the public form budget then throws 429", async () => {
    const { assertRateLimit } = await loadFresh();
    const ip = "203.0.113.10";
    for (let i = 0; i < 12; i++) {
      expect(await hit(assertRateLimit, "preventivo", ip)).toBe("ok");
    }
    expect(await hit(assertRateLimit, "preventivo", ip)).toBe(429);
  });

  it("applies a tighter budget to admin login", async () => {
    const { assertRateLimit } = await loadFresh();
    const ip = "203.0.113.11";
    for (let i = 0; i < 5; i++) {
      expect(await hit(assertRateLimit, "admin-login", ip)).toBe("ok");
    }
    // Six guesses per quarter hour, not the 12/min the public forms get.
    expect(await hit(assertRateLimit, "admin-login", ip)).toBe(429);
  });

  it("counts each route separately", async () => {
    const { assertRateLimit } = await loadFresh();
    const ip = "203.0.113.12";
    for (let i = 0; i < 5; i++) await hit(assertRateLimit, "admin-login", ip);
    expect(await hit(assertRateLimit, "admin-login", ip)).toBe(429);
    expect(await hit(assertRateLimit, "contatti", ip)).toBe("ok");
  });

  it("counts each client separately", async () => {
    const { assertRateLimit } = await loadFresh();
    for (let i = 0; i < 12; i++) await hit(assertRateLimit, "contatti", "1.1.1.1");
    expect(await hit(assertRateLimit, "contatti", "1.1.1.1")).toBe(429);
    expect(await hit(assertRateLimit, "contatti", "2.2.2.2")).toBe("ok");
  });

  it("lets the window slide", async () => {
    vi.useFakeTimers();
    const { assertRateLimit } = await loadFresh();
    const ip = "203.0.113.13";
    for (let i = 0; i < 12; i++) await hit(assertRateLimit, "contatti", ip);
    expect(await hit(assertRateLimit, "contatti", ip)).toBe(429);

    vi.setSystemTime(Date.now() + 61_000);
    expect(await hit(assertRateLimit, "contatti", ip)).toBe("ok");
    vi.useRealTimers();
  });
});
