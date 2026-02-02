export type Platform = 'android' | 'ios';
export type Framework = 'capacitor' | 'flutter' | 'react-native' | 'native';

// Icon Source Types
export type IconSourceType = 'icon' | 'clipart' | 'text' | 'image';

// Icon Scaling
export type ScalingMode = 'center' | 'crop' | 'mask';

// Icon Effect
export type IconEffect = 'none' | 'padding';

// Background Types
export type BackgroundType = 'color' | 'gradient' | 'mesh' | 'image' | 'texture' | 'none';

// Icon Shapes
export type IconShape = 'square' | 'squircle' | 'circle' | 'themed';

// Gradient Direction
export type GradientDirection = 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';

// Splash Position
export type SplashPosition = 'center' | 'top' | 'bottom';

// Splash Scale
export type SplashScale = 'small' | 'medium' | 'large';

// Splash Content Type
export type SplashContentType = 'logo' | 'text' | 'logo-text';

export interface GradientConfig {
  colors: string[];
  direction: GradientDirection;
}

export interface MeshConfig {
  colors: string[];
}

export interface IconConfig {
  sourceType: IconSourceType;
  sourceValue: string; // icon name, text, or image data URL
  scalingMode: ScalingMode;
  effect: IconEffect;
  paddingPercent: number;
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradient: GradientConfig;
  mesh: MeshConfig;
  backgroundImage: string | null;
  texture: string;
  shape: IconShape;
  hasBadge: boolean;
  badgeColor: string;
  filename: string;
  // Adaptive icon support
  useAdaptiveIcon: boolean;
  adaptiveForeground: string | null;
  adaptiveBackground: string | null;
  adaptiveBackgroundType: 'color' | 'gradient' | 'image';
  adaptiveBackgroundColor: string;
  adaptiveBackgroundGradient: GradientConfig;
}

export interface SplashConfig {
  contentType: SplashContentType;
  logoImage: string | null;
  text: string;
  textColor: string;
  textFont: string;
  position: SplashPosition;
  scale: SplashScale;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundColor: string;
  gradient: GradientConfig;
  backgroundImage: string | null;
}

export interface IconSize {
  name: string;
  size: number;
  folder: string;
  platform: Platform;
}

export interface SplashSize {
  name: string;
  width: number;
  height: number;
  folder: string;
  platform: Platform;
}

export interface AndroidStudioOptions {
  enabled: boolean;
  generateRoundIcon: boolean;
  generateForeground: boolean;
  generateMonochrome: boolean;
  generateAdaptiveXml: boolean;
  generateSplashXml: boolean;
}

export const DEFAULT_ANDROID_STUDIO_OPTIONS: AndroidStudioOptions = {
  enabled: false,
  generateRoundIcon: true,
  generateForeground: true,
  generateMonochrome: true,
  generateAdaptiveXml: true,
  generateSplashXml: true,
};

export interface ExtendedIconOptions {
  macOS: boolean;
  web: boolean;
  tvOS: boolean;
  androidTV: boolean;
  playStore: boolean;
}

export const DEFAULT_EXTENDED_ICON_OPTIONS: ExtendedIconOptions = {
  macOS: false,
  web: false,
  tvOS: false,
  androidTV: false,
  playStore: false,
};

// macOS icon sizes (for .icns generation)
export const MACOS_ICON_SIZES: IconSize[] = [
  { name: 'icon_16x16', size: 16, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_16x16@2x', size: 32, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_32x32', size: 32, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_32x32@2x', size: 64, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_128x128', size: 128, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_128x128@2x', size: 256, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_256x256', size: 256, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_256x256@2x', size: 512, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_512x512', size: 512, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
  { name: 'icon_512x512@2x', size: 1024, folder: 'macos/AppIcon.appiconset', platform: 'ios' },
];

// Web/PWA icon sizes
export const WEB_ICON_SIZES: IconSize[] = [
  { name: 'favicon-16x16', size: 16, folder: 'web', platform: 'ios' },
  { name: 'favicon-32x32', size: 32, folder: 'web', platform: 'ios' },
  { name: 'favicon-48x48', size: 48, folder: 'web', platform: 'ios' },
  { name: 'apple-touch-icon', size: 180, folder: 'web', platform: 'ios' },
  { name: 'icon-192x192', size: 192, folder: 'web', platform: 'ios' },
  { name: 'icon-512x512', size: 512, folder: 'web', platform: 'ios' },
  { name: 'maskable-icon-192', size: 192, folder: 'web', platform: 'ios' },
  { name: 'maskable-icon-512', size: 512, folder: 'web', platform: 'ios' },
];

// tvOS icon sizes
export const TVOS_ICON_SIZES: IconSize[] = [
  { name: 'App Icon - App Store 1x', size: 1280, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets', platform: 'ios' },
  { name: 'App Icon - Small 1x', size: 400, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets', platform: 'ios' },
  { name: 'App Icon - Small 2x', size: 800, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets', platform: 'ios' },
];

// tvOS Top Shelf sizes (these are banners, not square icons)
export interface BannerSize {
  name: string;
  width: number;
  height: number;
  folder: string;
}

export const TVOS_TOP_SHELF_SIZES: BannerSize[] = [
  { name: 'Top Shelf Image 1x', width: 1920, height: 720, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets' },
  { name: 'Top Shelf Image 2x', width: 3840, height: 1440, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets' },
  { name: 'Top Shelf Wide 1x', width: 2320, height: 720, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets' },
  { name: 'Top Shelf Wide 2x', width: 4640, height: 1440, folder: 'tvos/Assets.xcassets/App Icon & Top Shelf Image.brandassets' },
];

// Android TV banner sizes
export const ANDROID_TV_BANNER_SIZES: BannerSize[] = [
  { name: 'banner-xhdpi', width: 320, height: 180, folder: 'android-tv/drawable-xhdpi' },
  { name: 'banner-xxhdpi', width: 480, height: 270, folder: 'android-tv/drawable-xxhdpi' },
  { name: 'banner-xxxhdpi', width: 640, height: 360, folder: 'android-tv/drawable-xxxhdpi' },
];

// Play Store assets
export const PLAY_STORE_SIZES: BannerSize[] = [
  { name: 'feature-graphic', width: 1024, height: 500, folder: 'play-store' },
  { name: 'hi-res-icon', width: 512, height: 512, folder: 'play-store' },
];

export interface AssetConfig {
  platforms: Platform[];
  framework: Framework;
  iconConfig: IconConfig;
  splashConfig: SplashConfig;
  androidStudioOptions: AndroidStudioOptions;
}

export interface UploadedImage {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export interface GeneratedAsset {
  name: string;
  path: string;
  blob: Blob;
}

export const DEFAULT_ICON_CONFIG: IconConfig = {
  sourceType: 'icon',
  sourceValue: 'Sparkles',
  scalingMode: 'center',
  effect: 'padding',
  paddingPercent: 15,
  backgroundType: 'gradient',
  backgroundColor: '#3B82F6',
  gradient: {
    colors: ['#3B82F6', '#8B5CF6'],
    direction: 'to-br',
  },
  mesh: {
    colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981'],
  },
  backgroundImage: null,
  texture: 'noise',
  shape: 'squircle',
  hasBadge: false,
  badgeColor: '#EF4444',
  filename: 'ic_launcher',
  useAdaptiveIcon: false,
  adaptiveForeground: null,
  adaptiveBackground: null,
  adaptiveBackgroundType: 'color',
  adaptiveBackgroundColor: '#3B82F6',
  adaptiveBackgroundGradient: {
    colors: ['#3B82F6', '#8B5CF6'],
    direction: 'to-br',
  },
};

export const DEFAULT_SPLASH_CONFIG: SplashConfig = {
  contentType: 'logo',
  logoImage: null,
  text: 'My App',
  textColor: '#FFFFFF',
  textFont: 'Inter',
  position: 'center',
  scale: 'medium',
  backgroundType: 'color',
  backgroundColor: '#3B82F6',
  gradient: {
    colors: ['#3B82F6', '#8B5CF6'],
    direction: 'to-b',
  },
  backgroundImage: null,
};

export const ANDROID_ICON_SIZES: IconSize[] = [
  { name: 'mipmap-mdpi', size: 48, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-hdpi', size: 72, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xhdpi', size: 96, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xxhdpi', size: 144, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xxxhdpi', size: 192, folder: 'android/icons', platform: 'android' },
];

// Android Studio proper folder structure
export const ANDROID_STUDIO_ICON_SIZES: IconSize[] = [
  { name: 'ic_launcher', size: 48, folder: 'mipmap-mdpi', platform: 'android' },
  { name: 'ic_launcher', size: 72, folder: 'mipmap-hdpi', platform: 'android' },
  { name: 'ic_launcher', size: 96, folder: 'mipmap-xhdpi', platform: 'android' },
  { name: 'ic_launcher', size: 144, folder: 'mipmap-xxhdpi', platform: 'android' },
  { name: 'ic_launcher', size: 192, folder: 'mipmap-xxxhdpi', platform: 'android' },
];

export const ANDROID_STUDIO_SPLASH_SIZES: SplashSize[] = [
  // Portrait
  { name: 'splash', width: 240, height: 320, folder: 'drawable-port-ldpi', platform: 'android' },
  { name: 'splash', width: 320, height: 480, folder: 'drawable-port-mdpi', platform: 'android' },
  { name: 'splash', width: 480, height: 800, folder: 'drawable-port-hdpi', platform: 'android' },
  { name: 'splash', width: 720, height: 1280, folder: 'drawable-port-xhdpi', platform: 'android' },
  { name: 'splash', width: 960, height: 1600, folder: 'drawable-port-xxhdpi', platform: 'android' },
  { name: 'splash', width: 1280, height: 1920, folder: 'drawable-port-xxxhdpi', platform: 'android' },
  // Landscape
  { name: 'splash', width: 320, height: 240, folder: 'drawable-land-ldpi', platform: 'android' },
  { name: 'splash', width: 480, height: 320, folder: 'drawable-land-mdpi', platform: 'android' },
  { name: 'splash', width: 800, height: 480, folder: 'drawable-land-hdpi', platform: 'android' },
  { name: 'splash', width: 1280, height: 720, folder: 'drawable-land-xhdpi', platform: 'android' },
  { name: 'splash', width: 1600, height: 960, folder: 'drawable-land-xxhdpi', platform: 'android' },
  { name: 'splash', width: 1920, height: 1280, folder: 'drawable-land-xxxhdpi', platform: 'android' },
];

export const IOS_ICON_SIZES: IconSize[] = [
  { name: 'Icon-20@1x', size: 20, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-20@2x', size: 40, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-20@3x', size: 60, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-29@1x', size: 29, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-29@2x', size: 58, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-29@3x', size: 87, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-40@1x', size: 40, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-40@2x', size: 80, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-40@3x', size: 120, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-60@2x', size: 120, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-60@3x', size: 180, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-76@1x', size: 76, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-76@2x', size: 152, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-83.5@2x', size: 167, folder: 'ios/icons', platform: 'ios' },
  { name: 'Icon-1024', size: 1024, folder: 'ios/icons', platform: 'ios' },
];

export const ANDROID_SPLASH_SIZES: SplashSize[] = [
  { name: 'splash-port-mdpi', width: 320, height: 480, folder: 'android/splash', platform: 'android' },
  { name: 'splash-port-hdpi', width: 480, height: 800, folder: 'android/splash', platform: 'android' },
  { name: 'splash-port-xhdpi', width: 720, height: 1280, folder: 'android/splash', platform: 'android' },
  { name: 'splash-port-xxhdpi', width: 960, height: 1600, folder: 'android/splash', platform: 'android' },
  { name: 'splash-port-xxxhdpi', width: 1280, height: 1920, folder: 'android/splash', platform: 'android' },
  { name: 'splash-land-mdpi', width: 480, height: 320, folder: 'android/splash', platform: 'android' },
  { name: 'splash-land-hdpi', width: 800, height: 480, folder: 'android/splash', platform: 'android' },
  { name: 'splash-land-xhdpi', width: 1280, height: 720, folder: 'android/splash', platform: 'android' },
  { name: 'splash-land-xxhdpi', width: 1600, height: 960, folder: 'android/splash', platform: 'android' },
  { name: 'splash-land-xxxhdpi', width: 1920, height: 1280, folder: 'android/splash', platform: 'android' },
];

export const IOS_SPLASH_SIZES: SplashSize[] = [
  { name: 'Default@2x~iphone', width: 640, height: 1136, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-568h@2x~iphone', width: 640, height: 1136, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-667h@2x~iphone', width: 750, height: 1334, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-736h@3x~iphone', width: 1242, height: 2208, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-812h@3x~iphone', width: 1125, height: 2436, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-896h@2x~iphone', width: 828, height: 1792, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-896h@3x~iphone', width: 1242, height: 2688, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-1024h@2x~ipad', width: 1536, height: 2048, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-1366h@2x~ipad', width: 2048, height: 2732, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-Landscape-667h@2x', width: 1334, height: 750, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-Landscape-736h@3x', width: 2208, height: 1242, folder: 'ios/splash', platform: 'ios' },
  { name: 'Default-Landscape-1024h@2x', width: 2048, height: 1536, folder: 'ios/splash', platform: 'ios' },
];

// Popular Lucide icons for the icon library
export const ICON_LIBRARY = [
  'Sparkles', 'Star', 'Heart', 'Zap', 'Flame', 'Rocket', 'Music', 'Camera',
  'ShoppingCart', 'MessageCircle', 'Bell', 'Settings', 'Home', 'User', 'Mail',
  'Phone', 'Calendar', 'Clock', 'Map', 'Gift', 'Bookmark', 'Award', 'Trophy',
  'Target', 'Compass', 'Sun', 'Moon', 'Cloud', 'Umbrella', 'Coffee', 'Pizza',
  'Gamepad2', 'Headphones', 'Mic', 'Video', 'Image', 'Palette', 'Brush', 'Pen',
  'Code', 'Terminal', 'Database', 'Globe', 'Wifi', 'Battery', 'Shield', 'Lock',
  'Key', 'CreditCard', 'Wallet', 'PiggyBank', 'TrendingUp', 'BarChart', 'Activity',
  'Dumbbell', 'Bike', 'Car', 'Plane', 'Ship', 'Train', 'Bus', 'Building',
];

export const TEXTURE_OPTIONS = ['noise', 'dots', 'lines', 'grid', 'waves'];
