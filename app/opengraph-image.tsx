import { ImageResponse } from "next/og";

export const runtime = "edge";

async function loadGoogleFont(font: string, weight: number = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}`;
  const css = await fetch(url).then((res) => res.text());

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype|woff2)'\)/,
  );

  if (!resource) throw new Error(`Font ${font} not found`);

  return fetch(resource[1]).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const [instrumentSerif, instrumentSans] = await Promise.all([
    loadGoogleFont("Instrument+Serif", 400),
    loadGoogleFont("Instrument+Sans", 400),
  ]);

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
          backgroundColor: "#F5F4E9",
          fontFamily: "Instrument Sans",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: "Instrument Serif",
            color: "#FF5C00",
            fontStyle: "italic",
            marginBottom: 16,
          }}
        >
          uthot
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#4A4A4A",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 64,
          }}
        >
          seven gates for founders
        </div>
        <div
          style={{
            width: "40%",
            height: 1,
            backgroundColor: "#D4D4C8",
            marginBottom: 48,
          }}
        />
        <div
          style={{
            fontSize: 18,
            color: "#6B6B6B",
            textAlign: "center",
            lineHeight: 1.7,
            maxWidth: "70%",
          }}
        >
          Thirty-five questions you can&apos;t paste your way through.
          <br />
          A thinking instrument for founders.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrumentSerif,
          style: "normal",
          weight: 400,
        },
        {
          name: "Instrument Sans",
          data: instrumentSans,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
