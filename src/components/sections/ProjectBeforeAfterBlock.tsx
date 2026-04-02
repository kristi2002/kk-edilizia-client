"use client";

import dynamic from "next/dynamic";

const BeforeAfterSlider = dynamic(
  () =>
    import("@/components/sections/BeforeAfterSlider").then(
      (m) => m.BeforeAfterSlider,
    ),
  { ssr: false, loading: () => <div className="min-h-[240px]" /> },
);

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
};

export function ProjectBeforeAfterBlock(props: Props) {
  return <BeforeAfterSlider {...props} />;
}
