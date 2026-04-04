import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { Shield, Users, Award, FileCheck } from "lucide-react";
import { getSite } from "@/lib/data/site-store";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta =
    locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return {
    title: locale === "en" ? "About us" : "Chi siamo",
    description: meta.siteDescription,
  };
}

const workPhoto =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80";
const sitePhoto =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80";

export default async function ChiSiamoPage() {
  const site = await getSite();
  const pillars = [
    {
      icon: Users,
      title: "Team multidisciplinare",
      text: "Muratura, impianti, finiture: figure interne e partner certificati per ogni fase del lavoro.",
    },
    {
      icon: Shield,
      title: "Sicurezza e conformità",
      text: "Documentazione a norma, DPI per il personale e coordinamento in cantiere secondo le normative vigenti.",
    },
    {
      icon: Award,
      title: "Qualità percepita",
      text: "Materiali selezionati e controlli in corso d’opera per un risultato che regge nel tempo.",
    },
    {
      icon: FileCheck,
      title: "Assicurazione e adempimenti",
      text: site.insurance + " " + site.compliance,
    },
  ];

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              Azienda
            </p>
            <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
              Chi siamo
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              {site.brand} nasce dall&apos;incontro tra artigiani specializzati e
              project management: un unico referente per pianificare il cantiere,
              coordinare i fornitori e rispettare le tempistiche che promettiamo
              ai nostri clienti.
            </p>
          </FadeIn>

          <ul className="mt-16 space-y-12">
            {pillars.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <li className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227]/15 text-[#c9a227]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-white">{item.title}</h2>
                    <p className="mt-2 text-zinc-500">{item.text}</p>
                  </div>
                </li>
              </FadeIn>
            ))}
          </ul>

          <FadeIn delay={0.35}>
            <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="font-serif text-lg text-white">
                Certificazioni e qualificazioni
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {site.certifications} Aggiorna questo testo con categorie SOA,
                classifiche e scadenze reali quando disponibili.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              Cantieri e lavori
            </p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
              Immagini di esempio
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              Sostituisci queste foto stock con scatti dei vostri cantieri (prima
              / dopo, dettagli) caricando file in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-300">
                public/images/
              </code>{" "}
              e aggiornando i percorsi in{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-zinc-300">
                chi-siamo/page.tsx
              </code>
              .
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={workPhoto}
                    alt="Cantiere edile — sostituire con foto propria"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-zinc-500">
                  Esempio: ristrutturazione in corso
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-white/10">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={sitePhoto}
                    alt="Interno ristrutturato — sostituire con foto propria"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-zinc-500">
                  Esempio: finiture e spazi abitativi
                </figcaption>
              </figure>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
