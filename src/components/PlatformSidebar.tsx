import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { IconSourceSelector } from '@/components/icon-designer/IconSourceSelector';
import { BackgroundEditor } from '@/components/icon-designer/BackgroundEditor';
import { ShapeSelector } from '@/components/icon-designer/ShapeSelector';
import { AdaptiveIconEditor } from '@/components/icon-designer/AdaptiveIconEditor';
import type { 
  IconConfig, 
  ScalingMode, 
  IconEffect,
  AndroidStudioOptions,
  ExtendedIconOptions,
  CustomIconSize,
} from '@/types/assets';
import type { PlatformTab } from './PlatformTabs';

interface PlatformSidebarProps {
  activeTab: PlatformTab;
  iconConfig: IconConfig;
  onIconConfigChange: (config: IconConfig) => void;
  androidStudioOptions: AndroidStudioOptions;
  onAndroidStudioOptionsChange: (options: AndroidStudioOptions) => void;
  extendedOptions: ExtendedIconOptions;
  onExtendedOptionsChange: (options: ExtendedIconOptions) => void;
}

const scalingOptions: { id: ScalingMode; label: string }[] = [
  { id: 'center', label: 'Center' },
  { id: 'crop', label: 'Crop' },
  { id: 'mask', label: 'Mask' },
];

const effectOptions: { id: IconEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'padding', label: 'Padding' },
];

export function PlatformSidebar({
  activeTab,
  iconConfig,
  onIconConfigChange,
  androidStudioOptions,
  onAndroidStudioOptionsChange,
  extendedOptions,
  onExtendedOptionsChange,
}: PlatformSidebarProps) {
  const updateIconConfig = (updates: Partial<IconConfig>) => {
    onIconConfigChange({ ...iconConfig, ...updates });
  };

  const customSizes = extendedOptions.customSizes ?? [];

  const addCustomSize = () => {
    const newSize: CustomIconSize = {
      id: `custom-${Date.now()}`,
      name: 'custom-icon',
      width: 512,
      height: 512,
      enabled: true,
    };
    onExtendedOptionsChange({
      ...extendedOptions,
      customSizes: [...customSizes, newSize],
    });
  };

  const updateCustomSize = (id: string, updates: Partial<CustomIconSize>) => {
    onExtendedOptionsChange({
      ...extendedOptions,
      customSizes: customSizes.map((size) =>
        size.id === id ? { ...size, ...updates } : size
      ),
    });
  };

  const removeCustomSize = (id: string) => {
    onExtendedOptionsChange({
      ...extendedOptions,
      customSizes: customSizes.filter((size) => size.id !== id),
    });
  };

  // Common icon options (shared across most platforms)
  const renderCommonIconOptions = () => (
    <div className="space-y-6">
      <IconSourceSelector
        sourceType={iconConfig.sourceType}
        sourceValue={iconConfig.sourceValue}
        onSourceTypeChange={(sourceType) => updateIconConfig({ sourceType })}
        onSourceValueChange={(sourceValue) => updateIconConfig({ sourceValue })}
      />

      {/* Scaling Mode */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Scaling</label>
        <div className="flex gap-2">
          {scalingOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateIconConfig({ scalingMode: option.id })}
              className={`
                flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                ${iconConfig.scalingMode === option.id 
                  ? 'border-primary bg-primary/10 text-foreground' 
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                }
              `}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Effects */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Effects</label>
        <div className="flex gap-2 mb-3">
          {effectOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateIconConfig({ effect: option.id })}
              className={`
                flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                ${iconConfig.effect === option.id 
                  ? 'border-primary bg-primary/10 text-foreground' 
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                }
              `}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
        {iconConfig.effect === 'padding' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Padding</span>
              <span className="text-foreground">{iconConfig.paddingPercent}%</span>
            </div>
            <Slider
              value={[iconConfig.paddingPercent]}
              onValueChange={([value]) => updateIconConfig({ paddingPercent: value })}
              min={5}
              max={40}
              step={5}
            />
          </div>
        )}
      </div>

      <BackgroundEditor
        backgroundType={iconConfig.backgroundType}
        backgroundColor={iconConfig.backgroundColor}
        gradient={iconConfig.gradient}
        mesh={iconConfig.mesh}
        backgroundImage={iconConfig.backgroundImage}
        texture={iconConfig.texture}
        onBackgroundTypeChange={(backgroundType) => updateIconConfig({ backgroundType })}
        onBackgroundColorChange={(backgroundColor) => updateIconConfig({ backgroundColor })}
        onGradientChange={(gradient) => updateIconConfig({ gradient })}
        onMeshChange={(mesh) => updateIconConfig({ mesh })}
        onBackgroundImageChange={(backgroundImage) => updateIconConfig({ backgroundImage })}
        onTextureChange={(texture) => updateIconConfig({ texture })}
      />

      <ShapeSelector
        shape={iconConfig.shape}
        onChange={(shape) => updateIconConfig({ shape })}
      />

      {/* Badge */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="badge-toggle" className="text-sm font-medium">Corner Badge</Label>
          <Switch
            id="badge-toggle"
            checked={iconConfig.hasBadge}
            onCheckedChange={(hasBadge) => updateIconConfig({ hasBadge })}
          />
        </div>
        {iconConfig.hasBadge && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Color:</span>
            <input
              type="color"
              value={iconConfig.badgeColor}
              onChange={(e) => updateIconConfig({ badgeColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Filename */}
      <div>
        <Label htmlFor="filename" className="text-sm font-medium mb-2 block">Filename</Label>
        <Input
          id="filename"
          value={iconConfig.filename}
          onChange={(e) => updateIconConfig({ filename: e.target.value })}
          placeholder="ic_launcher"
          className="bg-secondary/50"
        />
      </div>
    </div>
  );

  // Android-specific options
  const renderAndroidOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
      
      {/* Adaptive Icon */}
      <AdaptiveIconEditor config={iconConfig} onChange={onIconConfigChange} />
      
      {/* Android Studio Options */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">Android Studio Format</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate proper mipmap folder structure</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="android-studio-toggle" className="text-sm">Enable folder structure</Label>
          <Switch
            id="android-studio-toggle"
            checked={androidStudioOptions.enabled}
            onCheckedChange={(enabled) => 
              onAndroidStudioOptionsChange({ ...androidStudioOptions, enabled })
            }
          />
        </div>
        
        {androidStudioOptions.enabled && (
          <div className="space-y-2 pl-2 border-l-2 border-primary/30">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={androidStudioOptions.generateRoundIcon}
                onChange={(e) => 
                  onAndroidStudioOptionsChange({ 
                    ...androidStudioOptions, 
                    generateRoundIcon: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Generate ic_launcher_round.png</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={androidStudioOptions.generateForeground}
                onChange={(e) => 
                  onAndroidStudioOptionsChange({ 
                    ...androidStudioOptions, 
                    generateForeground: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Generate ic_launcher_foreground.png</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={androidStudioOptions.generateMonochrome}
                onChange={(e) => 
                  onAndroidStudioOptionsChange({ 
                    ...androidStudioOptions, 
                    generateMonochrome: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Generate ic_launcher_monochrome.png</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={androidStudioOptions.generateAdaptiveXml}
                onChange={(e) => 
                  onAndroidStudioOptionsChange({ 
                    ...androidStudioOptions, 
                    generateAdaptiveXml: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Generate adaptive icon XML</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={androidStudioOptions.generateSplashXml}
                onChange={(e) => 
                  onAndroidStudioOptionsChange({ 
                    ...androidStudioOptions, 
                    generateSplashXml: e.target.checked 
                  })
                }
                className="rounded"
              />
              <span className="text-sm">Generate launch_background.xml</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  // iOS-specific options
  const renderIOSOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
    </div>
  );

  // Web/PWA-specific options
  const renderWebOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
      
      <div className="glass-card p-4 space-y-4">
        <h4 className="font-medium text-sm">PWA Manifest Settings</h4>
        
        <div className="space-y-2">
          <Label htmlFor="web-app-name" className="text-xs">App Name</Label>
          <Input
            id="web-app-name"
            value={extendedOptions.webAppName}
            onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, webAppName: e.target.value })}
            placeholder="My App"
            className="h-8 text-sm"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="web-theme-color" className="text-xs">Theme Color</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={extendedOptions.webThemeColor}
              onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, webThemeColor: e.target.value })}
              className="w-8 h-8 rounded border border-border cursor-pointer"
            />
            <Input
              id="web-theme-color"
              value={extendedOptions.webThemeColor}
              onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, webThemeColor: e.target.value })}
              placeholder="#3B82F6"
              className="h-8 text-sm font-mono flex-1"
            />
          </div>
        </div>
      </div>
      
      {/* Custom Sizes */}
      <div className="glass-card p-4 space-y-4">
        <h4 className="font-medium text-sm">Custom Icon Sizes</h4>
        <p className="text-xs text-muted-foreground">Add custom sizes for specific requirements.</p>
        
        {customSizes.map((size) => (
          <div key={size.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={size.enabled}
              onChange={(e) => updateCustomSize(size.id, { enabled: e.target.checked })}
              className="rounded"
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
              className="h-8 text-sm w-16"
              min={1}
            />
            <span className="text-xs text-muted-foreground">×</span>
            <Input
              type="number"
              value={size.height}
              onChange={(e) => updateCustomSize(size.id, { height: parseInt(e.target.value) || 0 })}
              className="h-8 text-sm w-16"
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
        
        <Button variant="outline" size="sm" onClick={addCustomSize} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Size
        </Button>
      </div>
    </div>
  );

  // Play Store-specific options
  const renderPlayStoreOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
      
      <div className="glass-card p-4 space-y-4">
        <h4 className="font-medium text-sm">Feature Graphic Settings</h4>
        
        <div className="space-y-2">
          <Label htmlFor="playstore-app-name" className="text-xs">App Name (on banner)</Label>
          <Input
            id="playstore-app-name"
            value={extendedOptions.playStoreAppName}
            onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, playStoreAppName: e.target.value })}
            placeholder="My App"
            className="h-8 text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          The app name will be displayed on the 1024×500 feature graphic banner.
        </p>
      </div>
    </div>
  );

  // Android TV options
  const renderAndroidTVOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
      
      <div className="glass-card p-4 space-y-2">
        <h4 className="font-medium text-sm">Banner Output</h4>
        <p className="text-xs text-muted-foreground">
          Generates Leanback launcher banners at:
        </p>
        <ul className="text-xs text-muted-foreground list-disc list-inside">
          <li>320×180 (xhdpi)</li>
          <li>480×270 (xxhdpi)</li>
          <li>640×360 (xxxhdpi)</li>
        </ul>
      </div>
    </div>
  );

  // tvOS options
  const renderTVOSOptions = () => (
    <div className="space-y-6">
      {renderCommonIconOptions()}
      
      <div className="glass-card p-4 space-y-2">
        <h4 className="font-medium text-sm">tvOS Output</h4>
        <p className="text-xs text-muted-foreground">
          Generates Apple TV icons and Top Shelf banners.
        </p>
      </div>
    </div>
  );

  // Splash Screen options - simplified, no icon options needed
  const renderSplashOptions = () => (
    <div className="space-y-6">
      {/* Background settings only - reuse from icon config */}
      <BackgroundEditor
        backgroundType={iconConfig.backgroundType}
        backgroundColor={iconConfig.backgroundColor}
        gradient={iconConfig.gradient}
        mesh={iconConfig.mesh}
        backgroundImage={iconConfig.backgroundImage}
        texture={iconConfig.texture}
        onBackgroundTypeChange={(backgroundType) => updateIconConfig({ backgroundType })}
        onBackgroundColorChange={(backgroundColor) => updateIconConfig({ backgroundColor })}
        onGradientChange={(gradient) => updateIconConfig({ gradient })}
        onMeshChange={(mesh) => updateIconConfig({ mesh })}
        onBackgroundImageChange={(backgroundImage) => updateIconConfig({ backgroundImage })}
        onTextureChange={(texture) => updateIconConfig({ texture })}
      />
      
      <div className="glass-card p-4 space-y-4">
        <h4 className="font-medium text-sm">Splash Screen Settings</h4>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="splash-show-icon" className="text-sm">Show Icon</Label>
          <Switch
            id="splash-show-icon"
            checked={extendedOptions.splashShowIcon ?? false}
            onCheckedChange={(checked) => 
              onExtendedOptionsChange({ ...extendedOptions, splashShowIcon: checked })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="splash-show-name" className="text-sm">Show App Name</Label>
          <Switch
            id="splash-show-name"
            checked={extendedOptions.splashShowName ?? true}
            onCheckedChange={(checked) => 
              onExtendedOptionsChange({ ...extendedOptions, splashShowName: checked })
            }
          />
        </div>
        
        {extendedOptions.splashShowName !== false && (
          <>
            <div className="space-y-2">
              <Label htmlFor="splash-app-name" className="text-xs">App Name</Label>
              <Input
                id="splash-app-name"
                value={extendedOptions.splashAppName || 'My App'}
                onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, splashAppName: e.target.value })}
                placeholder="My App"
                className="h-8 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={extendedOptions.splashTextColor || '#FFFFFF'}
                  onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, splashTextColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border cursor-pointer"
                />
                <Input
                  value={extendedOptions.splashTextColor || '#FFFFFF'}
                  onChange={(e) => onExtendedOptionsChange({ ...extendedOptions, splashTextColor: e.target.value })}
                  placeholder="#FFFFFF"
                  className="h-8 text-sm font-mono flex-1"
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="glass-card p-4 space-y-2">
        <h4 className="font-medium text-sm">Output Sizes</h4>
        <p className="text-xs text-muted-foreground">
          Generates splash screens for Android & iOS:
        </p>
        <ul className="text-xs text-muted-foreground list-disc list-inside">
          <li>Android: Portrait & Landscape (mdpi to xxxhdpi)</li>
          <li>iOS: All device sizes (iPhone & iPad)</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {activeTab === 'android' && renderAndroidOptions()}
      {activeTab === 'ios' && renderIOSOptions()}
      {activeTab === 'web' && renderWebOptions()}
      {activeTab === 'playStore' && renderPlayStoreOptions()}
      {activeTab === 'androidTV' && renderAndroidTVOptions()}
      {activeTab === 'tvOS' && renderTVOSOptions()}
      {activeTab === 'splash' && renderSplashOptions()}
    </div>
  );
}
