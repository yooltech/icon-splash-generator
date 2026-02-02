import { motion } from 'framer-motion';
import { Check, Folder, Smartphone, Apple, Globe, Tv, Play, X } from 'lucide-react';
import type { Platform, GeneratedAsset } from '@/types/assets';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createZipAndDownload } from '@/lib/zipExport';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  assets: GeneratedAsset[];
  platforms: Platform[];
}

export function SuccessModal({ open, onClose, assets, platforms }: SuccessModalProps) {
  // Count assets by platform
  const androidIcons = assets.filter((a) => 
    a.path.includes('android/icons') || 
    a.path.startsWith('android/mipmap-') ||
    a.path.startsWith('android/res/mipmap-')
  ).length;
  
  const iosIcons = assets.filter((a) => a.path.includes('ios/icons') || a.path.includes('ios/')).length;
  const webIcons = assets.filter((a) => a.path.includes('web/')).length;
  const tvIcons = assets.filter((a) => a.path.includes('tv/') || a.path.includes('androidTV/') || a.path.includes('tvOS/')).length;
  const playStoreIcons = assets.filter((a) => a.path.includes('playStore/')).length;

  const handleDownload = async () => {
    await createZipAndDownload(assets);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center sr-only">Assets Generated</DialogTitle>
        </DialogHeader>
        
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">Assets Generated!</h2>
          <p className="text-sm text-muted-foreground">
            {assets.length} files ready for download
          </p>
        </motion.div>

        {/* Asset Summary Grid */}
        <div className="grid grid-cols-2 gap-3 py-4">
          {androidIcons > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Smartphone className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Android</p>
                <p className="text-xs text-muted-foreground">{androidIcons} icons</p>
              </div>
            </div>
          )}
          
          {iosIcons > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Apple className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">iOS</p>
                <p className="text-xs text-muted-foreground">{iosIcons} icons</p>
              </div>
            </div>
          )}
          
          {webIcons > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Globe className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Web</p>
                <p className="text-xs text-muted-foreground">{webIcons} icons</p>
              </div>
            </div>
          )}
          
          {playStoreIcons > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Play className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Play Store</p>
                <p className="text-xs text-muted-foreground">{playStoreIcons} graphics</p>
              </div>
            </div>
          )}
          
          {tvIcons > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
              <Tv className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">TV</p>
                <p className="text-xs text-muted-foreground">{tvIcons} icons</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleDownload}
            size="lg"
            className="w-full btn-primary-glow"
          >
            Download ZIP
          </Button>
          
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
          >
            Continue Editing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
