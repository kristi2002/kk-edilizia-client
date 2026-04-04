import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/admin-session";

/** Returns a 401/503 response if not authenticated, or null if OK. */
export async function requireAdminAuth(): Promise<NextResponse | null> {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }
  const cookie = (await cookies()).get("kk_admin_session")?.value;
  if (!cookie || !(await verifyAdminSessionToken(cookie, secret))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return null;
}
