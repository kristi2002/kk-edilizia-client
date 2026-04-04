import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  isAdminEnvConfigured,
} from "@/lib/admin-session";

const COOKIE = "kk_admin_session";

export async function POST(request: Request) {
  if (!isAdminEnvConfigured()) {
    return NextResponse.json(
      { ok: false, error: "not_configured" },
      { status: 503 },
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
  if (!expectedPassword || password !== expectedPassword) {
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
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
