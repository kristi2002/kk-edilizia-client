/** Classi condivise — pannello admin: testi grandi, contrasto, facile da usare. */

export const adminInput =
  "mt-2 w-full rounded-xl border-2 border-white/15 bg-[#0c0c0c] px-4 py-3.5 text-base leading-snug text-white placeholder:text-zinc-500 focus:border-[#c9a227] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/25";

export const adminTextarea = `${adminInput} min-h-[120px] resize-y`;

export const adminLabel =
  "block text-sm font-semibold tracking-wide text-[#f0e6c8]";

export const adminHint = "mt-1.5 text-sm leading-relaxed text-zinc-500";

export const adminBtnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9a227] px-6 py-3.5 text-base font-semibold text-[#0a0a0a] shadow-lg shadow-[#c9a227]/15 transition hover:bg-[#ddb92e] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45";

export const adminBtnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/[0.06] px-6 py-3.5 text-base font-medium text-zinc-100 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-45";

export const adminSubCard =
  "rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/[0.07] p-5 sm:p-6";

export const adminAlertWarn =
  "rounded-xl border-2 border-amber-500/50 bg-amber-500/15 px-5 py-4 text-base leading-relaxed text-amber-100";

export const adminAlertOk =
  "rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-base text-emerald-100";

export const adminAlertErr =
  "rounded-xl border-2 border-red-500/40 bg-red-500/10 px-5 py-4 text-base text-red-100";

/** Campi portfolio / estimator (stesso stile). */
export const adminField = adminInput;

/** Testi lunghi nella tabella stima costi (colonne Testo IT / EN). */
export const adminEstimatorTextarea =
  "w-full min-w-[14rem] max-w-none rounded-xl border-2 border-white/15 bg-[#0c0c0c] px-4 py-3.5 text-base leading-relaxed text-white placeholder:text-zinc-500 focus:border-[#c9a227] focus:outline-none focus:ring-2 focus:ring-[#c9a227]/25 min-h-[168px] resize-y sm:min-w-[18rem]";
