import type { AppSlug } from "@/content/apps";

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly { term: string; text: string }[] };

export interface PolicySection {
  heading: string;
  blocks: readonly PolicyBlock[];
}

export interface Policy {
  app: AppSlug;
  title: string;
  lastUpdated: string;
  /** Sections before the shared "Contact" section, which PolicyDocument renders. */
  sections: readonly PolicySection[];
}

const p = (text: string): PolicyBlock => ({ type: "paragraph", text });

export const policies: Record<AppSlug, Policy> = {
  hy2ng: {
    app: "hy2ng",
    title: "Hy2NG privacy policy",
    lastUpdated: "December 2024",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how Hy2NG (“the App”) handles your data. We believe in transparency and minimal data collection.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "Hy2NG does not collect any personal data. The App operates entirely on-device and does not transmit any information to external servers.",
          ),
        ],
      },
      {
        heading: "VPN usage",
        blocks: [
          p(
            "The App uses the Android VPN API to route traffic according to your configuration. All VPN traffic is processed locally on your device. No traffic data is logged, stored, or transmitted to third parties.",
          ),
        ],
      },
      {
        heading: "Server configuration",
        blocks: [
          p(
            "Server configurations you enter are stored locally on your device. They are never sent to any server other than the one you configure. The built-in server setup wizard connects directly to your specified VPS.",
          ),
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "The App does not integrate any third-party analytics, advertising, or tracking services. It does not contain any cloud accounts or telemetry.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "All app data, including configurations and preferences, is stored exclusively on your device using Android’s local storage APIs. Uninstalling the App removes all stored data.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We may update this privacy policy from time to time. Changes will be posted on this page. We encourage you to review this policy periodically.",
          ),
        ],
      },
    ],
  },
  openloader: {
    app: "openloader",
    title: "OpenLoader privacy policy",
    lastUpdated: "December 2024",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how OpenLoader (“the App”) handles your data. We believe in minimal data collection and maximum transparency.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "OpenLoader does not collect any personal data. The App operates entirely on-device and does not transmit information to external servers.",
          ),
        ],
      },
      {
        heading: "APK files",
        blocks: [
          p(
            "APK files you select for installation are processed locally. The App never uploads or transmits APK files to any server.",
          ),
        ],
      },
      {
        heading: "Permissions",
        blocks: [
          p("The App requests the following permissions solely for local functionality:"),
          {
            type: "list",
            items: [
              {
                term: "Internet",
                text: "Used solely for wireless ADB connections to your devices over the local network. No data is sent to external servers.",
              },
              {
                term: "Notification",
                text: "Used to show install progress and completion status.",
              },
            ],
          },
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "OpenLoader does not integrate any third-party analytics, advertising, or tracking services. It has no cloud accounts or telemetry.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "All preferences and history are stored exclusively on your device using Android’s local storage APIs. Uninstalling the App removes all stored data.",
          ),
        ],
      },
      {
        heading: "Open source",
        blocks: [
          p(
            "OpenLoader is open source under GPL-3.0. You can verify our privacy claims by inspecting the source code.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We may update this privacy policy from time to time. Changes will be posted on this page.",
          ),
        ],
      },
    ],
  },
};
