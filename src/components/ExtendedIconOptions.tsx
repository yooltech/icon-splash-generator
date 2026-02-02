import { motion } from 'framer-motion';
import { Package, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type ExtendedIconOptions as ExtendedIconOptionsType } from '@/types/assets';

interface ExtendedIconOptionsProps {
  options: ExtendedIconOptionsType;
  onChange: (options: ExtendedIconOptionsType) => void;
}

const ICON_OPTIONS = [
  {
    key: 'macOS' as const,
    label: 'macOS App Icons',
    description: '10 sizes from 16x16 to 1024x1024 for .icns generation',
    sizes: '16-1024px',
  },
  {
    key: 'web' as const,
    label: 'Web/PWA Icons',
    description: 'Favicons, Apple Touch Icons, and PWA manifest icons',
    sizes: '16-512px + manifest',
  },
  {
    key: 'tvOS' as const,
    label: 'tvOS App Icons',
    description: 'Apple TV app icons and Top Shelf banners',
    sizes: '400-1280px + banners',
  },
  {
    key: 'androidTV' as const,
    label: 'Android TV Banner',
    description: 'Leanback launcher banners for Android TV apps',
    sizes: '320x180 - 640x360',
  },
  {
    key: 'playStore' as const,
    label: 'Play Store Assets',
    description: 'Feature graphic and high-res icon for Google Play',
    sizes: '1024x500 + 512x512',
  },
];

export function ExtendedIconOptions({
  options,
  onChange,
}: ExtendedIconOptionsProps) {
  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Extended Icon Formats</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Generate additional icon formats for desktop, web, and TV platforms.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ICON_OPTIONS.map((option) => (
          <motion.div
            key={option.key}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-xl border-2 transition-all cursor-pointer
              ${options[option.key]
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary/30 hover:border-primary/50'
              }
            `}
            onClick={() => onChange({ ...options, [option.key]: !options[option.key] })}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={`extended-${option.key}`}
                checked={options[option.key]}
                onCheckedChange={(checked) =>
                  onChange({ ...options, [option.key]: checked === true })
                }
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`extended-${option.key}`}
                    className="font-medium cursor-pointer text-sm"
                  >
                    {option.label}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{option.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{option.sizes}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Output preview when any option is selected */}
      {Object.values(options).some(Boolean) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-lg bg-secondary/30 border border-border"
        >
          <p className="text-xs text-muted-foreground mb-2">Additional output folders:</p>
          <div className="text-xs font-mono space-y-1">
            {options.macOS && (
              <div className="flex items-center gap-2">
                <span className="text-primary">macos/</span>
                <span className="text-muted-foreground">AppIcon.appiconset/</span>
              </div>
            )}
            {options.web && (
              <div className="flex items-center gap-2">
                <span className="text-primary">web/</span>
                <span className="text-muted-foreground">favicons, icons, manifest</span>
              </div>
            )}
            {options.tvOS && (
              <div className="flex items-center gap-2">
                <span className="text-primary">tvos/</span>
                <span className="text-muted-foreground">Assets.xcassets/</span>
              </div>
            )}
            {options.androidTV && (
              <div className="flex items-center gap-2">
                <span className="text-primary">android-tv/</span>
                <span className="text-muted-foreground">drawable-*/banner.png</span>
              </div>
            )}
            {options.playStore && (
              <div className="flex items-center gap-2">
                <span className="text-primary">play-store/</span>
                <span className="text-muted-foreground">feature-graphic, hi-res-icon</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
