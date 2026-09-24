import type { Metadata } from "next";
import { Card } from "@heroui/react";
import { Bug, Mail } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { EmailTextLink } from "@/components/contact/email-link";
import { TextLink } from "@/components/ui/links";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get help with OpenLoader or Hy2NG, suggest a feature, or talk to The Byte Array about working together.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        description="Get help with one of our apps, suggest a feature, or talk to us about working together. We read every message."
        title="Contact"
      />
      <Container className="pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="flex flex-col gap-8 lg:col-span-4">
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Mail aria-hidden="true" className="size-4 text-foreground" />
                Email
              </h2>
              <p className="mt-2">
                <EmailTextLink />
              </p>
              <div className="mt-3">
                <CopyEmailButton />
              </div>
            </div>
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Bug aria-hidden="true" className="size-4 text-foreground" />
                Found a bug?
              </h2>
              <p className="mt-2 text-muted">
                For open-source projects, an issue on GitHub is the fastest way to get it fixed.
              </p>
              <TextLink showExternalIcon className="mt-2" href={site.links.github}>
                Open GitHub
              </TextLink>
            </div>
          </aside>

          <Card className="p-6 sm:p-8 lg:col-span-8">
            <ContactForm />
          </Card>
        </div>
      </Container>
    </>
  );
}
