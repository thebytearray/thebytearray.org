// Everything on the Apps pages comes from this file. Icons and screenshots
// live in src/assets/apps/<slug>/.
import type { ImageMetadata } from 'astro';
import hy2ngAddConfiguration from '../assets/apps/hy2ng/add-configuration.png';
import hy2ngConfigurations from '../assets/apps/hy2ng/configurations.png';
import hy2ngIcon from '../assets/apps/hy2ng/icon.png';
import hy2ngPerAppProxy from '../assets/apps/hy2ng/per-app-proxy.png';
import hy2ngQrSharing from '../assets/apps/hy2ng/qr-sharing.png';
import hy2ngServerSetup from '../assets/apps/hy2ng/server-setup.png';
import openloaderHome from '../assets/apps/openloader/home.png';
import openloaderIcon from '../assets/apps/openloader/icon.png';
import openloaderInstallMethod from '../assets/apps/openloader/install-method.png';
import openloaderInstallQueue from '../assets/apps/openloader/install-queue.png';
import openloaderSettings from '../assets/apps/openloader/settings.png';
import type { IconName } from './icons';

export type AppSlug = 'openloader' | 'hy2ng';

export interface Screenshot {
  src: ImageMetadata;
  alt: string;
}

export interface AppFeature {
  icon: IconName;
  title: string;
  description: string;
}

export interface App {
  slug: AppSlug;
  name: string;
  tagline: string;
  summary: string;
  description: string;
  icon: ImageMetadata;
  /** The icon's path from the project root, for the generated social card. */
  iconFile: string;
  screenshots: Screenshot[];
  features: AppFeature[];
  playStoreUrl: string;
  packageId: string;
  sourceUrl?: string;
  license?: string;
  requirements: string;
  /** schema.org applicationCategory, for search engines. */
  storeCategory: 'DeveloperApplication' | 'UtilitiesApplication';
  /** Kept at the legacy URL: store listings link to it. */
  privacyPath: `/${string}/`;
}

export const apps: App[] = [
  {
    slug: 'openloader',
    name: 'OpenLoader',
    tagline: 'Install APKs on the Android devices you own',
    summary: 'Sideload APK files you already have, one at a time or as a queue, to one device or several.',
    description:
      'OpenLoader installs APK files you provide, outside the store flow. It is built with Android developers in mind: queue installs, push builds to several devices over wireless ADB, and use Shizuku for privileged installs when you grant it access. Open source under GPL-3.0.',
    icon: openloaderIcon,
    iconFile: 'src/assets/apps/openloader/icon.png',
    screenshots: [
      { src: openloaderHome, alt: 'OpenLoader home screen, ready to add APK files' },
      { src: openloaderInstallMethod, alt: 'Choosing an install method: Shizuku or wireless ADB' },
      { src: openloaderInstallQueue, alt: 'Install queue with one APK ready to install' },
      { src: openloaderSettings, alt: 'Settings and install options' },
    ],
    features: [
      {
        icon: 'playlist_add',
        title: 'Install queue',
        description: 'Pick several APK files and install them in one go.',
      },
      {
        icon: 'devices',
        title: 'Several devices at once',
        description: 'Push the same build to multiple phones or tablets without repeating every step.',
      },
      {
        icon: 'wifi',
        title: 'Wireless ADB',
        description: 'Connect and deploy over your network on Android 11 and newer.',
      },
      {
        icon: 'link',
        title: 'Pairing helpers',
        description: 'Guided flows and checks for wireless debugging and pairing, where supported.',
      },
      {
        icon: 'key',
        title: 'Optional Shizuku',
        description: 'Use a privileged install path when you grant Shizuku access.',
      },
      {
        icon: 'lock',
        title: 'Stays on your device',
        description: 'No analytics and no cloud account. History and preferences stay on the device.',
      },
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thebytearray.app.android.openloader',
    packageId: 'org.thebytearray.app.android.openloader',
    sourceUrl: 'https://github.com/thebytearray/OpenLoader',
    license: 'GPL-3.0',
    requirements: 'Android. Wireless ADB needs Android 11 or newer.',
    storeCategory: 'DeveloperApplication',
    privacyPath: '/openloader-privacy/',
  },
  {
    slug: 'hy2ng',
    name: 'Hy2NG',
    tagline: 'A Hysteria2 VPN client for Android',
    summary: 'Connect to Hysteria2 servers, or set up your own with the built-in wizard.',
    description:
      'Hy2NG is a Hysteria2 client for Android. Import a configuration from a QR code or your clipboard, choose which apps go through the tunnel, or set up your own VPS with the built-in guide. No ads and no tracking.',
    icon: hy2ngIcon,
    iconFile: 'src/assets/apps/hy2ng/icon.png',
    screenshots: [
      { src: hy2ngConfigurations, alt: 'List of saved configurations' },
      { src: hy2ngAddConfiguration, alt: 'Adding a new configuration' },
      { src: hy2ngQrSharing, alt: 'Sharing a configuration as a QR code' },
      { src: hy2ngServerSetup, alt: 'Server setup wizard' },
      { src: hy2ngPerAppProxy, alt: 'Choosing which apps use the VPN' },
    ],
    features: [
      {
        icon: 'dns',
        title: 'Server setup wizard',
        description: 'Configure your own VPS with a built-in, step-by-step guide.',
      },
      {
        icon: 'qr_code_2',
        title: 'QR code import',
        description: 'Add configurations by scanning a QR code or pasting from the clipboard.',
      },
      {
        icon: 'apps',
        title: 'Per-app proxy',
        description: 'Choose which apps use the VPN connection.',
      },
      {
        icon: 'lock',
        title: 'Stays on your device',
        description: 'No ads and no tracking. Configurations are stored only on your device.',
      },
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thebytearray.hy2.ng',
    packageId: 'org.thebytearray.hy2.ng',
    requirements: 'Android.',
    storeCategory: 'UtilitiesApplication',
    privacyPath: '/hy2ng-privacy/',
  },
];

export function getApp(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}
