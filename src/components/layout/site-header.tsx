"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ButtonLink } from "@/components/ui/links";
import { mainNav, site } from "@/content/site";
import { isActivePath } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-separator bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/85">
      <Container className="flex h-16 items-center gap-8">
        <NextLink
          aria-label={`${site.name}, home`}
          className="-mx-1 rounded-md px-1 text-xl"
          href="/"
        >
          <Logo />
        </NextLink>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const isCurrent = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <NextLink
                    aria-current={isCurrent ? "page" : undefined}
                    className="relative rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3 aria-[current=page]:after:-bottom-[17px] aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-brand"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <ButtonLink className="hidden md:inline-flex" href="/contact/" size="sm" variant="secondary">
            Contact
          </ButtonLink>
          <MobileNav pathname={pathname} />
        </div>
      </Container>
    </header>
  );
}
