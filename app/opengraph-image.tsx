import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Vorex - Master English Fluently";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0066FF",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.05em",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Vorex
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Master English Fluently with AI
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: "30px",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Personalized lessons • Real-time feedback • Structured practice
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
