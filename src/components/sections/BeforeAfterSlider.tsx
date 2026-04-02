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
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={beforeSrc}
              alt=""
              style={{ objectFit: "cover" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={afterSrc}
              alt=""
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
