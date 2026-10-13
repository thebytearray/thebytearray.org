import type { APIRoute, GetStaticPaths } from 'astro';
import { apps } from '../../data/apps';
import { site } from '../../data/site';
import { card, type CardOptions } from '../../lib/og';
import { formatDate, getPosts } from '../../lib/posts';

// One social card each for the home page (/og/home.png, the site-wide
// default), every app (/og/<slug>.png) and every post (/og/<post>.png).
export const getStaticPaths: GetStaticPaths = async () => [
  {
    params: { id: 'home' },
    props: { title: site.tagline, subtitle: 'Android apps, libraries and developer tools that do one job well.' },
  },
  ...apps.map((app) => ({
    params: { id: app.slug },
    props: { title: app.name, subtitle: app.tagline, iconFile: app.iconFile },
  })),
  ...(await getPosts()).map((post) => ({
    params: { id: post.id },
    props: { title: post.data.title, subtitle: `${post.data.author} · ${formatDate(post.data.date)}` },
  })),
];

export const GET: APIRoute<CardOptions> = async ({ props }) => {
  const png = await card(props);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
