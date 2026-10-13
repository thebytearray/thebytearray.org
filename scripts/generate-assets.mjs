// Generates public/favicon.svg, public/apple-touch-icon.png and
// public/manifest.webmanifest from the current color tokens. Run with
// `npm run assets` after changing the seed color; the outputs are committed.
// (Social cards are drawn at build time by src/pages/og/[id].png.ts.)
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { logo } from '../src/lib/logo.ts';

const tokens = readFileSync(new URL('../src/styles/tokens.generated.css', import.meta.url), 'utf8');
const [light] = tokens.split(":root[data-theme='dark']");
const color = (block, role) => block.match(new RegExp(`--md-sys-color-${role}: (#[0-9a-f]{6})`))[1];

const publicDir = new URL('../public/', import.meta.url);

const mark = `<path class="s" d="${logo.shape}"/><path class="b" d="${logo.brackets}"/>`;

// Black mark on light browser chrome, white mark on dark.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logo.viewBox}"><style>.s{fill:${logo.black}}.b{fill:${logo.white}}@media(prefers-color-scheme:dark){.s{fill:${logo.white}}.b{fill:${logo.black}}}</style>${mark}</svg>\n`;
writeFileSync(new URL('favicon.svg', publicDir), favicon);

// The "Logo · Solid Black" board as it is: the mark centered on white.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 800 800">
  <style>.s{fill:${logo.black}}.b{fill:${logo.white}}</style>
  <rect width="800" height="800" fill="${logo.white}"/>${mark}
</svg>`;
await sharp(Buffer.from(touch)).png().toFile(new URL('apple-touch-icon.png', publicDir).pathname);

const manifest = {
  name: 'The Byte Array',
  short_name: '[]byte',
  description:
    'The Byte Array makes mobile apps, libraries and developer tools that do one job well. Our apps have no ads, no tracking and no accounts.',
  start_url: '/',
  display: 'browser',
  background_color: color(light, 'surface'),
  theme_color: color(light, 'surface'),
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
};
writeFileSync(new URL('manifest.webmanifest', publicDir), `${JSON.stringify(manifest, null, 2)}\n`);

console.log('assets: wrote public/favicon.svg, public/apple-touch-icon.png and public/manifest.webmanifest');
