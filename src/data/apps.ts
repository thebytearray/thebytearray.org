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

export interface AppFaq {
  question: string;
  /** Plain text: it is also published as schema.org FAQPage data. */
  answer: string;
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
  /** Who the app is for, finishing "Pick it if…". Shown where the live apps are compared. */
  bestFor?: string;
  /** The strongest facts about the app, shown where the live apps are compared. */
  highlights?: string[];
  /**
   * Questions people ask about the app, answered from facts on this page and
   * in its guides. Shown on the app page, in its Markdown copy and as FAQPage data.
   */
  faqs?: AppFaq[];
  /** Blog posts that explain the app in depth. */
  guides?: { title: string; path: `/${string}/` }[];
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
   * Paid app. Its Google Play prices are listed in src/lib/prices.ts, so a
   * "pay once" app is never described to search engines as free.
   */
  paid?: boolean;
  /** Kept at the legacy URL: store listings link to it. */
  privacyPath?: `/${string}/`;
  /** App-specific terms of service, when the app has its own. */
  termsPath?: `/${string}/`;
  /** App is discontinued and no longer available for install. */
  discontinued?: boolean;
}

export const apps: App[] = [
  {
    slug: 'convertit',
    video: { id: 'y99jlwEYT5k', title: 'Convertit promo video', uploadDate: '2026-10-13T05:28:10-07:00' },
    name: 'Convertit',
    tagline: 'Offline audio and video converter for Android',
    summary: 'An offline audio and video converter for Android, with no ads.',
    description:
      'Convertit is an offline audio and video converter for Android. Pick a file and a format (MP3, M4A, AAC, OGG, OPUS, WMA, MKA, SPX or AMR), and it converts in the background. It shows no ads.',
    icon: convertitIcon,
    iconFile: 'src/assets/apps/convertit/icon.png',
    screenshots: [
      { src: convertitConvert, alt: 'Convert audio and video: one tap to start, no clutter' },
      { src: convertitFormats, alt: 'Pick the format, done: MP3, M4A, AAC, OGG and OPUS' },
      { src: convertitBackground, alt: 'Keeps going in the background: queue files and carry on' },
      { src: convertitLibrary, alt: 'Everything you converted: open or share in a tap' },
      { src: convertitTags, alt: 'Fix the tags: title, cover art and other details' },
    ],
    features: [
      {
        icon: 'graphic_eq',
        title: 'Audio and video',
        description: 'Start a conversion with a single tap.',
      },
      {
        icon: 'tune',
        title: 'Pick the format',
        description: 'MP3, M4A, AAC, OGG, OPUS, WMA, MKA, SPX and AMR.',
      },
      {
        icon: 'playlist_add',
        title: 'Keeps going in the background',
        description: 'Queue several files and carry on with something else.',
      },
      {
        icon: 'folder_open',
        title: 'Library',
        description: 'Open or share any converted file in a tap.',
      },
      {
        icon: 'sell',
        title: 'Fix the tags',
        description: 'Edit the title, cover art and other details of an audio file.',
      },
      {
        icon: 'wifi_off',
        title: 'Offline, no ads',
        description: 'Your files are converted on your device, and the app shows no ads.',
      },
    ],
    bestFor: 'you want to convert audio, or save the audio from a video, for free.',
    highlights: [
      '9 audio formats, including MP3, M4A and OPUS',
      'Edit audio tags such as the title and cover art',
      'Speed audio up or slow it down, from 0.5x to 2x',
      'Queue files and keep converting in the background',
    ],
    faqs: [
      {
        question: 'Is Convertit free?',
        answer: 'Yes. Convertit is free on Google Play and shows no ads. It needs no account.',
      },
      {
        question: 'Why is Convertit free?',
        answer:
          'We want to make a real difference in how people convert audio on their phones, without nagging you or pushing you to pay. Convertit has no permission to use the internet, so it cannot send your files or data anywhere, and we never sell data. The free features stay free. If you want to support our work and get the advanced tools, you can buy Convertit Pro.',
      },
      {
        question: 'Which formats can Convertit convert to?',
        answer:
          'Convertit takes audio or video files and saves the result as MP3, M4A, AAC, OGG, OPUS, WMA, MKA, SPX or AMR. You can choose the bitrate and sample rate, change the playback speed from 0.5x to 2x, and queue several files while it keeps converting in the background.',
      },
      {
        question: 'Does Convertit upload my files?',
        answer:
          'No. Files are converted offline on your phone and are never uploaded. The app has no ads and no tracking.',
      },
      {
        question: 'Can Convertit edit audio tags?',
        answer: 'Yes. You can edit the title, cover art and other tags of a converted file.',
      },
      {
        question: 'Which Android versions does Convertit support?',
        answer: 'Android 7.0 and newer.',
      },
      {
        question: 'What does Convertit Pro add?',
        answer:
          'Convertit Pro is the paid version. It adds video compression with H.264, H.265, VP9 and AV1, HDR and HDR10+ preservation, video stabilization, 13 audio formats including FLAC and ALAC, loudness normalization, noise reduction, a five-band equalizer, a ringtone maker, image conversion from formats such as HEIC, EXIF cleaning and media info.',
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
    termsPath: '/convertit-terms/',
  },
  {
    slug: 'convertit-pro',
    video: { id: 'MDA3KWgDElg', title: 'Convertit Pro promo video', uploadDate: '2026-10-24T12:46:49-07:00' },
    name: 'Convertit Pro',
    tagline: 'Audio, video and image tools for Android. One purchase covers the tools listed below.',
    summary: 'Audio, video and image tools for Android. Offline, no ads, pay once.',
    description:
      'Convertit Pro is the paid version of Convertit. One purchase unlocks the 14 tools listed under What it does on this page: audio, video and image conversion, video to GIF, video compression, video stabilization, noise reduction, an equalizer, volume leveling, a ringtone maker, EXIF cleaning for images and folders, metadata editing and media info. Future new tools may be separate and will be listed here before any charge. It runs offline and shows no ads.',
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
        icon: 'compress',
        title: 'Compress video',
        description:
          'Shrink videos with H.264, H.265, VP9 or AV1, in MP4, MKV, WebM and five other formats. Compress several at once.',
      },
      {
        icon: 'movie',
        title: 'HDR kept',
        description: 'Keeps HDR10, HLG and HDR10+ when compressing, so HDR video still looks right.',
      },
      {
        icon: 'video_stable',
        title: 'Stabilize video',
        description: 'Smooth out shaky footage. Set how strong the shake is, the zoom and how the borders are filled.',
      },
      {
        icon: 'audio_file',
        title: 'Convert audio and video',
        description:
          '13 audio formats, including lossless FLAC and ALAC, with CUE track splitting and silence removal. Videos convert to other formats too.',
      },
      {
        icon: 'crop',
        title: 'Trim and normalize',
        description: 'Cut audio and video to the part you need, and even out the loudness with EBU R128.',
      },
      {
        icon: 'gif',
        title: 'Video to GIF',
        description: 'Turn a clip into a GIF. Pick the size, the frame rate (5 to 20 fps) and the speed (0.5x to 8x).',
      },
      {
        icon: 'image',
        title: 'Convert images',
        description: 'Convert HEIC, AVIF, WebP, PNG and JPG, or save as PDF, SVG or ICO, with a quality slider.',
      },
      {
        icon: 'noise_control_off',
        title: 'Reduce noise',
        description: 'Scrub wind and hum out of voice recordings with an on-device AI model.',
      },
      {
        icon: 'equalizer',
        title: 'Equalizer',
        description: 'Five bands, from deep bass to air, with presets for more bass, more treble or clearer voice.',
      },
      {
        icon: 'graphic_eq',
        title: 'Level volume (beta)',
        description: 'Bring a file to a steady volume, with one target for voice and one for other audio.',
      },
      {
        icon: 'notifications_active',
        title: 'Ringtone maker',
        description: 'Trim a clip and set it as your ringtone, notification sound or alarm in one step.',
      },
      {
        icon: 'cleaning_services',
        title: 'EXIF and metadata',
        description: 'Clean EXIF from a few images or a whole folder, and edit the tags of any file.',
      },
      {
        icon: 'info',
        title: 'Media info',
        description: 'A plain verdict on any file: codec, resolution, HDR and chapters, plus the full report.',
      },
      {
        icon: 'lock',
        title: 'Offline, no ads',
        description: 'Everything runs on your device. The app has no permission to use the internet.',
      },
    ],
    bestFor: 'you need smaller videos, lossless audio or image conversion, and would rather pay once than subscribe.',
    highlights: [
      'Compress video with H.264, H.265, VP9 or AV1',
      'Keeps HDR10, HLG and HDR10+ when compressing',
      '13 audio formats, including lossless FLAC and ALAC',
      'Noise reduction, loudness normalization and HEIC conversion',
    ],
    faqs: [
      {
        question: 'How much does Convertit Pro cost?',
        answer:
          'Convertit Pro is a one-time purchase on Google Play, with no subscription and no ads. Google Play sets the price for each country, and the current prices are listed with the app details on this page. One purchase unlocks the 14 tools listed on this page. Future new tools may be separate and will be listed here before any charge.',
      },
      {
        question: 'Does Convertit Pro upload my files?',
        answer:
          'No. Every tool runs offline on your phone, so videos, audio and images are never uploaded. There are no ads, no tracking and no account.',
      },
      {
        question: 'Which codecs and formats can the video compressor use?',
        answer:
          'Four codecs: H.264, H.265 (HEVC), VP9 and AV1. AV1 can use the phone’s hardware encoder where there is one, or libaom or SVT-AV1 on the CPU. Output containers are MP4, MKV, AVI, MOV, WebM, 3GP, FLV and WMV. The Small, Medium and Large levels pick the size for you, or you can set the resolution, quality, frame rate or exact bitrate yourself, and several videos can be compressed at once.',
      },
      {
        question: 'Does Convertit Pro keep HDR when compressing video?',
        answer:
          'Yes. Preserve HDR keeps HDR10 or HLG colour and 10-bit depth with H.265 in MP4 on phones that support HDR encoding, with VP9 and with AV1. Preserve HDR10+ also keeps the per-frame HDR10+ brightness metadata. Dolby Vision is saved as H.265 with standard HDR (HLG or PQ). With Preserve HDR off, the video is converted to SDR colour.',
      },
      {
        question: 'Which audio formats does Convertit Pro support?',
        answer:
          '13 output formats: MP3, M4A, AAC, OGG, Opus, WMA, MKA, SPX and AMR (lossy), FLAC and ALAC (lossless) and WAV and AIFF (uncompressed). FLAC has a compression level from 0 to 12. The converter also offers CBR, VBR and ABR, playback speed from 0.5x to 2x, trimming, silence removal, a five-band equalizer, EBU R128 loudness normalization and CUE sheet track splitting.',
      },
      {
        question: 'What else can Convertit Pro do besides convert and compress?',
        answer:
          'It stabilizes shaky video, reduces wind and hum noise in voice recordings with an on-device DeepFilterNet model, applies a five-band equalizer, levels volume (in beta), turns video clips into GIFs and makes ringtones that it can set as your ringtone, notification or alarm sound. It converts images between HEIC, HEIF, AVIF, WebP, PNG, JPG and BMP, or to PDF, SVG and ICO. It also cleans EXIF data from single images or whole folders, edits tags and shows a plain-language summary of any media file: codec, resolution, HDR and chapters.',
      },
      {
        question: 'What is the difference between Convertit and Convertit Pro?',
        answer:
          'Convertit is free and converts audio and video to nine audio formats, including MP3, M4A and OPUS, with tag editing. Convertit Pro is paid once and adds video compression and stabilization, HDR preservation, lossless audio, loudness, noise and equalizer tools, a ringtone maker, image conversion, EXIF cleaning and media info.',
      },
      {
        question: 'Which Android versions does Convertit Pro support?',
        answer: 'Android 7.0 and newer. H.265 compression needs a phone with an H.265 encoder, which most phones from Android 10 onwards have.',
      },
    ],
    guides: [
      { title: 'How the video compressor in Convertit Pro works', path: '/blog/convertit-pro-video-compressor-guide/' },
      { title: 'How the audio converter in Convertit Pro works', path: '/blog/convertit-pro-audio-converter-guide/' },
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=org.thebytearray.convertit',
    packageId: 'org.thebytearray.convertit',
    requirements: 'Android 7.0+',
    storeCategory: 'MultimediaApplication',
    seoTitle: 'Convertit Pro – Video Compressor with HDR10+ on Android',
    seoDescription:
      'Compress video with HDR10+ metadata intact, and convert audio and images offline on Android. One purchase, no ads or tracking. Android 7.0+.',
    paid: true,
    privacyPath: '/convertit-pro-privacy/',
    termsPath: '/convertit-pro-terms/',
  },
  {
    slug: 'openloader',
    name: 'OpenLoader',
    tagline: 'Install APKs on the Android devices you own',
    summary: 'Sideload APK files you already have, one at a time or as a queue, to one device or several.',
    description:
      'OpenLoader is an APK installer for Android, designed for Android developers. It installs APK files outside an app store, supports install queues and installation to several devices over wireless ADB, and can use Shizuku for privileged installs when access is granted. It is open source under GPL-3.0.',
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
      'Hy2NG is a Hysteria2 client for Android. Configurations can be imported from a QR code or the clipboard, individual apps can be routed through the tunnel, and a built-in guide assists with setting up a VPS. It has no ads and no tracking.',
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
