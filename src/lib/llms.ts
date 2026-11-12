// Plain-Markdown versions of the site for AI assistants and other readers that
// work better with text than with HTML: /llms.txt, /llms-full.txt and the
// .md copy of every app page and blog post. Everything is built from the same
// data the HTML pages use, so the two never drift apart.
import { apps, type App } from '../data/apps';
import { getDownload } from '../data/downloads';
import { site, team } from '../data/site';
import type { Post } from './posts';

const url = (path: string) => new URL(path, import.meta.env.SITE).href;

/** Pages that are not apps or posts, in the order a reader is likely to need them. */
export const pages = [
  { title: 'Apps', path: '/apps/', description: 'Every app The Byte Array makes, with what each one does and where to get it.' },
  { title: 'Downloads', path: '/downloads/', description: 'Direct APK downloads with version, file size and SHA-256 checksum.' },
  { title: 'Open source', path: '/open-source/', description: 'Libraries, developer tools and apps published on GitHub.' },
  { title: 'Blog', path: '/blog/', description: 'Product updates: releases, discontinued apps and privacy changes.' },
  { title: 'About', path: '/about/', description: 'Who runs The Byte Array, what it makes and how it works.' },
  { title: 'Contact', path: '/contact/', description: 'Support for the apps, feature requests and business enquiries.' },
];

export const legalPages = [
  { title: 'Terms', path: '/terms/', description: 'Terms for the website and the apps.' },
  { title: 'Refund policy', path: '/refund-policy/', description: 'When you can get a refund for a paid app.' },
  { title: 'Site privacy', path: '/privacy/', description: 'How thebytearray.org handles data: no cookies, no analytics.' },
];

/** Markdown link to the app page, its .md copy, and its status. */
function appStatus(app: App): string {
  if (app.discontinued) return 'Discontinued, no longer available to install.';
  if (app.paid && app.price) return `Paid, one-time purchase of ${app.price.amount} ${app.price.currency} on Google Play.`;
  return 'Free on Google Play, no ads.';
}

export function appMarkdown(app: App): string {
  const download = getDownload(app.slug);
  const facts = [
    `- Status: ${appStatus(app)}`,
    `- Platform: ${app.requirements}`,
    `- Package name: \`${app.packageId}\``,
    !app.discontinued && `- Google Play: ${app.playStoreUrl}`,
    download && `- Direct download: ${url(download.file)} (version ${download.versionName})`,
    app.sourceUrl && `- Source code: ${app.sourceUrl}`,
    app.sourcePost && `- Why the source is not public: ${url(app.sourcePost)}`,
    app.license && `- License: ${app.license}`,
    app.signingSha256 && `- Signing certificate (SHA-256): \`${app.signingSha256}\``,
    app.privacyPath && `- Privacy policy: ${url(app.privacyPath)}`,
    app.termsPath && `- Terms: ${url(app.termsPath)}`,
  ].filter(Boolean);

  return [
    `# ${app.name}`,
    '',
    `> ${app.tagline}`,
    '',
    app.description,
    '',
    '## Facts',
    '',
    ...facts,
    '',
    '## What it does',
    '',
    ...app.features.map((feature) => `- **${feature.title}**: ${feature.description}`),
    '',
    `Web page: ${url(`/apps/${app.slug}/`)}`,
    '',
  ].join('\n');
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** A post's Markdown with site-relative links made absolute, so they still work outside the site. */
const postBody = (post: Post) => (post.body ?? '').trim().replace(/\]\(\//g, `](${url('/')}`);

/** A post's own Markdown with its title, dates and author on top. */
export function postMarkdown(post: Post): string {
  const { title, description, date, updated, author, tags } = post.data;
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `author: ${JSON.stringify(author)}`,
    `published: ${isoDate(date)}`,
    updated && `updated: ${isoDate(updated)}`,
    tags.length > 0 && `tags: ${JSON.stringify(tags)}`,
    `url: ${url(`/blog/${post.id}/`)}`,
    '---',
  ].filter(Boolean);
  return [...frontmatter, '', `# ${title}`, '', postBody(post), ''].join('\n');
}

const entry = (title: string, path: string, description: string) => `- [${title}](${url(path)}): ${description}`;

function header(): string[] {
  const founder = team[0];
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is run by ${site.company.name}, a company registered in ${site.company.jurisdiction} (company number ${site.company.number}).`,
    ...(founder ? [`It was founded by ${founder.name} (${founder.github}).`] : []),
    '',
    `Every app page and blog post also has a Markdown copy at the same address with \`.md\` in place of the trailing slash, for example ${url('/apps/convertit.md')}.`,
    '',
  ];
}

function keyFacts(): string[] {
  const live = apps.filter((app) => !app.discontinued).map((app) => app.name);
  const ended = apps.filter((app) => app.discontinued).map((app) => app.name);
  return [
    '## Key facts',
    '',
    `- Makes: ${site.tagline}.`,
    `- Current apps: ${live.join(', ')}.`,
    ...(ended.length > 0 ? [`- Discontinued apps: ${ended.join(', ')}.`] : []),
    '- The apps have no ads, no tracking and need no account.',
    `- Registered office: ${site.company.office}.`,
    `- GitHub: ${site.github}`,
    `- YouTube: ${site.youtube}`,
    `- Contact form: ${url('/contact/')}`,
    '',
  ];
}

/** The short index at /llms.txt. */
export function llmsTxt(posts: Post[]): string {
  const live = apps.filter((app) => !app.discontinued);
  const ended = apps.filter((app) => app.discontinued);
  return [
    ...header(),
    ...keyFacts(),
    '## Apps',
    '',
    ...live.map((app) => entry(app.name, `/apps/${app.slug}.md`, `${app.summary} ${appStatus(app)}`)),
    '',
    '## Site',
    '',
    ...pages.map((page) => entry(page.title, page.path, page.description)),
    '',
    '## Blog',
    '',
    ...posts.map((post) => entry(post.data.title, `/blog/${post.id}.md`, post.data.description)),
    '',
    '## Optional',
    '',
    ...ended.map((app) => entry(app.name, `/apps/${app.slug}.md`, `${app.summary} ${appStatus(app)}`)),
    ...legalPages.map((page) => entry(page.title, page.path, page.description)),
    entry('Full text', '/llms-full.txt', 'Every app page and blog post in one Markdown file.'),
    entry('RSS feed', '/rss.xml', 'New blog posts.'),
    '',
  ].join('\n');
}

/** Everything in one file at /llms-full.txt. */
export function llmsFullTxt(posts: Post[]): string {
  // Each app and post starts with an H1; push them under this file's H2 sections.
  const nest = (markdown: string) => markdown.replace(/^(#+) /gm, '##$1 ');
  const post = (item: Post) =>
    nest(
      [
        `# ${item.data.title}`,
        '',
        `Published ${isoDate(item.data.date)} by ${item.data.author}: ${url(`/blog/${item.id}/`)}`,
        '',
        postBody(item),
        '',
      ].join('\n'),
    );
  return [
    ...header(),
    ...keyFacts(),
    '## Apps',
    '',
    ...apps.map((app) => nest(appMarkdown(app))),
    '## Blog posts',
    '',
    ...posts.map(post),
  ].join('\n');
}
