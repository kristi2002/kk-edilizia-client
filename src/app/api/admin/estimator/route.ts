import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import {
  getEstimatorRows,
  saveEstimatorRowsToRedis,
} from "@/lib/data/estimator-store";
import { safeParseEstimatorRowsPayload } from "@/lib/validate-estimator-payload";

export async function GET() {
  const auth = await requireAdminAuth();
  if (auth) return auth;
  const rows = await getEstimatorRows();
  return NextResponse.json(rows);
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

  const parsed = safeParseEstimatorRowsPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", message: parsed.message },
      { status: 400 },
    );
  }

  try {
    await saveEstimatorRowsToRedis(parsed.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
