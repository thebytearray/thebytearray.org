// Generates public/favicon.svg, public/apple-touch-icon.png and
// public/manifest.webmanifest from the current color tokens. Run with
// `npm run assets` after changing the seed color; the outputs are committed.
// (Social cards are drawn at build time by src/pages/og/[id].png.ts.)
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { scallop } from '../src/lib/shape.ts';

const tokens = readFileSync(new URL('../src/styles/tokens.generated.css', import.meta.url), 'utf8');
const [light, dark] = tokens.split(":root[data-theme='dark']");
const color = (block, role) => block.match(new RegExp(`--md-sys-color-${role}: (#[0-9a-f]{6})`))[1];

const publicDir = new URL('../public/', import.meta.url);

// The "[]" of the []byte wordmark, drawn in a 32x32 box and centered on the shape.
const brackets = 'M8 8h6v3h-3v10h3v3H8zM24 8h-6v3h3v10h-3v3h6z';
const mark = `<path class="s" d="${scallop(8, 0.12)}"/><path class="b" transform="translate(50 50) scale(2.3) translate(-16 -16)" d="${brackets}"/>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><style>.s{fill:${color(light, 'primary')}}.b{fill:${color(light, 'on-primary')}}@media(prefers-color-scheme:dark){.s{fill:${color(dark, 'primary')}}.b{fill:${color(dark, 'on-primary')}}}</style>${mark}</svg>\n`;
writeFileSync(new URL('favicon.svg', publicDir), favicon);

// iOS rounds the corners itself, so the touch icon fills its square.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 100 100">
  <style>.s{fill:${color(light, 'primary')}}.b{fill:${color(light, 'on-primary')}}</style>
  <rect width="100" height="100" fill="${color(light, 'primary-container')}"/>
  <g transform="translate(50 50) scale(0.8) translate(-50 -50)">${mark}</g>
</svg>`;
await sharp(Buffer.from(touch)).png().toFile(new URL('apple-touch-icon.png', publicDir).pathname);

const manifest = {
  name: 'The Byte Array',
  short_name: '[]byte',
  description:
    'The Byte Array makes Android apps, libraries and developer tools that do one job well. Our apps have no ads, no tracking and no accounts.',
  start_url: '/',
  display: 'browser',
  background_color: color(light, 'surface'),
  theme_color: color(light, 'primary'),
  icons: [
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
};
writeFileSync(new URL('manifest.webmanifest', publicDir), `${JSON.stringify(manifest, null, 2)}\n`);

console.log('assets: wrote public/favicon.svg, public/apple-touch-icon.png and public/manifest.webmanifest');
