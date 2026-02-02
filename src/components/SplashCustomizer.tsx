import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Smartphone } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { UploadedImage } from '@/types/assets';

interface SplashCustomizerProps {
  logoImage: UploadedImage | null;
  backgroundColor: string;
  isDarkSplash: boolean;
  padding: number;
  onBackgroundColorChange: (color: string) => void;
  onDarkSplashToggle: (isDark: boolean) => void;
  onPaddingChange: (padding: number) => void;
}

const presetColors = [
  '#00D4AA', // Teal
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Cyan
];

export function SplashCustomizer({
  logoImage,
  backgroundColor,
  isDarkSplash,
  padding,
  onBackgroundColorChange,
  onDarkSplashToggle,
  onPaddingChange,
}: SplashCustomizerProps) {
  const [customColor, setCustomColor] = useState(backgroundColor);

  const effectiveBackground = isDarkSplash ? '#0a0a0f' : backgroundColor;

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Splash Background Color
        </label>
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {presetColors.map((color) => (
              <motion.button
                key={color}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onBackgroundColorChange(color);
                  setCustomColor(color);
                }}
                className={`
                  w-8 h-8 rounded-lg transition-all duration-200
                  ${backgroundColor === color && !isDarkSplash ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onBackgroundColorChange(e.target.value);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer opacity-0 absolute inset-0"
              />
              <div
                className="w-8 h-8 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-xs"
                style={{ backgroundColor: customColor }}
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light/Dark Toggle */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Background Mode
        </label>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onDarkSplashToggle(false)}
            className={`
              flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
              ${!isDarkSplash ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30'}
            `}
          >
            <Sun className={`w-4 h-4 ${!isDarkSplash ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={!isDarkSplash ? 'text-foreground' : 'text-muted-foreground'}>
              Color
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onDarkSplashToggle(true)}
            className={`
              flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all
              ${isDarkSplash ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30'}
            `}
          >
            <Moon className={`w-4 h-4 ${isDarkSplash ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={isDarkSplash ? 'text-foreground' : 'text-muted-foreground'}>
              Dark
            </span>
          </motion.button>
        </div>
      </div>

      {/* Padding Slider */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Logo Padding: {padding}%
        </label>
        <Slider
          value={[padding]}
          onValueChange={(value) => onPaddingChange(value[0])}
          min={10}
          max={50}
          step={5}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Preview
        </label>
        <div className="flex justify-center">
          <div className="preview-device">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-40 h-80 rounded-xl overflow-hidden flex items-center justify-center relative"
              style={{ backgroundColor: effectiveBackground }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {logoImage ? (
                  <img
                    src={logoImage.dataUrl}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                    style={{ 
                      maxWidth: `${100 - padding}%`,
                      maxHeight: `${100 - padding}%`,
                    }}
                  />
                ) : (
                  <div className="text-white/20 flex flex-col items-center gap-2">
                    <Smartphone className="w-8 h-8" />
                    <span className="text-xs">No logo</span>
                  </div>
                )}
              </div>
              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
