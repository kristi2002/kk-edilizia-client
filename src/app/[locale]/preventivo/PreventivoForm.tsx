"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { HoneypotField } from "@/components/forms/HoneypotField";
import {
  preventivoRequestSchema,
  step1Schema,
  step2Schema,
  type PreventivoRequest,
} from "@/lib/validations/preventivo";
import { useLocale, useTranslations } from "next-intl";
import { firstServerFieldError } from "@/lib/form-api-response";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { PreventivoFormOptions } from "@/lib/data/preventivo-form-options";

type Props = {
  initialOptions: PreventivoFormOptions;
};

export function PreventivoForm({ initialOptions }: Props) {
  const locale = useLocale();
  const workTypes = initialOptions.workTypes;
  const budgets = initialOptions.budgets;
  const timelines = initialOptions.timelines;

  const optLabel = (o: { labelIt: string; labelEn: string }) =>
    locale === "en" ? o.labelEn : o.labelIt;
  const tForm = useTranslations("FormErrors");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState,
    setError,
    getValues,
  } = useForm<PreventivoRequest>({
      resolver: zodResolver(preventivoRequestSchema),
      defaultValues: {
        workType: "",
        sqm: "",
        budget: "",
        timeline: "",
        name: "",
        email: "",
        phone: "",
        notes: "",
        _gotcha: "",
      },
    });
  const workType = useWatch({ control, name: "workType" });
  const budget = useWatch({ control, name: "budget" });
  const timeline = useWatch({ control, name: "timeline" });

  const totalSteps = 3;

  async function validateAndNext() {
    setSubmitError(null);
    const values = getValues();
    const schema = step === 0 ? step1Schema : step === 1 ? step2Schema : null;
    if (!schema) return;

    const r = schema.safeParse(
      step === 0
        ? { workType: values.workType, sqm: values.sqm }
        : { budget: values.budget, timeline: values.timeline }
    );
    if (!r.success) {
      const fieldErrors = r.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([key, msgs]) => {
        const first = Array.isArray(msgs) ? msgs[0] : undefined;
        if (first)
          setError(key as keyof PreventivoRequest, { message: first });
      });
      return;
    }
    setStep((s) => s + 1);
  }

  async function onSubmit(data: PreventivoRequest) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/preventivo", {
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
      setDone(true);
    } catch {
      setSubmitError("Errore di rete. Controlla la connessione.");
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-8 py-16 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-[#c9a227]" />
        <h2 className="mt-6 font-serif text-2xl text-white">
          Richiesta inviata
        </h2>
        <p className="mt-3 text-zinc-400">
          Ti contatteremo entro 1–2 giorni lavorativi con i prossimi passi.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
      <div className="mb-10 flex gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <motion.div
              className="h-full bg-[#c9a227]"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.35 }}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <HoneypotField register={register} setValue={setValue} name="_gotcha" />
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                Passo 1 di 3
              </p>
              <h2 className="font-serif text-2xl text-white">
                Che tipo di intervento ti serve?
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {workTypes.map((w) => (
                  <label
                    key={w.value}
                    className={`flex cursor-pointer items-center rounded-xl border px-4 py-3 text-sm transition ${
                      workType === w.value
                        ? "border-[#c9a227] bg-[#c9a227]/10 text-white"
                        : "border-white/15 text-zinc-400 hover:border-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      value={w.value}
                      className="sr-only"
                      {...register("workType")}
                    />
                    {optLabel(w)}
                  </label>
                ))}
              </div>
              {formState.errors.workType && (
                <p className="text-sm text-red-400">
                  {formState.errors.workType.message}
                </p>
              )}
              <div>
                <label className="text-sm text-zinc-500">
                  Metri quadri (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="es. 85"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                  {...register("sqm")}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                Passo 2 di 3
              </p>
              <h2 className="font-serif text-2xl text-white">
                Budget e tempistiche
              </h2>
              <div>
                <p className="text-sm text-zinc-500">Fascia di investimento</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {budgets.map((b) => (
                    <label
                      key={b.value}
                      className={`flex cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                        budget === b.value
                          ? "border-[#c9a227] bg-[#c9a227]/10 text-white"
                          : "border-white/15 text-zinc-400 hover:border-white/30"
                      }`}
                    >
                      <input
                        type="radio"
                        value={b.value}
                        className="sr-only"
                        {...register("budget")}
                      />
                      {optLabel(b)}
                    </label>
                  ))}
                </div>
                {formState.errors.budget && (
                  <p className="mt-2 text-sm text-red-400">
                    {formState.errors.budget.message}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-zinc-500">Quando vorresti iniziare?</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {timelines.map((t) => (
                    <label
                      key={t.value}
                      className={`flex cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                        timeline === t.value
                          ? "border-[#c9a227] bg-[#c9a227]/10 text-white"
                          : "border-white/15 text-zinc-400 hover:border-white/30"
                      }`}
                    >
                      <input
                        type="radio"
                        value={t.value}
                        className="sr-only"
                        {...register("timeline")}
                      />
                      {optLabel(t)}
                    </label>
                  ))}
                </div>
                {formState.errors.timeline && (
                  <p className="mt-2 text-sm text-red-400">
                    {formState.errors.timeline.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                Passo 3 di 3
              </p>
              <h2 className="font-serif text-2xl text-white">I tuoi contatti</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="preventivo-name" className="text-sm text-zinc-500">
                    Nome e cognome
                  </label>
                  <input
                    id="preventivo-name"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                    {...register("name")}
                    autoComplete="name"
                  />
                  {formState.errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="preventivo-email" className="text-sm text-zinc-500">
                    Email
                  </label>
                  <input
                    id="preventivo-email"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                    {...register("email")}
                    autoComplete="email"
                  />
                  {formState.errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="preventivo-phone" className="text-sm text-zinc-500">
                    Telefono
                  </label>
                  <input
                    id="preventivo-phone"
                    type="tel"
                    inputMode="tel"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                    {...register("phone")}
                    autoComplete="tel"
                  />
                  {formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-400">
                      {formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="preventivo-notes" className="text-sm text-zinc-500">
                    Note aggiuntive (opzionale)
                  </label>
                  <textarea
                    id="preventivo-notes"
                    rows={4}
                    className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                    placeholder="Esigenze particolari, vincoli, note utili…"
                    {...register("notes")}
                    autoComplete="off"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitError && (
          <p className="mt-6 text-sm text-red-400">{submitError}</p>
        )}

        <div className="mt-10 flex flex-wrap justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setStep((s) => s - 1);
                setSubmitError(null);
              }}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Indietro
            </button>
          ) : (
            <span />
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={validateAndNext}
              className="ml-auto rounded-full bg-[#c9a227] px-8 py-3 text-sm font-semibold text-[#0a0a0a] hover:bg-[#ddb92e]"
            >
              Avanti
            </button>
          ) : (
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-8 py-3 text-sm font-semibold text-[#0a0a0a] hover:bg-[#ddb92e] disabled:opacity-60"
            >
              {formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Invia richiesta
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
