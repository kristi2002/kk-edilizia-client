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
import { Loader2, Send } from "lucide-react";

export function ContactForm() {
  const tForm = useTranslations("FormErrors");
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
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
    try {
      const res = await fetch("/api/contatti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json?.error === "email_not_configured") {
          setSubmitError(
            "Invio email non attivo sul server: configura Resend o Gmail (vedi .env.example).",
          );
          return;
        }
        if (json?.error === "rate_limited") {
          setSubmitError(tForm("rateLimited"));
          return;
        }
        setSubmitError("Invio non riuscito. Riprova tra poco.");
        return;
      }
      reset();
      setDone(true);
    } catch {
      setSubmitError("Errore di rete. Controlla la connessione.");
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-6 py-10 text-center">
        <p className="font-medium text-white">Messaggio inviato</p>
        <p className="mt-2 text-sm text-zinc-400">
          Riceverai una breve conferma via email; ti risponderemo al più presto.
        </p>
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
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <h2 className="font-serif text-xl text-white">Scrivici</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Compila il modulo: i dati sono trattati come da{" "}
        <Link href="/privacy" className="text-[#c9a227] hover:underline">
          privacy policy
        </Link>
        .
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-6 space-y-4">
        <HoneypotField register={register} name="_gotcha" />
        <div>
          <label className="text-sm text-zinc-500">Nome e cognome</label>
          <input
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-zinc-500">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm text-zinc-500">Telefono (opzionale)</label>
          <input
            type="tel"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            {...register("phone")}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-500">Messaggio</label>
          <textarea
            rows={5}
            className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
            placeholder="Descrivi la tua richiesta…"
            {...register("message")}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">
              {errors.message.message}
            </p>
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
