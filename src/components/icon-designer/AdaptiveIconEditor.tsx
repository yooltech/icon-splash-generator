import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Upload, X, Circle, Square, Hexagon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { IconConfig, GradientDirection } from '@/types/assets';

interface AdaptiveIconEditorProps {
  config: IconConfig;
  onChange: (config: IconConfig) => void;
}

const maskShapes = [
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'squircle', label: 'Squircle', icon: Square },
  { id: 'rounded', label: 'Rounded', icon: Square },
  { id: 'teardrop', label: 'Teardrop', icon: Hexagon },
];

const presetColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#22C55E',
  '#14B8A6', '#1E293B', '#FFFFFF', '#000000',
];

export function AdaptiveIconEditor({ config, onChange }: AdaptiveIconEditorProps) {
  const [previewMask, setPreviewMask] = useState('squircle');
  const [isDraggingFg, setIsDraggingFg] = useState(false);
  const [isDraggingBg, setIsDraggingBg] = useState(false);

  const updateConfig = (updates: Partial<IconConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleForegroundUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateConfig({ adaptiveForeground: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateConfig({ adaptiveBackground: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'foreground' | 'background') => {
    e.preventDefault();
    if (type === 'foreground') setIsDraggingFg(false);
    else setIsDraggingBg(false);
    
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      if (type === 'foreground') handleForegroundUpload(file);
      else handleBackgroundUpload(file);
    }
  };

  const getMaskClipPath = (mask: string) => {
    switch (mask) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'squircle':
        return 'inset(0 round 22%)';
      case 'rounded':
        return 'inset(0 round 12%)';
      case 'teardrop':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      default:
        return 'inset(0 round 22%)';
    }
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    if (config.adaptiveBackground) {
      return {
        backgroundImage: `url(${config.adaptiveBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    
    switch (config.adaptiveBackgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(${config.adaptiveBackgroundGradient.direction.replace('to-', 'to ')}, ${config.adaptiveBackgroundGradient.colors.join(', ')})`,
        };
      default:
        return { backgroundColor: config.adaptiveBackgroundColor };
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-primary" />
            <div>
              <Label htmlFor="adaptive-toggle" className="text-sm font-medium">Android Adaptive Icon</Label>
              <p className="text-xs text-muted-foreground">Separate foreground and background layers</p>
            </div>
          </div>
          <Switch
            id="adaptive-toggle"
            checked={config.useAdaptiveIcon}
            onCheckedChange={(useAdaptiveIcon) => updateConfig({ useAdaptiveIcon })}
          />
        </div>
      </div>

      {config.useAdaptiveIcon && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          {/* Layer Uploads */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Foreground Layer */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Foreground Layer
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Your logo/icon with transparency (PNG)
              </p>
              {config.adaptiveForeground ? (
                <div className="relative glass-card p-4">
                  <button
                    onClick={() => updateConfig({ adaptiveForeground: null })}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-[repeating-conic-gradient(#808080_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
                    <img
                      src={config.adaptiveForeground}
                      alt="Foreground"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`upload-zone ${isDraggingFg ? 'upload-zone-active' : ''} cursor-pointer`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFg(true); }}
                  onDragLeave={() => setIsDraggingFg(false)}
                  onDrop={(e) => handleDrop(e, 'foreground')}
                  onClick={() => document.getElementById('adaptive-fg-upload')?.click()}
                >
                  <input
                    id="adaptive-fg-upload"
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleForegroundUpload(file);
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <p className="text-xs text-center">Drop PNG with transparency</p>
                  </div>
                </div>
              )}
            </div>

            {/* Background Layer */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Background Layer
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Solid color, gradient, or image
              </p>
              
              {/* Background Type */}
              <div className="flex gap-2 mb-3">
                {(['color', 'gradient', 'image'] as const).map((type) => (
                  <motion.button
                    key={type}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateConfig({ adaptiveBackgroundType: type })}
                    className={`
                      flex-1 py-1.5 px-2 rounded-lg border text-xs capitalize transition-all
                      ${config.adaptiveBackgroundType === type 
                        ? 'border-primary bg-primary/10 text-foreground' 
                        : 'border-border bg-secondary/30 text-muted-foreground'
                      }
                    `}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>

              {config.adaptiveBackgroundType === 'color' && (
                <div className="flex gap-2 flex-wrap">
                  {presetColors.map((color) => (
                    <motion.button
                      key={color}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateConfig({ adaptiveBackgroundColor: color })}
                      className={`
                        w-7 h-7 rounded-lg transition-all border
                        ${config.adaptiveBackgroundColor === color 
                          ? 'ring-2 ring-offset-1 ring-offset-background ring-primary' 
                          : 'border-border'
                        }
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {config.adaptiveBackgroundType === 'gradient' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.adaptiveBackgroundGradient.colors[0]}
                    onChange={(e) => updateConfig({ 
                      adaptiveBackgroundGradient: { 
                        ...config.adaptiveBackgroundGradient, 
                        colors: [e.target.value, config.adaptiveBackgroundGradient.colors[1]] 
                      } 
                    })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className="text-muted-foreground">→</span>
                  <input
                    type="color"
                    value={config.adaptiveBackgroundGradient.colors[1]}
                    onChange={(e) => updateConfig({ 
                      adaptiveBackgroundGradient: { 
                        ...config.adaptiveBackgroundGradient, 
                        colors: [config.adaptiveBackgroundGradient.colors[0], e.target.value] 
                      } 
                    })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                </div>
              )}

              {config.adaptiveBackgroundType === 'image' && (
                config.adaptiveBackground ? (
                  <div className="relative glass-card p-3">
                    <button
                      onClick={() => updateConfig({ adaptiveBackground: null })}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="w-16 h-16 mx-auto rounded overflow-hidden">
                      <img src={config.adaptiveBackground} alt="BG" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`upload-zone ${isDraggingBg ? 'upload-zone-active' : ''} cursor-pointer py-3`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingBg(true); }}
                    onDragLeave={() => setIsDraggingBg(false)}
                    onDrop={(e) => handleDrop(e, 'background')}
                    onClick={() => document.getElementById('adaptive-bg-upload')?.click()}
                  >
                    <input
                      id="adaptive-bg-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBackgroundUpload(file);
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <p className="text-xs">Upload image</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mask Preview */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Mask Preview
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Different Android launchers use different mask shapes
            </p>

            {/* Mask Shape Selector */}
            <div className="flex gap-2 mb-4">
              {maskShapes.map((mask) => (
                <motion.button
                  key={mask.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPreviewMask(mask.id)}
                  className={`
                    flex items-center gap-2 py-2 px-3 rounded-lg border text-xs transition-all
                    ${previewMask === mask.id 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border bg-secondary/30 text-muted-foreground'
                    }
                  `}
                >
                  <mask.icon className="w-4 h-4" />
                  {mask.label}
                </motion.button>
              ))}
            </div>

            {/* Live Preview Grid */}
            <div className="flex justify-center gap-8">
              {maskShapes.map((mask) => (
                <motion.div
                  key={mask.id}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: previewMask === mask.id ? 1.1 : 1 }}
                  className="text-center"
                >
                  <div 
                    className="w-20 h-20 relative overflow-hidden mx-auto mb-2"
                    style={{ clipPath: getMaskClipPath(mask.id) }}
                  >
                    {/* Background */}
                    <div 
                      className="absolute inset-0"
                      style={getBackgroundStyle()}
                    />
                    {/* Foreground */}
                    {config.adaptiveForeground && (
                      <img
                        src={config.adaptiveForeground}
                        alt="Icon"
                        className="absolute inset-0 w-full h-full object-contain p-3"
                      />
                    )}
                    {!config.adaptiveForeground && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-2xl">
                        ✦
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{mask.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="glass-card p-4 bg-primary/5 border-primary/20">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              About Adaptive Icons
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Android Adaptive Icons consist of a foreground layer (your logo with transparency) 
              and a background layer. The system applies different masks based on the launcher. 
              Both layers should be 108dp with the visible area in the center 72dp (safe zone).
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
