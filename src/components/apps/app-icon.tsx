import Image from "next/image";
import { cn } from "tailwind-variants";

import type { App } from "@/content/apps";

const sizes = {
  md: "size-14 rounded-[0.9rem]",
  lg: "size-20 rounded-[1.25rem]",
} as const;

export function AppIcon({ app, size = "md", decorative = false }: { app: App; size?: keyof typeof sizes; decorative?: boolean }) {
  return (
    <Image
      alt={decorative ? "" : app.icon.alt}
      className={cn("shrink-0 border border-border bg-white object-cover", sizes[size])}
      height={160}
      src={app.icon.src}
      width={160}
    />
  );
}
