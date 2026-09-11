import { ArrowLeft } from "lucide-react";

import { MdxContent } from "@/components/blog/mdx-content";
import { PostByline } from "@/components/blog/post-byline";
import { Container } from "@/components/layout/container";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/links";
import type { PostMeta } from "@/lib/blog";
import { blogPostingLd, breadcrumbLd } from "@/lib/structured-data";

export function BlogPost({ post, body }: { post: PostMeta; body: string }) {
  const path = `/blog/${post.slug}/`;

  return (
    <Container className="pt-8 pb-20 md:pt-12 md:pb-28">
      <JsonLd
        data={[
          blogPostingLd(post),
          breadcrumbLd([
            { name: "Blog", path: "/blog/" },
            { name: post.title, path },
          ]),
        ]}
      />
      <PageBreadcrumbs items={[{ label: "Blog", href: "/blog/" }, { label: post.title }]} />

      <article className="mt-8">
        <header className="max-w-[68ch] border-b border-separator pb-8">
          <h1 className="text-h1 font-bold">{post.title}</h1>
          {post.excerpt ? <p className="mt-4 text-lead text-muted">{post.excerpt}</p> : null}
          <div className="mt-6">
            <PostByline author={post.author} date={post.date} />
          </div>
        </header>

        <div className="prose mt-8">
          <MdxContent source={body} />
        </div>
      </article>

      <div className="mt-14 max-w-[68ch] border-t border-separator pt-8">
        <ButtonLink href="/blog/" variant="tertiary">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All posts
        </ButtonLink>
      </div>
    </Container>
  );
}
