// Guards src/data/downloads.ts against a swapped APK whose metadata was not
// updated: recomputes each file's byte size and SHA-256 from public/ and
// fails if either differs. Run with `npm run downloads:verify`.
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { downloads } from '../src/data/downloads.ts';

let failed = false;

for (const download of downloads) {
  const path = new URL(`../public${download.file}`, import.meta.url);
  let bytes;
  try {
    bytes = readFileSync(path);
  } catch {
    console.error(`downloads: missing file for ${download.appSlug}: public${download.file}`);
    failed = true;
    continue;
  }
  const size = statSync(path).size;
  const sha256 = createHash('sha256').update(bytes).digest('hex');

  if (size !== download.sizeBytes) {
    console.error(
      `downloads: size drift for ${download.appSlug}: ` +
        `data says ${download.sizeBytes}, file is ${size}. ` +
        `Update sizeBytes in src/data/downloads.ts.`,
    );
    failed = true;
  }
  if (sha256 !== download.sha256) {
    console.error(
      `downloads: SHA-256 drift for ${download.appSlug}: ` +
        `data says ${download.sha256}, file is ${sha256}. ` +
        `Update sha256 in src/data/downloads.ts.`,
    );
    failed = true;
  }
  if (!failed) {
    console.log(
      `downloads: ok ${download.appSlug} v${download.versionName} ` +
        `(${(size / 1048576).toFixed(1)} MB, sha256 ${sha256.slice(0, 12)}…)`,
    );
  }
}

if (failed) process.exit(1);
