import { motion } from 'framer-motion';
import { Square, Circle } from 'lucide-react';
import type { IconShape } from '@/types/assets';

interface ShapeSelectorProps {
  shape: IconShape;
  onChange: (shape: IconShape) => void;
}

const shapeOptions: { id: IconShape; label: string; preview: React.ReactNode }[] = [
  { 
    id: 'square', 
    label: 'Square',
    preview: <div className="w-8 h-8 bg-primary rounded-sm" />,
  },
  { 
    id: 'squircle', 
    label: 'Squircle',
    preview: <div className="w-8 h-8 bg-primary rounded-xl" />,
  },
  { 
    id: 'circle', 
    label: 'Circle',
    preview: <div className="w-8 h-8 bg-primary rounded-full" />,
  },
  { 
    id: 'themed', 
    label: 'Themed',
    preview: (
      <div className="w-8 h-8 bg-primary" style={{ 
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }} />
    ),
  },
];

export function ShapeSelector({ shape, onChange }: ShapeSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">Shape</label>
      <div className="grid grid-cols-4 gap-2">
        {shapeOptions.map((option) => (
          <motion.button
            key={option.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.id)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-lg border transition-all
              ${shape === option.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border bg-secondary/30 hover:border-primary/50'
              }
            `}
          >
            {option.preview}
            <span className="text-xs text-muted-foreground">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
