import { cn } from "tailwind-variants";

/** The []byte wordmark. Decorative: wrap it in a link or heading that carries the name. */
export function Logo({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("font-mono font-bold tracking-tight whitespace-nowrap", className)}>
      <span className="text-brand">[]</span>byte
    </span>
  );
}
