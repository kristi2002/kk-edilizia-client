import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import {
  BrickWall,
  Camera,
  ClipboardList,
  CookingPot,
  Drill,
  Droplets,
  Fan,
  FileCheck,
  Frame,
  Gauge,
  Grid2x2,
  Hammer,
  HardHat,
  Layers,
  LayoutGrid,
  Lightbulb,
  PaintRoller,
  PanelsTopLeft,
  Plug,
  Recycle,
  Ruler,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  SquareStack,
  Thermometer,
  Trash2,
  Truck,
  Umbrella,
  Waves,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ScopeItem = { icon?: string; title: string; text: string };

/**
 * Icons the copy is allowed to name.
 *
 * The mapping lives here rather than in the component body because the choice belongs to
 * the item — a scope line about screeds wants `Layers`, one about a consumer unit wants
 * `Zap` — and the copy for nine silos is written in `messages/*.json`. Anything the
 * translation names that is not on this list falls back to `Hammer` rather than throwing.
 */
const ICONS: Record<string, LucideIcon> = {
  brick: BrickWall,
  camera: Camera,
  clipboard: ClipboardList,
  cooking: CookingPot,
  drill: Drill,
  droplets: Droplets,
  fan: Fan,
  file: FileCheck,
  frame: Frame,
  gauge: Gauge,
  grid: Grid2x2,
  hammer: Hammer,
  hardhat: HardHat,
  layers: Layers,
  layout: LayoutGrid,
  light: Lightbulb,
  paint: PaintRoller,
  panels: PanelsTopLeft,
  plug: Plug,
  recycle: Recycle,
  ruler: Ruler,
  shield: ShieldCheck,
  shower: ShowerHead,
  sparkles: Sparkles,
  stack: SquareStack,
  thermometer: Thermometer,
  trash: Trash2,
  truck: Truck,
  umbrella: Umbrella,
  waves: Waves,
  wind: Wind,
  wrench: Wrench,
  zap: Zap,
};

/**
 * "What the job actually covers", as a scannable grid.
 *
 * Everything on these pages was previously prose: a visitor deciding whether to call had
 * to read two thousand words to find out whether the firm does the screed as well as the
 * tiling. This is the answer in six lines, and it is the one block on the page written
 * per trade rather than shared.
 */
export async function ServiceSiloScope({ items }: { items: ScopeItem[] }) {
  const t = await getTranslations("ServiceSilos");
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-b border-line bg-raised px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(201,162,39,0.07),transparent_52%)]" />
      <WatermarkWord>CANTIERE</WatermarkWord>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("scopeEyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("scopeTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-3">{t("scopeIntro")}</p>
        </FadeIn>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon ?? ""] ?? Hammer;
            return (
              <li key={item.title}>
                <FadeIn delay={i * 0.05}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-raised-2 p-6 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] w-0 bg-gradient-to-r from-accent to-accent-deep transition-all duration-500 group-hover:w-full"
                    />
                    <div className="flex items-start gap-4">
                      <span className="inline-flex shrink-0 rounded-xl bg-accent/15 p-3 text-accent-ink transition group-hover:scale-105">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="font-serif text-lg leading-tight text-ink-1">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-3">
                          {item.text}
                        </p>
                      </div>
                    </div>
                    {/* Ordinal, set as furniture rather than content. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-2 right-4 font-serif text-4xl text-accent/12 transition group-hover:text-accent/25"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
