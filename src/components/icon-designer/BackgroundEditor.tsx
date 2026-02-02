import { motion } from 'framer-motion';
import { Palette, Image, Sparkles, Grid3X3, Waves, Circle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { BackgroundType, GradientConfig, GradientDirection, MeshConfig } from '@/types/assets';

interface BackgroundEditorProps {
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradient: GradientConfig;
  mesh: MeshConfig;
  backgroundImage: string | null;
  texture: string;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onBackgroundColorChange: (color: string) => void;
  onGradientChange: (gradient: GradientConfig) => void;
  onMeshChange: (mesh: MeshConfig) => void;
  onBackgroundImageChange: (image: string | null) => void;
  onTextureChange: (texture: string) => void;
}

const backgroundOptions: { id: BackgroundType; label: string; icon: React.ReactNode }[] = [
  { id: 'color', label: 'Color', icon: <Circle className="w-4 h-4" /> },
  { id: 'gradient', label: 'Gradient', icon: <Palette className="w-4 h-4" /> },
  { id: 'mesh', label: 'Mesh', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
  { id: 'texture', label: 'Texture', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'none', label: 'None', icon: <Waves className="w-4 h-4" /> },
];

const presetColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#14B8A6', '#06B6D4', '#6366F1', '#A855F7', '#F43F5E',
];

const gradientPresets: GradientConfig[] = [
  { colors: ['#3B82F6', '#8B5CF6'], direction: 'to-br' },
  { colors: ['#EC4899', '#F97316'], direction: 'to-r' },
  { colors: ['#22C55E', '#14B8A6'], direction: 'to-b' },
  { colors: ['#6366F1', '#A855F7'], direction: 'to-br' },
  { colors: ['#F43F5E', '#FCD34D'], direction: 'to-tr' },
  { colors: ['#1E293B', '#334155'], direction: 'to-b' },
];

const directionOptions: { id: GradientDirection; label: string }[] = [
  { id: 'to-b', label: '↓' },
  { id: 'to-t', label: '↑' },
  { id: 'to-r', label: '→' },
  { id: 'to-l', label: '←' },
  { id: 'to-br', label: '↘' },
  { id: 'to-bl', label: '↙' },
  { id: 'to-tr', label: '↗' },
  { id: 'to-tl', label: '↖' },
];

export function BackgroundEditor({
  backgroundType,
  backgroundColor,
  gradient,
  mesh,
  onBackgroundTypeChange,
  onBackgroundColorChange,
  onGradientChange,
  onBackgroundImageChange,
}: BackgroundEditorProps) {
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onBackgroundImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Background Type */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Background</label>
        <div className="grid grid-cols-3 gap-2">
          {backgroundOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBackgroundTypeChange(option.id)}
              className={`
                flex items-center gap-2 p-2 rounded-lg border transition-all text-xs
                ${backgroundType === option.id 
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

      {/* Color Picker */}
      {backgroundType === 'color' && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {presetColors.map((color) => (
              <motion.button
                key={color}
                whileTap={{ scale: 0.9 }}
                onClick={() => onBackgroundColorChange(color)}
                className={`
                  w-8 h-8 rounded-lg transition-all
                  ${backgroundColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
            <div className="relative">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer opacity-0 absolute inset-0"
              />
              <div
                className="w-8 h-8 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-xs"
                style={{ backgroundColor }}
              >
                +
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Editor */}
      {backgroundType === 'gradient' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Presets</label>
            <div className="flex gap-2 flex-wrap">
              {gradientPresets.map((preset, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onGradientChange(preset)}
                  className={`
                    w-10 h-10 rounded-lg transition-all
                    ${JSON.stringify(gradient) === JSON.stringify(preset) 
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' 
                      : ''
                    }
                  `}
                  style={{
                    background: `linear-gradient(${preset.direction.replace('to-', 'to ')}, ${preset.colors.join(', ')})`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Color 1</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.colors[0]}
                  onChange={(e) => onGradientChange({ ...gradient, colors: [e.target.value, gradient.colors[1]] })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{gradient.colors[0]}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Color 2</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={gradient.colors[1]}
                  onChange={(e) => onGradientChange({ ...gradient, colors: [gradient.colors[0], e.target.value] })}
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">{gradient.colors[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Direction</label>
            <div className="flex gap-1 flex-wrap">
              {directionOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onGradientChange({ ...gradient, direction: option.id })}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition-all
                    ${gradient.direction === option.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mesh Editor */}
      {backgroundType === 'mesh' && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Mesh gradients use multiple colors blended together
          </p>
          <div className="grid grid-cols-4 gap-2">
            {mesh.colors.map((color, i) => (
              <div key={i} className="text-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...mesh.colors];
                    newColors[i] = e.target.value;
                    onGradientChange({ ...gradient }); // trigger update
                  }}
                  className="w-8 h-8 rounded cursor-pointer mx-auto block"
                />
                <span className="text-xs text-muted-foreground mt-1 block">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload */}
      {backgroundType === 'image' && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-medium file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90 file:cursor-pointer"
          />
        </div>
      )}

      {/* Texture Options */}
      {backgroundType === 'texture' && (
        <div className="space-y-3">
          <div className="flex gap-2 flex-wrap mb-3">
            {presetColors.slice(0, 6).map((color) => (
              <motion.button
                key={color}
                whileTap={{ scale: 0.9 }}
                onClick={() => onBackgroundColorChange(color)}
                className={`
                  w-8 h-8 rounded-lg transition-all
                  ${backgroundColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Noise texture will be applied over the base color
          </p>
        </div>
      )}
    </div>
  );
}
