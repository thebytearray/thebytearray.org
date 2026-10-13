// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://thebytearray.org';

/**
 * Post-processes Markdown output: task-list checkboxes are named after their
 * list item, scrollable code blocks are announced as a labelled region, and
 * links to other sites open in a new tab.
 * @type {import('satteri').HastPluginDefinition}
 */
const markdownTweaks = {
  name: 'markdown-tweaks',
  element: [
    {
      filter: ['a'],
      visit(node, ctx) {
        const href = String(node.properties?.href ?? '');
        if (!/^https?:\/\//.test(href) || href.startsWith(SITE)) return;
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener');
      },
    },
    {
      filter: ['input'],
      visit(node, ctx) {
        if (node.properties?.type !== 'checkbox') return;
        const item = ctx.parent(node);
        if (item) ctx.setProperty(node, 'aria-label', ctx.textContent(item).trim());
      },
    },
    {
      filter: ['pre'],
      visit(node, ctx) {
        const language = node.properties?.dataLanguage ?? node.properties?.['data-language'];
        ctx.setProperty(node, 'role', 'region');
        ctx.setProperty(node, 'aria-label', language ? `Code: ${language}` : 'Code');
      },
    },
  ],
};

// Last-modified dates for the sitemap, read from each post's frontmatter
// (`updated`, falling back to `date`).
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const postDates = new Map(
  readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .flatMap((file) => {
      const frontmatter = readFileSync(new URL(file, BLOG_DIR), 'utf8').split(/^---$/m)[1] ?? '';
      const field = (/** @type {string} */ name) => frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1];
      const date = new Date(field('updated') ?? field('date') ?? '');
      return Number.isNaN(date.valueOf()) ? [] : [[`${SITE}/blog/${file.replace(/\.md$/, '')}/`, date]];
    }),
);

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/blog/tags/'),
      serialize: (item) => ({ ...item, lastmod: postDates.get(item.url)?.toISOString() }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    processor: satteri({ hastPlugins: [markdownTweaks] }),
    shikiConfig: {
      // Colors come from the --astro-code-* variables in src/styles/global.css
      theme: 'css-variables',
    },
  },
});
