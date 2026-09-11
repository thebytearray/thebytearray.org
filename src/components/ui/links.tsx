import type { ComponentProps, ReactNode } from "react";
import NextLink from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants, linkVariants, type ButtonVariants } from "@heroui/styles";
import { cn } from "tailwind-variants";

interface SmartLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  children: ReactNode;
}

const opensNewTab = (href: string) => /^https?:\/\//.test(href);

/**
 * Internal paths go through next/link for client navigation.
 * Web URLs open in a new tab with a screen-reader hint; mailto: stays in place.
 */
function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (opensNewTab(href)) {
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (href.startsWith("mailto:")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}

type ButtonLinkProps = SmartLinkProps & ButtonVariants;

/** A link styled with HeroUI's button variants. */
export function ButtonLink({
  variant = "primary",
  size,
  fullWidth,
  isIconOnly,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <SmartLink
      className={buttonVariants({ variant, size, fullWidth, isIconOnly, className })}
      {...props}
    />
  );
}

interface TextLinkProps extends SmartLinkProps {
  /** Show the ↗ icon for links that leave the site. */
  showExternalIcon?: boolean;
}

/** A link styled with HeroUI's link styles. */
export function TextLink({ className, showExternalIcon, children, ...props }: TextLinkProps) {
  const slots = linkVariants();

  return (
    <SmartLink className={cn(slots.base(), "gap-1", className)} {...props}>
      {children}
      {showExternalIcon && opensNewTab(props.href) ? (
        <ArrowUpRight aria-hidden="true" className={slots.icon()} />
      ) : null}
    </SmartLink>
  );
}
