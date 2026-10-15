// Direct APK downloads served from this site. Files live in
// public/downloads/<slug>/ and are copied verbatim into dist/ by the build.
// Adding a future app is one entry here plus one APK file.
// Run `npm run downloads:verify` after swapping an APK: it recomputes the
// size and SHA-256 and fails if this file has drifted.
import type { AppSlug } from './apps';

export interface DownloadRelease {
  appSlug: AppSlug;
  versionName: string;
  versionCode: number;
  /** Public URL of the APK, e.g. `/downloads/convertit/convertit-1.3.18-lts.apk`. */
  file: `/downloads/${string}.apk`;
  /** Exact byte size of the APK; checked by scripts/verify-downloads.mjs. */
  sizeBytes: number;
  /** Lowercase hex SHA-256 of the APK; checked by scripts/verify-downloads.mjs. */
  sha256: string;
  /** Human-readable minimum Android version, e.g. `Android 8.0+`. */
  minAndroid: string;
  /** Release date, ISO `YYYY-MM-DD`. */
  updated: string;
}

export const downloads: DownloadRelease[] = [
  {
    appSlug: 'convertit',
    versionName: '1.3.18-lts',
    versionCode: 52,
    file: '/downloads/convertit/convertit-1.3.18-lts.apk',
    sizeBytes: 86358358,
    sha256: '39952626a403ef8911ba85cfb1264d49877c47171eab2fdb08effd41f9b288c8',
    minAndroid: 'Android.',
    updated: '2026-10-15',
  },
];

export function getDownload(slug: string): DownloadRelease | undefined {
  return downloads.find((download) => download.appSlug === slug);
}

/** `12.4 MB`-style formatting for the byte size. */
export function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 10 ? `${Math.round(mb)} MB` : `${(Math.round(mb * 10) / 10).toFixed(1)} MB`;
}
