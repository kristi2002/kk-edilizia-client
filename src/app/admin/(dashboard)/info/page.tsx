import { faqByLocale } from "@/lib/data/faq";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminSection } from "../../AdminSection";

export default function AdminInfoPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Info &amp; FAQ</h1>
          <p className="mt-2 text-base text-zinc-400">
            Cose che non si modificano da questo pannello (per sicurezza e stabilità).
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={5}
        title="Domande frequenti (FAQ)"
        intro="Le domande e risposte della pagina FAQ sono nel codice del progetto."
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-base text-zinc-400">
          <p>
            Oggi ci sono{" "}
            <strong className="text-zinc-200">{faqByLocale.it.length}</strong> voci in
            italiano e{" "}
            <strong className="text-zinc-200">{faqByLocale.en.length}</strong> in inglese.
          </p>
          <p className="mt-3">
            Per cambiarle serve intervenire sul codice o chiedere allo sviluppatore — così non
            si rischia di rompere il layout.
          </p>
        </div>
      </AdminSection>

      <AdminSection
        step={6}
        title="Testi del sito (lingue)"
        intro="Pulsanti, titoli e footer sono nei file di traduzione."
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-base text-zinc-400">
          <p>
            Lingue: italiano e inglese. Non modificare questi file se non hai esperienza: un
            errore di sintassi può bloccare il sito.
          </p>
        </div>
      </AdminSection>
    </div>
  );
}
