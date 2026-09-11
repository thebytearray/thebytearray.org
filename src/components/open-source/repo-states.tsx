"use client";

import { Alert, Button, Skeleton } from "@heroui/react";
import { ArrowUpRight, RotateCw } from "lucide-react";

import { ButtonLink } from "@/components/ui/links";
import { site } from "@/content/site";

export const repoGridClassName = "grid gap-x-10 md:grid-cols-2 [&>li]:border-t [&>li]:border-separator";

export function RepoListSkeleton({ count }: { count: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading repositories…</span>
      <ul aria-hidden="true" className={repoGridClassName}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className="flex flex-col gap-3 py-5">
            <Skeleton className="h-4 w-2/5 rounded-md" />
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-3/5 rounded-md" />
            <Skeleton className="mt-1 h-3 w-1/3 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RepoError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Repositories couldn’t be loaded</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onPress={onRetry}>
            <RotateCw aria-hidden="true" className="size-4" />
            Try again
          </Button>
          <ButtonLink href={site.links.github} size="sm" variant="tertiary">
            Open GitHub
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </Alert.Content>
    </Alert>
  );
}
