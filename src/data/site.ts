import { siGithub, siGoogleplay } from 'simple-icons';
import type { IconName } from './icons';

// The address is kept base64-encoded everywhere (source and HTML) to keep it
// away from scrapers. It is decoded only when someone copies it or opens their
// mail app (see the inline script in layouts/Base.astro).
// To change it: printf 'you@example.com' | base64
const mail = 'Y29udGFjdEB0aGVieXRlYXJyYXkub3Jn';

export const site = {
  name: 'The Byte Array',
  title: 'The Byte Array',
  tagline: 'Straight to the point. Private by default.',
  description:
    'The Byte Array makes Android apps, libraries and developer tools that do one job well. Our apps have no ads, no tracking and no accounts.',
  locale: 'en',
  mail,
  /** Written-out form of the address, safe to show in the page. */
  emailDisplay: 'contact at thebytearray dot org',
  license: {
    name: 'GPL-3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.html',
  },
  github: 'https://github.com/thebytearray',
  /** Source of this website. */
  repo: 'https://github.com/thebytearray/thebytearray.org',
  /** Topics for search engines (schema.org `knowsAbout`). */
  topics: ['Android', 'Privacy', 'Open source', 'Developer tools'],
};

export const nav = [
  { label: 'Apps', href: '/apps/' },
  { label: 'Open source', href: '/open-source/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** Simple Icons paths for the brand logos used on the site. */
export const brands = {
  github: siGithub.path,
  googlePlay: siGoogleplay.path,
};

export interface SocialLink {
  label: string;
  /** Text shown on the chip. */
  handle: string;
  href: string;
  icon: IconName;
  /** Simple Icons path for a brand logo; used instead of `icon` when set. */
  brand?: string;
  /** Base64-encoded email address; makes the chip copy the decoded address on click. */
  mail?: string;
  /** Show as a chip in the home page contact section. */
  hero?: boolean;
}

export const socials: SocialLink[] = [
  { label: 'GitHub', handle: 'thebytearray', href: site.github, icon: 'code', brand: brands.github, hero: true },
  { label: 'Email', handle: 'Copy email', href: '', icon: 'mail', mail, hero: true },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  github: string;
  avatar: string;
}

export const team: TeamMember[] = [
  {
    name: 'Tamim',
    role: 'Founder and lead developer',
    bio: 'Building software and sharing what I learn along the way.',
    github: 'https://github.com/codewithtamim',
    avatar: 'https://github.com/codewithtamim.png',
  },
];

export const workAreas: { title: string; description: string; icon: IconName }[] = [
  {
    title: 'Developer tools',
    description: "Command-line apps, build tools and utilities that take repetitive steps out of a developer's day.",
    icon: 'code',
  },
  {
    title: 'Libraries and packages',
    description:
      'Reusable packages for common problems, across several languages. Built to be reliable and documented.',
    icon: 'folder_code',
  },
  {
    title: 'Applications',
    description:
      'End-user software built with privacy in mind: local-first, clear policies and no unnecessary tracking.',
    icon: 'apps',
  },
];
