import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Apple, 
  Globe, 
  Tv, 
  MonitorPlay,
  Store,
  X,
  Check,
} from 'lucide-react';

export type PlatformTab = 
  | 'android' 
  | 'ios' 
  | 'web' 
  | 'androidTV' 
  | 'playStore' 
  | 'tvOS';

interface PlatformTabsProps {
  activeTab: PlatformTab;
  enabledPlatforms: Set<PlatformTab>;
  onTabChange: (tab: PlatformTab) => void;
  onTogglePlatform: (tab: PlatformTab) => void;
}

const PLATFORM_TABS: { id: PlatformTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'android', label: 'Android Icon', icon: Smartphone },
  { id: 'ios', label: 'iOS Icon', icon: Apple },
  { id: 'web', label: 'Web Icons', icon: Globe },
  { id: 'androidTV', label: 'Android TV Banner', icon: MonitorPlay },
  { id: 'playStore', label: 'Play Store Banner', icon: Store },
  { id: 'tvOS', label: 'tvOS App Icon', icon: Tv },
];

export function PlatformTabs({ 
  activeTab, 
  enabledPlatforms,
  onTabChange,
  onTogglePlatform,
}: PlatformTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {PLATFORM_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isEnabled = enabledPlatforms.has(tab.id);
        
        return (
          <motion.div
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[100px]
                ${isActive 
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                  : isEnabled 
                    ? 'border-primary/50 bg-primary/5 hover:border-primary'
                    : 'border-border bg-card hover:border-primary/50 opacity-60'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : isEnabled
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground'
                }
              `}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-medium text-center leading-tight ${
                isActive || isEnabled ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
            
            {/* Toggle button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlatform(tab.id);
              }}
              className={`
                absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                border-2 border-background shadow-md transition-colors z-10
                ${isEnabled 
                  ? 'bg-primary text-primary-foreground hover:bg-destructive' 
                  : 'bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                }
              `}
              title={isEnabled ? 'Remove from export' : 'Add to export'}
            >
              {isEnabled ? (
                <X className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
