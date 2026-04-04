import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { saveSiteToRedis } from "@/lib/data/site-store";
import { staticSite } from "@/lib/site";

export async function POST() {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  try {
    await saveSiteToRedis(staticSite);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
