import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Type, Shapes, Upload, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ICON_LIBRARY, type IconSourceType } from '@/types/assets';

interface IconSourceSelectorProps {
  sourceType: IconSourceType;
  sourceValue: string;
  onSourceTypeChange: (type: IconSourceType) => void;
  onSourceValueChange: (value: string) => void;
}

const sourceOptions: { id: IconSourceType; label: string; icon: React.ReactNode }[] = [
  { id: 'icon', label: 'Icon', icon: <Shapes className="w-4 h-4" /> },
  { id: 'clipart', label: 'Clipart', icon: <Shapes className="w-4 h-4" /> },
  { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
  { id: 'image', label: 'Image', icon: <Image className="w-4 h-4" /> },
];

export function IconSourceSelector({
  sourceType,
  sourceValue,
  onSourceTypeChange,
  onSourceValueChange,
}: IconSourceSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = ICON_LIBRARY.filter((icon) =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onSourceValueChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const renderIconPreview = (iconName: string) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Source Type Selector */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Icon Source</label>
        <div className="grid grid-cols-4 gap-2">
          {sourceOptions.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSourceTypeChange(option.id)}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-lg border transition-all text-xs
                ${sourceType === option.id 
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

      {/* Source Value Input */}
      {sourceType === 'icon' && (
        <div className="space-y-3">
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary/50"
          />
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-secondary/30 rounded-lg">
            {filteredIcons.map((iconName) => (
              <motion.button
                key={iconName}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSourceValueChange(iconName)}
                className={`
                  p-2 rounded-lg transition-all flex items-center justify-center
                  ${sourceValue === iconName 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/50 hover:bg-secondary text-foreground'
                  }
                `}
                title={iconName}
              >
                {renderIconPreview(iconName)}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {sourceType === 'clipart' && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Select from emoji-style clipart
          </p>
          <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 bg-secondary/30 rounded-lg">
            {['🚀', '⭐', '💎', '🔥', '💡', '🎯', '🎨', '🎵', '📱', '💬', '📸', '🎮', '🏆', '💪', '🌟', '✨', '🎁', '🔔', '❤️', '💚', '💙', '💜', '🧡', '💛'].map((emoji) => (
              <motion.button
                key={emoji}
                whileTap={{ scale: 0.9 }}
                onClick={() => onSourceValueChange(emoji)}
                className={`
                  p-2 rounded-lg text-2xl transition-all
                  ${sourceValue === emoji 
                    ? 'bg-primary/20 ring-2 ring-primary' 
                    : 'hover:bg-secondary'
                  }
                `}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {sourceType === 'text' && (
        <div className="space-y-3">
          <Input
            placeholder="Enter text (1-3 characters work best)"
            value={sourceValue}
            onChange={(e) => onSourceValueChange(e.target.value.slice(0, 3))}
            maxLength={3}
            className="bg-secondary/50 text-center text-2xl font-bold"
          />
          <p className="text-xs text-muted-foreground text-center">
            Short text like initials or abbreviations
          </p>
        </div>
      )}

      {sourceType === 'image' && (
        <div className="space-y-3">
          {sourceValue && sourceValue.startsWith('data:') ? (
            <div className="relative glass-card p-4">
              <button
                onClick={() => onSourceValueChange('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden bg-secondary">
                <img
                  src={sourceValue}
                  alt="Uploaded"
                  className="w-full h-full object-contain"
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
              onClick={() => document.getElementById('icon-image-upload')?.click()}
            >
              <input
                id="icon-image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2 text-center py-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm">Drop image here or click to upload</p>
                <p className="text-xs text-muted-foreground">Square images work best</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
