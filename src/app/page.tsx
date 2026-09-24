import NextLink from "next/link";
import { Mail } from "lucide-react";

import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RepoPreview } from "@/components/open-source/repo-preview";
import { EmailButton } from "@/components/contact/email-link";
import { ButtonLink, TextLink } from "@/components/ui/links";
import { apps } from "@/content/apps";
import { site } from "@/content/site";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const [latestPost] = await getAllPosts();

  return (
    <>
      <Container className="pt-14 pb-16 md:pt-24 md:pb-24">
        <h1 className="max-w-[16ch] text-display font-extrabold">{site.tagline}</h1>
        <p className="mt-6 max-w-xl text-lead text-muted">
          {site.name} makes Android apps, libraries and developer tools that do one job well. Our
          apps have no ads, no tracking and no accounts.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/apps/" size="lg">
            See our apps
          </ButtonLink>
          <ButtonLink href="/open-source/" size="lg" variant="tertiary">
            Browse open source
          </ButtonLink>
        </div>
      </Container>

      <Section description="Built for Android and available on Google Play." id="apps" title="Apps">
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </Section>

      <Section
        action={
          <ButtonLink href="/open-source/" size="sm" variant="tertiary">
            All repositories
          </ButtonLink>
        }
        description="Libraries, tools and apps we publish on GitHub."
        id="open-source"
        title="Open source"
      >
        <RepoPreview limit={4} />
      </Section>

      <Container>
        <div className="grid gap-12 border-t border-separator pt-10 pb-20 md:grid-cols-2 md:gap-16 md:pt-14 md:pb-28">
          <section aria-labelledby="latest-post-heading">
            <h2 className="text-h3 font-bold" id="latest-post-heading">
              From the blog
            </h2>
            {latestPost ? (
              <article className="mt-5">
                <p className="text-sm text-muted">
                  <time dateTime={latestPost.date}>{formatDate(latestPost.date)}</time>
                </p>
                <h3 className="mt-1 text-lead font-semibold">
                  <NextLink className="rounded-sm hover:underline hover:underline-offset-4" href={`/blog/${latestPost.slug}/`}>
                    {latestPost.title}
                  </NextLink>
                </h3>
                {latestPost.excerpt ? <p className="mt-1 text-muted">{latestPost.excerpt}</p> : null}
              </article>
            ) : (
              <p className="mt-5 text-muted">No posts yet. Updates will appear here.</p>
            )}
            <TextLink className="mt-5" href="/blog/">
              All posts
            </TextLink>
          </section>

          <section aria-labelledby="contact-heading">
            <h2 className="text-h3 font-bold" id="contact-heading">
              Questions or ideas?
            </h2>
            <p className="mt-5 max-w-md text-muted">
              Get help with one of our apps, suggest a feature, or talk to us about working together.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact/">Contact us</ButtonLink>
              <EmailButton variant="ghost">
                <Mail aria-hidden="true" className="size-4" />
                {site.emailDisplay}
              </EmailButton>
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
