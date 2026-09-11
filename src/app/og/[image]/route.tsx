import { notFound } from "next/navigation";

import { apps } from "@/content/apps";
import { site } from "@/content/site";
import { publicImageDataUrl, renderOgImage } from "@/lib/og-image";

// Share images are exported as real .png files (e.g. /og/home.png) so any static host
// serves them with the right content type.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ image: "home.png" }, ...apps.map((app) => ({ image: `${app.slug}.png` }))];
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;

  if (image === "home.png") {
    return renderOgImage({
      title: site.tagline,
      subtitle: "Android apps, libraries and developer tools that do one job well.",
    });
  }

  const app = apps.find((item) => `${item.slug}.png` === image);
  if (!app) notFound();

  return renderOgImage({
    title: app.name,
    subtitle: app.tagline,
    iconSrc: await publicImageDataUrl(app.icon.src),
  });
}
