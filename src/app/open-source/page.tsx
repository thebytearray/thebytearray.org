import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { GitHubIcon } from "@/components/icons/brand";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { RepoExplorer } from "@/components/open-source/repo-explorer";
import { ButtonLink } from "@/components/ui/links";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Open source",
  description: "Libraries, developer tools and apps that The Byte Array publishes on GitHub, including OpenLoader and wireling.",
  path: "/open-source/",
});

export default function OpenSourcePage() {
  return (
    <>
      <PageHeader
        description="Libraries, developer tools and apps we publish on GitHub. Read the code, open an issue, or build on it."
        title="Open source"
      >
        <ButtonLink href={site.links.github} variant="tertiary">
          <GitHubIcon className="size-4" />
          github.com/thebytearray
          <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
        </ButtonLink>
      </PageHeader>
      <Container className="pb-20 md:pb-28">
        <RepoExplorer />
      </Container>
    </>
  );
}
