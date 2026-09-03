import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  isAdminEnvConfigured,
} from "@/lib/admin-session";
import { assertRateLimit } from "@/lib/rate-limit";

const COOKIE = "kk_admin_session";

/** Constant-time compare so a wrong password costs the same as a right one. */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  if (!isAdminEnvConfigured()) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
    );
  }

  /** 5 attempts / 15 min per IP (see ROUTE_BUDGETS in lib/rate-limit). */
  try {
    await assertRateLimit("admin-login", request);
  } catch {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof (body as { password: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  const expectedPassword = process.env.ADMIN_PASSWORD?.trim() ?? "";
  if (!expectedPassword || !secretsMatch(password, expectedPassword)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET!.trim();
  const token = await createAdminSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return res;
}
