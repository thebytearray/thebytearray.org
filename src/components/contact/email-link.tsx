"use client";

import type { ReactNode } from "react";
import { buttonVariants, linkVariants, type ButtonVariants } from "@heroui/styles";
import { cn } from "tailwind-variants";

import { emailAddress, site } from "@/content/site";

export function openEmail() {
  window.location.href = `mailto:${emailAddress()}`;
}

type EmailButtonProps = ButtonVariants & {
  className?: string;
  children: ReactNode;
};

/** A button styled as a HeroUI button that opens the mail app on click. */
export function EmailButton({ variant = "primary", size, fullWidth, className, children }: EmailButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, fullWidth, className })} type="button" onClick={openEmail}>
      {children}
    </button>
  );
}

/** Icon button that opens the mail app. The address is not in the markup. */
export function EmailIconButton({ className, label, children }: { className?: string; label: string; children: ReactNode }) {
  return (
    <button aria-label={label} className={className} type="button" onClick={openEmail}>
      {children}
    </button>
  );
}

/** A button styled as a text link. The visible label stays in the written-out form. */
export function EmailTextLink({ className, children }: { className?: string; children?: ReactNode }) {
  const slots = linkVariants();

  return (
    <button className={cn(slots.base(), className)} type="button" onClick={openEmail}>
      {children ?? site.emailDisplay}
    </button>
  );
}
