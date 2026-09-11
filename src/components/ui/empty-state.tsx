import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

/** Shown when a list has nothing to display; always says what to do next. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border px-6 py-10 sm:items-center sm:text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-default text-muted">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
