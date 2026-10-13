// Everything on the Apps pages comes from this file. Icons and screenshots
// live in src/assets/apps/<slug>/.
import type { ImageMetadata } from 'astro';
import convertitBackground from '../assets/apps/convertit/background.png';
import convertitConvert from '../assets/apps/convertit/convert.png';
import convertitFeatureGraphic from '../assets/apps/convertit/feature-graphic.png';
import convertitFormats from '../assets/apps/convertit/formats.png';
import convertitIcon from '../assets/apps/convertit/icon.png';
import convertitLibrary from '../assets/apps/convertit/library.png';
import convertitTags from '../assets/apps/convertit/tags.png';
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

export type AppSlug = 'convertit' | 'openloader' | 'hy2ng';

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
  /**
   * The store feature graphic. The app that has one is the featured app: it
   * gets the banner on the home and Apps pages instead of a card.
   */
  featureGraphic?: Screenshot;
  screenshots: Screenshot[];
  features: AppFeature[];
  playStoreUrl: string;
  packageId: string;
  sourceUrl?: string;
  license?: string;
  requirements: string;
  /** schema.org applicationCategory, for search engines. */
  storeCategory: 'DeveloperApplication' | 'MultimediaApplication' | 'UtilitiesApplication';
  /** Kept at the legacy URL: store listings link to it. */
  privacyPath?: `/${string}/`;
}

export const apps: App[] = [
  {
    slug: 'convertit',
    name: 'Convertit',
    tagline: 'No BS. Straight to the point.',
    summary: 'An offline audio and video converter for Android, with no ads.',
    description:
      'Convertit is an ad-free, offline audio and video converter for Android. Pick a file, pick a format (MP3, M4A, AAC, OGG, OPUS and more) and it converts in the background.',
    icon: convertitIcon,
    iconFile: 'src/assets/apps/convertit/icon.png',
    featureGraphic: {
      src: convertitFeatureGraphic,
      alt: 'Convertit. No BS. Straight to the point. Audio and video converter, offline, no ads.',
    },
    screenshots: [
      { src: convertitConvert, alt: 'Convert audio and video: one tap to start, no clutter' },
      { src: convertitFormats, alt: 'Pick the format, done: MP3, M4A, AAC, OGG, OPUS and more' },
      { src: convertitBackground, alt: 'Keeps going in the background: queue files and carry on' },
      { src: convertitLibrary, alt: 'Everything you converted: open or share in a tap' },
      { src: convertitTags, alt: 'Fix the tags: title, artist, album and cover art' },
    ],
    features: [
      {
        icon: 'graphic_eq',
        title: 'Audio and video',
        description: 'One tap to start a conversion. No clutter in the way.',
      },
      {
        icon: 'tune',
        title: 'Pick the format',
        description: 'MP3, M4A, AAC, OGG, OPUS and more.',
      },
      {
        icon: 'queue_music',
        title: 'Keeps going in the background',
        description: 'Queue several files and carry on with something else.',
      },
      {
        icon: 'library_music',
        title: 'Library',
        description: 'Open or share any converted file in a tap.',
      },
      {
        icon: 'sell',
        title: 'Fix the tags',
        description: 'Edit the title, artist, album and cover art.',
      },
      {
        icon: 'wifi_off',
        title: 'Offline, no ads',
        description: 'Files are converted on your device, and the app shows no ads.',
      },
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nasahacker.convertit',
    packageId: 'com.nasahacker.convertit',
    requirements: 'Android.',
    storeCategory: 'MultimediaApplication',
    privacyPath: '/convertit-privacy/',
  },
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

/** The app shown as a banner, and the ones shown as cards. */
export const featuredApp = apps.find((app) => app.featureGraphic);
export const otherApps = apps.filter((app) => app !== featuredApp);

export function getApp(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}
