import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Rendered above the title, typically breadcrumbs. */
  eyebrow?: ReactNode;
  /** Rendered below the description, typically buttons. */
  children?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, children }: PageHeaderProps) {
  return (
    <Container className="pt-10 pb-10 md:pt-16 md:pb-14">
      {eyebrow ? <div className="mb-6">{eyebrow}</div> : null}
      <h1 className="max-w-3xl text-h1 font-bold">{title}</h1>
      {description ? <p className="mt-4 max-w-2xl text-lead text-muted">{description}</p> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </Container>
  );
}
