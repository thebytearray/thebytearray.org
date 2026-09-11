import type { Metadata } from "next";

import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { apps } from "@/content/apps";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Apps",
  description:
    "OpenLoader installs APKs on the Android devices you own. Hy2NG is a Hysteria2 VPN client. No ads, no tracking, no accounts.",
  path: "/apps/",
});

export default function AppsPage() {
  return (
    <>
      <PageHeader
        description="Android apps that do one job well. None of them show ads, track you or ask you to sign up."
        title="Apps"
      />
      <Container className="pb-20 md:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </Container>
    </>
  );
}
