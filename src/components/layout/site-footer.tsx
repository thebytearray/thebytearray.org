import NextLink from "next/link";
import { Mail } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { GitHubIcon } from "@/components/icons/brand";
import { Container } from "@/components/layout/container";
import { apps } from "@/content/apps";
import { site } from "@/content/site";

const columns = [
  {
    title: "Apps",
    links: apps.map((app) => ({ label: app.name, href: `/apps/${app.slug}/` })),
  },
  {
    title: "Privacy",
    links: apps.map((app) => ({ label: `${app.name} privacy policy`, href: app.privacyPath })),
  },
  {
    title: "Studio",
    links: [
      { label: "Open source", href: "/open-source/" },
      { label: "Blog", href: "/blog/" },
      { label: "About", href: "/about/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-separator bg-surface">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <NextLink aria-label={`${site.name}, home`} className="rounded-md text-xl" href="/">
              <Logo />
            </NextLink>
            <p className="mt-4 max-w-xs text-sm text-muted">
              {site.name} makes apps and developer tools that get straight to the point. No ads, no
              tracking, no accounts.
            </p>
            <div className="mt-5 flex items-center gap-1">
              <a
                aria-label="The Byte Array on GitHub (opens in a new tab)"
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-default hover:text-foreground"
                href={site.links.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitHubIcon className="size-[18px]" />
              </a>
              <a
                aria-label={`Email ${site.email}`}
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-default hover:text-foreground"
                href={`mailto:${site.email}`}
              >
                <Mail aria-hidden="true" className="size-[18px]" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-sm font-semibold">{column.title}</h2>
                <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <NextLink className="rounded-sm text-muted transition-colors hover:text-foreground" href={link.href}>
                        {link.label}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-separator pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>
            This website is open source under{" "}
            <a
              className="rounded-sm underline decoration-1 underline-offset-2 hover:text-foreground"
              href={`${site.links.github}/website`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {site.license.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
