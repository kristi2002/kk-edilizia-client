import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getSiteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "Informativa sul trattamento dei dati personali e cookie — K.K Edilizia.",
};

export default function PrivacyPage() {
  const url = getSiteUrl();

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
          Legal
        </p>
        <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-zinc-400">
          <section id="titolare">
            <h2 className="font-serif text-2xl text-white">
              1. Titolare del trattamento
            </h2>
            <p className="mt-4">
              Il titolare del trattamento dei dati personali è{" "}
              <strong>{site.legalName}</strong>, con sede in {site.address.street}
              , {site.address.postalCode} {site.address.city} (
              {site.address.province}), P.IVA {site.vatId}, e-mail{" "}
              <a className="text-[#c9a227] hover:underline" href={`mailto:${site.email}`}>{site.email}</a>, PEC{" "}
              <a className="text-[#c9a227] hover:underline" href={`mailto:${site.pec}`}>{site.pec}</a>.
            </p>
          </section>

          <section id="finalita">
            <h2 className="font-serif text-2xl text-white">
              2. Tipologie di dati e finalità
            </h2>
            <p className="mt-4">
              Trattiamo i dati che ci fornisci volontariamente tramite il sito
              (moduli &quot;Preventivo&quot;, &quot;Contatti&quot; e
              &quot;Prenota sopralluogo&quot;, e-mail o telefono) e i dati tecnici
              necessari alla navigazione e alla sicurezza.
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <strong className="text-zinc-300">Dati di contatto e contenuto delle richieste</strong>{" "}
                (nome, e-mail, telefono, testo del messaggio, dettagli
                dell&apos;intervento): per rispondere alle richieste, preparare
                preventivi, organizzare sopralluoghi e gestire il rapporto
                precontrattuale/contrattuale.
              </li>
              <li>
                <strong className="text-zinc-300">Dati tecnici e di sicurezza</strong>{" "}
                (indirizzo IP, tipo di browser, orario di accesso, pagine visitate ove
                raccolti dai sistemi; misure anti-spam come limitazione della
                frequenza di invio moduli): per sicurezza del sito, prevenzione di
                abusi automatizzati, diagnosi tecnica e miglioramento del servizio,
                nei limiti previsti dalla legge e, per il traffico verso i moduli,
                anche in base al legittimo interesse (art. 6, par. 1, lett. f GDPR),
                previo bilanciamento con i tuoi diritti.
              </li>
            </ul>
          </section>

          <section id="base-giuridica">
            <h2 className="font-serif text-2xl text-white">
              3. Base giuridica e conservazione
            </h2>
            <p className="mt-4">
              La base giuridica è l&apos;esecuzione di misure precontrattuali su
              tua richiesta (art. 6, par. 1, lett. b GDPR) e, ove applicabile,
              il legittimo interesse a gestire il sito in modo sicuro (art. 6,
              par. 1, lett. f GDPR). I dati delle richieste sono conservati per il
              tempo necessario a evadere la pratica e per eventuali obblighi di
              legge (es. contabilità), salvo ulteriori conservazioni imposte dalla
              normativa.
            </p>
          </section>

          <section id="destinatari">
            <h2 className="font-serif text-2xl text-white">
              4. Destinatari e trasferimenti
            </h2>
            <p className="mt-4">
              I dati possono essere trattati da personale autorizzato e da
              fornitori che erogano servizi strumentali (es. hosting del sito su
              Vercel, servizi di posta elettronica o invio messaggi, database per
              limitazione richieste ove configurato), nominati responsabili del
              trattamento ove richiesto. Se utilizziamo strumenti con server fuori
              dallo SEE, adottiamo garanzie adeguate (es. clausole contrattuali
              standard) ove necessario.
            </p>
          </section>

          <section id="diritti">
            <h2 className="font-serif text-2xl text-white">
              5. Diritti dell&apos;interessato
            </h2>
            <p className="mt-4">
              Puoi esercitare i diritti di accesso, rettifica, cancellazione,
              limitazione, opposizione e portabilità nei limiti di legge, nonché
              proporre reclamo al Garante per la protezione dei dati personali (
              <a
                className="text-[#c9a227] hover:underline"
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.garanteprivacy.it
              </a>
              ). Per richieste relative ai tuoi dati:{" "}
              <a className="text-[#c9a227] hover:underline" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </section>

          <section id="cookie">
            <h2 className="font-serif text-2xl text-white">
              6. Cookie e tecnologie simili
            </h2>
            <p className="mt-4">
              Questo sito utilizza cookie tecnici strettamente necessari al
              funzionamento e alla sicurezza (es. gestione sessione, preferenze
              cookie). La scelta sul banner (solo necessari / accetta tutto) viene
              memorizzata in locale sul tuo dispositivo (localStorage) per ricordare
              la preferenza.
            </p>
            <p className="mt-4">
              Se accetti dal banner, possiamo attivare statistiche di visita in
              forma aggregata e anonima tramite Vercel Web Analytics (fornitore:
              Vercel Inc.), per capire come viene usato il sito. Se scegli solo i
              cookie necessari, tali statistiche non vengono attivate.
            </p>
            <p className="mt-4">
              Non utilizziamo cookie di profilazione di terze parti salvo diversa
              indicazione aggiornata in questa pagina. Puoi gestire le preferenze
              dal banner cookie e dal tuo browser. Il rifiuto dei cookie tecnici può
              compromettere alcune funzioni del sito.
            </p>
          </section>

          <section id="modifiche">
            <h2 className="font-serif text-2xl text-white">7. Modifiche</h2>
            <p className="mt-4">
              La presente informativa può essere aggiornata. La versione
              vigente è pubblicata su{" "}
              <Link href="/privacy" className="text-[#c9a227]">
                {url}/privacy
              </Link>
              .
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
