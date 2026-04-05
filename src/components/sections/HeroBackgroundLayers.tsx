import Image from "next/image";

const HERO_IMAGE_SRC =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e";

export function HeroBackgroundLayers() {
  return (
    <>
      <Image
        src={HERO_IMAGE_SRC}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={72}
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-[#080808]/75 to-[#080808]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9a227]/12 via-transparent to-transparent" />
    </>
  );
}
