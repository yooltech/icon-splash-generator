import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Type, Layers, Upload, X, Smartphone, Monitor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { 
  SplashConfig, 
  SplashContentType, 
  SplashPosition, 
  SplashScale, 
  GradientDirection 
} from '@/types/assets';

interface SplashDesignerProps {
  config: SplashConfig;
  onChange: (config: SplashConfig) => void;
}

const contentTypeOptions: { id: SplashContentType; label: string; icon: React.ReactNode }[] = [
  { id: 'logo', label: 'Logo', icon: <Image className="w-4 h-4" /> },
  { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  { id: 'logo-text', label: 'Logo + Text', icon: <Layers className="w-4 h-4" /> },
];

const positionOptions: { id: SplashPosition; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'center', label: 'Center' },
  { id: 'bottom', label: 'Bottom' },
];

const scaleOptions: { id: SplashScale; label: string; size: string }[] = [
  { id: 'small', label: 'Small', size: '25%' },
  { id: 'medium', label: 'Medium', size: '40%' },
  { id: 'large', label: 'Large', size: '55%' },
];

const presetColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#22C55E',
  '#14B8A6', '#06B6D4', '#1E293B', '#000000', '#FFFFFF', '#F8FAFC',
];

const gradientPresets = [
  { colors: ['#3B82F6', '#8B5CF6'], direction: 'to-b' as GradientDirection },
  { colors: ['#EC4899', '#F97316'], direction: 'to-br' as GradientDirection },
  { colors: ['#1E293B', '#0F172A'], direction: 'to-b' as GradientDirection },
  { colors: ['#22C55E', '#14B8A6'], direction: 'to-br' as GradientDirection },
];

export function SplashDesigner({ config, onChange }: SplashDesignerProps) {
  const [previewMode, setPreviewMode] = useState<'portrait' | 'landscape'>('portrait');
  const [isDragging, setIsDragging] = useState(false);

  const updateConfig = (updates: Partial<SplashConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateConfig({ logoImage: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      handleLogoUpload(file);
    }
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (config.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(${config.gradient.direction.replace('to-', 'to ')}, ${config.gradient.colors.join(', ')})`,
        };
      case 'image':
        return config.backgroundImage ? {
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : { backgroundColor: config.backgroundColor };
      default:
        return { backgroundColor: config.backgroundColor };
    }
  };

  const getContentPosition = (): React.CSSProperties => {
    switch (config.position) {
      case 'top':
        return { alignItems: 'flex-start', paddingTop: '20%' };
      case 'bottom':
        return { alignItems: 'flex-end', paddingBottom: '20%' };
      default:
        return { alignItems: 'center' };
    }
  };

  const getLogoSize = (): string => {
    switch (config.scale) {
      case 'small': return '25%';
      case 'large': return '55%';
      default: return '40%';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        {/* Content Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Content Type</label>
          <div className="grid grid-cols-3 gap-2">
            {contentTypeOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig({ contentType: option.id })}
                className={`
                  flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-sm
                  ${config.contentType === option.id 
                    ? 'border-primary bg-primary/10 text-foreground' 
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                  }
                `}
              >
                {option.icon}
                <span>{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Logo Upload */}
        {(config.contentType === 'logo' || config.contentType === 'logo-text') && (
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Logo Image</label>
            {config.logoImage ? (
              <div className="relative glass-card p-4">
                <button
                  onClick={() => updateConfig({ logoImage: null })}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
                  <img
                    src={config.logoImage}
                    alt="Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                className={`upload-zone ${isDragging ? 'upload-zone-active' : ''} cursor-pointer`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('splash-logo-upload')?.click()}
              >
                <input
                  id="splash-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(file);
                  }}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-center py-4">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm">Drop logo here or click to upload</p>
                  <p className="text-xs text-muted-foreground">PNG or SVG recommended</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Input */}
        {(config.contentType === 'text' || config.contentType === 'logo-text') && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground mb-2 block">App Name / Text</label>
            <Input
              value={config.text}
              onChange={(e) => updateConfig({ text: e.target.value })}
              placeholder="My App"
              className="bg-secondary/50"
            />
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Color:</span>
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => updateConfig({ textColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Position</label>
          <div className="flex gap-2">
            {positionOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig({ position: option.id })}
                className={`
                  flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                  ${config.position === option.id 
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

        {/* Scale */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Scale</label>
          <div className="flex gap-2">
            {scaleOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig({ scale: option.id })}
                className={`
                  flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                  ${config.scale === option.id 
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

        {/* Background Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Background</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['color', 'gradient', 'image'] as const).map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig({ backgroundType: type })}
                className={`
                  py-2 px-3 rounded-lg border text-sm capitalize transition-all
                  ${config.backgroundType === type 
                    ? 'border-primary bg-primary/10 text-foreground' 
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                  }
                `}
              >
                {type}
              </motion.button>
            ))}
          </div>

          {/* Color Picker */}
          {config.backgroundType === 'color' && (
            <div className="flex gap-2 flex-wrap">
              {presetColors.map((color) => (
                <motion.button
                  key={color}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateConfig({ backgroundColor: color })}
                  className={`
                    w-8 h-8 rounded-lg transition-all border
                    ${config.backgroundColor === color 
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' 
                      : 'border-border'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* Gradient Picker */}
          {config.backgroundType === 'gradient' && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {gradientPresets.map((preset, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateConfig({ gradient: preset })}
                    className="w-10 h-10 rounded-lg transition-all"
                    style={{
                      background: `linear-gradient(${preset.direction.replace('to-', 'to ')}, ${preset.colors.join(', ')})`,
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.gradient.colors[0]}
                    onChange={(e) => updateConfig({ 
                      gradient: { ...config.gradient, colors: [e.target.value, config.gradient.colors[1]] } 
                    })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="color"
                    value={config.gradient.colors[1]}
                    onChange={(e) => updateConfig({ 
                      gradient: { ...config.gradient, colors: [config.gradient.colors[0], e.target.value] } 
                    })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Image Upload */}
          {config.backgroundType === 'image' && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => updateConfig({ backgroundImage: ev.target?.result as string });
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-medium file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90 file:cursor-pointer"
            />
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Preview</h3>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode('portrait')}
              className={`p-2 rounded-lg transition-all ${previewMode === 'portrait' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              <Smartphone className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode('landscape')}
              className={`p-2 rounded-lg transition-all ${previewMode === 'landscape' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              <Monitor className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="preview-device p-3">
            <motion.div
              layout
              className="overflow-hidden flex flex-col justify-center relative"
              style={{
                width: previewMode === 'portrait' ? 180 : 320,
                height: previewMode === 'portrait' ? 360 : 200,
                borderRadius: 16,
                ...getBackgroundStyle(),
                ...getContentPosition(),
              }}
            >
              {/* Safe Area Indicator */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-black/10" />
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-black/10" />

              {/* Content */}
              <div 
                className="flex flex-col items-center justify-center z-10"
                style={{ width: getLogoSize() }}
              >
                {(config.contentType === 'logo' || config.contentType === 'logo-text') && config.logoImage && (
                  <img
                    src={config.logoImage}
                    alt="Logo"
                    className="w-full h-auto max-h-24 object-contain mb-2"
                  />
                )}
                {(config.contentType === 'text' || config.contentType === 'logo-text') && (
                  <p
                    className="text-lg font-bold text-center"
                    style={{ color: config.textColor }}
                  >
                    {config.text || 'My App'}
                  </p>
                )}
              </div>

              {/* Phone Notch */}
              {previewMode === 'portrait' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full" />
              )}
            </motion.div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Gray areas indicate safe zones for notches and home indicators
        </p>
      </div>
    </div>
  );
}
