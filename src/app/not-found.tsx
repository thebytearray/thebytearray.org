import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/links";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start py-24 md:py-36">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-h1 font-bold">This page doesn’t exist</h1>
      <p className="mt-4 max-w-lg text-lead text-muted">
        The link may be broken, or the page may have moved. Check the address, or go to one of these
        instead.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/apps/" variant="tertiary">
          See our apps
        </ButtonLink>
      </div>
    </Container>
  );
}
