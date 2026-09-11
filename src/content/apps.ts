import type { LucideIcon } from "lucide-react";
import {
  KeyRound,
  LayoutGrid,
  Link,
  ListPlus,
  Lock,
  MonitorSmartphone,
  QrCode,
  Server,
  Wifi,
} from "lucide-react";

export type AppSlug = "openloader" | "hy2ng";

export interface Screenshot {
  src: string;
  alt: string;
}

export interface AppFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface App {
  slug: AppSlug;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  icon: Screenshot;
  screenshots: readonly Screenshot[];
  features: readonly AppFeature[];
  playStoreUrl: string;
  packageId: string;
  sourceUrl?: string;
  license?: string;
  requirements: string;
  /** schema.org applicationCategory, for search engines. */
  storeCategory: "DeveloperApplication" | "UtilitiesApplication";
  /** Kept at the legacy URL: store listings link to it. */
  privacyPath: `/${string}/`;
}

export const apps: readonly App[] = [
  {
    slug: "openloader",
    name: "OpenLoader",
    tagline: "Install APKs on the Android devices you own",
    summary:
      "Sideload APK files you already have, one at a time or as a queue, to one device or several.",
    description:
      "OpenLoader installs APK files you provide, outside the store flow. It is built with Android developers in mind: queue installs, push builds to several devices over wireless ADB, and use Shizuku for privileged installs when you grant it access. Open source under GPL-3.0.",
    icon: { src: "/images/openloader/icon.png", alt: "OpenLoader app icon" },
    screenshots: [
      { src: "/images/openloader/home.png", alt: "OpenLoader home screen, ready to add APK files" },
      { src: "/images/openloader/install-method.png", alt: "Choosing an install method: Shizuku or wireless ADB" },
      { src: "/images/openloader/install-queue.png", alt: "Install queue with one APK ready to install" },
      { src: "/images/openloader/settings.png", alt: "Settings and install options" },
    ],
    features: [
      {
        icon: ListPlus,
        title: "Install queue",
        description: "Pick several APK files and install them in one go.",
      },
      {
        icon: MonitorSmartphone,
        title: "Several devices at once",
        description: "Push the same build to multiple phones or tablets without repeating every step.",
      },
      {
        icon: Wifi,
        title: "Wireless ADB",
        description: "Connect and deploy over your network on Android 11 and newer.",
      },
      {
        icon: Link,
        title: "Pairing helpers",
        description: "Guided flows and checks for wireless debugging and pairing, where supported.",
      },
      {
        icon: KeyRound,
        title: "Optional Shizuku",
        description: "Use a privileged install path when you grant Shizuku access.",
      },
      {
        icon: Lock,
        title: "Stays on your device",
        description: "No analytics and no cloud account. History and preferences stay on the device.",
      },
    ],
    playStoreUrl: "https://play.google.com/store/apps/details?id=org.thebytearray.app.android.openloader",
    packageId: "org.thebytearray.app.android.openloader",
    sourceUrl: "https://github.com/thebytearray/OpenLoader",
    license: "GPL-3.0",
    requirements: "Android. Wireless ADB needs Android 11 or newer.",
    storeCategory: "DeveloperApplication",
    privacyPath: "/openloader-privacy/",
  },
  {
    slug: "hy2ng",
    name: "Hy2NG",
    tagline: "A Hysteria2 VPN client for Android",
    summary: "Connect to Hysteria2 servers, or set up your own with the built-in wizard.",
    description:
      "Hy2NG is a Hysteria2 client for Android. Import a configuration from a QR code or your clipboard, choose which apps go through the tunnel, or set up your own VPS with the built-in guide. No ads and no tracking.",
    icon: { src: "/images/hy2ng/icon.png", alt: "Hy2NG app icon" },
    screenshots: [
      { src: "/images/hy2ng/configurations.png", alt: "List of saved configurations" },
      { src: "/images/hy2ng/add-configuration.png", alt: "Adding a new configuration" },
      { src: "/images/hy2ng/qr-sharing.png", alt: "Sharing a configuration as a QR code" },
      { src: "/images/hy2ng/server-setup.png", alt: "Server setup wizard" },
      { src: "/images/hy2ng/per-app-proxy.png", alt: "Choosing which apps use the VPN" },
    ],
    features: [
      {
        icon: Server,
        title: "Server setup wizard",
        description: "Configure your own VPS with a built-in, step-by-step guide.",
      },
      {
        icon: QrCode,
        title: "QR code import",
        description: "Add configurations by scanning a QR code or pasting from the clipboard.",
      },
      {
        icon: LayoutGrid,
        title: "Per-app proxy",
        description: "Choose which apps use the VPN connection.",
      },
      {
        icon: Lock,
        title: "Stays on your device",
        description: "No ads and no tracking. Configurations are stored only on your device.",
      },
    ],
    playStoreUrl: "https://play.google.com/store/apps/details?id=org.thebytearray.hy2.ng",
    packageId: "org.thebytearray.hy2.ng",
    requirements: "Android.",
    storeCategory: "UtilitiesApplication",
    privacyPath: "/hy2ng-privacy/",
  },
];

export function getApp(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}
