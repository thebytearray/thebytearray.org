# thebytearray.org

Website of The Byte Array, a privacy-focused software studio building developer
tools, libraries and apps. Astro, TypeScript and Tailwind CSS v4, with Material 3
Expressive tokens generated from one seed color.

[thebytearray.org](https://thebytearray.org) · GPL-3.0

## Run

Requires Node 22.12+.

```sh
npm install
npm run dev      # http://localhost:4321, drafts visible
npm run build    # production build in dist/ plus the search index, drafts left out
npm run preview  # serve the build
npm run check    # type-check
```

## Edit

- **Apps:** `src/data/apps.ts`; icons and screenshots in
  `src/assets/apps/<slug>/`. Each app gets a page at `/apps/<slug>/` and a
  social card at `/og/<slug>.png`.
- **Privacy policies:** `src/data/policies.ts`. They are published at
  `/openloader-privacy/` and `/hy2ng-privacy/`; the Google Play listings link to
  those URLs, so keep the paths.
- **Blog post:** add `src/content/blog/my-post.md` (published at
  `/blog/my-post/`). Frontmatter: `title`, `date`, `author`, `description`,
  `tags`, `draft`, optional `cover`, `coverAlt` and `updated`. `author` should
  match a name in `team` in `src/data/site.ts`. Each post gets a generated social
  card at `/og/<post>.png` unless it has a PNG or JPEG cover, a table of contents
  when it has four or more headings, and copy buttons on its code blocks. Posts
  with `draft: true` only appear in `npm run dev`.
- **Name, navigation, team and contact:** `src/data/site.ts`. The email is
  stored base64-encoded and never appears in the HTML; generate one with
  `printf 'you@example.com' | base64`.
- **Open source list:** loaded in the browser from the GitHub API
  (`src/lib/github.ts`, `src/components/RepoList.astro`).
- **Contact form:** `src/components/ContactForm.astro`. There is no server
  behind it; sending opens the visitor's mail app with the message filled in.
- **Search and shortcuts:** `src/components/CommandPalette.astro`, opened with
  Ctrl/⌘ + K, `/` or the header search button. Results come from the Pagefind
  index that `npm run build` writes to `dist/pagefind/`; `npm run dev` has no
  index, so it lists commands only. A page is searchable when its content sits
  inside `data-pagefind-body`.
- **Colors:** `src/styles/seed.json`. `seed` is the default accent; each entry
  in `alternates` adds a color visitors can pick on the home page. After changing
  it run `npm run tokens`, and `npm run assets` if the seed changed (favicon,
  touch icon and web manifest follow the seed only).
- **Icons:** add the Material Symbols name to `src/data/icons.ts`, run
  `npm run icons`, then use `<Icon name="..." />`.

## Deployment

The live site is served by nginx on a VPS from a directory of releases.

```sh
npm run deploy
```

This builds the site, uploads it as a new release, switches the live site to
it, checks that the server is serving it and rolls back if it is not. Pushing
to `main` does the same through `.github/workflows/deploy.yml`. See
[DEPLOYMENT.md](DEPLOYMENT.md) for setup, secrets and rollback.
