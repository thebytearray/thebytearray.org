"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchRepos, GitHubError, type Repo } from "@/lib/github";

export type RepoState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; repos: Repo[] };

export function useGitHubRepos() {
  const [state, setState] = useState<RepoState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchRepos({ force: attempt > 0 })
      .then((repos) => {
        if (!cancelled) setState({ status: "success", repos });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof GitHubError
            ? error.message
            : "Something went wrong while loading repositories.";
        setState({ status: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  return { state, retry };
}
