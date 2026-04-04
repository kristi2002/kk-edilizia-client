"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoneypotField } from "@/components/forms/HoneypotField";
import {
  prenotaRequestSchema,
  type PrenotaRequest,
} from "@/lib/validations/prenota";
import { Loader2 } from "lucide-react";
import { firstServerFieldError } from "@/lib/form-api-response";
import { BOOKING_TIME_SLOT_VALUES } from "@/lib/booking-time-slots";
import { BookingTimeSelect } from "@/components/forms/BookingTimeSelect";
import { BookingDatePicker } from "@/components/forms/BookingDatePicker";
import {
  FormAttachmentPicker,
  type AttachmentItem,
} from "@/components/forms/FormAttachmentPicker";

export function PrenotaForm() {
  const t = useTranslations("Booking");
  const tForm = useTranslations("FormErrors");
  const locale = useLocale();
  const [attachmentItems, setAttachmentItems] = useState<AttachmentItem[]>([]);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PrenotaRequest>({
    resolver: zodResolver(prenotaRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
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

  async function onSubmit(data: PrenotaRequest) {
    setSubmitError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);
    try {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("phone", data.phone);
      if (data.address?.trim()) fd.append("address", data.address.trim());
      fd.append("preferredDate", data.preferredDate);
      fd.append("preferredTime", data.preferredTime);
      if (data.notes?.trim()) fd.append("notes", data.notes.trim());
      fd.append("_gotcha", data._gotcha ?? "");
      fd.append("locale", locale === "en" ? "en" : "it");
      for (const { file } of attachmentItems) {
        fd.append("attachments", file);
      }

      const res = await fetch("/api/prenota", {
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
      setSubmitError(t("errorNetwork"));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-6 py-10 text-center">
        <p className="font-medium text-white">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-zinc-400">{t("successBody")}</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 text-sm font-medium text-[#c9a227] hover:underline"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <p className="text-sm text-zinc-500">
        {t("formPrivacy")}{" "}
        <Link href="/privacy" className="text-[#c9a227] hover:underline">
          {t("privacyLink")}
        </Link>
        .
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-6 space-y-4">
        <HoneypotField register={register} setValue={setValue} name="_gotcha" />
        <div>
          <label className="text-sm text-zinc-500">{t("fieldName")}</label>
          <input
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-zinc-500">{t("fieldEmail")}</label>
          <input
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-zinc-500">{t("fieldPhone")}</label>
          <input
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-zinc-500">{t("fieldAddress")}</label>
          <p className="mt-1 text-xs text-zinc-600">{t("fieldAddressHint")}</p>
          <input
            autoComplete="street-address"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("address")}
          />
        </div>
        <div>
          <p className="text-sm text-zinc-500">{t("fieldPreferred")}</p>
          <p className="mt-1 text-xs text-zinc-600">{t("fieldPreferredHint")}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="prenota-date"
                className="text-xs font-medium text-zinc-500"
              >
                {t("fieldPreferredDate")}
              </label>
              <Controller
                name="preferredDate"
                control={control}
                render={({ field }) => (
                  <BookingDatePicker
                    id="prenota-date"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("fieldPreferredDatePlaceholder")}
                    locale={locale}
                  />
                )}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="prenota-time"
                className="text-xs font-medium text-zinc-500"
              >
                {t("fieldPreferredTime")}
              </label>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                  <BookingTimeSelect
                    id="prenota-time"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    slots={BOOKING_TIME_SLOT_VALUES}
                    placeholder={t("fieldPreferredTimePlaceholder")}
                  />
                )}
              />
              {errors.preferredTime && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-500">{t("fieldNotes")}</label>
          <textarea
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("notes")}
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-400">{errors.notes.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="prenota-attachments"
            className="text-sm text-zinc-500"
          >
            {t("fieldAttachments")}
          </label>
          <p className="mt-1 text-xs text-zinc-600">{t("attachmentsHint")}</p>
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
            inputId="prenota-attachments"
          />
        </div>
        {submitError && (
          <p className="text-sm text-red-400">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a227] py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
