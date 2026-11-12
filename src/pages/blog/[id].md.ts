import type { APIContext } from 'astro';
import { postMarkdown } from '../../lib/llms';
import { getPosts, type Post } from '../../lib/posts';

export async function getStaticPaths() {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}

export function GET({ props }: APIContext<{ post: Post }>) {
  return new Response(postMarkdown(props.post), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
