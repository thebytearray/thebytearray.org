import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { AppIcon } from "@/components/apps/app-icon";
import { FeatureList } from "@/components/apps/feature-list";
import { ScreenshotGallery } from "@/components/apps/screenshot-gallery";
import { GitHubIcon, GooglePlayIcon } from "@/components/icons/brand";
import { Container } from "@/components/layout/container";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { Section } from "@/components/layout/section";
import { EmailTextLink } from "@/components/contact/email-link";
import { ButtonLink } from "@/components/ui/links";
import { apps, getApp } from "@/content/apps";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";
import { appLd, breadcrumbLd } from "@/lib/structured-data";

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const app = getApp((await params).slug);
  if (!app) return {};

  return pageMetadata({
    title: `${app.name}: ${app.tagline}`,
    description: app.summary,
    path: `/apps/${app.slug}/`,
    image: { url: `/og/${app.slug}.png`, alt: `${app.name}: ${app.tagline}` },
  });
}

export default async function AppPage({ params }: AppPageProps) {
  const app = getApp((await params).slug);
  if (!app) notFound();

  const details: { term: string; description: React.ReactNode }[] = [
    { term: "Platform", description: app.requirements },
    {
      term: "Package name",
      description: <code className="font-mono text-sm break-all">{app.packageId}</code>,
    },
    ...(app.license ? [{ term: "License", description: app.license }] : []),
  ];

  return (
    <>
      <JsonLd
        data={[
          appLd(app),
          breadcrumbLd([
            { name: "Apps", path: "/apps/" },
            { name: app.name, path: `/apps/${app.slug}/` },
          ]),
        ]}
      />
      <Container className="pt-8 pb-14 md:pt-12 md:pb-20">
        <PageBreadcrumbs items={[{ label: "Apps", href: "/apps/" }, { label: app.name }]} />

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <AppIcon app={app} size="lg" />
          <div>
            <h1 className="text-h1 font-bold">{app.name}</h1>
            <p className="mt-1 text-lead text-muted">{app.tagline}</p>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-lead">{app.description}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={app.playStoreUrl} size="lg">
            <GooglePlayIcon className="size-4" />
            Get it on Google Play
          </ButtonLink>
          {app.sourceUrl ? (
            <ButtonLink href={app.sourceUrl} size="lg" variant="tertiary">
              <GitHubIcon className="size-4" />
              Source code
              <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
            </ButtonLink>
          ) : null}
          <ButtonLink href={app.privacyPath} size="lg" variant="ghost">
            <ShieldCheck aria-hidden="true" className="size-4" />
            Privacy policy
          </ButtonLink>
        </div>
      </Container>

      <Section id="screenshots" title="Screenshots">
        <ScreenshotGallery appName={app.name} screenshots={app.screenshots} />
      </Section>

      <Section id="features" title="What it does">
        <FeatureList features={app.features} />
      </Section>

      <Section id="details" title="Details">
        <dl className="grid max-w-3xl gap-x-10 sm:grid-cols-[10rem_1fr]">
          {details.map(({ term, description }) => (
            <div key={term} className="contents">
              <dt className="border-t border-separator pt-4 text-sm text-muted sm:pb-4">{term}</dt>
              <dd className="pb-4 sm:border-t sm:border-separator sm:pt-4">{description}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-muted">
          Questions or feedback about {app.name}? Email{" "}
          <EmailTextLink />.
        </p>
      </Section>
    </>
  );
}
