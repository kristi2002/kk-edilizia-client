import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const SECRET = "test-secret-value-0123456789";

afterEach(() => {
  vi.useRealTimers();
});

describe("admin session token", () => {
  it("round-trips a freshly issued token", async () => {
    const token = await createAdminSessionToken(SECRET);
    await expect(verifyAdminSessionToken(token, SECRET)).resolves.toBe(true);
  });

  it("issues a different token every time", async () => {
    const [a, b] = await Promise.all([
      createAdminSessionToken(SECRET),
      createAdminSessionToken(SECRET),
    ]);
    // The previous implementation HMAC'd a constant, so every session shared one value.
    expect(a).not.toBe(b);
  });

  it("rejects a token once its expiry has passed", async () => {
    const token = await createAdminSessionToken(SECRET, 60);
    await expect(verifyAdminSessionToken(token, SECRET)).resolves.toBe(true);

    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 61_000);
    await expect(verifyAdminSessionToken(token, SECRET)).resolves.toBe(false);
  });

  it("rejects an extended expiry that was not signed", async () => {
    const token = await createAdminSessionToken(SECRET, 60);
    const [, nonce, sig] = token.split(".");
    const forged = `${Math.floor(Date.now() / 1000) + 999_999}.${nonce}.${sig}`;
    await expect(verifyAdminSessionToken(forged, SECRET)).resolves.toBe(false);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createAdminSessionToken(SECRET);
    await expect(verifyAdminSessionToken(token, "another-secret")).resolves.toBe(
      false,
    );
  });

  it.each([
    ["empty", ""],
    ["not enough parts", "123.abc"],
    ["too many parts", "1.2.3.4"],
    ["non-numeric expiry", "abc.0123456789abcdef0123456789abcdef.ff"],
    ["malformed nonce", "9999999999.NOTHEX.ff"],
  ])("rejects a malformed token (%s)", async (_label, token) => {
    await expect(verifyAdminSessionToken(token, SECRET)).resolves.toBe(false);
  });

  it("defaults to the same TTL the login cookie uses", async () => {
    const token = await createAdminSessionToken(SECRET);
    const expiresAt = Number(token.split(".")[0]);
    const expected = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
    expect(Math.abs(expiresAt - expected)).toBeLessThanOrEqual(2);
  });
});
