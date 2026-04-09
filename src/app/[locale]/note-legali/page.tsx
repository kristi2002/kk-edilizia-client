import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSite } from "@/lib/data/site-store";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, "/note-legali", {
    title: meta.noteLegaliTitle,
    description: meta.noteLegaliDescription,
  });
}

export default async function NoteLegaliPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSite();
  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
          Note legali
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Testo informativo — far verificare da un professionista prima della
          pubblicazione definitiva.
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-zinc-400">
          <section>
            <h2 className="font-serif text-xl text-white">Titolarità del sito</h2>
            <p className="mt-3">
              Il presente sito web è gestito da{" "}
              <strong className="text-zinc-300">{site.legalName}</strong>, P.IVA{" "}
              {site.vatId}, REA {site.rea}.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-white">
              Proprietà intellettuale
            </h2>
            <p className="mt-3">
              Testi, marchi, loghi, layout e contenuti del sito sono di titolarità
              di {site.legalName} o utilizzati su licenza, salvo diversa
              indicazione. È vietata la riproduzione non autorizzata a fini
              commerciali.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-white">
              Limitazione di responsabilità
            </h2>
            <p className="mt-3">
              Le informazioni pubblicate hanno scopo generale e non sostituiscono
              una consulenza tecnica o legale. {site.legalName} non risponde di
              eventuali errori od omissioni né di danni derivanti
              dall&apos;utilizzo delle informazioni presenti sul sito, nei limiti
              consentiti dalla legge.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-white">Link esterni</h2>
            <p className="mt-3">
              Eventuali collegamenti a siti terzi sono forniti per comodità;
              {site.legalName} non controlla i contenuti esterni e declina ogni
              responsabilità in merito.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-white">Legge applicabile</h2>
            <p className="mt-3">
              Per quanto non diversamente previsto, si applica la legge italiana.
              Foro competente, ove previsto, quello del luogo di residenza o sede
              del consumatore ove applicabile il Codice del Consumo.
            </p>
          </section>
        </div>

        <p className="mt-16 text-center text-sm text-zinc-600">
          <Link href="/" className="text-[#c9a227] hover:underline">
            Torna alla home
          </Link>
        </p>
      </article>
    </main>
  );
}
