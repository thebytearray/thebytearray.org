import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  return {
    // Plain HTML/CSS/JS, served by nginx. No Node server needed.
    output: "export",
    // `next build` writes the site to dist/, the folder the existing CI/CD workflow and Dockerfile
    // ship. `next dev` keeps using .next/ so dev files never end up in a deploy.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next" : "dist",
    // Emits /hy2ng-privacy/index.html, which nginx's existing `try_files $uri $uri/` rule serves.
    trailingSlash: true,
    images: { unoptimized: true },
  };
}
