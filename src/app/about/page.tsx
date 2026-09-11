import type { Metadata } from "next";
import { Avatar } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons/brand";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { ButtonLink, TextLink } from "@/components/ui/links";
import { apps } from "@/content/apps";
import { site, team, workAreas } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "The Byte Array makes software that solves real problems without trading away your privacy: Android apps, libraries and developer tools.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        description="We make software that solves real problems without trading away your privacy. Much of our work is open source, so you can see how it works."
        title="About The Byte Array"
      />

      <Section id="what-we-build" title="What we build">
        <dl className="grid gap-x-10 md:grid-cols-3">
          {workAreas.map((area) => (
            <div key={area.title} className="border-t border-separator py-6">
              <dt className="text-lead font-semibold">{area.title}</dt>
              <dd className="mt-2 text-muted">{area.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="data" title="How we handle data">
        <div className="max-w-2xl space-y-4 text-lead text-muted">
          <p>
            Our apps work on your device. They don’t include analytics, ads or tracking, and none of
            them ask you to create an account. When an app needs the network, it only talks to
            devices or servers you choose.
          </p>
          <p>
            We share code when it helps the community, and we keep our policies short and plain
            about the rest. Read the full policies for{" "}
            {apps.map((app, index) => (
              <span key={app.slug}>
                {index > 0 ? " and " : null}
                <TextLink href={app.privacyPath}>{app.name}</TextLink>
              </span>
            ))}
            .
          </p>
        </div>
      </Section>

      <Section id="team" title="Who we are">
        <ul className="grid max-w-3xl gap-4 sm:grid-cols-2">
          {team.map((member) => (
            <li key={member.name} className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5">
              <Avatar size="lg">
                <Avatar.Image alt="" src={member.avatar} />
                <Avatar.Fallback>{member.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted">{member.role}</p>
                <p className="mt-2 text-sm">{member.bio}</p>
                <TextLink showExternalIcon className="mt-3 text-sm" href={member.github}>
                  GitHub profile
                </TextLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="license" title="Open source">
        <p className="max-w-2xl text-lead text-muted">
          OpenLoader and this website are open source under {site.license.name}. Our libraries and
          tools are on GitHub too, each with its own license.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/open-source/">Browse repositories</ButtonLink>
          <ButtonLink href={site.links.github} variant="tertiary">
            <GitHubIcon className="size-4" />
            GitHub
            <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
