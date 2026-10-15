// Guards src/data/downloads.ts against a swapped APK whose metadata was not
// updated. Local `/downloads/...` files are read from public/; remote
// `https://...` files (thebytearray/downloads repo) are fetched and hashed.
// Run with `npm run downloads:verify`.
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { downloads } from '../src/data/downloads.ts';

let failed = false;

function check(appSlug, versionName, size, sha256, expectedSize, expectedSha, label) {
  if (size !== expectedSize) {
    console.error(
      `downloads: size drift for ${appSlug}: ` +
        `data says ${expectedSize}, ${label} is ${size}. ` +
        `Update sizeBytes in src/data/downloads.ts.`,
    );
    failed = true;
  }
  if (sha256 !== expectedSha) {
    console.error(
      `downloads: SHA-256 drift for ${appSlug}: ` +
        `data says ${expectedSha}, ${label} is ${sha256}. ` +
        `Update sha256 in src/data/downloads.ts.`,
    );
    failed = true;
  }
  if (!failed) {
    console.log(
      `downloads: ok ${appSlug} v${versionName} ` +
        `(${(size / 1048576).toFixed(1)} MB, sha256 ${sha256.slice(0, 12)}…)`,
    );
  }
}

async function verifyRemote(download) {
  const res = await fetch(download.file);
  if (!res.ok) {
    console.error(`downloads: fetch failed for ${download.appSlug}: ${res.status} ${download.file}`);
    failed = true;
    return;
  }
  const hash = createHash('sha256');
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.length;
    hash.update(chunk);
  }
  check(
    download.appSlug,
    download.versionName,
    size,
    hash.digest('hex'),
    download.sizeBytes,
    download.sha256,
    'remote file',
  );
}

function verifyLocal(download) {
  const path = new URL(`../public${download.file}`, import.meta.url);
  let bytes;
  try {
    bytes = readFileSync(path);
  } catch {
    console.error(`downloads: missing file for ${download.appSlug}: public${download.file}`);
    failed = true;
    return;
  }
  const size = statSync(path).size;
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  check(
    download.appSlug,
    download.versionName,
    size,
    sha256,
    download.sizeBytes,
    download.sha256,
    'local file',
  );
}

for (const download of downloads) {
  if (download.file.startsWith('https://')) {
    await verifyRemote(download);
  } else {
    verifyLocal(download);
  }
}

if (failed) process.exit(1);
