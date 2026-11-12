import { llmsFullTxt } from '../lib/llms';
import { getPosts } from '../lib/posts';

export async function GET() {
  const posts = (await getPosts()).filter((post) => !post.data.draft);
  return new Response(llmsFullTxt(posts), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
