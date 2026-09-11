import type { App } from "@/content/apps";
import { site, team } from "@/content/site";
import type { PostMeta } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

const ORGANIZATION_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

const organizationRef = { "@id": ORGANIZATION_ID };

export function organizationLd() {
  const founder = team[0];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    alternateName: "[]byte",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/apple-icon.png"),
    email: site.email,
    description: site.description,
    sameAs: [site.links.github],
    ...(founder
      ? { founder: { "@type": "Person", name: founder.name, url: founder.github, jobTitle: founder.role } }
      : {}),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "en",
    publisher: organizationRef,
  };
}

export function appLd(app: App) {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: app.name,
    description: app.description,
    url: absoluteUrl(`/apps/${app.slug}/`),
    operatingSystem: "Android",
    applicationCategory: app.storeCategory,
    installUrl: app.playStoreUrl,
    downloadUrl: app.playStoreUrl,
    image: absoluteUrl(app.icon.src),
    screenshot: app.screenshots.map((shot) => absoluteUrl(shot.src)),
    featureList: app.features.map((feature) => feature.title),
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: organizationRef,
    ...(app.license ? { license: site.license.url } : {}),
    ...(app.sourceUrl ? { codeRepository: app.sourceUrl } : {}),
  };
}

export function blogPostingLd(post: PostMeta) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  const author = team.find((person) => person.name === post.author);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl("/og/home.png"),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    author: { "@type": "Person", name: post.author, ...(author ? { url: author.github } : {}) },
    publisher: organizationRef,
  };
}

export function breadcrumbLd(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
