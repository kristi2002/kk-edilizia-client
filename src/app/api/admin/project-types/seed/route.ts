import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { saveProjectTypesToRedis } from "@/lib/data/project-types-store";
import { staticProjectTypes } from "@/lib/data/project-types";

export async function POST() {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  try {
    await saveProjectTypesToRedis(staticProjectTypes);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
