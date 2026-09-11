import { z } from "zod";

const REPOS_URL = "https://api.github.com/users/thebytearray/repos?sort=updated&per_page=100";
const CACHE_KEY = "tba:github-repos:v1";
const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

const apiRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  language: z.string().nullable(),
  fork: z.boolean(),
  archived: z.boolean().optional().default(false),
  pushed_at: z.string(),
});

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  archived: boolean;
  pushedAt: string;
}

const repoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  stars: z.number(),
  forks: z.number(),
  language: z.string().nullable(),
  archived: z.boolean(),
  pushedAt: z.string(),
});

const cacheSchema = z.object({ savedAt: z.number(), repos: z.array(repoSchema) });

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly kind: "rate-limit" | "network" | "response",
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

function toRepo(repo: z.infer<typeof apiRepoSchema>): Repo {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    archived: repo.archived,
    pushedAt: repo.pushed_at,
  };
}

/** Public repos that are not forks: most stars first, then most recently pushed. */
export function sortRepos(repos: Repo[]): Repo[] {
  return [...repos].sort(
    (a, b) => b.stars - a.stars || Date.parse(b.pushedAt) - Date.parse(a.pushedAt),
  );
}

function readCache(): Repo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = cacheSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || Date.now() - parsed.data.savedAt > CACHE_TTL_MS) return null;
    return parsed.data.repos;
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos }));
  } catch {
    // Storage full or blocked: carry on without a cache.
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    let response: Response;

    try {
      response = await fetch(REPOS_URL, {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      throw new GitHubError(
        "GitHub couldn't be reached. Check your connection and try again.",
        "network",
      );
    }

    const rateLimited =
      response.status === 429 ||
      (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0");

    if (rateLimited) {
      throw new GitHubError(
        "GitHub's request limit was reached. Try again in a few minutes, or browse the repositories on GitHub.",
        "rate-limit",
      );
    }

    if (response.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    if (!response.ok) {
      throw new GitHubError(`GitHub responded with an error (${response.status}).`, "response");
    }

    return response.json();
  }
}

let inflight: Promise<Repo[]> | null = null;

/**
 * Loads the studio's public repositories from the GitHub API in the browser.
 * Results are cached for an hour per tab, and concurrent callers share one request.
 */
export function fetchRepos({ force = false }: { force?: boolean } = {}): Promise<Repo[]> {
  if (!force) {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
  }

  inflight ??= request()
    .then((data) => {
      const list = z.array(z.unknown()).safeParse(data);
      if (!list.success) {
        throw new GitHubError("GitHub returned data in an unexpected format.", "response");
      }

      const repos = list.data
        .map((item) => apiRepoSchema.safeParse(item))
        .flatMap((result) => (result.success && !result.data.fork ? [toRepo(result.data)] : []));

      const sorted = sortRepos(repos);
      writeCache(sorted);
      return sorted;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

// Colors from GitHub's linguist, so languages look the way developers expect.
const LANGUAGE_COLORS: Record<string, string> = {
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  Kotlin: "#A97BFF",
  Python: "#3572A5",
  Rust: "#dea584",
  Shell: "#89e051",
  Swift: "#F05138",
  TypeScript: "#3178c6",
};

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "var(--muted)";
}
