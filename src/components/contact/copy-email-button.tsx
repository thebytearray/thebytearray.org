"use client";

import { Button, toast, type ButtonProps } from "@heroui/react";
import { Copy } from "lucide-react";

import { emailAddress } from "@/content/site";

export function CopyEmailButton({ variant = "tertiary", size = "sm" }: Pick<ButtonProps, "variant" | "size">) {
  const copy = async () => {
    try {
      const address = emailAddress();
      await navigator.clipboard.writeText(address);
      toast.success("Email address copied", { description: address });
    } catch {
      toast.danger("Couldn’t copy the address", {
        description: `Select it and copy it yourself: ${emailAddress()}`,
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
