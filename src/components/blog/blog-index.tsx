import NextLink from "next/link";
import { Mail, Newspaper } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/links";
import { site } from "@/content/site";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export function BlogIndex({ posts }: { posts: PostMeta[] }) {
  return (
    <>
      <PageHeader description="Product updates and notes from the studio." title="Blog" />
      <Container className="pb-20 md:pb-28">
        {posts.length === 0 ? (
          <EmptyState
            action={
              <ButtonLink href={`mailto:${site.email}`} size="sm" variant="tertiary">
                <Mail aria-hidden="true" className="size-4" />
                Email us
              </ButtonLink>
            }
            description="Product updates will appear here. Have a question in the meantime? Email us."
            icon={Newspaper}
            title="No posts yet"
          />
        ) : (
          <ol className="max-w-3xl">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-separator">
                <article className="group relative grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <time className="text-sm text-muted sm:pt-1" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <div>
                    <h2 className="text-h3 font-bold">
                      <NextLink
                        className="rounded-sm decoration-brand decoration-2 underline-offset-4 after:absolute after:inset-0 group-hover:underline"
                        href={`/blog/${post.slug}/`}
                      >
                        {post.title}
                      </NextLink>
                    </h2>
                    {post.excerpt ? <p className="mt-2 text-muted">{post.excerpt}</p> : null}
                    <p className="mt-3 text-sm text-muted">By {post.author}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
