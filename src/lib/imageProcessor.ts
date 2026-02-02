import {
  ANDROID_ICON_SIZES,
  IOS_ICON_SIZES,
  ANDROID_SPLASH_SIZES,
  IOS_SPLASH_SIZES,
  ANDROID_STUDIO_ICON_SIZES,
  ANDROID_STUDIO_SPLASH_SIZES,
  MACOS_ICON_SIZES,
  WEB_ICON_SIZES,
  TVOS_ICON_SIZES,
  TVOS_TOP_SHELF_SIZES,
  ANDROID_TV_BANNER_SIZES,
  PLAY_STORE_SIZES,
  type Platform,
  type GeneratedAsset,
  type IconConfig,
  type SplashConfig,
  type AndroidStudioOptions,
  type ExtendedIconOptions,
} from '@/types/assets';
import { generateAppIconContentsJson, generateSplashContentsJson } from './iosContentsJson';

export async function generateIconFromConfig(
  config: IconConfig,
  targetSize: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Draw background
    drawIconBackground(ctx, config, targetSize);

    // Apply shape mask
    applyShapeMask(ctx, config.shape, targetSize);

    // Draw content
    const contentReady = drawIconContent(ctx, config, targetSize);

    contentReady.then(() => {
      // Draw badge if enabled
      if (config.hasBadge) {
        drawBadge(ctx, config.badgeColor, targetSize);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  });
}

function drawIconBackground(
  ctx: CanvasRenderingContext2D,
  config: IconConfig,
  size: number
) {
  ctx.save();

  switch (config.backgroundType) {
    case 'color':
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, size, size);
      break;

    case 'gradient': {
      const gradient = createGradient(ctx, config.gradient.direction, size);
      config.gradient.colors.forEach((color, i) => {
        gradient.addColorStop(i / (config.gradient.colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      break;
    }

    case 'mesh': {
      ctx.fillStyle = config.mesh.colors[0];
      ctx.fillRect(0, 0, size, size);

      config.mesh.colors.forEach((color, i) => {
        const x = (i % 2) * size;
        const y = Math.floor(i / 2) * size;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.8);
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      });
      break;
    }

    case 'texture':
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, size, size);
      addNoiseTexture(ctx, size);
      break;

    case 'none':
      // Transparent background
      break;

    case 'image':
      // Will be handled with image loading
      if (config.backgroundImage) {
        const img = new Image();
        img.src = config.backgroundImage;
        ctx.drawImage(img, 0, 0, size, size);
      }
      break;
  }

  ctx.restore();
}

function createGradient(
  ctx: CanvasRenderingContext2D,
  direction: string,
  size: number
): CanvasGradient {
  const coords: Record<string, [number, number, number, number]> = {
    'to-b': [size / 2, 0, size / 2, size],
    'to-t': [size / 2, size, size / 2, 0],
    'to-r': [0, size / 2, size, size / 2],
    'to-l': [size, size / 2, 0, size / 2],
    'to-br': [0, 0, size, size],
    'to-bl': [size, 0, 0, size],
    'to-tr': [0, size, size, 0],
    'to-tl': [size, size, 0, 0],
  };
  const [x0, y0, x1, y1] = coords[direction] || coords['to-br'];
  return ctx.createLinearGradient(x0, y0, x1, y1);
}

function addNoiseTexture(ctx: CanvasRenderingContext2D, size: number) {
  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 20;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyShapeMask(
  ctx: CanvasRenderingContext2D,
  shape: string,
  size: number
) {
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();

  switch (shape) {
    case 'square':
      ctx.rect(0, 0, size, size);
      break;
    case 'squircle': {
      const radius = size * 0.22;
      ctx.roundRect(0, 0, size, size, radius);
      break;
    }
    case 'circle':
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      break;
    case 'themed': {
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2;
      ctx.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
      for (let i = 1; i <= 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      break;
    }
  }

  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}

async function drawIconContent(
  ctx: CanvasRenderingContext2D,
  config: IconConfig,
  size: number
): Promise<void> {
  const padding = config.effect === 'padding' ? config.paddingPercent / 100 : 0;
  const contentSize = size * (1 - padding * 2);
  const offset = size * padding;

  ctx.save();
  ctx.translate(offset, offset);

  switch (config.sourceType) {
    case 'text':
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${contentSize * 0.6}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.sourceValue, contentSize / 2, contentSize / 2);
      break;

    case 'clipart':
      ctx.font = `${contentSize * 0.6}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.sourceValue, contentSize / 2, contentSize / 2);
      break;

    case 'image':
      if (config.sourceValue.startsWith('data:')) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, contentSize, contentSize);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = config.sourceValue;
        });
      }
      break;

    case 'icon':
    default:
      // Draw a simple icon representation
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${contentSize * 0.5}px Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦', contentSize / 2, contentSize / 2);
      break;
  }

  ctx.restore();
  return Promise.resolve();
}

function drawBadge(
  ctx: CanvasRenderingContext2D,
  color: string,
  size: number
) {
  const badgeSize = size * 0.25;
  const x = size - badgeSize - size * 0.05;
  const y = size * 0.05;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + badgeSize / 2, y + badgeSize / 2, badgeSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

export async function generateSplashFromConfig(
  config: SplashConfig,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Draw background
    drawSplashBackground(ctx, config, width, height);

    // Draw content
    drawSplashContent(ctx, config, width, height).then(() => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  });
}

function drawSplashBackground(
  ctx: CanvasRenderingContext2D,
  config: SplashConfig,
  width: number,
  height: number
) {
  switch (config.backgroundType) {
    case 'gradient': {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      config.gradient.colors.forEach((color, i) => {
        gradient.addColorStop(i / (config.gradient.colors.length - 1), color);
      });
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      break;
    }
    case 'image':
      if (config.backgroundImage) {
        const img = new Image();
        img.src = config.backgroundImage;
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    default:
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, width, height);
  }
}

async function drawSplashContent(
  ctx: CanvasRenderingContext2D,
  config: SplashConfig,
  width: number,
  height: number
): Promise<void> {
  const scaleMap = { small: 0.25, medium: 0.4, large: 0.55 };
  const scale = scaleMap[config.scale];
  const maxLogoWidth = width * scale;
  const maxLogoHeight = height * scale * 0.5;

  // Calculate Y position
  let centerY: number;
  switch (config.position) {
    case 'top':
      centerY = height * 0.3;
      break;
    case 'bottom':
      centerY = height * 0.7;
      break;
    default:
      centerY = height / 2;
  }

  // Draw logo
  if (
    (config.contentType === 'logo' || config.contentType === 'logo-text') &&
    config.logoImage
  ) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        let logoWidth = maxLogoWidth;
        let logoHeight = logoWidth / aspectRatio;

        if (logoHeight > maxLogoHeight) {
          logoHeight = maxLogoHeight;
          logoWidth = logoHeight * aspectRatio;
        }

        const logoX = (width - logoWidth) / 2;
        const logoY = centerY - logoHeight / 2 - (config.contentType === 'logo-text' ? 20 : 0);

        ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = config.logoImage!;
    });
  }

  // Draw text
  if (config.contentType === 'text' || config.contentType === 'logo-text') {
    const fontSize = Math.min(width * 0.08, 48);
    ctx.fillStyle = config.textColor;
    ctx.font = `bold ${fontSize}px ${config.textFont}, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textY =
      config.contentType === 'logo-text'
        ? centerY + maxLogoHeight * 0.3
        : centerY;
    ctx.fillText(config.text, width / 2, textY);
  }
}

export async function generateAllIcons(
  config: IconConfig,
  platforms: Platform[],
  onProgress: (current: number, total: number) => void,
  androidStudioOptions?: AndroidStudioOptions,
  extendedIconOptions?: ExtendedIconOptions
): Promise<GeneratedAsset[]> {
  const assets: GeneratedAsset[] = [];
  const useAndroidStudio = androidStudioOptions?.enabled && platforms.includes('android');
  
  const sizes = [
    ...(platforms.includes('android') 
      ? (useAndroidStudio ? ANDROID_STUDIO_ICON_SIZES : ANDROID_ICON_SIZES) 
      : []),
    ...(platforms.includes('ios') ? IOS_ICON_SIZES : []),
  ];

  let totalAssets = sizes.length;
  if (useAndroidStudio) {
    if (androidStudioOptions.generateRoundIcon) totalAssets += ANDROID_STUDIO_ICON_SIZES.length;
    if (androidStudioOptions.generateForeground) totalAssets += ANDROID_STUDIO_ICON_SIZES.length;
    if (androidStudioOptions.generateMonochrome) totalAssets += ANDROID_STUDIO_ICON_SIZES.length;
    if (androidStudioOptions.generateAdaptiveXml) totalAssets += 1;
  }
  
  // Extended icon counts
  if (extendedIconOptions?.macOS) totalAssets += MACOS_ICON_SIZES.length + 1; // +1 for Contents.json
  if (extendedIconOptions?.web) totalAssets += WEB_ICON_SIZES.length + 1; // +1 for manifest
  if (extendedIconOptions?.tvOS) totalAssets += TVOS_ICON_SIZES.length + TVOS_TOP_SHELF_SIZES.length;
  if (extendedIconOptions?.androidTV) totalAssets += ANDROID_TV_BANNER_SIZES.length;
  if (extendedIconOptions?.playStore) totalAssets += PLAY_STORE_SIZES.length;

  let currentAsset = 0;

  for (const sizeConfig of sizes) {
    const blob = await generateIconFromConfig(config, sizeConfig.size);
    
    if (useAndroidStudio && sizeConfig.platform === 'android') {
      // Android Studio format: android/res/folder/filename.png
      assets.push({
        name: `${config.filename || 'ic_launcher'}.png`,
        path: `android/res/${sizeConfig.folder}/${config.filename || 'ic_launcher'}.png`,
        blob,
      });
    } else if (sizeConfig.platform === 'android') {
      // Generic format: android/icons/folder/filename.png
      assets.push({
        name: `${config.filename || 'ic_launcher'}.png`,
        path: `${sizeConfig.folder}/${sizeConfig.name}/${config.filename || 'ic_launcher'}.png`,
        blob,
      });
    } else {
      // iOS format
      assets.push({
        name: `${sizeConfig.name}.png`,
        path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
        blob,
      });
    }
    currentAsset++;
    onProgress(currentAsset, totalAssets);
  }

  // Generate additional Android Studio assets
  if (useAndroidStudio) {
    // Round icons
    if (androidStudioOptions.generateRoundIcon) {
      for (const sizeConfig of ANDROID_STUDIO_ICON_SIZES) {
        const roundConfig = { ...config, shape: 'circle' as const };
        const blob = await generateIconFromConfig(roundConfig, sizeConfig.size);
        assets.push({
          name: `${config.filename || 'ic_launcher'}_round.png`,
          path: `android/res/${sizeConfig.folder}/${config.filename || 'ic_launcher'}_round.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Foreground icons (transparent background)
    if (androidStudioOptions.generateForeground) {
      for (const sizeConfig of ANDROID_STUDIO_ICON_SIZES) {
        const foregroundConfig = { ...config, backgroundType: 'none' as const, shape: 'square' as const };
        const blob = await generateIconFromConfig(foregroundConfig, sizeConfig.size);
        assets.push({
          name: `${config.filename || 'ic_launcher'}_foreground.png`,
          path: `android/res/${sizeConfig.folder}/${config.filename || 'ic_launcher'}_foreground.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Monochrome icons (for Material You theming)
    if (androidStudioOptions.generateMonochrome) {
      for (const sizeConfig of ANDROID_STUDIO_ICON_SIZES) {
        const blob = await generateMonochromeIcon(config, sizeConfig.size);
        assets.push({
          name: `${config.filename || 'ic_launcher'}_monochrome.png`,
          path: `android/res/${sizeConfig.folder}/${config.filename || 'ic_launcher'}_monochrome.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Adaptive icon XML
    if (androidStudioOptions.generateAdaptiveXml) {
      const adaptiveXml = generateAdaptiveIconXml(config, false, androidStudioOptions.generateMonochrome);
      const xmlBlob = new Blob([adaptiveXml], { type: 'application/xml' });
      assets.push({
        name: 'ic_launcher.xml',
        path: `android/res/mipmap-anydpi-v26/ic_launcher.xml`,
        blob: xmlBlob,
      });
      
      // Also add round adaptive icon XML
      const adaptiveRoundXml = generateAdaptiveIconXml(config, true, androidStudioOptions.generateMonochrome);
      const xmlRoundBlob = new Blob([adaptiveRoundXml], { type: 'application/xml' });
      assets.push({
        name: 'ic_launcher_round.xml',
        path: `android/res/mipmap-anydpi-v26/ic_launcher_round.xml`,
        blob: xmlRoundBlob,
      });
      
      currentAsset++;
      onProgress(currentAsset, totalAssets);
    }
  }

  // Generate extended icon formats
  if (extendedIconOptions) {
    // macOS icons
    if (extendedIconOptions.macOS) {
      for (const sizeConfig of MACOS_ICON_SIZES) {
        const macConfig = { ...config, shape: 'squircle' as const };
        const blob = await generateIconFromConfig(macConfig, sizeConfig.size);
        assets.push({
          name: `${sizeConfig.name}.png`,
          path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
      // Add macOS Contents.json
      const macContentsJson = generateMacOSContentsJson();
      assets.push({
        name: 'Contents.json',
        path: 'macos/AppIcon.appiconset/Contents.json',
        blob: new Blob([macContentsJson], { type: 'application/json' }),
      });
      currentAsset++;
      onProgress(currentAsset, totalAssets);
    }

    // Web/PWA icons
    if (extendedIconOptions.web) {
      for (const sizeConfig of WEB_ICON_SIZES) {
        const blob = await generateIconFromConfig(config, sizeConfig.size);
        assets.push({
          name: `${sizeConfig.name}.png`,
          path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
      // Add web manifest
      const webManifest = generateWebManifest();
      assets.push({
        name: 'site.webmanifest',
        path: 'web/site.webmanifest',
        blob: new Blob([webManifest], { type: 'application/json' }),
      });
      currentAsset++;
      onProgress(currentAsset, totalAssets);
    }

    // tvOS icons
    if (extendedIconOptions.tvOS) {
      for (const sizeConfig of TVOS_ICON_SIZES) {
        const blob = await generateIconFromConfig(config, sizeConfig.size);
        assets.push({
          name: `${sizeConfig.name}.png`,
          path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
      // tvOS Top Shelf banners
      for (const bannerSize of TVOS_TOP_SHELF_SIZES) {
        const blob = await generateBannerFromIcon(config, bannerSize.width, bannerSize.height);
        assets.push({
          name: `${bannerSize.name}.png`,
          path: `${bannerSize.folder}/${bannerSize.name}.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Android TV banners
    if (extendedIconOptions.androidTV) {
      for (const bannerSize of ANDROID_TV_BANNER_SIZES) {
        const blob = await generateBannerFromIcon(config, bannerSize.width, bannerSize.height);
        assets.push({
          name: `banner.png`,
          path: `${bannerSize.folder}/banner.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Play Store assets
    if (extendedIconOptions.playStore) {
      for (const bannerSize of PLAY_STORE_SIZES) {
        if (bannerSize.width === bannerSize.height) {
          // Square icon
          const blob = await generateIconFromConfig(config, bannerSize.width);
          assets.push({
            name: `${bannerSize.name}.png`,
            path: `${bannerSize.folder}/${bannerSize.name}.png`,
            blob,
          });
        } else {
          // Feature graphic
          const blob = await generateBannerFromIcon(config, bannerSize.width, bannerSize.height);
          assets.push({
            name: `${bannerSize.name}.png`,
            path: `${bannerSize.folder}/${bannerSize.name}.png`,
            blob,
          });
        }
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }
  }

  // Generate iOS Contents.json
  if (platforms.includes('ios')) {
    const contentsJson = generateAppIconContentsJson(config.filename || 'AppIcon');
    const jsonBlob = new Blob([contentsJson], { type: 'application/json' });
    assets.push({
      name: 'Contents.json',
      path: 'ios/icons/AppIcon.appiconset/Contents.json',
      blob: jsonBlob,
    });
  }

  return assets;
}

function generateAdaptiveIconXml(config: IconConfig, isRound = false, includeMonochrome = false): string {
  const filename = config.filename || 'ic_launcher';
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/${filename}_foreground"/>
    ${includeMonochrome ? `<monochrome android:drawable="@mipmap/${filename}_monochrome"/>` : ''}
</adaptive-icon>`;
}

async function generateMonochromeIcon(config: IconConfig, targetSize: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Transparent background for monochrome icons
    ctx.clearRect(0, 0, targetSize, targetSize);

    // Draw content in white (will be tinted by system)
    const padding = config.effect === 'padding' ? config.paddingPercent / 100 : 0.15;
    const contentSize = targetSize * (1 - padding * 2);
    const offset = targetSize * padding;

    ctx.save();
    ctx.translate(offset, offset);
    ctx.fillStyle = '#FFFFFF';

    switch (config.sourceType) {
      case 'text':
        ctx.font = `bold ${contentSize * 0.6}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, contentSize / 2, contentSize / 2);
        break;
      case 'clipart':
        ctx.font = `${contentSize * 0.6}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, contentSize / 2, contentSize / 2);
        break;
      default:
        ctx.font = `${contentSize * 0.5}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦', contentSize / 2, contentSize / 2);
    }

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

async function generateBannerFromIcon(config: IconConfig, width: number, height: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Draw background
    switch (config.backgroundType) {
      case 'gradient': {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        config.gradient.colors.forEach((color, i) => {
          gradient.addColorStop(i / (config.gradient.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        break;
      }
      default:
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }

    // Draw icon in center
    const iconSize = Math.min(width, height) * 0.6;
    const iconX = (width - iconSize) / 2;
    const iconY = (height - iconSize) / 2;

    ctx.save();
    ctx.translate(iconX, iconY);
    ctx.fillStyle = '#FFFFFF';

    switch (config.sourceType) {
      case 'text':
        ctx.font = `bold ${iconSize * 0.5}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, iconSize / 2, iconSize / 2);
        break;
      case 'clipart':
        ctx.font = `${iconSize * 0.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.sourceValue, iconSize / 2, iconSize / 2);
        break;
      default:
        ctx.font = `${iconSize * 0.4}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦', iconSize / 2, iconSize / 2);
    }

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

function generateMacOSContentsJson(): string {
  const images = MACOS_ICON_SIZES.map((size) => ({
    filename: `${size.name}.png`,
    idiom: 'mac',
    scale: size.name.includes('@2x') ? '2x' : '1x',
    size: `${size.name.includes('@2x') ? size.size / 2 : size.size}x${size.name.includes('@2x') ? size.size / 2 : size.size}`,
  }));

  return JSON.stringify({ images, info: { author: 'SplashCraft', version: 1 } }, null, 2);
}

function generateWebManifest(): string {
  return JSON.stringify({
    name: 'My App',
    short_name: 'App',
    icons: [
      { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'maskable-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: 'maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    theme_color: '#3B82F6',
    background_color: '#ffffff',
    display: 'standalone',
  }, null, 2);
}

function generateLaunchBackgroundXml(backgroundColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_icon"/>
    </item>
</layer-list>`;
}

function generateColorsXml(iconBgColor: string, splashBgColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${iconBgColor}</color>
    <color name="splash_background">${splashBgColor}</color>
</resources>`;
}

export async function generateAllSplashScreens(
  config: SplashConfig,
  platforms: Platform[],
  onProgress: (current: number, total: number) => void,
  androidStudioOptions?: AndroidStudioOptions
): Promise<GeneratedAsset[]> {
  const assets: GeneratedAsset[] = [];
  const useAndroidStudio = androidStudioOptions?.enabled && platforms.includes('android');
  
  const sizes = [
    ...(platforms.includes('android') 
      ? (useAndroidStudio ? ANDROID_STUDIO_SPLASH_SIZES : ANDROID_SPLASH_SIZES) 
      : []),
    ...(platforms.includes('ios') ? IOS_SPLASH_SIZES : []),
  ];

  let totalAssets = sizes.length;
  if (useAndroidStudio && androidStudioOptions.generateSplashXml) {
    totalAssets += 2; // launch_background.xml and colors.xml
  }

  let currentAsset = 0;

  for (const sizeConfig of sizes) {
    const blob = await generateSplashFromConfig(
      config,
      sizeConfig.width,
      sizeConfig.height
    );
    
    if (useAndroidStudio && sizeConfig.platform === 'android') {
      // Android Studio format with android/res/ prefix
      assets.push({
        name: `${sizeConfig.name}.png`,
        path: `android/res/${sizeConfig.folder}/${sizeConfig.name}.png`,
        blob,
      });
    } else {
      assets.push({
        name: `${sizeConfig.name}.png`,
        path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
        blob,
      });
    }
    currentAsset++;
    onProgress(currentAsset, totalAssets);
  }

  // Generate Android 12+ splash XML files
  if (useAndroidStudio && androidStudioOptions.generateSplashXml) {
    const launchBackgroundXml = generateLaunchBackgroundXml(config.backgroundColor);
    const xmlBlob = new Blob([launchBackgroundXml], { type: 'application/xml' });
    assets.push({
      name: 'launch_background.xml',
      path: 'android/res/drawable-v24/launch_background.xml',
      blob: xmlBlob,
    });
    
    // Generate colors.xml
    const colorsXml = generateColorsXml('#3B82F6', config.backgroundColor);
    const colorsBlob = new Blob([colorsXml], { type: 'application/xml' });
    assets.push({
      name: 'colors.xml',
      path: 'android/res/values/colors.xml',
      blob: colorsBlob,
    });
    
    currentAsset += 2;
    onProgress(currentAsset, totalAssets);
  }

  // Generate iOS splash Contents.json
  if (platforms.includes('ios')) {
    const contentsJson = generateSplashContentsJson();
    const jsonBlob = new Blob([contentsJson], { type: 'application/json' });
    assets.push({
      name: 'Contents.json',
      path: 'ios/splash/LaunchImage.launchimage/Contents.json',
      blob: jsonBlob,
    });
  }

  return assets;
}

export function loadImage(file: File): Promise<{
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          file,
          dataUrl,
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
