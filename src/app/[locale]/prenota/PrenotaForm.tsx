"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

export function PrenotaForm() {
  const t = useTranslations("Booking");
  const tForm = useTranslations("FormErrors");
  const locale = useLocale();
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
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
      preferredSlot: "",
      notes: "",
      _gotcha: "",
    },
  });

  async function onSubmit(data: PrenotaRequest) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/prenota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale: locale === "en" ? "en" : "it",
        }),
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
      setDone(true);
    } catch {
      setSubmitError(t("errorNetwork"));
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
          <label className="text-sm text-zinc-500">{t("fieldPreferred")}</label>
          <textarea
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            placeholder={t("fieldPreferredPh")}
            {...register("preferredSlot")}
          />
          {errors.preferredSlot && (
            <p className="mt-1 text-sm text-red-400">
              {errors.preferredSlot.message}
            </p>
          )}
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
