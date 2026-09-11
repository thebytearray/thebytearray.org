"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RouterProvider, Toast } from "@heroui/react";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute={["class", "data-theme"]}
      defaultTheme="system"
    >
      {/* Lets HeroUI links (Breadcrumbs, Link) navigate client-side. */}
      <RouterProvider navigate={router.push}>
        <MotionConfig reducedMotion="user">
          {children}
          <Toast.Provider placement="bottom" />
        </MotionConfig>
      </RouterProvider>
    </ThemeProvider>
  );
}
