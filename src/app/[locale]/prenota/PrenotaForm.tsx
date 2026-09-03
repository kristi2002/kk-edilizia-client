"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HoneypotField } from "@/components/forms/HoneypotField";
import {
  createPrenotaRequestSchema,
  type PrenotaRequest,
} from "@/lib/validations/prenota";
import {
  AlertCircle,
  CalendarCheck,
  Check,
  Loader2,
  Mail,
  MessageSquareText,
  Paperclip,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { firstServerFieldError } from "@/lib/form-api-response";
import { BOOKING_TIME_SLOT_VALUES } from "@/lib/booking-time-slots";
import { BookingTimeSelect } from "@/components/forms/BookingTimeSelect";
import { BookingDatePicker } from "@/components/forms/BookingDatePicker";
import {
  FormAttachmentPicker,
  type AttachmentItem,
} from "@/components/forms/FormAttachmentPicker";

/**
 * The booking form.
 *
 * It is one form, but a visitor reads it as three questions — who you are, when suits
 * you, anything we should know — so it is built as three numbered `<fieldset>`s rather
 * than one run of eleven stacked controls. The numerals are the set numerals the process
 * section on the home page uses, which is what ties this page to the rest of the site
 * without lifting a component that was written for a different job.
 *
 * Two changes here are corrections rather than styling. Every label now carries `htmlFor`
 * against a real `id` — they were bare `<label>` elements wrapping nothing, so clicking a
 * label did nothing and assistive technology announced the fields unlabelled — and errors
 * are wired through `aria-invalid` / `aria-describedby` and set in `text-red-700`, since
 * the `text-red-400` they used measures 2.6:1 on white and dates from the dark palette.
 */

/** Shared field chrome: a warm well inside the white card, white again once focused. */
const FIELD =
  "w-full rounded-xl border bg-page py-3 pl-11 pr-4 text-sm text-ink-1 transition placeholder:text-ink-4 focus:bg-raised focus:outline-none focus:ring-1";
const FIELD_OK = "border-control-line focus:border-accent focus:ring-accent";
const FIELD_BAD = "border-red-600 focus:border-red-600 focus:ring-red-600";

function fieldClass(hasError: boolean) {
  return `${FIELD} ${hasError ? FIELD_BAD : FIELD_OK}`;
}

/** Numbered legend, set in the same numerals as the process steps on the home page. */
function StepLegend({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <legend className="flex w-full items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-serif text-base leading-none text-accent-ink"
      >
        {String(step).padStart(2, "0")}
      </span>
      <span className="font-serif text-lg text-ink-1">{children}</span>
    </legend>
  );
}

/** Asterisk for sighted readers, a word for everyone else. */
function RequiredMark({ label }: { label: string }) {
  return (
    <>
      <span aria-hidden="true" className="text-accent-ink">
        {" *"}
      </span>
      <span className="sr-only">{` (${label})`}</span>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export function PrenotaForm() {
  const t = useTranslations("Booking");
  const tForm = useTranslations("FormErrors");
  const locale = useLocale();
  /** Locale-aware: the schema used to answer an English visitor in Italian. */
  const schema = useMemo(
    () => createPrenotaRequestSchema(locale === "en" ? "en" : "it"),
    [locale],
  );
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
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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
      <div className="overflow-hidden rounded-3xl border border-line bg-raised shadow-[0_1px_2px_rgba(20,23,26,0.04),0_24px_60px_-38px_rgba(20,23,26,0.45)]">
        <span
          aria-hidden="true"
          className="block h-1 bg-gradient-to-r from-accent-deep via-accent-light to-accent-deep"
        />
        <div className="px-6 py-14 text-center sm:px-10">
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/12 text-accent-ink"
          >
            <Check className="h-7 w-7" strokeWidth={2.25} />
          </span>
          <h2 className="mt-6 font-serif text-2xl text-ink-1 sm:text-3xl">
            {t("successTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-ink-3">
            {t("successBody")}
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:border-accent/60 hover:bg-accent/20"
          >
            {t("sendAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-raised shadow-[0_1px_2px_rgba(20,23,26,0.04),0_24px_60px_-38px_rgba(20,23,26,0.45)]">
      <span
        aria-hidden="true"
        className="block h-1 bg-gradient-to-r from-accent-deep via-accent-light to-accent-deep"
      />

      <div className="p-6 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
          {t("formLabel")}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-ink-1 sm:text-3xl">
          {t("formTitle")}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-9 space-y-10"
          noValidate
        >
          <HoneypotField
            register={register}
            setValue={setValue}
            name="_gotcha"
          />

          {/* 01 — who you are */}
          <fieldset className="min-w-0 border-0 p-0">
            <StepLegend step={1}>{t("stepContact")}</StepLegend>
            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="prenota-name"
                  className="text-sm font-medium text-ink-2"
                >
                  {t("fieldName")}
                  <RequiredMark label={t("requiredMark")} />
                </label>
                <div className="relative mt-2">
                  <User
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4"
                  />
                  <input
                    id="prenota-name"
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={
                      errors.name ? "prenota-name-error" : undefined
                    }
                    className={fieldClass(Boolean(errors.name))}
                    {...register("name")}
                  />
                </div>
                <FieldError
                  id="prenota-name-error"
                  message={errors.name?.message}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="prenota-email"
                    className="text-sm font-medium text-ink-2"
                  >
                    {t("fieldEmail")}
                    <RequiredMark label={t("requiredMark")} />
                  </label>
                  <div className="relative mt-2">
                    <Mail
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4"
                    />
                    <input
                      id="prenota-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={
                        errors.email ? "prenota-email-error" : undefined
                      }
                      className={fieldClass(Boolean(errors.email))}
                      {...register("email")}
                    />
                  </div>
                  <FieldError
                    id="prenota-email-error"
                    message={errors.email?.message}
                  />
                </div>

                <div>
                  <label
                    htmlFor="prenota-phone"
                    className="text-sm font-medium text-ink-2"
                  >
                    {t("fieldPhone")}
                    <RequiredMark label={t("requiredMark")} />
                  </label>
                  <div className="relative mt-2">
                    <Phone
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4"
                    />
                    <input
                      id="prenota-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={
                        errors.phone ? "prenota-phone-error" : undefined
                      }
                      className={fieldClass(Boolean(errors.phone))}
                      {...register("phone")}
                    />
                  </div>
                  <FieldError
                    id="prenota-phone-error"
                    message={errors.phone?.message}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* 02 — when */}
          <fieldset className="min-w-0 border-0 border-t border-line p-0 pt-9">
            <StepLegend step={2}>{t("stepWhen")}</StepLegend>
            <p className="mt-4 text-sm leading-relaxed text-ink-3">
              {t("fieldPreferredHint")}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="prenota-date"
                  className="text-sm font-medium text-ink-2"
                >
                  {t("fieldPreferredDate")}
                  <RequiredMark label={t("requiredMark")} />
                </label>
                <div className="mt-2">
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
                        invalid={Boolean(errors.preferredDate)}
                        describedBy={
                          errors.preferredDate ? "prenota-date-error" : undefined
                        }
                      />
                    )}
                  />
                </div>
                <FieldError
                  id="prenota-date-error"
                  message={errors.preferredDate?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="prenota-time"
                  className="text-sm font-medium text-ink-2"
                >
                  {t("fieldPreferredTime")}
                  <RequiredMark label={t("requiredMark")} />
                </label>
                <div className="mt-2">
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
                        invalid={Boolean(errors.preferredTime)}
                        describedBy={
                          errors.preferredTime ? "prenota-time-error" : undefined
                        }
                      />
                    )}
                  />
                </div>
                <FieldError
                  id="prenota-time-error"
                  message={errors.preferredTime?.message}
                />
              </div>
            </div>
          </fieldset>

          {/* 03 — anything else */}
          <fieldset className="min-w-0 border-0 border-t border-line p-0 pt-9">
            <StepLegend step={3}>{t("stepDetails")}</StepLegend>
            <p className="mt-4 text-sm leading-relaxed text-ink-3">
              {t("stepDetailsHint")}
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="prenota-notes"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-2"
                >
                  <MessageSquareText aria-hidden className="h-4 w-4 text-ink-4" />
                  {t("fieldNotes")}
                </label>
                <textarea
                  id="prenota-notes"
                  rows={4}
                  aria-invalid={errors.notes ? true : undefined}
                  aria-describedby={
                    errors.notes ? "prenota-notes-error" : undefined
                  }
                  className={`mt-2 w-full resize-y rounded-xl border bg-page px-4 py-3 text-sm leading-relaxed text-ink-1 transition focus:bg-raised focus:outline-none focus:ring-1 ${
                    errors.notes ? FIELD_BAD : FIELD_OK
                  }`}
                  {...register("notes")}
                />
                <FieldError
                  id="prenota-notes-error"
                  message={errors.notes?.message}
                />
              </div>

              <div>
                <label
                  htmlFor="prenota-attachments"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-2"
                >
                  <Paperclip aria-hidden className="h-4 w-4 text-ink-4" />
                  {t("fieldAttachments")}
                </label>
                <p className="mt-1 text-xs leading-relaxed text-ink-4">
                  {t("attachmentsHint")}
                </p>
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
            </div>
          </fieldset>

          {/* Send */}
          <div className="border-t border-line pt-9">
            {submitError && (
              <p
                role="alert"
                className="mb-5 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="sweep inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-on-accent shadow-lg shadow-accent/20 transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {t("sending")}
                </>
              ) : (
                <>
                  <CalendarCheck className="h-4 w-4" aria-hidden />
                  {t("submit")}
                </>
              )}
            </button>

            <p className="mt-4 text-center text-sm leading-relaxed text-ink-3">
              {t("submitNote")}
            </p>

            <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-ink-4">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                {t("formPrivacy")}{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-accent-ink underline underline-offset-2 hover:text-accent-deep"
                >
                  {t("privacyLink")}
                </Link>
                .
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
