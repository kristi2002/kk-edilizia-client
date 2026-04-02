import { NextResponse } from "next/server";
import { sendPreventivoConfirmation } from "@/lib/email/preventivo";
import { assertRateLimit } from "@/lib/rate-limit";
import { stripHoneypot } from "@/lib/strip-honeypot";
import { preventivoRequestSchema } from "@/lib/validations/preventivo";

export async function POST(request: Request) {
  try {
    await assertRateLimit("preventivo", request);
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
    const body = await request.json();
    const parsed = preventivoRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    try {
      await sendPreventivoConfirmation(stripHoneypot(parsed.data));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "EMAIL_NOT_CONFIGURED") {
        console.error(
          "[preventivo] Configura Gmail (GMAIL_USER + GMAIL_APP_PASSWORD) oppure Resend (RESEND_API_KEY + RESEND_FROM_EMAIL)",
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
