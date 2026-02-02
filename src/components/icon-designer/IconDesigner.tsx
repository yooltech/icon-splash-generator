import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconSourceSelector } from './IconSourceSelector';
import { BackgroundEditor } from './BackgroundEditor';
import { ShapeSelector } from './ShapeSelector';
import { IconPreview } from './IconPreview';
import { AdaptiveIconEditor } from './AdaptiveIconEditor';
import type { IconConfig, ScalingMode, IconEffect } from '@/types/assets';

interface IconDesignerProps {
  config: IconConfig;
  onChange: (config: IconConfig) => void;
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

export function IconDesigner({ config, onChange }: IconDesignerProps) {
  const updateConfig = (updates: Partial<IconConfig>) => {
    onChange({ ...config, ...updates });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <IconSourceSelector
          sourceType={config.sourceType}
          sourceValue={config.sourceValue}
          onSourceTypeChange={(sourceType) => updateConfig({ sourceType })}
          onSourceValueChange={(sourceValue) => updateConfig({ sourceValue })}
        />

        {/* Scaling Mode */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Scaling</label>
          <div className="flex gap-2">
            {scalingOptions.map((option) => (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateConfig({ scalingMode: option.id })}
                className={`
                  flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                  ${config.scalingMode === option.id 
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
                onClick={() => updateConfig({ effect: option.id })}
                className={`
                  flex-1 py-2 px-3 rounded-lg border text-sm transition-all
                  ${config.effect === option.id 
                    ? 'border-primary bg-primary/10 text-foreground' 
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                  }
                `}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          {config.effect === 'padding' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Padding</span>
                <span className="text-foreground">{config.paddingPercent}%</span>
              </div>
              <Slider
                value={[config.paddingPercent]}
                onValueChange={([value]) => updateConfig({ paddingPercent: value })}
                min={5}
                max={40}
                step={5}
              />
            </div>
          )}
        </div>

        <BackgroundEditor
          backgroundType={config.backgroundType}
          backgroundColor={config.backgroundColor}
          gradient={config.gradient}
          mesh={config.mesh}
          backgroundImage={config.backgroundImage}
          texture={config.texture}
          onBackgroundTypeChange={(backgroundType) => updateConfig({ backgroundType })}
          onBackgroundColorChange={(backgroundColor) => updateConfig({ backgroundColor })}
          onGradientChange={(gradient) => updateConfig({ gradient })}
          onMeshChange={(mesh) => updateConfig({ mesh })}
          onBackgroundImageChange={(backgroundImage) => updateConfig({ backgroundImage })}
          onTextureChange={(texture) => updateConfig({ texture })}
        />

        <ShapeSelector
          shape={config.shape}
          onChange={(shape) => updateConfig({ shape })}
        />

        {/* Badge */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="badge-toggle" className="text-sm font-medium">Corner Badge</Label>
            <Switch
              id="badge-toggle"
              checked={config.hasBadge}
              onCheckedChange={(hasBadge) => updateConfig({ hasBadge })}
            />
          </div>
          {config.hasBadge && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Color:</span>
              <input
                type="color"
                value={config.badgeColor}
                onChange={(e) => updateConfig({ badgeColor: e.target.value })}
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
            value={config.filename}
            onChange={(e) => updateConfig({ filename: e.target.value })}
            placeholder="ic_launcher"
            className="bg-secondary/50"
          />
        </div>

        {/* Adaptive Icon */}
        <AdaptiveIconEditor config={config} onChange={onChange} />
      </div>

      {/* Preview */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground mb-4">Live Preview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Light Mode</p>
              <div className="flex justify-center">
                <IconPreview config={config} size={140} isDark={false} />
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Dark Mode</p>
              <div className="flex justify-center">
                <IconPreview config={config} size={140} isDark={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Size Preview Grid */}
        <div className="glass-card p-4">
          <h4 className="text-xs text-muted-foreground mb-3">Size Variations</h4>
          <div className="flex items-end justify-center gap-3">
            {[48, 72, 96, 120].map((size) => (
              <div key={size} className="text-center">
                <IconPreview config={config} size={size} />
                <span className="text-xs text-muted-foreground mt-1 block">{size}px</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
