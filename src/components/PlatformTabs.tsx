import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Apple, 
  Globe, 
  Tv, 
  MonitorPlay,
  Store,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type PlatformTab = 
  | 'android' 
  | 'ios' 
  | 'web' 
  | 'androidTV' 
  | 'playStore' 
  | 'tvOS'
  | 'splash';

interface PlatformTabsProps {
  activeTab: PlatformTab;
  enabledPlatforms: Set<PlatformTab>;
  onTabChange: (tab: PlatformTab) => void;
  onTogglePlatform: (tab: PlatformTab) => void;
}

const PLATFORM_TABS: { id: PlatformTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'android', label: 'Android Icon', icon: Smartphone },
  { id: 'ios', label: 'iOS Icon', icon: Apple },
  { id: 'splash', label: 'Splash Screen', icon: Sparkles },
  { id: 'web', label: 'Web Icons', icon: Globe },
  { id: 'androidTV', label: 'Android TV', icon: MonitorPlay },
  { id: 'playStore', label: 'Play Store', icon: Store },
  { id: 'tvOS', label: 'tvOS Icon', icon: Tv },
];

export function PlatformTabs({ 
  activeTab, 
  enabledPlatforms,
  onTabChange,
  onTogglePlatform,
}: PlatformTabsProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const enabledTabs = PLATFORM_TABS.filter(tab => enabledPlatforms.has(tab.id));
  const disabledTabs = PLATFORM_TABS.filter(tab => !enabledPlatforms.has(tab.id));

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Enabled platform tabs */}
      {enabledTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[100px]
                ${isActive 
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                  : 'border-border bg-card hover:border-primary/50'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-primary/20 text-primary'
                }
              `}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                isActive ? 'text-foreground' : 'text-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
            
            {/* Remove button - only show on hover and if more than 1 platform */}
            {enabledPlatforms.size > 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlatform(tab.id);
                }}
                className="
                  absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                  border-2 border-background shadow-md z-10
                  bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground
                  opacity-0 group-hover:opacity-100 transition-opacity
                "
                title="Remove from export"
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </motion.div>
        );
      })}

      {/* Add platform button */}
      {disabledTabs.length > 0 && (
        <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed 
                border-border bg-card hover:border-primary/50 hover:bg-primary/5 
                transition-all min-w-[100px] min-h-[104px]
              "
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary text-muted-foreground">
                <Plus className="w-6 h-6" />
              </div>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">Add Platform</p>
              {disabledTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTogglePlatform(tab.id);
                      setAddMenuOpen(false);
                    }}
                    className="
                      w-full flex items-center gap-3 px-2 py-2 rounded-lg
                      hover:bg-primary/10 transition-colors text-left
                    "
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary text-muted-foreground">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
