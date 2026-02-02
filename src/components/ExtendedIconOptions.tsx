import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Info, ChevronDown, Settings2, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { type ExtendedIconOptions as ExtendedIconOptionsType, type CustomIconSize } from '@/types/assets';

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
    hasSettings: false,
  },
  {
    key: 'web' as const,
    label: 'Web/PWA Icons',
    description: 'Favicons, Apple Touch Icons, and PWA manifest icons',
    sizes: '16-512px + manifest',
    hasSettings: true,
  },
  {
    key: 'tvOS' as const,
    label: 'tvOS App Icons',
    description: 'Apple TV app icons and Top Shelf banners',
    sizes: '400-1280px + banners',
    hasSettings: false,
  },
  {
    key: 'androidTV' as const,
    label: 'Android TV Banner',
    description: 'Leanback launcher banners for Android TV apps',
    sizes: '320x180 - 640x360',
    hasSettings: false,
  },
  {
    key: 'playStore' as const,
    label: 'Play Store Assets',
    description: 'Feature graphic and high-res icon for Google Play',
    sizes: '1024x500 + 512x512',
    hasSettings: true,
  },
];

export function ExtendedIconOptions({
  options,
  onChange,
}: ExtendedIconOptionsProps) {
  const [expandedSettings, setExpandedSettings] = useState<string | null>(null);
  const [showCustomSizes, setShowCustomSizes] = useState(false);

  // Ensure customSizes is always an array
  const customSizes = options.customSizes ?? [];

  const toggleSettings = (key: string) => {
    setExpandedSettings(expandedSettings === key ? null : key);
  };

  const addCustomSize = () => {
    const newSize: CustomIconSize = {
      id: `custom-${Date.now()}`,
      name: 'custom-icon',
      width: 512,
      height: 512,
      enabled: true,
    };
    onChange({
      ...options,
      customSizes: [...customSizes, newSize],
    });
  };

  const updateCustomSize = (id: string, updates: Partial<CustomIconSize>) => {
    onChange({
      ...options,
      customSizes: customSizes.map((size) =>
        size.id === id ? { ...size, ...updates } : size
      ),
    });
  };

  const removeCustomSize = (id: string) => {
    onChange({
      ...options,
      customSizes: customSizes.filter((size) => size.id !== id),
    });
  };

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Extended Icon Formats</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Generate additional icon formats for desktop, web, and TV platforms.
      </p>

      <div className="space-y-3">
        {ICON_OPTIONS.map((option) => (
          <div key={option.key} className="space-y-2">
            <motion.div
              whileTap={{ scale: 0.99 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${options[option.key]
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`extended-${option.key}`}
                  checked={options[option.key]}
                  onCheckedChange={(checked) =>
                    onChange({ ...options, [option.key]: checked === true })
                  }
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
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
                    {option.hasSettings && options[option.key] && (
                      <button
                        onClick={() => toggleSettings(option.key)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                        Customize
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${
                            expandedSettings === option.key ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{option.sizes}</p>
                </div>
              </div>
            </motion.div>

            {/* Settings panel for Web/PWA */}
            <AnimatePresence>
              {option.key === 'web' && expandedSettings === 'web' && options.web && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 p-4 rounded-lg bg-secondary/30 border border-border space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="web-app-name" className="text-xs">
                      App Name (for manifest)
                    </Label>
                    <Input
                      id="web-app-name"
                      value={options.webAppName}
                      onChange={(e) => onChange({ ...options, webAppName: e.target.value })}
                      placeholder="My App"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="web-theme-color" className="text-xs">
                      Theme Color
                    </Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={options.webThemeColor}
                        onChange={(e) => onChange({ ...options, webThemeColor: e.target.value })}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <Input
                        id="web-theme-color"
                        value={options.webThemeColor}
                        onChange={(e) => onChange({ ...options, webThemeColor: e.target.value })}
                        placeholder="#3B82F6"
                        className="h-8 text-sm font-mono flex-1"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Settings panel for Play Store */}
              {option.key === 'playStore' && expandedSettings === 'playStore' && options.playStore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-6 p-4 rounded-lg bg-secondary/30 border border-border space-y-3"
                >
                  <div className="space-y-2">
                    <Label htmlFor="playstore-app-name" className="text-xs">
                      App Name (for feature graphic)
                    </Label>
                    <Input
                      id="playstore-app-name"
                      value={options.playStoreAppName}
                      onChange={(e) => onChange({ ...options, playStoreAppName: e.target.value })}
                      placeholder="My App"
                      className="h-8 text-sm"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The app name will be displayed on the feature graphic banner.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Custom Sizes Section */}
      <Collapsible open={showCustomSizes} onOpenChange={setShowCustomSizes} className="mt-4">
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showCustomSizes ? 'rotate-180' : ''}`}
            />
            Custom Icon Sizes
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-4 rounded-lg bg-secondary/30 border border-border space-y-3"
          >
            <p className="text-xs text-muted-foreground">
              Add custom icon sizes for specific requirements.
            </p>

            {customSizes.map((size) => (
              <div key={size.id} className="flex items-center gap-2">
                <Checkbox
                  checked={size.enabled}
                  onCheckedChange={(checked) =>
                    updateCustomSize(size.id, { enabled: checked === true })
                  }
                />
                <Input
                  value={size.name}
                  onChange={(e) => updateCustomSize(size.id, { name: e.target.value })}
                  placeholder="filename"
                  className="h-8 text-sm flex-1"
                />
                <Input
                  type="number"
                  value={size.width}
                  onChange={(e) => updateCustomSize(size.id, { width: parseInt(e.target.value) || 0 })}
                  className="h-8 text-sm w-20"
                  min={1}
                />
                <span className="text-xs text-muted-foreground">×</span>
                <Input
                  type="number"
                  value={size.height}
                  onChange={(e) => updateCustomSize(size.id, { height: parseInt(e.target.value) || 0 })}
                  className="h-8 text-sm w-20"
                  min={1}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeCustomSize(size.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addCustomSize}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Size
            </Button>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>

      {/* Output preview when any option is selected */}
      {(Object.entries(options).some(([key, val]) => 
        ['macOS', 'web', 'tvOS', 'androidTV', 'playStore'].includes(key) && val
      ) || customSizes.some(s => s.enabled)) && (
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
                <span className="text-muted-foreground">
                  favicons, icons, manifest ({options.webAppName})
                </span>
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
            {customSizes.filter(s => s.enabled).length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-primary">custom/</span>
                <span className="text-muted-foreground">
                  {customSizes.filter(s => s.enabled).map(s => `${s.name}.png`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
