import type { AppSlug } from "./apps";

export type PolicyBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly { term: string; text: string }[] };

export interface PolicySection {
  heading: string;
  blocks: readonly PolicyBlock[];
}

/**
 * Apps that have a privacy policy here but no app page on the site, such as
 * helper apps. Their policy says "Applies to <name>" without a link.
 */
export const unlistedApps = {
  precheck: { name: "Precheck" },
  "convertit-ios": { name: "Convertit for iPhone and iPad" },
} as const;

export type UnlistedAppSlug = keyof typeof unlistedApps;

export interface Policy {
  app: AppSlug | UnlistedAppSlug;
  title: string;
  /** ISO 8601 timestamp of the last update, e.g. "2026-10-20T04:22:31Z". Shown with date and time for transparency. */
  lastUpdated: string;
  /** Sections before the shared "Contact" section, which PolicyDocument renders. */
  sections: readonly PolicySection[];
}

const p = (text: string): PolicyBlock => ({ type: "paragraph", text });

export const policies: Record<AppSlug | UnlistedAppSlug, Policy> = {
  convertit: {
    app: "convertit",
    title: "Convertit privacy policy",
    lastUpdated: "2026-10-20T04:22:31Z",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how Convertit (“the App”) handles your data. We believe in minimal data collection and maximum transparency.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "Convertit does not collect any personal data. The App operates entirely on-device and does not transmit information to external servers.",
          ),
        ],
      },
      {
        heading: "Your files",
        blocks: [
          p(
            "Audio and video files you choose are converted locally on your device. The App never uploads or transmits your files, the converted results, or their tags and cover art to any server.",
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
                term: "Files and media",
                text: "Used to read the files you pick and to save the converted files on your device.",
              },
              {
                term: "Notification",
                text: "Used to show conversion progress and completion status while the App works in the background.",
              },
            ],
          },
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "Convertit does not integrate any third-party analytics, advertising, or tracking services. It shows no ads and has no cloud accounts or telemetry.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "Converted files, your library and your preferences are stored exclusively on your device using Android’s local storage APIs. Uninstalling the App removes its stored data; converted files you saved to shared storage stay until you delete them.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
  "convertit-pro": {
    app: "convertit-pro",
    title: "Convertit Pro privacy policy",
    lastUpdated: "2026-10-20T04:22:31Z",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how Convertit Pro (“the App”) handles your data. We believe in minimal data collection and maximum transparency.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "Convertit Pro does not collect any personal data. The App operates entirely on-device and does not transmit information to external servers.",
          ),
        ],
      },
      {
        heading: "Your files",
        blocks: [
          p(
            "Audio, video and image files you choose are converted locally on your device. The App never uploads or transmits your files, the converted results, or their tags and metadata to any server.",
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
                term: "Files and media",
                text: "Used to read the files you pick and to save the converted files on your device.",
              },
              {
                term: "Notification",
                text: "Used to show progress and completion status while the App works in the background.",
              },
            ],
          },
        ],
      },
      {
        heading: "Purchases",
        blocks: [
          p(
            "Purchases are handled entirely by Google Play. We never see and do not store your payment details.",
          ),
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "Convertit Pro does not integrate any third-party analytics, advertising, or tracking services. It shows no ads and has no cloud accounts or telemetry.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "Converted files, your library and your preferences are stored exclusively on your device using Android’s local storage APIs. Uninstalling the App removes its stored data; converted files you saved to shared storage stay until you delete them.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
  "convertit-ios": {
    app: "convertit-ios",
    title: "Convertit for iPhone and iPad privacy policy",
    lastUpdated: "2026-11-21T08:50:00Z",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how Convertit for iPhone and iPad (“the App”), published by The Byte Array Ltd, handles your data. We believe in minimal data collection and maximum transparency.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "The App does not collect personal data. It has no account, no analytics, no advertising and no tracking, and it does not send your information to our servers or to anyone else’s. The only time we receive anything is when you choose to contact us, as described under Support and logs.",
          ),
        ],
      },
      {
        heading: "Your files",
        blocks: [
          p(
            "Audio, video and image files you choose are converted, compressed and edited on your device. The App never uploads your files, the results, or their tags, cover art, dates or locations to any server.",
          ),
        ],
      },
      {
        heading: "Permissions",
        blocks: [
          p("The App asks for these permissions only when a feature needs them, and uses them only on your device:"),
          {
            type: "list",
            items: [
              {
                term: "Add to Photos",
                text: "Used to save converted videos and GIFs to your Photos library when you choose Photos as the destination.",
              },
              {
                term: "Full Photos access",
                text: "Used by Storage Saver to find your largest videos and save smaller copies next to them, and to open or share files the App saved to Photos. If you limit access, the App only sees the items you allow. Videos stored in iCloud may be downloaded by Photos so they can be compressed on your device.",
              },
              {
                term: "Notifications",
                text: "Used only if you ask for a reminder before your 24-hour pass ends. The reminder is scheduled on your device.",
              },
            ],
          },
          p(
            "Files you pick from the Files app, and folders you choose as a save location, are accessed only with the system’s file picker and only for the files and folders you select. You can change Photos and notification access at any time in the Settings app.",
          ),
        ],
      },
      {
        heading: "Purchases",
        blocks: [
          p(
            "Pro and the 24-hour pass are sold through the App Store. Apple handles the payment, and we never see your payment details or your Apple Account. To know whether Pro is unlocked, the App reads your purchase records from Apple on your device. We do not receive them.",
          ),
        ],
      },
      {
        heading: "Support and logs",
        blocks: [
          p(
            "If you use Contact support, the App opens your own mail app with your message addressed to us. We receive what you send, including your email address and anything you write. If you turn on Attach logs, the email also includes the App’s log, recent system messages from the App and a device report (device model, iOS version, language and region, free storage and similar technical details). Logs can include the names of files you processed. Nothing is sent until you press send in your mail app.",
          ),
          p(
            "File logging is off unless you turn it on in Settings, or turn on Attach logs. Logs stay on your device until you share them, and the App keeps at most a few small log files. We use support emails and logs only to answer you and fix problems, and we delete them when they are no longer needed for that.",
          ),
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "The App does not include third-party analytics, advertising, tracking or crash-reporting services. It uses Apple’s own frameworks for purchases, Photos and notifications, under Apple’s privacy policy. Links in the App, for example to our community channels, open in your browser and are covered by those sites’ own policies.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "Converted files, your library, presets and preferences are stored only on your device. Files saved to the App’s folder appear in the Files app; files saved to Photos stay in your Photos library. Deleting the App removes its library and settings; files you saved to Photos or to another folder stay until you delete them. An app data backup you export is a file you control.",
          ),
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          p(
            "Because the App does not send us your data, we hold nothing about you unless you email us. If you have, you can ask us to see, correct or delete what we hold, and we will reply within 30 days. If you are in the UK or the EU, you can also complain to your data protection authority; in the UK that is the Information Commissioner’s Office.",
          ),
        ],
      },
      {
        heading: "Children",
        blocks: [
          p(
            "The App is not directed at children and does not knowingly collect information from anyone, including children.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
  precheck: {
    app: "precheck",
    title: "Precheck privacy policy",
    lastUpdated: "2026-11-20T23:30:00Z",
    sections: [
      {
        heading: "Introduction",
        blocks: [
          p(
            "This privacy policy explains how Precheck (“the App”) handles your data. Precheck tests whether your phone can run Convertit Pro and which of its features work on it.",
          ),
        ],
      },
      {
        heading: "Data collection",
        blocks: [
          p(
            "Precheck does not collect any personal data. It has no permission to use the internet, so it cannot send anything to us or to anyone else.",
          ),
        ],
      },
      {
        heading: "What the App reads",
        blocks: [
          p("To run its checks, the App reads these details from your phone. They are used on your phone only, to show the results:"),
          {
            type: "list",
            items: [
              {
                term: "Device",
                text: "The manufacturer, model, Android version, processor name, whether the processor can run 64-bit apps, number of processor cores, amount of memory and whether the phone runs Android Go.",
              },
              {
                term: "Media support",
                text: "The video and image encoders your phone reports, and what its graphics chip and camera video profiles support, such as HEVC, AV1, HDR and 4K.",
              },
            ],
          },
          p("The App does not read your files, photos, contacts, location or any identifier that is unique to you or your phone."),
        ],
      },
      {
        heading: "Sharing a report",
        blocks: [
          p(
            "If you tap Share, the App builds a plain-text report of your phone’s details and the check results and opens Android’s share menu. Nothing is sent unless you choose an app to share it with. What happens to the report then is up to you and the app you pick.",
          ),
        ],
      },
      {
        heading: "Permissions",
        blocks: [p("The App requests no permissions.")],
      },
      {
        heading: "Links to Google Play",
        blocks: [
          p(
            "The App can open Convertit Pro’s page in the Google Play app or your browser. Google’s privacy policy applies to anything you do there.",
          ),
        ],
      },
      {
        heading: "Third-party services",
        blocks: [
          p(
            "Precheck does not integrate any third-party analytics, advertising, crash reporting or tracking services. It shows no ads and has no accounts.",
          ),
        ],
      },
      {
        heading: "Data storage",
        blocks: [
          p(
            "The App does not save the check results or your phone’s details. They are worked out each time you open it and are gone when you close it.",
          ),
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          p(
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
  hy2ng: {
    app: "hy2ng",
    title: "Hy2NG privacy policy",
    lastUpdated: "2026-10-20T04:22:31Z",
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
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
  openloader: {
    app: "openloader",
    title: "OpenLoader privacy policy",
    lastUpdated: "2026-10-20T04:22:31Z",
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
            "We version this page. See the Last updated date and time above. If we make a material change, we add a dated note here and announce it on our blog at least 7 days before it takes effect.",
          ),
        ],
      },
    ],
  },
};
