import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { getSite, saveSiteToRedis } from "@/lib/data/site-store";
import { parseSitePayload } from "@/lib/validate-site-payload";

export async function GET() {
  const auth = await requireAdminAuth();
  if (auth) return auth;
  const site = await getSite();
  return NextResponse.json(site);
}

export async function PUT(request: Request) {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  let site;
  try {
    site = parseSitePayload(body);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  try {
    await saveSiteToRedis(site);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
