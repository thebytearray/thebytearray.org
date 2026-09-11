const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** "2026-04-14" → "April 14, 2026" (UTC, so build and browser agree). */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "3 months ago", "yesterday", etc. Call only in the browser to avoid hydration drift. */
export function formatRelative(isoDate: string, now = Date.now()): string {
  const diff = Date.parse(isoDate) - now;

  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return relativeFormatter.format(Math.round(diff / ms), unit);
  }

  return "just now";
}
