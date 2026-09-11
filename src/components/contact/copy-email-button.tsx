"use client";

import { Button, toast, type ButtonProps } from "@heroui/react";
import { Copy } from "lucide-react";

import { site } from "@/content/site";

export function CopyEmailButton({ variant = "tertiary", size = "sm" }: Pick<ButtonProps, "variant" | "size">) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      toast.success("Email address copied", { description: site.email });
    } catch {
      toast.danger("Couldn’t copy the address", {
        description: `Select it and copy it yourself: ${site.email}`,
      });
    }
  };

  return (
    <Button size={size} variant={variant} onPress={copy}>
      <Copy aria-hidden="true" className="size-4" />
      Copy address
    </Button>
  );
}
