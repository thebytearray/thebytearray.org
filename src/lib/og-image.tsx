import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

import { ogImageSize } from "@/lib/og-image-size";

// Share images always use the dark palette: it reads well in every feed and chat app.
const COLORS = { background: "#0f1515", foreground: "#e4ecea", muted: "#93a4a2", brand: "#5ec8bd", rule: "#263333" };

const fontsDir = path.join(process.cwd(), "src", "assets", "fonts");
const loadFonts = () =>
  Promise.all([
    readFile(path.join(fontsDir, "SchibstedGrotesk-ExtraBold.ttf")),
    readFile(path.join(fontsDir, "SchibstedGrotesk-Medium.ttf")),
    readFile(path.join(fontsDir, "JetBrainsMono-Bold.ttf")),
  ]);

/** Reads an image from /public as a data URL, for embedding in a share image. */
export async function publicImageDataUrl(publicPath: string) {
  const data = await readFile(path.join(process.cwd(), "public", publicPath));
  return `data:image/png;base64,${data.toString("base64")}`;
}

interface OgImageOptions {
  title: string;
  subtitle?: string;
  /** Data URL of a square image (an app icon) shown next to the title. */
  iconSrc?: string;
}

export async function renderOgImage({ title, subtitle, iconSrc }: OgImageOptions) {
  const [extraBold, medium, monoBold] = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: COLORS.background,
          color: COLORS.foreground,
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 44 }}>
          <span style={{ color: COLORS.brand }}>[]</span>
          <span>byte</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          {iconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
            <img alt="" height={168} src={iconSrc} style={{ borderRadius: 40, background: "#ffffff" }} width={168} />
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: iconSrc ? 820 : 1000 }}>
            <div style={{ fontSize: iconSrc ? 76 : 84, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ marginTop: 20, fontSize: 34, fontWeight: 500, color: COLORS.muted, lineHeight: 1.3 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${COLORS.rule}`,
            paddingTop: 28,
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.muted,
          }}
        >
          <span>thebytearray.org</span>
          <span>No ads. No tracking. No accounts.</span>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
      fonts: [
        { name: "Schibsted Grotesk", data: extraBold, weight: 800, style: "normal" },
        { name: "Schibsted Grotesk", data: medium, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
