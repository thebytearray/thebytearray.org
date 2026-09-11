import { Archive, ArrowUpRight, GitFork, Star } from "lucide-react";

import { formatRelative } from "@/lib/format";
import { languageColor, type Repo } from "@/lib/github";

export function RepoRow({ repo }: { repo: Repo }) {
  return (
    <article className="group relative flex h-full flex-col gap-2 py-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 font-mono text-[0.9375rem] font-semibold">
          <a
            className="rounded-sm break-words decoration-brand decoration-2 underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none"
            href={repo.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {repo.name}
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
        </h3>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-muted transition-colors group-hover:text-foreground"
        />
      </div>

      <p className="line-clamp-2 text-sm text-muted">{repo.description ?? "No description yet."}</p>

      <dl className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted">
        {repo.language ? (
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Language</dt>
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ backgroundColor: languageColor(repo.language) }}
            />
            <dd>{repo.language}</dd>
          </div>
        ) : null}
        <div className="flex items-center gap-1">
          <dt>
            <Star aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Stars</span>
          </dt>
          <dd className="tabular-nums">{repo.stars}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt>
            <GitFork aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Forks</span>
          </dt>
          <dd className="tabular-nums">{repo.forks}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="sr-only">Last updated</dt>
          <dd>Updated {formatRelative(repo.pushedAt)}</dd>
        </div>
        {repo.archived ? (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Status</dt>
            <Archive aria-hidden="true" className="size-3.5" />
            <dd>Archived</dd>
          </div>
        ) : null}
      </dl>

      {/* Focus ring for the stretched link, drawn on the whole row. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 inset-y-1 rounded-xl ring-2 ring-focus opacity-0 group-has-[a:focus-visible]:opacity-100"
      />
    </article>
  );
}
