"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContattiRequestSchema,
  type ContattiRequest,
} from "@/lib/validations/contatti";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { useLocale, useTranslations } from "next-intl";
import { firstServerFieldError } from "@/lib/form-api-response";
import { Check, Loader2, Send } from "lucide-react";
import {
  FormAttachmentPicker,
  type AttachmentItem,
} from "@/components/forms/FormAttachmentPicker";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const tForm = useTranslations("FormErrors");
  const locale = useLocale();
  const contattiSchema = useMemo(
    () => createContattiRequestSchema(locale === "en" ? "en" : "it"),
    [locale],
  );
  const [attachmentItems, setAttachmentItems] = useState<AttachmentItem[]>([]);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContattiRequest>({
    resolver: zodResolver(contattiSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      _gotcha: "",
    },
  });

  function mapAttachmentError(code: string | undefined): string | null {
    switch (code) {
      case "too_many":
        return tForm("attachmentTooMany");
      case "file_too_large":
        return tForm("attachmentFileTooLarge");
      case "invalid_type":
        return tForm("attachmentInvalidType");
      case "total_too_large":
        return tForm("attachmentTotalTooLarge");
      default:
        return null;
    }
  }

  async function onSubmit(data: ContattiRequest) {
    setSubmitError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      if (data.phone?.trim()) fd.append("phone", data.phone.trim());
      fd.append("message", data.message);
      fd.append("_gotcha", data._gotcha ?? "");
      fd.append("locale", locale === "en" ? "en" : "it");
      for (const { file } of attachmentItems) {
        fd.append("attachments", file);
      }

      const res = await fetch("/api/contatti", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string[] | undefined>;
      };
      if (!res.ok || !json.ok) {
        const fieldMsg = firstServerFieldError(json.errors);
        if (fieldMsg) {
          setSubmitError(fieldMsg);
          return;
        }
        const att = json?.error?.startsWith("attachment_")
          ? json.error.slice("attachment_".length)
          : undefined;
        const attMsg = mapAttachmentError(att);
        if (attMsg) {
          setSubmitError(attMsg);
          return;
        }
        if (json?.error === "email_not_configured") {
          setSubmitError(tForm("emailNotConfigured"));
          return;
        }
        if (json?.error === "rate_limited") {
          setSubmitError(tForm("rateLimited"));
          return;
        }
        if (json?.error === "email_send_failed") {
          setSubmitError(tForm("emailSendFailed"));
          return;
        }
        setSubmitError(tForm("genericSubmit"));
        return;
      }
      reset();
      setAttachmentItems([]);
      setDone(true);
    } catch {
      setSubmitError(t("networkError"));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  if (done) {
    const waHref =
      waNumber &&
      `https://wa.me/${waNumber}?text=${encodeURIComponent(
        t("whatsappPrefill"),
      )}`;
    return (
      <div className="rounded-3xl border border-accent/30 bg-accent/10 px-6 py-12 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent-ink"
        >
          <Check className="h-7 w-7" />
        </span>
        <p className="mt-6 font-serif text-2xl text-ink-1">
          {t("successTitle")}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-3">
          {t("successBody")}
        </p>
        {waHref ? (
          <p className="mt-4 text-sm text-ink-4">
            {t("successWhatsappIntro")}{" "}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#25D366] hover:underline"
            >
              {t("successWhatsappCta")}
            </a>
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 text-sm font-medium text-accent-ink hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 rounded-3xl border border-line bg-raised p-6 shadow-xl shadow-black/5 sm:p-8">
      <p className="text-sm leading-relaxed text-ink-4">
        {t("formPrivacyBefore")}{" "}
        <Link href="/privacy" className="text-accent-ink hover:underline">
          {t("formPrivacyLink")}
        </Link>
        .
      </p>
      {/* Estensioni (password manager, ecc.) possono iniettare fdprocessedid sui campi; suppressHydrationWarning evita falsi avvisi. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-7 space-y-5"
        suppressHydrationWarning
      >
        <HoneypotField register={register} setValue={setValue} name="_gotcha" />
        <div>
          <label
            htmlFor="contact-name"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-4"
          >
            {t("fieldName")}
          </label>
          <input
            id="contact-name"
            className="mt-2 w-full rounded-xl border border-control-line bg-raised-2 px-4 py-3 text-ink-1 transition focus:border-accent focus:bg-raised focus:outline-none focus:ring-2 focus:ring-accent/40"
            suppressHydrationWarning
            {...register("name")}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-4"
          >
            {t("fieldEmail")}
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            className="mt-2 w-full rounded-xl border border-control-line bg-raised-2 px-4 py-3 text-ink-1 transition focus:border-accent focus:bg-raised focus:outline-none focus:ring-2 focus:ring-accent/40"
            suppressHydrationWarning
            {...register("email")}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-phone"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-4"
          >
            {t("fieldPhone")}
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            className="mt-2 w-full rounded-xl border border-control-line bg-raised-2 px-4 py-3 text-ink-1 transition focus:border-accent focus:bg-raised focus:outline-none focus:ring-2 focus:ring-accent/40"
            suppressHydrationWarning
            {...register("phone")}
            autoComplete="tel"
          />
        </div>
        <div>
          <label
            htmlFor="contact-message"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-4"
          >
            {t("fieldMessage")}
          </label>
          <textarea
            id="contact-message"
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-control-line bg-raised-2 px-4 py-3 text-ink-1 transition focus:border-accent focus:bg-raised focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder={t("messagePlaceholder")}
            suppressHydrationWarning
            {...register("message")}
            autoComplete="off"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-700">
              {errors.message.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="contact-attachments"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-4"
          >
            {t("attachmentsLabel")}
          </label>
          <p className="mt-1 text-xs text-ink-4">{t("attachmentsHint")}</p>
          <FormAttachmentPicker
            items={attachmentItems}
            onItemsChange={(next) => {
              setAttachmentItems(next);
              setSubmitError(null);
            }}
            chooseLabel={t("chooseFiles")}
            onInvalid={(code) => {
              const msg = mapAttachmentError(code);
              if (msg) setSubmitError(msg);
            }}
            removeAriaLabel={(name) => t("removeAttachmentAria", { name })}
            inputId="contact-attachments"
          />
        </div>
        {errors._gotcha && (
          <p className="text-sm text-red-700" role="alert">
            {errors._gotcha.message}
          </p>
        )}
        {submitError && (
          <p className="text-sm text-red-700">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="sweep inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-on-accent transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
