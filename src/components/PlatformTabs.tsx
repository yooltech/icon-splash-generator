import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Apple, 
  Globe, 
  Tv, 
  MonitorPlay,
  Store
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
  onTabChange 
}: PlatformTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {PLATFORM_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isEnabled = enabledPlatforms.has(tab.id);
        
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all min-w-[100px]
              ${isActive 
                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                : isEnabled 
                  ? 'border-primary/50 bg-primary/5 hover:border-primary'
                  : 'border-border bg-card hover:border-primary/50'
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
            
            {/* Active indicator dot */}
            {isEnabled && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
