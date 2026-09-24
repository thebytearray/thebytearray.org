import { Container } from "@/components/layout/container";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { EmailTextLink } from "@/components/contact/email-link";
import { getApp } from "@/content/apps";
import type { Policy } from "@/content/policies";
import { breadcrumbLd } from "@/lib/structured-data";

export function PolicyDocument({ policy }: { policy: Policy }) {
  const app = getApp(policy.app);

  return (
    <Container className="pt-8 pb-20 md:pt-12 md:pb-28">
      {app ? (
        <JsonLd
          data={breadcrumbLd([
            { name: "Apps", path: "/apps/" },
            { name: app.name, path: `/apps/${app.slug}/` },
            { name: "Privacy policy", path: app.privacyPath },
          ])}
        />
      ) : null}
      <PageBreadcrumbs
        items={[
          { label: "Apps", href: "/apps/" },
          ...(app ? [{ label: app.name, href: `/apps/${app.slug}/` }] : []),
          { label: "Privacy policy" },
        ]}
      />

      <header className="mt-8 max-w-[68ch] border-b border-separator pb-8">
        <h1 className="text-h1 font-bold">{policy.title}</h1>
        <p className="mt-3 text-muted">Last updated {policy.lastUpdated}</p>
      </header>

      <article className="prose mt-4">
        {policy.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.blocks.map((block, index) =>
              block.type === "paragraph" ? (
                <p key={index}>{block.text}</p>
              ) : (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item.term}>
                      <strong>{item.term}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <EmailTextLink />.
          </p>
        </section>
      </article>
    </Container>
  );
}
