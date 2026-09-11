"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Modal, ScrollShadow } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Screenshot } from "@/content/apps";

interface ScreenshotGalleryProps {
  appName: string;
  screenshots: readonly Screenshot[];
}

/** A scrollable strip of screenshots; each opens a larger view you can step through. */
export function ScreenshotGallery({ appName, screenshots }: ScreenshotGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const count = screenshots.length;
  const active = openIndex === null ? null : screenshots[openIndex];

  const isOpen = openIndex !== null;

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) => (index === null ? index : (index + delta + count) % count)),
    [count],
  );

  // Arrow keys step through screenshots while the larger view is open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, step]);

  return (
    <>
      <ScrollShadow hideScrollBar className="-mx-4 sm:-mx-6 lg:mx-0" orientation="horizontal">
        <ul className="flex w-max gap-4 px-4 pb-2 sm:px-6 lg:px-0">
          {screenshots.map((shot, index) => (
            <li key={shot.src}>
              <button
                aria-label={`View larger: ${shot.alt}`}
                className="group block cursor-zoom-in rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                type="button"
                onClick={() => setOpenIndex(index)}
              >
                <Image
                  alt={shot.alt}
                  className="h-auto w-44 rounded-[1.4rem] border border-border bg-screenshot-frame transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none sm:w-52"
                  height={2244}
                  loading={index < 3 ? "eager" : "lazy"}
                  sizes="208px"
                  src={shot.src}
                  width={1008}
                />
              </button>
            </li>
          ))}
        </ul>
      </ScrollShadow>

      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenIndex(null);
        }}
      >
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog aria-label={`${appName} screenshots`} className="sm:max-w-xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{active?.alt}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex justify-center">
              {active ? (
                <Image
                  alt={active.alt}
                  className="h-auto max-h-[62dvh] w-auto rounded-2xl border border-border"
                  height={2244}
                  sizes="(max-width: 640px) 80vw, 360px"
                  src={active.src}
                  width={1008}
                />
              ) : null}
            </Modal.Body>
            <Modal.Footer className="flex items-center justify-between">
              <Button isIconOnly aria-label="Previous screenshot" variant="tertiary" onPress={() => step(-1)}>
                <ChevronLeft aria-hidden="true" className="size-5" />
              </Button>
              <p aria-live="polite" className="text-sm text-muted tabular-nums">
                {openIndex === null ? null : `${openIndex + 1} of ${count}`}
              </p>
              <Button isIconOnly aria-label="Next screenshot" variant="tertiary" onPress={() => step(1)}>
                <ChevronRight aria-hidden="true" className="size-5" />
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
