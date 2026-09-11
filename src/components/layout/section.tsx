import type { ReactNode } from "react";
import { cn } from "tailwind-variants";

import { Container } from "@/components/layout/container";

interface SectionProps {
  /** Used for the heading id and the section's accessible name. */
  id: string;
  title: string;
  description?: ReactNode;
  /** A link or button shown opposite the heading, e.g. "All repositories". */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A page section with a rule above it, a heading, and optional description and action. */
export function Section({ id, title, description, action, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn("scroll-mt-20", className)} id={id}>
      <Container>
        <div className="border-t border-separator pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-bold" id={headingId}>
                {title}
              </h2>
              {description ? <p className="mt-3 text-lead text-muted">{description}</p> : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
          {children}
        </div>
      </Container>
    </section>
  );
}
