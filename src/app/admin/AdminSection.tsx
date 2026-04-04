import type { ReactNode } from "react";

type Accent = "gold" | "emerald" | "sky";

const accentBorder: Record<Accent, string> = {
  gold: "border-[#c9a227]/35 bg-gradient-to-b from-[#1a1810] to-[#101010]",
  emerald: "border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-[#101010]",
  sky: "border-sky-500/25 bg-gradient-to-b from-sky-950/30 to-[#101010]",
};

type Props = {
  step: number;
  title: string;
  intro: string;
  children: ReactNode;
  accent?: Accent;
};

export function AdminSection({
  step,
  title,
  intro,
  children,
  accent = "gold",
}: Props) {
  return (
    <section
      className={`rounded-2xl border-2 p-6 shadow-xl shadow-black/30 sm:p-8 md:p-10 ${accentBorder[accent]}`}
    >
      <div className="flex flex-wrap items-start gap-5">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-xl font-bold text-[#0a0a0a] shadow-md"
          aria-hidden
        >
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-2xl text-white sm:text-3xl">{title}</h2>
          <p className="mt-2 text-base leading-relaxed text-zinc-400">{intro}</p>
        </div>
      </div>
      <div className="mt-8 space-y-6">{children}</div>
    </section>
  );
}
