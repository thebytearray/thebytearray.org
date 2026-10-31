// Everything on the Apps pages comes from this file. Icons and screenshots
// live in src/assets/apps/<slug>/.
import type { ImageMetadata } from 'astro';
import convertitProCompressVideo from '../assets/apps/convertit-pro/compress-video.png';
import convertitProCompressCustom from '../assets/apps/convertit-pro/compress-custom.png';
import convertitProConvertAudioFlac from '../assets/apps/convertit-pro/convert-audio-flac.png';
import convertitProConvertImage from '../assets/apps/convertit-pro/convert-image.png';
import convertitProFeatureGraphic from '../assets/apps/convertit-pro/feature-graphic.png';
import convertitProIcon from '../assets/apps/convertit-pro/icon.png';
import convertitProMediaInfo from '../assets/apps/convertit-pro/media-info.png';
import convertitProReduceNoise from '../assets/apps/convertit-pro/reduce-noise.png';
import convertitProTools from '../assets/apps/convertit-pro/tools.png';
import convertitProTrim from '../assets/apps/convertit-pro/trim.png';
import convertitBackground from '../assets/apps/convertit/background.png';
import convertitConvert from '../assets/apps/convertit/convert.png';
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

export type AppSlug = 'convertit-pro' | 'convertit' | 'openloader' | 'hy2ng';

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
   * The store feature graphic. The app marked `featured` uses it as the
   * banner on the home and Apps pages instead of a card.
   */
  featureGraphic?: Screenshot;
  /** The featured app: it gets the banner on the home and Apps pages. */
  featured?: boolean;
  screenshots: Screenshot[];
  /** Promo video on YouTube. `id` is the video ID from its URL. */
  video?: { id: string; title: string; uploadDate?: string };
  features: AppFeature[];
  playStoreUrl: string;
  packageId: string;
  sourceUrl?: string;
  /** Points to a post explaining why this app's code is not public. */
  sourcePost?: string;
  /** Google Play app-signing certificate fingerprints, so users can verify an APK matches the Play copy. */
  signingSha256?: string;
  signingSha1?: string;
  license?: string;
  requirements: string;
  /** schema.org applicationCategory, for search engines. */
  storeCategory: 'DeveloperApplication' | 'MultimediaApplication' | 'UtilitiesApplication';
  /** SEO title (50-60 chars, query first). Falls back to `name: tagline` when omitted. */
  seoTitle?: string;
  /** SEO description (150-160 chars). Falls back to `summary` when omitted. */
  seoDescription?: string;
  /**
   * Paid app. Its `price` is used for the `offers` node in structured data,
   * so a "pay once" app is never described to search engines as free.
   */
  paid?: boolean;
  /** Play Store price, required when `paid` is set. */
  price?: { amount: string; currency: string };
  /** Kept at the legacy URL: store listings link to it. */
  privacyPath?: `/${string}/`;
  /** App is discontinued and no longer available for install. */
  discontinued?: boolean;
}

export const apps: App[] = [
  {
    slug: 'convertit',
    video: { id: 'y99jlwEYT5k', title: 'Convertit promo video' },
    name: 'Convertit',
    tagline: 'No BS. Straight to the point.',
    summary: 'An offline audio and video converter for Android, with no ads.',
    description:
      'Convertit is an ad-free, offline audio and video converter for Android. Pick a file, pick a format (MP3, M4A, AAC, OGG and OPUS) and it converts in the background.',
    icon: convertitIcon,
    iconFile: 'src/assets/apps/convertit/icon.png',
    screenshots: [
      { src: convertitConvert, alt: 'Convert audio and video: one tap to start, no clutter' },
      { src: convertitFormats, alt: 'Pick the format, done: MP3, M4A, AAC, OGG and OPUS' },
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
        description: 'MP3, M4A, AAC, OGG and OPUS.',
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
    sourcePost: '/blog/why-convertit-is-not-open-source/',
    requirements: 'Android 7.0+',
    storeCategory: 'MultimediaApplication',
    seoTitle: 'Convertit – Offline Audio & Video Converter for Android',
    seoDescription:
      'Convertit converts audio and video offline on Android: MP3, M4A, AAC, OGG, OPUS in background with tags. No ads, no tracking, no account. Android 7.0+.',
    privacyPath: '/convertit-privacy/',
  },
  {
    slug: 'convertit-pro',
    video: { id: 'MDA3KWgDElg', title: 'Convertit Pro promo video' },
    name: 'Convertit Pro',
    tagline: 'All tools listed below. Pay once.',
    summary: 'Audio, video and image tools for Android. Offline, no ads, pay once.',
    description:
      'Convertit Pro is the paid version of Convertit. One purchase unlocks the tools listed under What it does on this page as of 20 October 2026: audio, video and image conversion, video compression, noise reduction, a ringtone maker, EXIF and metadata tools, and media info. Future new tools may be separate and will be listed here before any charge. It runs offline and shows no ads.',
    icon: convertitProIcon,
    iconFile: 'src/assets/apps/convertit-pro/icon.png',
    featured: true,
    featureGraphic: {
      src: convertitProFeatureGraphic,
      alt: 'Convertit Pro. Every tool. Pay once. Audio, video and image tools, offline, no ads.',
    },
    screenshots: [
      {
        src: convertitProTools,
        alt: 'The tools screen: convert, enhance and metadata tools in one place',
      },
      {
        src: convertitProCompressVideo,
        alt: 'Compress several videos at once, with HDR10+ handled with care',
      },
      {
        src: convertitProReduceNoise,
        alt: 'Reduce noise on a recording, with adjustable attenuation',
      },
      {
        src: convertitProConvertAudioFlac,
        alt: 'Convert audio to FLAC, with CUE track splitting and a compression level slider',
      },
      {
        src: convertitProTrim,
        alt: 'Trim video and normalize loudness, with a size and time estimate',
      },
      {
        src: convertitProConvertImage,
        alt: 'Convert images like HEIC, with a quality slider',
      },
      {
        src: convertitProCompressCustom,
        alt: 'Compress video with its own resolution, frame rate and audio settings',
      },
      {
        src: convertitProMediaInfo,
        alt: 'Media info: a plain verdict plus every detail of a file',
      },
    ],
    features: [
      {
        icon: 'apps',
        title: 'All tools in one place',
        description: 'Convert, enhance and inspect media from one screen. One purchase unlocks the tools listed here, no ads.',
      },
      {
        icon: 'compress',
        title: 'Compress video',
        description: 'Shrink files with your pick of speed, codec, format and resolution.',
      },
      {
        icon: 'movie',
        title: 'HDR10+ metadata kept',
        description: 'Compress HDR10+ video without losing its dynamic metadata.',
      },
      {
        icon: 'crop',
        title: 'Trim and normalize',
        description: 'Cut video to the part that matters and even out the loudness.',
      },
      {
        icon: 'noise_control_off',
        title: 'Reduce noise',
        description: 'Scrub wind and hum out of voice recordings, on your device.',
      },
      {
        icon: 'gif',
        title: 'Video to GIF',
        description: 'Turn a clip into a GIF without leaving the app.',
      },
      {
        icon: 'queue_music',
        title: 'FLAC and CUE',
        description: 'Convert to FLAC, with CUE track splitting and a compression level slider.',
      },
      {
        icon: 'cleaning_services',
        title: 'EXIF and metadata',
        description: 'Clean EXIF from images or a whole folder, and edit tags.',
      },
      {
        icon: 'info',
        title: 'Media info',
        description: 'A plain verdict on any file: codec, resolution, HDR and chapters.',
      },
      {
        icon: 'lock',
        title: 'Offline, no ads',
        description: 'Everything runs on your device. No ads and no tracking.',
      },
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thebytearray.convertit',
    packageId: 'org.thebytearray.convertit',
    requirements: 'Android 7.0+',
    storeCategory: 'MultimediaApplication',
    seoTitle: 'Convertit Pro – Video Compressor with HDR10+ on Android',
    seoDescription:
      'Compress video with HDR10+ metadata intact, and convert audio and images offline on Android. One purchase, no ads or tracking. Android 7.0+.',
    paid: true,
    price: { amount: '5.99', currency: 'USD' },
    privacyPath: '/convertit-pro-privacy/',
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
    seoTitle: 'OpenLoader – Install APKs on Android Devices You Own',
    seoDescription:
      'OpenLoader installs APK files you provide via queue, wireless ADB or Shizuku. Open source GPL-3.0, no analytics, data stays on device. Discontinued.',
    privacyPath: '/openloader-privacy/',
    discontinued: true,
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
    discontinued: true,
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
    signingSha256: 'AB:47:2A:13:FE:1F:CE:B2:F1:86:28:04:95:4D:A8:73:68:F0:52:B0:89:9A:A5:4E:E9:A5:52:BA:69:D7:98:69',
    signingSha1: '91:11:2D:98:FF:F8:07:6C:01:81:FB:B3:AD:83:67:C5:D4:D5:32:D3',
    requirements: 'Android 8.0+',
    storeCategory: 'UtilitiesApplication',
    seoTitle: 'Hy2NG – Hysteria2 VPN Client for Android',
    seoDescription:
      'Hy2NG is a Hysteria2 client for Android: QR import, per-app proxy and VPS setup guide. No ads, no tracking, configs stay on device. Discontinued.',
    privacyPath: '/hy2ng-privacy/',
  },
];

/** The app marked `featured` is shown as a banner, and the ones as cards. */
export const featuredApp = apps.find((app) => app.featured);
export const otherApps = apps.filter((app) => app !== featuredApp);

export function getApp(slug: string): App | undefined {
  return apps.find((app) => app.slug === slug);
}
