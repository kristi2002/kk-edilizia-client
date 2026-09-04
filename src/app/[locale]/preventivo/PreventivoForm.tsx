"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { FieldError, RequiredMark } from "@/components/forms/FieldError";
import {
  createPreventivoRequestSchema,
  createPreventivoStepSchemas,
  type PreventivoRequest,
} from "@/lib/validations/preventivo";
import { useLocale, useTranslations } from "next-intl";
import { firstServerFieldError } from "@/lib/form-api-response";
import { Loader2, CheckCircle2 } from "lucide-react";
import type { PreventivoFormOptions } from "@/lib/data/preventivo-form-options";

type Props = {
  initialOptions: PreventivoFormOptions;
};

const TOTAL_STEPS = 3;

/** Shared field chrome, red-bordered while a field is in error. */
const FIELD =
  "mt-2 w-full rounded-xl border bg-raised px-4 py-3 text-ink-1 transition placeholder:text-ink-4 focus:outline-none focus:ring-1";
const FIELD_OK = "border-control-line focus:border-accent focus:ring-accent";
const FIELD_BAD = "border-red-600 focus:border-red-600 focus:ring-red-600";

function fieldClass(hasError: boolean) {
  return `${FIELD} ${hasError ? FIELD_BAD : FIELD_OK}`;
}

/**
 * The quote form.
 *
 * Every string here used to be an Italian literal, so `/en/preventivo` served an
 * Italian form on the page every call to action points at — while `ContactForm` and
 * `PrenotaForm` were both fully translated. The copy now lives in the `PreventivoForm`
 * namespace, and the resolver comes from `createPreventivoRequestSchema(locale)` so
 * validation messages follow the page rather than staying Italian.
 *
 * The accessibility work mirrors `PrenotaForm`, which had already been through this
 * pass: errors are wired through `aria-invalid` / `aria-describedby` and rendered by the
 * shared `FieldError` (`role="alert"`, `text-red-700`); the two option lists are real
 * `<fieldset>`s with a `<legend>`, so their headings are the groups' accessible names
 * instead of loose paragraphs; and advancing a step moves focus to the new heading and
 * announces the position, which nothing signalled before.
 */
export function PreventivoForm({ initialOptions }: Props) {
  const locale = useLocale();
  const loc = locale === "en" ? "en" : "it";
  const workTypes = initialOptions.workTypes;
  const budgets = initialOptions.budgets;
  const timelines = initialOptions.timelines;

  const optLabel = (o: { labelIt: string; labelEn: string }) =>
    loc === "en" ? o.labelEn : o.labelIt;
  const t = useTranslations("PreventivoForm");
  const tForm = useTranslations("FormErrors");
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Focus target for each step, so advancing does not strand a keyboard user. */
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const schema = useMemo(() => createPreventivoRequestSchema(loc), [loc]);
  const stepSchemas = useMemo(() => createPreventivoStepSchemas(loc), [loc]);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    formState,
    setError,
    getValues,
  } = useForm<PreventivoRequest>({
    resolver: zodResolver(schema),
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
  const errors = formState.errors;
  const workType = useWatch({ control, name: "workType" });
  const budget = useWatch({ control, name: "budget" });
  const timeline = useWatch({ control, name: "timeline" });

  function goToStep(next: number) {
    setStep(next);
    setSubmitError(null);
    /** After the panel swap, put the caret on the new heading. */
    requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  async function validateAndNext() {
    setSubmitError(null);
    const values = getValues();
    const schemaForStep =
      step === 0 ? stepSchemas.step1 : step === 1 ? stepSchemas.step2 : null;
    if (!schemaForStep) return;

    const r = schemaForStep.safeParse(
      step === 0
        ? { workType: values.workType, sqm: values.sqm }
        : { budget: values.budget, timeline: values.timeline },
    );
    if (!r.success) {
      const fieldErrors = r.error.flatten().fieldErrors;
      Object.entries(fieldErrors).forEach(([key, msgs]) => {
        const first = Array.isArray(msgs) ? msgs[0] : undefined;
        if (first) setError(key as keyof PreventivoRequest, { message: first });
      });
      return;
    }
    goToStep(step + 1);
  }

  async function onSubmit(data: PreventivoRequest) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/preventivo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale: loc }),
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
      setSubmitError(t("networkError"));
    }
  }

  if (done) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-accent/30 bg-accent/10 px-8 py-16 text-center"
      >
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent-ink" aria-hidden />
        <h2 className="mt-6 font-serif text-2xl text-ink-1">
          {t("successTitle")}
        </h2>
        <p className="mt-3 text-ink-3">{t("successBody")}</p>
      </div>
    );
  }

  const stepLabel = t("stepOf", { step: step + 1, total: TOTAL_STEPS });

  return (
    <div className="rounded-3xl border border-line bg-raised p-6 sm:p-10">
      <div
        className="mb-10 flex gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step + 1}
        aria-valuetext={stepLabel}
        aria-label={t("progressLabel")}
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 overflow-hidden rounded-full bg-raised-2"
          >
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: i <= step ? "100%" : "0%" }}
              transition={{ duration: 0.35 }}
            />
          </div>
        ))}
      </div>

      {/* Announces "Passo 2 di 3" when the panel swaps; the panels themselves animate. */}
      <p className="sr-only" aria-live="polite">
        {stepLabel}
      </p>

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
              <p
                aria-hidden="true"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink"
              >
                {stepLabel}
              </p>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="font-serif text-2xl text-ink-1 outline-none"
              >
                {t("step1Title")}
              </h2>
              <fieldset
                className="min-w-0 border-0 p-0"
                aria-invalid={errors.workType ? true : undefined}
                aria-describedby={
                  errors.workType ? "preventivo-worktype-error" : undefined
                }
              >
                <legend className="sr-only">{t("step1Title")}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {workTypes.map((w) => (
                    <label
                      key={w.value}
                      className={`flex cursor-pointer items-center rounded-xl border px-4 py-3 text-sm transition ${
                        workType === w.value
                          ? "border-accent bg-accent/10 text-ink-1"
                          : "border-line text-ink-3 hover:border-line-2"
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
                <FieldError
                  id="preventivo-worktype-error"
                  message={errors.workType?.message}
                />
              </fieldset>
              <div>
                <label
                  htmlFor="preventivo-sqm"
                  className="text-sm text-ink-4"
                >
                  {t("fieldSqm")}
                </label>
                <input
                  id="preventivo-sqm"
                  type="text"
                  inputMode="numeric"
                  placeholder={t("sqmPlaceholder")}
                  className={fieldClass(Boolean(errors.sqm))}
                  aria-invalid={errors.sqm ? true : undefined}
                  aria-describedby={
                    errors.sqm ? "preventivo-sqm-error" : undefined
                  }
                  {...register("sqm")}
                />
                <FieldError
                  id="preventivo-sqm-error"
                  message={errors.sqm?.message}
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
              <p
                aria-hidden="true"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink"
              >
                {stepLabel}
              </p>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="font-serif text-2xl text-ink-1 outline-none"
              >
                {t("step2Title")}
              </h2>
              <fieldset
                className="min-w-0 border-0 p-0"
                aria-invalid={errors.budget ? true : undefined}
                aria-describedby={
                  errors.budget ? "preventivo-budget-error" : undefined
                }
              >
                <legend className="text-sm text-ink-4">
                  {t("groupBudget")}
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {budgets.map((b) => (
                    <label
                      key={b.value}
                      className={`flex cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                        budget === b.value
                          ? "border-accent bg-accent/10 text-ink-1"
                          : "border-line text-ink-3 hover:border-line-2"
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
                <FieldError
                  id="preventivo-budget-error"
                  message={errors.budget?.message}
                />
              </fieldset>
              <fieldset
                className="min-w-0 border-0 p-0"
                aria-invalid={errors.timeline ? true : undefined}
                aria-describedby={
                  errors.timeline ? "preventivo-timeline-error" : undefined
                }
              >
                <legend className="text-sm text-ink-4">
                  {t("groupTimeline")}
                </legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {timelines.map((tl) => (
                    <label
                      key={tl.value}
                      className={`flex cursor-pointer rounded-xl border px-4 py-3 text-sm transition ${
                        timeline === tl.value
                          ? "border-accent bg-accent/10 text-ink-1"
                          : "border-line text-ink-3 hover:border-line-2"
                      }`}
                    >
                      <input
                        type="radio"
                        value={tl.value}
                        className="sr-only"
                        {...register("timeline")}
                      />
                      {optLabel(tl)}
                    </label>
                  ))}
                </div>
                <FieldError
                  id="preventivo-timeline-error"
                  message={errors.timeline?.message}
                />
              </fieldset>
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
              <p
                aria-hidden="true"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink"
              >
                {stepLabel}
              </p>
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="font-serif text-2xl text-ink-1 outline-none"
              >
                {t("step3Title")}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="preventivo-name"
                    className="text-sm text-ink-4"
                  >
                    {t("fieldName")}
                    <RequiredMark label={t("requiredMark")} />
                  </label>
                  <input
                    id="preventivo-name"
                    className={fieldClass(Boolean(errors.name))}
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={
                      errors.name ? "preventivo-name-error" : undefined
                    }
                    {...register("name")}
                  />
                  <FieldError
                    id="preventivo-name-error"
                    message={errors.name?.message}
                  />
                </div>
                <div>
                  <label
                    htmlFor="preventivo-email"
                    className="text-sm text-ink-4"
                  >
                    {t("fieldEmail")}
                    <RequiredMark label={t("requiredMark")} />
                  </label>
                  <input
                    id="preventivo-email"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    className={fieldClass(Boolean(errors.email))}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={
                      errors.email ? "preventivo-email-error" : undefined
                    }
                    {...register("email")}
                  />
                  <FieldError
                    id="preventivo-email-error"
                    message={errors.email?.message}
                  />
                </div>
                <div>
                  <label
                    htmlFor="preventivo-phone"
                    className="text-sm text-ink-4"
                  >
                    {t("fieldPhone")}
                    <RequiredMark label={t("requiredMark")} />
                  </label>
                  <input
                    id="preventivo-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={fieldClass(Boolean(errors.phone))}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={
                      errors.phone ? "preventivo-phone-error" : undefined
                    }
                    {...register("phone")}
                  />
                  <FieldError
                    id="preventivo-phone-error"
                    message={errors.phone?.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="preventivo-notes"
                    className="text-sm text-ink-4"
                  >
                    {t("fieldNotes")}
                  </label>
                  <textarea
                    id="preventivo-notes"
                    rows={4}
                    className={`${fieldClass(Boolean(errors.notes))} resize-none`}
                    placeholder={t("notesPlaceholder")}
                    autoComplete="off"
                    aria-invalid={errors.notes ? true : undefined}
                    aria-describedby={
                      errors.notes ? "preventivo-notes-error" : undefined
                    }
                    {...register("notes")}
                  />
                  <FieldError
                    id="preventivo-notes-error"
                    message={errors.notes?.message}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitError && (
          <p role="alert" className="mt-6 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              className="rounded-full border border-line-2 px-6 py-3 text-sm font-medium text-ink-1 hover:bg-raised-2"
            >
              {t("back")}
            </button>
          ) : (
            <span />
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={validateAndNext}
              className="ml-auto rounded-full bg-accent px-8 py-3 text-sm font-semibold text-on-accent hover:bg-accent-deep"
            >
              {t("next")}
            </button>
          ) : (
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-on-accent hover:bg-accent-deep disabled:opacity-60"
            >
              {formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              {t("submit")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
