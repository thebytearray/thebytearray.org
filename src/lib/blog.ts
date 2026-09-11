import "server-only";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parse } from "yaml";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  author: z.string().min(1),
  excerpt: z.string().optional(),
});

export type PostMeta = z.infer<typeof frontmatterSchema> & { slug: string };

interface Post extends PostMeta {
  /** The MDX body, without frontmatter. */
  body: string;
}

async function readPost(fileName: string): Promise<Post> {
  const source = await readFile(path.join(BLOG_DIR, fileName), "utf8");
  const match = FRONTMATTER.exec(source);
  const result = frontmatterSchema.safeParse(match ? parse(match[1]) : {});

  if (!result.success) {
    throw new Error(`Invalid frontmatter in content/blog/${fileName}: ${z.prettifyError(result.error)}`);
  }

  return {
    ...result.data,
    slug: fileName.replace(/\.mdx$/, ""),
    body: match ? source.slice(match[0].length) : source,
  };
}

const getPosts = cache(async (): Promise<Post[]> => {
  const entries = await readdir(BLOG_DIR).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const posts = await Promise.all(entries.filter((file) => file.endsWith(".mdx")).map(readPost));

  return posts.sort((a, b) => b.date.localeCompare(a.date));
});

/** All posts, newest first. Reads content/blog at build time. */
export async function getAllPosts(): Promise<PostMeta[]> {
  return (await getPosts()).map(({ slug, title, date, author, excerpt }) => ({
    slug,
    title,
    date,
    author,
    excerpt,
  }));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}
