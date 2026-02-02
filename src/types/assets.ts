export type Platform = 'android' | 'ios';
export type Framework = 'capacitor' | 'flutter' | 'react-native' | 'native';

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

export interface AssetConfig {
  platforms: Platform[];
  framework: Framework;
  splashBackgroundColor: string;
  isDarkSplash: boolean;
  logoPadding: number;
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

export const ANDROID_ICON_SIZES: IconSize[] = [
  { name: 'mipmap-mdpi', size: 48, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-hdpi', size: 72, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xhdpi', size: 96, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xxhdpi', size: 144, folder: 'android/icons', platform: 'android' },
  { name: 'mipmap-xxxhdpi', size: 192, folder: 'android/icons', platform: 'android' },
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
];
