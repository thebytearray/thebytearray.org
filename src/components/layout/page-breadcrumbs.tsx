import { Breadcrumbs } from "@heroui/react";

export interface Crumb {
  label: string;
  /** Omit for the current page. */
  href?: string;
}

export function PageBreadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumbs>
        {items.map((item) => (
          <Breadcrumbs.Item key={item.label} href={item.href}>
            {item.label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </nav>
  );
}
