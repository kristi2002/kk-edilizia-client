/**
 * Session token for /admin (Edge-safe Web Crypto).
 * Set ADMIN_PASSWORD + ADMIN_SESSION_SECRET in production (see .env.example).
 *
 * The token is `<expiresAt>.<nonce>.<hmac>`. It used to be the HMAC of a *constant*
 * string, which meant every login on every device produced the identical value, it never
 * expired, and logging out could not invalidate anything — rotating the secret was the
 * only way to revoke. Signing an expiry and a per-session nonce fixes all three.
 */

const encoder = new TextEncoder();
const SESSION_PREFIX = "kk-edilizia-admin-session-v2";

/** Matches the session cookie `maxAge` set in /api/admin/login. */
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${SESSION_PREFIX}.${payload}`),
  );
  return bufferToHex(sig);
}

export async function createAdminSessionToken(
  secret: string,
  ttlSeconds: number = ADMIN_SESSION_TTL_SECONDS,
): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const nonce = bufferToHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const payload = `${expiresAt}.${nonce}`;
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [rawExpiry, nonce, signature] = parts;

  if (!/^\d{1,15}$/.test(rawExpiry) || !/^[0-9a-f]{32}$/.test(nonce)) {
    return false;
  }
  if (Number(rawExpiry) <= Math.floor(Date.now() / 1000)) return false;

  const expected = await sign(`${rawExpiry}.${nonce}`, secret);
  return timingSafeEqual(signature, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function bufferToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isAdminEnvConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD?.trim() &&
      process.env.ADMIN_SESSION_SECRET?.trim(),
  );
}
