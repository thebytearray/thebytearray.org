"use client";

import { FolderGit2 } from "lucide-react";

import { RepoRow } from "@/components/open-source/repo-row";
import { RepoError, RepoListSkeleton, repoGridClassName } from "@/components/open-source/repo-states";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/links";
import { site } from "@/content/site";
import { useGitHubRepos } from "@/hooks/use-github-repos";

/** The most-starred repositories, for the home page. */
export function RepoPreview({ limit = 4 }: { limit?: number }) {
  const { state, retry } = useGitHubRepos();

  if (state.status === "loading") return <RepoListSkeleton count={limit} />;
  if (state.status === "error") return <RepoError message={state.message} onRetry={retry} />;

  if (state.repos.length === 0) {
    return (
      <EmptyState
        action={
          <ButtonLink href={site.links.github} size="sm" variant="tertiary">
            Open GitHub
          </ButtonLink>
        }
        description="Public repositories will show up here once they're published."
        icon={FolderGit2}
        title="No public repositories yet"
      />
    );
  }

  return (
    <ul className={repoGridClassName}>
      {state.repos.slice(0, limit).map((repo) => (
        <li key={repo.id}>
          <RepoRow repo={repo} />
        </li>
      ))}
    </ul>
  );
}
