// Downloads a Material Symbols Rounded font containing only the icons listed
// in src/data/icons.ts and saves it to src/assets/fonts/, so the site serves its
// own icons instead of calling Google Fonts. Run with `npm run icons` after
// adding or removing an icon name; the output is committed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { icons } from '../src/data/icons.ts';

const names = [...icons].sort().join(',');
const cssUrl =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0' +
  `&icon_names=${names}&display=block`;

// A browser user agent makes Google Fonts answer with woff2.
const headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
};

const css = await (await fetch(cssUrl, { headers })).text();
const fontUrl = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1];
if (!fontUrl) throw new Error(`icons: no woff2 URL in the Google Fonts response:\n${css.slice(0, 300)}`);

const font = Buffer.from(await (await fetch(fontUrl, { headers })).arrayBuffer());
const dir = new URL('../src/assets/fonts/', import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL('material-symbols-rounded.woff2', dir), font);
console.log(`icons: wrote ${icons.length} icons (${(font.length / 1024).toFixed(1)} KB)`);
