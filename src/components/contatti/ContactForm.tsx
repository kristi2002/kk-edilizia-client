"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contattiRequestSchema,
  type ContattiRequest,
} from "@/lib/validations/contatti";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { useTranslations } from "next-intl";
import { firstServerFieldError } from "@/lib/form-api-response";
import { Loader2, Send } from "lucide-react";

const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const tForm = useTranslations("FormErrors");
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContattiRequest>({
    resolver: zodResolver(contattiRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      _gotcha: "",
    },
  });

  async function onSubmit(data: ContattiRequest) {
    setSubmitError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 45_000);
    try {
      const res = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      setSubmitError(t("networkError"));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  if (done) {
    const waHref =
      waNumber &&
      `https://wa.me/${waNumber}?text=${encodeURIComponent(
        "Buongiorno, ho appena inviato un messaggio dal modulo contatti sul sito.",
      )}`;
    return (
      <div className="rounded-3xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-6 py-10 text-center">
        <p className="font-medium text-white">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-zinc-400">{t("successBody")}</p>
        {waHref ? (
          <p className="mt-4 text-sm text-zinc-500">
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
          className="mt-6 text-sm font-medium text-[#c9a227] hover:underline"
        >
          Invia un altro messaggio
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="font-serif text-xl text-white">Scrivici</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Compila il modulo: i dati sono trattati come da{" "}
        <Link href="/privacy" className="text-[#c9a227] hover:underline">
          privacy policy
        </Link>
        .
      </p>
      {/* Estensioni (password manager, ecc.) possono iniettare fdprocessedid sui campi; suppressHydrationWarning evita falsi avvisi. */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-6 space-y-4"
        suppressHydrationWarning
      >
        <HoneypotField register={register} setValue={setValue} name="_gotcha" />
        <div>
          <label htmlFor="contact-name" className="text-sm text-zinc-500">
            Nome e cognome
          </label>
          <input
            id="contact-name"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            suppressHydrationWarning
            {...register("name")}
            autoComplete="name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm text-zinc-500">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            suppressHydrationWarning
            {...register("email")}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-sm text-zinc-500">
            Telefono (opzionale)
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            suppressHydrationWarning
            {...register("phone")}
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="text-sm text-zinc-500">
            Messaggio
          </label>
          <textarea
            id="contact-message"
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            placeholder="Descrivi la tua richiesta…"
            suppressHydrationWarning
            {...register("message")}
            autoComplete="off"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>
        {errors._gotcha && (
          <p className="text-sm text-red-400" role="alert">
            {errors._gotcha.message}
          </p>
        )}
        {submitError && (
          <p className="text-sm text-red-400">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          suppressHydrationWarning
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#c9a227] py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Invia messaggio
        </button>
      </form>
    </div>
  );
}
