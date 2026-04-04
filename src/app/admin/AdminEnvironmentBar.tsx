import { ExternalLink } from "lucide-react";

type Props = {
  siteUrl: string;
  redisOk: boolean;
  blobOk: boolean;
  portfolioSource: "redis" | "static";
};

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${ok ? "bg-emerald-500" : "bg-red-400"}`}
      aria-hidden
    />
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
    <div className="mb-8 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
          Stato ambiente
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          <li className="flex items-center gap-2">
            <Dot ok={redisOk} />
            <span>Redis (Upstash)</span>
            <span className="text-zinc-500">
              {redisOk ? "configurato" : "mancante in .env"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Dot ok={blobOk} />
            <span>Blob upload</span>
            <span className="text-zinc-500">
              {blobOk ? "BLOB_READ_WRITE_TOKEN" : "token mancante"}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Dot ok={portfolioInRedis} />
            <span>Portfolio attivo</span>
            <span className="text-zinc-500">
              {portfolioInRedis
                ? "copia in Redis"
                : "solo codice (nessuna copia in Redis)"}
            </span>
          </li>
        </ul>
      </div>
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/10 px-4 py-2.5 text-sm font-semibold text-[#c9a227] transition hover:bg-[#c9a227]/20"
      >
        Apri sito pubblico
        <ExternalLink className="size-4" aria-hidden />
      </a>
    </div>
  );
}
