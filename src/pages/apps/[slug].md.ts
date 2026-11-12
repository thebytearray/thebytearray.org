import type { APIContext } from 'astro';
import { apps, type App } from '../../data/apps';
import { appMarkdown } from '../../lib/llms';

export function getStaticPaths() {
  return apps.map((app) => ({ params: { slug: app.slug }, props: { app } }));
}

export function GET({ props }: APIContext<{ app: App }>) {
  return new Response(appMarkdown(props.app), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
