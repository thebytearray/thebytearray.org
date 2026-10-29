import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  // Drafts never go in the feed, even in dev.
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return rss({
    title: `${site.name}: Blog`,
    description: site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  });
}
