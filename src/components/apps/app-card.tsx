import Image from "next/image";
import NextLink from "next/link";
import { Card } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";

import { AppIcon } from "@/components/apps/app-icon";
import { GooglePlayIcon } from "@/components/icons/brand";
import { ButtonLink } from "@/components/ui/links";
import type { App } from "@/content/apps";

/** One app, summarised: icon, what it does, two actions, and a glimpse of the UI. */
export function AppCard({ app }: { app: App }) {
  const detailsHref = `/apps/${app.slug}/`;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <AppIcon decorative app={app} />
          <div className="min-w-0">
            <Card.Title className="text-h3 font-bold">
              <NextLink className="rounded-sm hover:underline hover:decoration-2 hover:underline-offset-4" href={detailsHref}>
                {app.name}
              </NextLink>
            </Card.Title>
            <p className="text-sm text-muted">{app.tagline}</p>
          </div>
        </div>
        <Card.Description className="text-base text-foreground/85">{app.summary}</Card.Description>
        <div className="mt-auto flex flex-wrap gap-2">
          <ButtonLink aria-label={`${app.name} details`} href={detailsHref} variant="secondary">
            Details
          </ButtonLink>
          <ButtonLink
            aria-label={`Get ${app.name} on Google Play`}
            href={app.playStoreUrl}
            variant="ghost"
          >
            <GooglePlayIcon className="size-4" />
            Google Play
            <ArrowUpRight aria-hidden="true" className="size-4 text-muted" />
          </ButtonLink>
        </div>
      </div>

      {/* A glimpse of the app; full, described screenshots are on the details page. */}
      <div aria-hidden="true" className="flex h-52 justify-center gap-3 overflow-hidden bg-screenshot-frame px-6 pt-7 sm:h-60 sm:gap-4">
        {app.screenshots.slice(0, 3).map((shot, index) => (
          <Image
            key={shot.src}
            alt=""
            className={`h-auto w-[30%] max-w-36 self-start rounded-t-2xl border border-b-0 border-border object-cover object-top shadow-surface ${index === 1 ? "-mt-3" : "mt-2"}`}
            height={2244}
            sizes="144px"
            src={shot.src}
            width={1008}
          />
        ))}
      </div>
    </Card>
  );
}
