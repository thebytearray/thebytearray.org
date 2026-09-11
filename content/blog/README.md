# Blog posts

Each `.mdx` file in this folder becomes a post at `/blog/<file-name>/`.

Start every post with frontmatter:

```mdx
---
title: "Post title"
date: "2026-09-11"
author: Tamim
excerpt: "One sentence shown in lists and search results."
---

Write the post in Markdown. Tables, lists and links are supported.
```

`date` must be `YYYY-MM-DD`. `author` should match a name in `src/content/site.ts` to show their photo.
Run `npm run build`: an invalid frontmatter field fails the build with a message saying which one.
