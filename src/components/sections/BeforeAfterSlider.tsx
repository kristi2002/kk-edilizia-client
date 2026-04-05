"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  /** Descriptive alt text for SEO and accessibility (see Google image guidelines). */
  beforeAlt?: string;
  afterAlt?: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  beforeAlt,
  afterAlt,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={beforeSrc}
              alt={beforeAlt ?? beforeLabel}
              style={{ objectFit: "cover" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={afterSrc}
              alt={afterAlt ?? afterLabel}
              style={{ objectFit: "cover" }}
            />
          }
          style={{ aspectRatio: "16/10", width: "100%" }}
        />
      </div>
      <div className="flex justify-between text-xs uppercase tracking-wider text-zinc-500">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
