import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.brand} — Ristrutturazioni Modena`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
              fontSize: 72,
              fontWeight: 700,
              color: "#c9a227",
              letterSpacing: "-0.02em",
              fontFamily: "Georgia, serif",
            }}
          >
            K.K
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: "#f4f4f5",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Edilizia
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
    { ...size }
  );
}
