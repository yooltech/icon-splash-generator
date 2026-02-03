import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Sparkles, 
  Download,
} from 'lucide-react';
import { HeroSection } from '@/components/HeroSection';
import { SuccessModal } from '@/components/SuccessModal';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { PlatformTabs, type PlatformTab } from '@/components/PlatformTabs';
import { PlatformSidebar } from '@/components/PlatformSidebar';
import { PlatformPreview } from '@/components/PlatformPreview';
import { generateAllIcons } from '@/lib/imageProcessor';
import { 
  type Platform, 
  type IconConfig,
  type GeneratedAsset,
  type AndroidStudioOptions as AndroidStudioOptionsType,
  type ExtendedIconOptions as ExtendedIconOptionsType,
  DEFAULT_ICON_CONFIG,
  DEFAULT_ANDROID_STUDIO_OPTIONS,
  DEFAULT_EXTENDED_ICON_OPTIONS,
} from '@/types/assets';

export function AssetGenerator() {
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState<PlatformTab>('android');
  const [enabledPlatforms, setEnabledPlatforms] = useState<Set<PlatformTab>>(new Set(['android', 'ios', 'splash']));
  const [iconConfig, setIconConfig] = useState<IconConfig>(DEFAULT_ICON_CONFIG);
  const [androidStudioOptions, setAndroidStudioOptions] = useState<AndroidStudioOptionsType>(DEFAULT_ANDROID_STUDIO_OPTIONS);
  const [extendedIconOptions, setExtendedIconOptions] = useState<ExtendedIconOptionsType>(DEFAULT_EXTENDED_ICON_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGetStarted = useCallback(() => {
    setShowHero(false);
  }, []);

  const handleTabChange = useCallback((tab: PlatformTab) => {
    setActiveTab(tab);
  }, []);

  const handleTogglePlatform = useCallback((tab: PlatformTab) => {
    setEnabledPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(tab)) {
        // Don't allow removing the last platform
        if (next.size > 1) {
          next.delete(tab);
          // If we removed the active tab, switch to another enabled tab
          if (tab === activeTab) {
            const remaining = Array.from(next);
            setActiveTab(remaining[0]);
          }
        }
      } else {
        next.add(tab);
      }
      return next;
    });
  }, [activeTab]);

  // Convert PlatformTab set to Platform array for generation
  const platforms = useMemo((): Platform[] => {
    const result: Platform[] = [];
    if (enabledPlatforms.has('android') || enabledPlatforms.has('androidTV')) {
      result.push('android');
    }
    if (enabledPlatforms.has('ios') || enabledPlatforms.has('tvOS')) {
      result.push('ios');
    }
    return result.length > 0 ? result : ['android'];
  }, [enabledPlatforms]);

  // Update extended options based on enabled platforms
  const effectiveExtendedOptions = useMemo((): ExtendedIconOptionsType => ({
    ...extendedIconOptions,
    web: enabledPlatforms.has('web'),
    macOS: enabledPlatforms.has('macOS'),
    tvOS: enabledPlatforms.has('tvOS'),
    androidTV: enabledPlatforms.has('androidTV'),
    playStore: enabledPlatforms.has('playStore'),
    watchOS: enabledPlatforms.has('watchOS'),
  }), [extendedIconOptions, enabledPlatforms]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      setProgress({ current: 0, total: 0, phase: 'Generating icons...' });
      const icons = await generateAllIcons(
        iconConfig, 
        platforms, 
        (current, total) => {
          setProgress({ current, total, phase: 'Generating icons...' });
        },
        androidStudioOptions,
        effectiveExtendedOptions
      );

      setGeneratedAssets(icons);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to generate assets:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [iconConfig, platforms, androidStudioOptions, effectiveExtendedOptions]);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Show hero section
  if (showHero) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">
                <span className="text-gradient">Splash</span>Craft
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleGetStarted}>
                Skip to Generator
              </Button>
            </div>
          </div>
        </header>
        <HeroSection onGetStarted={handleGetStarted} />
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setShowHero(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">
              <span className="text-gradient">Splash</span>Craft
            </h1>
          </button>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="gap-2 btn-primary-glow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Platform Tabs */}
      <div className="border-b border-border py-4 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <PlatformTabs
            activeTab={activeTab}
            enabledPlatforms={enabledPlatforms}
            onTabChange={handleTabChange}
            onTogglePlatform={handleTogglePlatform}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border bg-card overflow-hidden flex flex-col">
          {/* Sidebar Content - Platform specific */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`sidebar-${activeTab}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <PlatformSidebar
                  activeTab={activeTab}
                  iconConfig={iconConfig}
                  onIconConfigChange={setIconConfig}
                  androidStudioOptions={androidStudioOptions}
                  onAndroidStudioOptionsChange={setAndroidStudioOptions}
                  extendedOptions={extendedIconOptions}
                  onExtendedOptionsChange={setExtendedIconOptions}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="h-full"
            >
              <PlatformPreview
                activeTab={activeTab}
                iconConfig={iconConfig}
                extendedOptions={extendedIconOptions}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Generation Progress Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-card p-8 rounded-2xl shadow-2xl text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p className="font-medium">{progress.phase}</p>
              {progress.total > 0 && (
                <div className="w-64 bg-secondary rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {progress.current} / {progress.total} assets
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccess}
        onClose={handleCloseSuccess}
        assets={generatedAssets}
        platforms={platforms}
      />
    </div>
  );
}
