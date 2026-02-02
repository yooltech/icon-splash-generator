import { IOS_ICON_SIZES, IOS_SPLASH_SIZES } from '@/types/assets';

interface ContentsImageEntry {
  filename: string;
  idiom: string;
  scale: string;
  size: string;
}

interface ContentsJson {
  images: ContentsImageEntry[];
  info: {
    author: string;
    version: number;
  };
}

// Map iOS icon sizes to their idiom and scale
function getIconIdiomAndScale(name: string, size: number): { idiom: string; scale: string; size: string } {
  // Parse the name pattern like "Icon-20@2x" or "Icon-1024"
  const match = name.match(/Icon-(\d+\.?\d*)(?:@(\d)x)?/);
  if (!match) {
    return { idiom: 'universal', scale: '1x', size: `${size}x${size}` };
  }

  const baseSize = parseFloat(match[1]);
  const scaleMultiplier = match[2] ? parseInt(match[2]) : 1;
  const scaleStr = `${scaleMultiplier}x`;

  // Determine idiom based on size
  let idiom = 'iphone';
  if (baseSize >= 76 || name.includes('ipad')) {
    idiom = 'ipad';
  }
  if (baseSize === 1024) {
    idiom = 'ios-marketing';
  }

  return {
    idiom,
    scale: scaleStr,
    size: `${baseSize}x${baseSize}`,
  };
}

export function generateIconContentsJson(filename: string): string {
  const images: ContentsImageEntry[] = IOS_ICON_SIZES.map((iconSize) => {
    const { idiom, scale, size } = getIconIdiomAndScale(iconSize.name, iconSize.size);
    return {
      filename: `${iconSize.name}.png`,
      idiom,
      scale,
      size,
    };
  });

  const contents: ContentsJson = {
    images,
    info: {
      author: 'SplashCraft',
      version: 1,
    },
  };

  return JSON.stringify(contents, null, 2);
}

export function generateSplashContentsJson(): string {
  const images = IOS_SPLASH_SIZES.map((splashSize) => {
    // Determine orientation
    const isLandscape = splashSize.width > splashSize.height;
    const orientation = isLandscape ? 'landscape' : 'portrait';
    
    // Parse scale from name
    const scaleMatch = splashSize.name.match(/@(\d)x/);
    const scale = scaleMatch ? `${scaleMatch[1]}x` : '1x';

    // Determine idiom
    let idiom = 'iphone';
    if (splashSize.name.includes('ipad')) {
      idiom = 'ipad';
    }

    return {
      filename: `${splashSize.name}.png`,
      idiom,
      scale,
      orientation,
    };
  });

  const contents = {
    images,
    info: {
      author: 'SplashCraft',
      version: 1,
    },
  };

  return JSON.stringify(contents, null, 2);
}

// Generate AppIcon.appiconset structure
export function generateAppIconContentsJson(filename: string): string {
  const iconEntries = [
    { size: 20, scales: [2, 3], idiom: 'iphone' },
    { size: 29, scales: [2, 3], idiom: 'iphone' },
    { size: 40, scales: [2, 3], idiom: 'iphone' },
    { size: 60, scales: [2, 3], idiom: 'iphone' },
    { size: 20, scales: [1, 2], idiom: 'ipad' },
    { size: 29, scales: [1, 2], idiom: 'ipad' },
    { size: 40, scales: [1, 2], idiom: 'ipad' },
    { size: 76, scales: [1, 2], idiom: 'ipad' },
    { size: 83.5, scales: [2], idiom: 'ipad' },
    { size: 1024, scales: [1], idiom: 'ios-marketing' },
  ];

  const images: Array<{
    filename: string;
    idiom: string;
    scale: string;
    size: string;
  }> = [];

  iconEntries.forEach(({ size, scales, idiom }) => {
    scales.forEach((scale) => {
      const pixelSize = Math.round(size * scale);
      const scaleStr = scale === 1 ? '' : `@${scale}x`;
      const filenameStr = size === 1024 
        ? `${filename}-1024.png`
        : `${filename}-${size}${scaleStr}.png`;

      images.push({
        filename: filenameStr,
        idiom,
        scale: `${scale}x`,
        size: `${size}x${size}`,
      });
    });
  });

  const contents = {
    images,
    info: {
      author: 'SplashCraft',
      version: 1,
    },
  };

  return JSON.stringify(contents, null, 2);
}
