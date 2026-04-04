import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-api-auth";

const MAX_BYTES = 12 * 1024 * 1024;

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(request: Request) {
  const auth = await requireAdminAuth();
  if (auth) return auth;

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json(
      { ok: false, error: "blob_not_configured" },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 });
  }

  const file = formData.get("file");
  const projectSlug =
    typeof formData.get("projectSlug") === "string"
      ? (formData.get("projectSlug") as string).trim()
      : "";

  if (!projectSlug) {
    return NextResponse.json({ ok: false, error: "missing_project_slug" }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: "missing_file" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 413 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ ok: false, error: "unsupported_type" }, { status: 415 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload.jpg";
  const pathname = `portfolio/${projectSlug}/${safeName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: type,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "upload_failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
