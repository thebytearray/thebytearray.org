import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogIndex } from "@/components/blog/blog-index";
import { BlogPost } from "@/components/blog/blog-post";
import { getAllPosts, getPost } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

// One optional catch-all serves both /blog/ (no slug) and /blog/<post>/.
// A separate [slug] route would fail the static export whenever there are no posts yet.
interface BlogPageProps {
  params: Promise<{ slug?: string[] }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return [{ slug: [] }, ...posts.map((post) => ({ slug: [post.slug] }))];
}

async function resolvePost(params: BlogPageProps["params"]) {
  const { slug } = await params;
  if (!slug?.length) return null;
  const post = slug.length === 1 ? await getPost(slug[0]) : undefined;
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await resolvePost(params);

  if (!post) {
    return pageMetadata({
      title: "Blog",
      description: "Product updates and notes from The Byte Array.",
      path: "/blog/",
    });
  }

  return {
    ...pageMetadata({
      title: post.title,
      description: post.excerpt ?? `${post.title}, from The Byte Array blog.`,
      path: `/blog/${post.slug}/`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    }),
    authors: [{ name: post.author }],
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const post = await resolvePost(params);

  if (!post) return <BlogIndex posts={await getAllPosts()} />;

  const { body, ...meta } = post;
  return <BlogPost body={body} post={meta} />;
}
