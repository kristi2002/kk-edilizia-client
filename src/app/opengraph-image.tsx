import { ImageResponse } from "next/og";
import { getSite } from "@/lib/data/site-store";

export const alt = "K.K Edilizia — Ristrutturazioni Modena";

/** Declared for Open Graph; helps platforms size previews without downloading the full image first. */
export const size = { width: 1200, height: 630 };
export const width = 1200;
export const height = 630;
export const contentType = "image/png";

export default async function OpengraphImage() {
  const site = await getSite();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a1510 45%, #080808 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#c9a227",
              letterSpacing: "-0.02em",
              fontFamily: "Georgia, serif",
            }}
          >
            {site.brand}
          </div>
          <div
            style={{
              marginTop: 28,
              maxWidth: 720,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#a1a1aa",
            }}
          >
            Ristrutturazioni e lavori edili a Modena e provincia
          </div>
          <div
            style={{
              marginTop: 40,
              height: 4,
              width: 120,
              background: "#c9a227",
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
