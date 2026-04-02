import type { Metadata } from "next";
import { PreventivoForm } from "./PreventivoForm";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Preventivo",
  description:
    "Richiedi un preventivo per ristrutturazioni e lavori edili. Modulo guidato in pochi passaggi.",
};

export default function PreventivoPage() {
  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Preventivo
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            Raccontaci il tuo progetto
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Rispondi a poche domande: ti ricontatteremo per approfondire e
            fissare un sopralluogo.
          </p>
        </FadeIn>

        <div className="mt-12">
          <PreventivoForm />
        </div>
      </div>
    </main>
  );
}
