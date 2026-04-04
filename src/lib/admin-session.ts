/**
 * Session token for /admin (Edge-safe Web Crypto).
 * Set ADMIN_PASSWORD + ADMIN_SESSION_SECRET in production (see .env.example).
 */

const encoder = new TextEncoder();
const SESSION_MSG = "kk-edilizia-admin-session-v1";

export async function createAdminSessionToken(secret: string): Promise<string> {
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
    encoder.encode(SESSION_MSG),
  );
  return bufferToHex(sig);
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  const expected = await createAdminSessionToken(secret);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
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
