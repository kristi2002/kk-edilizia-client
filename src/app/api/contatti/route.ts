import { NextResponse } from "next/server";
import { sendContattiConfirmation } from "@/lib/email/contatti";
import {
  filesToEmailAttachments,
  validateFormAttachmentFiles,
} from "@/lib/form-attachments";
import { assertRateLimit } from "@/lib/rate-limit";
import { stripHoneypot } from "@/lib/strip-honeypot";
import { contattiRequestSchema } from "@/lib/validations/contatti";

/** Invio email + retry interni possono superare il default serverless breve. */
export const maxDuration = 60;

function isMultipart(request: Request) {
  const ct = request.headers.get("content-type") ?? "";
  return ct.includes("multipart/form-data");
}

function collectAttachmentFiles(formData: FormData): File[] {
  return formData
    .getAll("attachments")
    .filter((x): x is File => x instanceof File && x.size > 0);
}

export async function POST(request: Request) {
  try {
    await assertRateLimit("contatti", request);
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMITED") {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 },
      );
    }
    throw e;
  }

  try {
    let parsed: ReturnType<typeof contattiRequestSchema.safeParse>;
    let attachmentFiles: File[] = [];

    if (isMultipart(request)) {
      const formData = await request.formData();
      attachmentFiles = collectAttachmentFiles(formData);
      const v = validateFormAttachmentFiles(attachmentFiles);
      if (!v.ok) {
        return NextResponse.json(
          { ok: false, error: `attachment_${v.error}` },
          { status: 400 },
        );
      }
      const phoneRaw = String(formData.get("phone") ?? "").trim();
      parsed = contattiRequestSchema.safeParse({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: phoneRaw || undefined,
        message: String(formData.get("message") ?? ""),
        locale: formData.get("locale") === "en" ? "en" : undefined,
        _gotcha: String(formData.get("_gotcha") ?? ""),
      });
    } else {
      const body = await request.json();
      parsed = contattiRequestSchema.safeParse(body);
    }

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const attachments =
      attachmentFiles.length > 0
        ? await filesToEmailAttachments(attachmentFiles)
        : [];

    try {
      await sendContattiConfirmation(stripHoneypot(parsed.data), attachments);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "EMAIL_NOT_CONFIGURED") {
        console.error(
          "[contatti] Configura Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) oppure Resend (RESEND_API_KEY + RESEND_FROM_EMAIL)",
        );
        return NextResponse.json(
          { ok: false, error: "email_not_configured" },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { ok: false, error: "email_send_failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
