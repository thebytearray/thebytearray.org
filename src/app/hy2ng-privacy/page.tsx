import type { Metadata } from "next";

import { PolicyDocument } from "@/components/legal/policy-document";
import { policies } from "@/content/policies";
import { pageMetadata } from "@/lib/seo";

// This URL is linked from the Google Play listing; keep the path stable.
const policy = policies.hy2ng;

export const metadata: Metadata = pageMetadata({
  title: policy.title,
  description: "How Hy2NG handles your data: nothing is collected, and everything stays on your device.",
  path: "/hy2ng-privacy/",
});

export default function Hy2ngPrivacyPage() {
  return <PolicyDocument policy={policy} />;
}
