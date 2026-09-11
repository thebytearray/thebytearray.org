"use client";

import NextLink from "next/link";
import { Button, Drawer, Separator, useOverlayState } from "@heroui/react";
import { Mail, Menu } from "lucide-react";

import { GitHubIcon } from "@/components/icons/brand";
import { mainNav, site } from "@/content/site";
import { isActivePath } from "@/lib/nav";

const drawerLinks = [...mainNav, { label: "Contact", href: "/contact/" }];

export function MobileNav({ pathname }: { pathname: string }) {
  const state = useOverlayState();

  return (
    <div className="md:hidden">
      <Drawer state={state}>
        <Button isIconOnly aria-label="Open menu" size="sm" variant="ghost">
          <Menu aria-hidden="true" className="size-5" />
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="right">
            <Drawer.Dialog aria-label="Menu">
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Menu</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <nav aria-label="Main">
                  <ul className="flex flex-col">
                    {drawerLinks.map((item) => {
                      const isCurrent = isActivePath(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <NextLink
                            aria-current={isCurrent ? "page" : undefined}
                            className="flex items-center justify-between rounded-lg px-3 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-default aria-[current=page]:text-accent"
                            href={item.href}
                            onClick={state.close}
                          >
                            {item.label}
                            {isCurrent ? <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" /> : null}
                          </NextLink>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <Separator className="my-4" />
                <ul className="flex flex-col gap-1 text-sm">
                  <li>
                    <a
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-default hover:text-foreground"
                      href={site.links.github}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <GitHubIcon className="size-4" />
                      GitHub
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-default hover:text-foreground"
                      href={`mailto:${site.email}`}
                    >
                      <Mail aria-hidden="true" className="size-4" />
                      {site.email}
                    </a>
                  </li>
                </ul>
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  );
}
