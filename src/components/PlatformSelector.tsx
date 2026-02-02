import { motion } from 'framer-motion';
import { Smartphone, Apple, Zap, Code2 } from 'lucide-react';
import type { Platform, Framework } from '@/types/assets';

interface PlatformSelectorProps {
  platforms: Platform[];
  framework: Framework;
  onPlatformsChange: (platforms: Platform[]) => void;
  onFrameworkChange: (framework: Framework) => void;
}

const platformOptions: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'android', label: 'Android', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'ios', label: 'iOS', icon: <Apple className="w-5 h-5" /> },
];

const frameworkOptions: { id: Framework; label: string; icon: React.ReactNode }[] = [
  { id: 'capacitor', label: 'Capacitor', icon: <Zap className="w-4 h-4" /> },
  { id: 'flutter', label: 'Flutter', icon: <Code2 className="w-4 h-4" /> },
  { id: 'react-native', label: 'React Native', icon: <Code2 className="w-4 h-4" /> },
  { id: 'native', label: 'Native', icon: <Smartphone className="w-4 h-4" /> },
];

export function PlatformSelector({
  platforms,
  framework,
  onPlatformsChange,
  onFrameworkChange,
}: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        onPlatformsChange(platforms.filter((p) => p !== platform));
      }
    } else {
      onPlatformsChange([...platforms, platform]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Target Platforms
        </label>
        <div className="grid grid-cols-2 gap-3">
          {platformOptions.map((option) => {
            const isSelected = platforms.includes(option.id);
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => togglePlatform(option.id)}
                className={`
                  relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border bg-secondary/50 hover:border-primary/50'
                  }
                `}
              >
                <div className={`transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                  {option.icon}
                </div>
                <span className={`font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="platform-check"
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Framework (Optional)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {frameworkOptions.map((option) => {
            const isSelected = framework === option.id;
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFrameworkChange(option.id)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 text-sm
                  ${isSelected 
                    ? 'border-primary bg-primary/10 text-foreground' 
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                  }
                `}
              >
                {option.icon}
                <span>{option.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
