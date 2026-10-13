import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are included in dev only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !(import.meta.env.PROD && data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Tags with post counts, most used first. */
export function getTags(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** URL-safe form of a tag, used for /blog/tags/<slug>/. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');
}

/** Reading time in whole minutes at 200 words per minute. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}
