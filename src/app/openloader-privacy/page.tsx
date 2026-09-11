import type { Metadata } from "next";

import { PolicyDocument } from "@/components/legal/policy-document";
import { policies } from "@/content/policies";
import { pageMetadata } from "@/lib/seo";

// This URL is linked from the Google Play listing; keep the path stable.
const policy = policies.openloader;

export const metadata: Metadata = pageMetadata({
  title: policy.title,
  description: "How OpenLoader handles your data: nothing is collected, and APK files never leave your device.",
  path: "/openloader-privacy/",
});

export default function OpenLoaderPrivacyPage() {
  return <PolicyDocument policy={policy} />;
}
