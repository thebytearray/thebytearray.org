import type { AppFeature } from "@/content/apps";

export function FeatureList({ features }: { features: readonly AppFeature[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <li key={title} className="flex gap-4 border-t border-separator py-6">
          <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
