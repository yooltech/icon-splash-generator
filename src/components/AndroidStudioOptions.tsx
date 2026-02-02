import { motion } from 'framer-motion';
import { FolderTree, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { type AndroidStudioOptions as AndroidStudioOptionsType } from '@/types/assets';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AndroidStudioOptionsProps {
  options: AndroidStudioOptionsType;
  onChange: (options: AndroidStudioOptionsType) => void;
  hasAndroid: boolean;
}

export function AndroidStudioOptions({
  options,
  onChange,
  hasAndroid,
}: AndroidStudioOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!hasAndroid) {
    return null;
  }

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <FolderTree className="w-5 h-5 text-primary" />
        <h3 className="font-medium">Advanced Options</h3>
      </div>

      <div className="space-y-4">
        {/* Main checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="android-studio-structure"
            checked={options.enabled}
            onCheckedChange={(checked) =>
              onChange({ ...options, enabled: checked === true })
            }
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="android-studio-structure"
                className="font-medium cursor-pointer"
              >
                Android Studio Folder Structure
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Generates assets using official Android resource folder
                      naming conventions (mipmap-*, drawable-port/land-*) for
                      direct use in Android Studio projects.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Generate Android icons and splash screens using the official
              Android Studio resource folder structure (mipmap-* and
              drawable-port/land).
            </p>
          </div>
        </div>

        {/* Sub-options when enabled */}
        {options.enabled && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-7"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
                Additional icon assets
              </motion.button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-7 mt-3 space-y-3 p-4 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="generate-round"
                    checked={options.generateRoundIcon}
                    onCheckedChange={(checked) =>
                      onChange({ ...options, generateRoundIcon: checked === true })
                    }
                  />
                  <Label htmlFor="generate-round" className="text-sm cursor-pointer">
                    Generate ic_launcher_round.png
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="generate-foreground"
                    checked={options.generateForeground}
                    onCheckedChange={(checked) =>
                      onChange({ ...options, generateForeground: checked === true })
                    }
                  />
                  <Label htmlFor="generate-foreground" className="text-sm cursor-pointer">
                    Generate ic_launcher_foreground.png
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="generate-monochrome"
                    checked={options.generateMonochrome}
                    onCheckedChange={(checked) =>
                      onChange({ ...options, generateMonochrome: checked === true })
                    }
                  />
                  <Label htmlFor="generate-monochrome" className="text-sm cursor-pointer">
                    Generate ic_launcher_monochrome.png (Material You)
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="generate-adaptive-xml"
                    checked={options.generateAdaptiveXml}
                    onCheckedChange={(checked) =>
                      onChange({ ...options, generateAdaptiveXml: checked === true })
                    }
                  />
                  <Label htmlFor="generate-adaptive-xml" className="text-sm cursor-pointer">
                    Generate mipmap-anydpi-v26/ic_launcher.xml (Adaptive Icon)
                  </Label>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="generate-splash-xml"
                    checked={options.generateSplashXml}
                    onCheckedChange={(checked) =>
                      onChange({ ...options, generateSplashXml: checked === true })
                    }
                  />
                  <Label htmlFor="generate-splash-xml" className="text-sm cursor-pointer">
                    Generate drawable-v24/launch_background.xml (Android 12+)
                  </Label>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Folder structure preview */}
        {options.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="ml-7 mt-4"
          >
            <p className="text-xs text-muted-foreground mb-2">Output structure:</p>
            <div className="text-xs font-mono bg-secondary/50 p-3 rounded-lg border border-border overflow-x-auto">
              <div className="text-muted-foreground">res/</div>
              <div className="ml-2">
                <span className="text-primary">├── mipmap-mdpi/</span>
                <span className="text-muted-foreground">ic_launcher.png</span>
              </div>
              <div className="ml-2">
                <span className="text-primary">├── mipmap-hdpi/</span>
                <span className="text-muted-foreground">...</span>
              </div>
              <div className="ml-2">
                <span className="text-primary">├── mipmap-anydpi-v26/</span>
                <span className="text-muted-foreground">ic_launcher.xml</span>
              </div>
              <div className="ml-2">
                <span className="text-primary">├── drawable-port-mdpi/</span>
                <span className="text-muted-foreground">splash.png</span>
              </div>
              <div className="ml-2">
                <span className="text-primary">├── drawable-land-mdpi/</span>
                <span className="text-muted-foreground">splash.png</span>
              </div>
              <div className="ml-2">
                <span className="text-primary">└── drawable-v24/</span>
                <span className="text-muted-foreground">launch_background.xml</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
