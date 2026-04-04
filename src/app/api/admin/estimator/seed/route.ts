import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { saveEstimatorRowsToRedis } from "@/lib/data/estimator-store";
import { getStaticEstimatorRows } from "@/lib/data/cost-estimator";

export async function POST() {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  try {
    await saveEstimatorRowsToRedis(getStaticEstimatorRows());
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
