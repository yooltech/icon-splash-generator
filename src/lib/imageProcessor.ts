import {
  ANDROID_ICON_SIZES,
  IOS_ICON_SIZES,
  ANDROID_SPLASH_SIZES,
  IOS_SPLASH_SIZES,
  ANDROID_STUDIO_ICON_SIZES,
  ANDROID_STUDIO_SPLASH_SIZES,
  type Platform,
  type GeneratedAsset,
  type IconConfig,
  type SplashConfig,
  type AndroidStudioOptions,
} from '@/types/assets';

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
  androidStudioOptions?: AndroidStudioOptions
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
    if (androidStudioOptions.generateAdaptiveXml) totalAssets += 1;
  }

  let currentAsset = 0;

  for (const sizeConfig of sizes) {
    const blob = await generateIconFromConfig(config, sizeConfig.size);
    
    if (useAndroidStudio && sizeConfig.platform === 'android') {
      // Android Studio format: folder/filename.png
      assets.push({
        name: `${config.filename || 'ic_launcher'}.png`,
        path: `${sizeConfig.folder}/${config.filename || 'ic_launcher'}.png`,
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
          path: `${sizeConfig.folder}/${config.filename || 'ic_launcher'}_round.png`,
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
          path: `${sizeConfig.folder}/${config.filename || 'ic_launcher'}_foreground.png`,
          blob,
        });
        currentAsset++;
        onProgress(currentAsset, totalAssets);
      }
    }

    // Adaptive icon XML
    if (androidStudioOptions.generateAdaptiveXml) {
      const adaptiveXml = generateAdaptiveIconXml(config);
      const xmlBlob = new Blob([adaptiveXml], { type: 'application/xml' });
      assets.push({
        name: 'ic_launcher.xml',
        path: `mipmap-anydpi-v26/ic_launcher.xml`,
        blob: xmlBlob,
      });
      
      // Also add round adaptive icon XML
      const adaptiveRoundXml = generateAdaptiveIconXml(config, true);
      const xmlRoundBlob = new Blob([adaptiveRoundXml], { type: 'application/xml' });
      assets.push({
        name: 'ic_launcher_round.xml',
        path: `mipmap-anydpi-v26/ic_launcher_round.xml`,
        blob: xmlRoundBlob,
      });
      
      currentAsset++;
      onProgress(currentAsset, totalAssets);
    }
  }

  return assets;
}

function generateAdaptiveIconXml(config: IconConfig, isRound = false): string {
  const filename = config.filename || 'ic_launcher';
  return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/${filename}_foreground"/>
    ${isRound ? '<monochrome android:drawable="@mipmap/' + filename + '_foreground"/>' : ''}
</adaptive-icon>`;
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
      // Android Studio format
      assets.push({
        name: `${sizeConfig.name}.png`,
        path: `${sizeConfig.folder}/${sizeConfig.name}.png`,
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
      path: 'drawable-v24/launch_background.xml',
      blob: xmlBlob,
    });
    
    // Generate colors.xml
    const colorsXml = generateColorsXml('#3B82F6', config.backgroundColor);
    const colorsBlob = new Blob([colorsXml], { type: 'application/xml' });
    assets.push({
      name: 'colors.xml',
      path: 'values/colors.xml',
      blob: colorsBlob,
    });
    
    currentAsset += 2;
    onProgress(currentAsset, totalAssets);
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
