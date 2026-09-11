import type { MetadataRoute } from "next";

import { apps } from "@/content/apps";
import { policies } from "@/content/policies";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// Policies state "Last updated December 2024"; keep the sitemap in step with that.
const POLICY_UPDATED = "2024-12-01";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const builtAt = new Date();

  const page = (
    path: string,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: number,
    lastModified: Date | string = builtAt,
  ): MetadataRoute.Sitemap[number] => ({ url: absoluteUrl(path), lastModified, changeFrequency, priority });

  return [
    page("/", "weekly", 1),
    page("/apps/", "monthly", 0.9),
    ...apps.map((app) => ({
      ...page(`/apps/${app.slug}/`, "monthly", 0.9),
      images: [app.icon.src, ...app.screenshots.map((shot) => shot.src)].map(absoluteUrl),
    })),
    ...apps.map((app) => page(app.privacyPath, "yearly", 0.6, policies[app.slug] ? POLICY_UPDATED : builtAt)),
    page("/open-source/", "weekly", 0.7),
    page("/blog/", "weekly", 0.6),
    ...posts.map((post) => page(`/blog/${post.slug}/`, "yearly", 0.6, post.date)),
    page("/about/", "yearly", 0.5),
    page("/contact/", "yearly", 0.5),
  ];
}
