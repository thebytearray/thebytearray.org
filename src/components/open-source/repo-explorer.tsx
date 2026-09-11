"use client";

import { useMemo, useState } from "react";
import { Button, Label, SearchField, Tag, TagGroup, type Selection } from "@heroui/react";
import { FolderGit2, SearchX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { RepoRow } from "@/components/open-source/repo-row";
import { RepoError, RepoListSkeleton, repoGridClassName } from "@/components/open-source/repo-states";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/links";
import { site } from "@/content/site";
import { useGitHubRepos } from "@/hooks/use-github-repos";
import type { Repo } from "@/lib/github";

const ALL = "all";

// A solid fill makes the active filter obvious in both themes.
const tagClassName =
  "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:[&_.count]:text-accent-foreground/75";

function countLanguages(repos: Repo[]) {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts].sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b));
}

function matches(repo: Repo, language: string, query: string) {
  if (language !== ALL && repo.language !== language) return false;
  if (!query) return true;
  const haystack = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

function RepoResults({ repos }: { repos: Repo[] }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState(ALL);

  const languages = useMemo(() => countLanguages(repos), [repos]);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = repos.filter((repo) => matches(repo, language, normalizedQuery));
  const isFiltered = language !== ALL || normalizedQuery !== "";

  const handleLanguageChange = (keys: Selection) => {
    const [next] = keys === "all" ? [] : [...keys];
    setLanguage(next ? String(next) : ALL);
  };

  const clearFilters = () => {
    setQuery("");
    setLanguage(ALL);
  };

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <SearchField className="w-full lg:max-w-sm" value={query} onChange={setQuery}>
          <Label>Search repositories</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Name or description" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        {languages.length > 1 ? (
          <TagGroup
            selectedKeys={new Set([language])}
            selectionMode="single"
            size="lg"
            onSelectionChange={handleLanguageChange}
          >
            <Label>Language</Label>
            <TagGroup.List className="flex-wrap">
              <Tag className={tagClassName} id={ALL} textValue={`All, ${repos.length}`}>
                All <span className="count text-muted tabular-nums">{repos.length}</span>
              </Tag>
              {languages.map(([name, count]) => (
                <Tag key={name} className={tagClassName} id={name} textValue={`${name}, ${count}`}>
                  {name} <span className="count text-muted tabular-nums">{count}</span>
                </Tag>
              ))}
            </TagGroup.List>
          </TagGroup>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-8 mb-2 text-sm text-muted">
        {isFiltered
          ? `Showing ${visible.length} of ${repos.length} repositories`
          : `${repos.length} repositories`}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          action={
            <Button size="sm" variant="tertiary" onPress={clearFilters}>
              Clear filters
            </Button>
          }
          description={
            normalizedQuery
              ? `Nothing matches “${query.trim()}”${language !== ALL ? ` in ${language}` : ""}. Try a different word or clear the filters.`
              : "Try another language or clear the filters."
          }
          icon={SearchX}
          title="No repositories match"
        />
      ) : (
        <ul className={repoGridClassName}>
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((repo) => (
              <motion.li
                key={repo.id}
                layout
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <RepoRow repo={repo} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

/** Every public repository, with search and a language filter. */
export function RepoExplorer() {
  const { state, retry } = useGitHubRepos();

  if (state.status === "loading") return <RepoListSkeleton count={6} />;
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

  return <RepoResults repos={state.repos} />;
}
