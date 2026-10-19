// Narrates every blog post with Kokoro (an open-source TTS model, run locally)
// and saves an MP3 per post to public/audio/blog/, plus the timings the Listen
// player uses to highlight each paragraph (src/data/post-audio.json). Only
// posts whose text changed are regenerated. Run with `npm run audio` after
// writing or editing a post (`npm run audio -- <post-id>` for just one); the
// output is committed. Needs ffmpeg on PATH.
//
// `npm run audio:verify` only verifies that every post's audio matches its
// current text, and fails if not; the build runs it so stale narration never ships.
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { slug } from 'github-slugger';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toString } from 'mdast-util-to-string';
import { gfm } from 'micromark-extension-gfm';

const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const VOICE = 'am_michael';
// Kokoro's default pace drags for reading; this is a brisk but natural 1×.
const SPEED = 1.15;
const SAMPLE_RATE = 24000;
// Bump to regenerate every post, e.g. after changing pauses or pronunciations.
const VERSION = 3;

// Silence after each kind of block, in seconds.
const PAUSE = { heading: 0.5, block: 0.32, sentence: 0.06 };

// Words the model mispronounces, spelled the way they should sound.
const PRONOUNCE = [
  [/\bConvertit\b/g, 'Convert-it'],
  [/\bHDR10\+/g, 'HDR ten plus'],
  [/\bULTRAKILL\b/g, 'Ultrakill'],
  [/\bAPKs\b/g, 'A P Ks'],
  [/\bAPK\b/g, 'A P K'],
];

const root = new URL('../', import.meta.url);
const postsDir = new URL('src/content/blog/', root);
const audioDir = new URL('public/audio/blog/', root);
const manifestFile = new URL('src/data/post-audio.json', root);

/** Reads the frontmatter fields the narration needs (single-line values only). */
function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) throw new Error('missing frontmatter');
  const data = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1).replaceAll("''", "'");
    else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[field[1]] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

// Nodes that hold other blocks rather than text.
const CONTAINERS = new Set(['blockquote', 'list', 'listItem']);
// Blocks that are never read aloud (and that the player skips on the page).
const SILENT = new Set(['code', 'html', 'table', 'footnoteDefinition', 'thematicBreak', 'definition']);

/**
 * A block's text. Child blocks of quotes and list items are joined as separate
 * sentences, so "Back.Update" doesn't come out as one word.
 */
function textOf(node) {
  if (!CONTAINERS.has(node.type)) return toString(node, { includeImageAlt: false }).replace(/\s+/g, ' ').trim();
  return node.children
    .filter((child) => !SILENT.has(child.type))
    .map(textOf)
    .filter(Boolean)
    .reduce((text, next) => (text ? `${text}${/[.!?:;]["'”’)]*$/.test(text) ? ' ' : '. '}${next}` : next), '');
}

/**
 * The post as spoken blocks, in the same order the Listen player finds them on
 * the page: title, description, then every top-level paragraph, heading, list
 * item and quote of the body. Image-only paragraphs, code, tables and
 * footnotes are skipped on both sides.
 */
function blocks(data, body) {
  const out = [{ kind: 'heading', text: data.title }];
  if (data.description) out.push({ kind: 'block', text: data.description });
  const tree = fromMarkdown(body, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  for (const node of tree.children) {
    if (node.type === 'heading') out.push({ kind: 'heading', text: textOf(node) });
    else if (node.type === 'paragraph' || node.type === 'blockquote') out.push({ kind: 'block', text: textOf(node) });
    else if (node.type === 'list') for (const item of node.children) out.push({ kind: 'block', text: textOf(item) });
  }
  return out.map((b) => ({ ...b, text: b.text.replace(/\s+/g, ' ').trim() })).filter((b) => b.text);
}

function speakable(text) {
  return PRONOUNCE.reduce((t, [pattern, spoken]) => t.replace(pattern, spoken), text);
}

// Splits only where a sentence really ends: punctuation, a space, then a
// capital or a digit. "thebytearray.org", "v1.2.1" and "e.g. this" stay whole.
function sentences(text) {
  return text
    .split(/(?<=[.!?]["'”’)]*)\s+(?=["'“‘(]?[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function wav(samples) {
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const args = process.argv.slice(2);
const check = args.includes('--check');
const only = args.find((arg) => !arg.startsWith('--'));

// Post IDs as Astro's glob loader makes them: a frontmatter slug, or the
// slugified file name.
const posts = readdirSync(postsDir)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const { data, body } = frontmatter(readFileSync(new URL(file, postsDir), 'utf8'));
    return { id: data.slug || slug(file.slice(0, -3)), parts: blocks(data, body) };
  });

const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : {};
const hashOf = (parts) =>
  createHash('sha256')
    .update(JSON.stringify({ VERSION, VOICE, SPEED, PRONOUNCE: PRONOUNCE.map(String), parts }))
    .digest('hex')
    .slice(0, 16);
const current = (id, hash) => manifest[id]?.hash === hash && existsSync(new URL(`${id}.mp3`, audioDir));

if (check) {
  const stale = posts.filter(({ id, parts }) => !current(id, hashOf(parts))).map(({ id }) => id);
  if (stale.length) {
    console.error(`audio: narration is missing or out of date for: ${stale.join(', ')}`);
    console.error('audio: run `npm run audio` and commit the result.');
    process.exit(1);
  }
  console.log(`audio: all ${posts.length} posts are up to date`);
  process.exit(0);
}

// Drop audio for posts that no longer exist.
for (const id of Object.keys(manifest)) {
  if (posts.some((post) => post.id === id)) continue;
  rmSync(new URL(`${id}.mp3`, audioDir), { force: true });
  delete manifest[id];
}

let tts;
mkdirSync(audioDir, { recursive: true });

for (const { id, parts } of posts) {
  if (only && id !== only) continue;
  const hash = hashOf(parts);
  if (current(id, hash)) {
    console.log(`audio: ${id} is up to date`);
    continue;
  }

  // Loaded only when something needs narrating: the model is large.
  if (!tts) {
    const { KokoroTTS } = await import('kokoro-js');
    tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'fp32', device: 'cpu' });
  }
  console.log(`audio: narrating ${id} (${parts.length} blocks)`);

  const chunks = [];
  const marks = [];
  let length = 0;
  const silence = (seconds) => {
    const pad = new Float32Array(Math.round(seconds * SAMPLE_RATE));
    chunks.push(pad);
    length += pad.length;
  };

  for (const part of parts) {
    marks.push(Number((length / SAMPLE_RATE).toFixed(2)));
    const lines = sentences(speakable(part.text));
    for (const [i, line] of lines.entries()) {
      const { audio } = await tts.generate(line, { voice: VOICE, speed: SPEED });
      chunks.push(audio);
      length += audio.length;
      if (i < lines.length - 1) silence(PAUSE.sentence);
    }
    silence(PAUSE[part.kind]);
  }

  const samples = new Float32Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    samples.set(chunk, offset);
    offset += chunk.length;
  }

  // Mono speech at 64 kbps: about half a megabyte per minute.
  const mp3 = fileURLToPath(new URL(`${id}.mp3`, audioDir));
  const ffmpeg = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'wav', '-i', 'pipe:0', '-ac', '1', '-b:a', '64k', mp3],
    { input: wav(samples), maxBuffer: 1 << 30 },
  );
  if (ffmpeg.status !== 0) throw new Error(`audio: ffmpeg failed for ${id}: ${ffmpeg.stderr}`);

  manifest[id] = { hash, duration: Number((length / SAMPLE_RATE).toFixed(2)), marks };
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`audio: wrote ${id}.mp3 (${(length / SAMPLE_RATE / 60).toFixed(1)} min)`);
}

writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
