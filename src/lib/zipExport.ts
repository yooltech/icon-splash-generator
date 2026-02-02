import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { GeneratedAsset } from '@/types/assets';

export async function createZipAndDownload(assets: GeneratedAsset[]): Promise<void> {
  const zip = new JSZip();

  for (const asset of assets) {
    zip.file(asset.path, asset.blob);
  }

  const blob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `app-assets-${timestamp}.zip`);
}
