// Loads the studio's public repositories from the GitHub API in the browser.
// Used by components/RepoList.astro.
const REPOS_URL = 'https://api.github.com/users/thebytearray/repos?sort=updated&per_page=100';
const CACHE_KEY = 'tba:github-repos:v2';
const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

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

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly kind: 'rate-limit' | 'network' | 'response',
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const stringOrNull = (value: unknown): value is string | null => value === null || typeof value === 'string';

/** One item of the API response as a Repo, or null when it is a fork or malformed. */
function toRepo(item: unknown): Repo | null {
  if (!isRecord(item) || item.fork !== false) return null;
  const { id, name, description, html_url, stargazers_count, forks_count, language, archived, pushed_at } = item;
  if (
    typeof id !== 'number' ||
    typeof name !== 'string' ||
    !stringOrNull(description) ||
    typeof html_url !== 'string' ||
    typeof stargazers_count !== 'number' ||
    typeof forks_count !== 'number' ||
    !stringOrNull(language) ||
    typeof pushed_at !== 'string'
  ) {
    return null;
  }
  return {
    id,
    name,
    description,
    url: html_url,
    stars: stargazers_count,
    forks: forks_count,
    language,
    archived: archived === true,
    pushedAt: pushed_at,
  };
}

function isRepo(value: unknown): value is Repo {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    stringOrNull(value.description) &&
    typeof value.url === 'string' &&
    typeof value.stars === 'number' &&
    typeof value.forks === 'number' &&
    stringOrNull(value.language) &&
    typeof value.archived === 'boolean' &&
    typeof value.pushedAt === 'string'
  );
}

/** Active repositories before archived ones; then most stars first, then most recently pushed. */
export function sortRepos(repos: Repo[]): Repo[] {
  return [...repos].sort(
    (a, b) =>
      Number(a.archived) - Number(b.archived) ||
      b.stars - a.stars ||
      Date.parse(b.pushedAt) - Date.parse(a.pushedAt),
  );
}

function readCache(): Repo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.savedAt !== 'number' || !Array.isArray(parsed.repos)) return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS || !parsed.repos.every(isRepo)) return null;
    return parsed.repos;
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
        headers: { Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      throw new GitHubError("GitHub couldn't be reached. Check your connection and try again.", 'network');
    }

    const rateLimited =
      response.status === 429 || (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0');

    if (rateLimited) {
      throw new GitHubError(
        "GitHub's request limit was reached. Try again in a few minutes, or browse the repositories on GitHub.",
        'rate-limit',
      );
    }

    if (response.status >= 500 && attempt < MAX_RETRIES) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }

    if (!response.ok) {
      throw new GitHubError(`GitHub responded with an error (${response.status}).`, 'response');
    }

    return response.json();
  }
}

let inflight: Promise<Repo[]> | null = null;

/**
 * Public repositories that are not forks. Results are cached for an hour per
 * tab, and concurrent callers share one request.
 */
export function fetchRepos({ force = false }: { force?: boolean } = {}): Promise<Repo[]> {
  if (!force) {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);
  }

  inflight ??= request()
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new GitHubError('GitHub returned data in an unexpected format.', 'response');
      }
      const sorted = sortRepos(data.flatMap((item) => toRepo(item) ?? []));
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
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Dart: '#00B4AB',
  Go: '#00ADD8',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#A97BFF',
  Python: '#3572A5',
  Rust: '#dea584',
  Shell: '#89e051',
  Swift: '#F05138',
  TypeScript: '#3178c6',
};

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? 'var(--color-outline)';
}

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
];

/** "3 months ago", "yesterday", etc. */
export function formatRelative(isoDate: string, now = Date.now()): string {
  const diff = Date.parse(isoDate) - now;

  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return relativeFormatter.format(Math.round(diff / ms), unit);
  }

  return 'just now';
}
