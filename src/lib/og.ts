// Social cards (Open Graph images), drawn in the site's own colors and display
// typeface. Used by src/pages/og/[id].png.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { logo } from './logo';
import { scallop } from './shape';

const root = process.cwd();
const tokens = readFileSync(join(root, 'src/styles/tokens.generated.css'), 'utf8').split(":root[data-theme='dark']")[0];
const color = (role: string) => tokens.match(new RegExp(`--md-sys-color-${role}: (#[0-9a-f]{6})`))![1];

// Satori reads static woff files, not the variable woff2 the site itself uses.
const font = (weight: 600 | 800) => ({
  name: 'Bricolage Grotesque',
  weight,
  style: 'normal' as const,
  data: readFileSync(
    join(root, `node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-${weight}-normal.woff`),
  ),
});
const fonts = [font(600), font(800)];

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props = {}): Node => ({
  type,
  props: { style, children, ...props },
});
const shape = (d: string, fill: string, style: Record<string, unknown>) =>
  el('svg', style, el('path', {}, undefined, { d, fill }), { viewBox: '0 0 100 100' });

export interface CardOptions {
  title: string;
  subtitle?: string;
  /** Path from the project root to a square PNG (an app icon) shown beside the title. */
  iconFile?: string;
}

export async function card({ title, subtitle, iconFile }: CardOptions): Promise<Buffer> {
  const icon = iconFile && `data:image/png;base64,${readFileSync(join(root, iconFile)).toString('base64')}`;

  const tree = el(
    'div',
    {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      width: 1200,
      height: 630,
      padding: '72px 80px',
      backgroundColor: color('surface'),
      color: color('on-surface'),
      fontFamily: 'Bricolage Grotesque',
    },
    [
      // Wrapped in a div: Satori only takes an element out of the flow when
      // `position: absolute` is on a div, not on the svg itself.
      el(
        'div',
        { display: 'flex', position: 'absolute', top: -150, right: -170 },
        shape(scallop(9, 0.07), color('primary-container'), { width: 560, height: 560 }),
      ),
      el('div', { display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 600 }, [
        el(
          'svg',
          { width: 64, height: 64 },
          [
            el('path', {}, undefined, { d: logo.shape, fill: logo.black }),
            el('path', {}, undefined, { d: logo.brackets, fill: logo.white }),
          ],
          { viewBox: logo.viewBox },
        ),
        'thebytearray.org',
      ]),
      el('div', { display: 'flex', alignItems: 'center', gap: 44 }, [
        icon && el('img', { borderRadius: 36 }, undefined, { src: icon, width: 168, height: 168 }),
        el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
          el(
            'div',
            {
              // Long titles step down so they stay within three lines.
              fontSize: title.length > 60 ? 64 : title.length > 34 ? 80 : 100,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              maxWidth: icon ? 780 : 900,
            },
            title,
          ),
          subtitle &&
            el(
              'div',
              { fontSize: 34, fontWeight: 600, color: color('on-surface-variant'), maxWidth: icon ? 780 : 900 },
              subtitle,
            ),
        ]),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
