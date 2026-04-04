import type { LucideIcon } from "lucide-react";
import { ExternalLink, Images, Database, HardDrive } from "lucide-react";

type Props = {
  siteUrl: string;
  redisOk: boolean;
  blobOk: boolean;
  portfolioSource: "redis" | "static";
};

function StatusCard({
  ok,
  title,
  subtitle,
  icon: Icon,
}: {
  ok: boolean;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div
      className={`flex min-w-[200px] flex-1 items-start gap-3 rounded-xl border-2 px-4 py-3 ${
        ok
          ? "border-emerald-500/40 bg-emerald-950/40"
          : "border-amber-500/45 bg-amber-950/35"
      }`}
    >
      <Icon
        className={`mt-0.5 size-6 shrink-0 ${ok ? "text-emerald-400" : "text-amber-300"}`}
        aria-hidden
      />
      <div>
        <p className={`text-sm font-semibold ${ok ? "text-emerald-100" : "text-amber-100"}`}>
          {title}
        </p>
        <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

export function AdminEnvironmentBar({
  siteUrl,
  redisOk,
  blobOk,
  portfolioSource,
}: Props) {
  const portfolioInRedis = portfolioSource === "redis";

  return (
    <div className="mb-10 space-y-5 rounded-2xl border-2 border-[#c9a227]/30 bg-gradient-to-br from-[#1c1914] to-[#0d0d0d] p-6 shadow-lg shadow-black/40 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#c9a227]">
            Stato tecnico (solo informativo)
          </p>
          <p className="mt-2 max-w-xl text-base text-zinc-400">
            Se qualcosa è arancione, alcune funzioni potrebbero non salvare: contatta chi
            gestisce il server. Il sito pubblico si apre comunque con il pulsante a
            destra.
          </p>
        </div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={siteUrl}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#c9a227] bg-[#c9a227] px-6 py-3.5 text-base font-semibold text-[#0a0a0a] shadow-md transition hover:bg-[#ddb92e]"
        >
          Apri sito pubblico
          <ExternalLink className="size-5" aria-hidden />
        </a>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <StatusCard
          ok={redisOk}
          icon={Database}
          title="Memoria salvataggi (Redis)"
          subtitle={
            redisOk
              ? "Attiva: i salvataggi funzionano."
              : "Non configurata: salvataggio disattivato."
          }
        />
        <StatusCard
          ok={blobOk}
          icon={HardDrive}
          title="Caricamento immagini"
          subtitle={
            blobOk
              ? "Attivo: puoi caricare file nel portfolio."
              : "Token mancante: upload disattivato."
          }
        />
        <StatusCard
          ok={portfolioInRedis}
          icon={Images}
          title="Portfolio"
          subtitle={
            portfolioInRedis
              ? "Copia attiva salvata online."
              : "In uso la copia di base dal codice."
          }
        />
      </div>
    </div>
  );
}
