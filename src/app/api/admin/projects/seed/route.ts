import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";
import { saveProjectsToRedis } from "@/lib/data/projects-store";
import { staticProjects } from "@/lib/data/projects";

/** Copies `staticProjects` from code into Redis (first-time or reset). */
export async function POST() {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  try {
    await saveProjectsToRedis(staticProjects);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  return NextResponse.json({ ok: true, count: staticProjects.length });
}
