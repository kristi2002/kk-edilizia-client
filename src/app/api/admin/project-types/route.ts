import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import {
  getProjectTypes,
  saveProjectTypesToRedis,
} from "@/lib/data/project-types-store";
import { safeParseProjectTypesPayload } from "@/lib/validate-project-types-payload";

export async function GET() {
  const auth = await requireAdminAuth();
  if (auth) return auth;
  const types = await getProjectTypes();
  return NextResponse.json(types);
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

  const parsed = safeParseProjectTypesPayload(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload", message: parsed.message },
      { status: 400 },
    );
  }

  try {
    await saveProjectTypesToRedis(parsed.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
