export const site = {
  name: "The Byte Array",
  url: "https://thebytearray.org",
  tagline: "Straight to the point. Private by default.",
  description:
    "The Byte Array makes Android apps, libraries and developer tools that do one job well. Our apps have no ads, no tracking and no accounts.",
  email: "contact@thebytearray.org",
  license: {
    name: "GPL-3.0",
    url: "https://www.gnu.org/licenses/gpl-3.0.html",
  },
  links: {
    github: "https://github.com/thebytearray",
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: readonly NavItem[] = [
  { label: "Apps", href: "/apps/" },
  { label: "Open source", href: "/open-source/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/about/" },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  github: string;
  avatar: string;
}

export const team: readonly TeamMember[] = [
  {
    name: "Tamim",
    role: "Founder and lead developer",
    bio: "Building software and sharing what I learn along the way.",
    github: "https://github.com/codewithtamim",
    avatar: "https://github.com/codewithtamim.png",
  },
];

export const workAreas = [
  {
    title: "Developer tools",
    description:
      "Command-line apps, build tools and utilities that take repetitive steps out of a developer's day.",
  },
  {
    title: "Libraries and packages",
    description:
      "Reusable packages for common problems, across several languages. Built to be reliable and documented.",
  },
  {
    title: "Applications",
    description:
      "End-user software built with privacy in mind: local-first, clear policies and no unnecessary tracking.",
  },
] as const;
