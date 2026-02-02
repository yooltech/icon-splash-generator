import {
  ANDROID_ICON_SIZES,
  IOS_ICON_SIZES,
  ANDROID_SPLASH_SIZES,
  IOS_SPLASH_SIZES,
  type Platform,
  type IconSize,
  type SplashSize,
  type GeneratedAsset,
  type UploadedImage,
} from '@/types/assets';

export async function resizeImage(
  imageDataUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

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
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageDataUrl;
  });
}

export async function generateSplashScreen(
  logoDataUrl: string,
  width: number,
  height: number,
  backgroundColor: string,
  padding: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const logo = new Image();
    logo.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Calculate logo size with padding
      const maxLogoWidth = width * (1 - padding / 50);
      const maxLogoHeight = height * (1 - padding / 50);
      
      const logoAspect = logo.width / logo.height;
      let logoWidth = maxLogoWidth;
      let logoHeight = logoWidth / logoAspect;

      if (logoHeight > maxLogoHeight) {
        logoHeight = maxLogoHeight;
        logoWidth = logoHeight * logoAspect;
      }

      // Center the logo
      const x = (width - logoWidth) / 2;
      const y = (height - logoHeight) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(logo, x, y, logoWidth, logoHeight);

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
    };
    logo.onerror = () => reject(new Error('Failed to load logo'));
    logo.src = logoDataUrl;
  });
}

export async function generateIcons(
  iconImage: UploadedImage,
  platforms: Platform[],
  onProgress: (current: number, total: number) => void
): Promise<GeneratedAsset[]> {
  const assets: GeneratedAsset[] = [];
  const sizes: IconSize[] = [];

  if (platforms.includes('android')) {
    sizes.push(...ANDROID_ICON_SIZES);
  }
  if (platforms.includes('ios')) {
    sizes.push(...IOS_ICON_SIZES);
  }

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const blob = await resizeImage(iconImage.dataUrl, size.size, size.size);
    assets.push({
      name: `${size.name}.png`,
      path: `${size.folder}/${size.name}.png`,
      blob,
    });
    onProgress(i + 1, sizes.length);
  }

  return assets;
}

export async function generateSplashScreens(
  logoImage: UploadedImage,
  platforms: Platform[],
  backgroundColor: string,
  padding: number,
  onProgress: (current: number, total: number) => void
): Promise<GeneratedAsset[]> {
  const assets: GeneratedAsset[] = [];
  const sizes: SplashSize[] = [];

  if (platforms.includes('android')) {
    sizes.push(...ANDROID_SPLASH_SIZES);
  }
  if (platforms.includes('ios')) {
    sizes.push(...IOS_SPLASH_SIZES);
  }

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const blob = await generateSplashScreen(
      logoImage.dataUrl,
      size.width,
      size.height,
      backgroundColor,
      padding
    );
    assets.push({
      name: `${size.name}.png`,
      path: `${size.folder}/${size.name}.png`,
      blob,
    });
    onProgress(i + 1, sizes.length);
  }

  return assets;
}

export function loadImage(file: File): Promise<UploadedImage> {
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
