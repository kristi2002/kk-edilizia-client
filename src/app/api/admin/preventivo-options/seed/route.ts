import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { defaultPreventivoFormOptions } from "@/lib/data/preventivo-form-options";
import { savePreventivoFormOptionsToRedis } from "@/lib/data/preventivo-options-store";

export async function POST() {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  try {
    await savePreventivoFormOptionsToRedis(
      structuredClone(defaultPreventivoFormOptions),
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
