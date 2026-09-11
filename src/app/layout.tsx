import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { ogImageSize } from "@/lib/og-image-size";
import { defaultShareImage } from "@/lib/seo";
import { organizationLd, websiteLd } from "@/lib/structured-data";

import { Providers } from "./providers";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-schibsted",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  keywords: [
    "The Byte Array",
    "privacy-first apps",
    "Android apps",
    "OpenLoader",
    "APK installer",
    "wireless ADB",
    "Shizuku",
    "Hy2NG",
    "Hysteria2 client",
    "open source",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    images: [{ ...defaultShareImage, ...ogImageSize, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    images: [{ ...defaultShareImage, ...ogImageSize, type: "image/png" }],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1515" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth" className={`${schibsted.variable} ${jetbrains.variable}`} lang="en">
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <Providers>
          <a
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-accent-foreground"
            href="#main"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main className="flex-1 outline-none" id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
