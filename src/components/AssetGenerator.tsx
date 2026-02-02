import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Palette, 
  Image, 
  Eye, 
  Download,
  Smartphone,
  Apple
} from 'lucide-react';
import { StepIndicator } from '@/components/StepIndicator';
import { HeroSection } from '@/components/HeroSection';
import { IconDesigner } from '@/components/icon-designer';
import { SplashDesigner } from '@/components/splash-designer';
import { SuccessScreen } from '@/components/SuccessScreen';
import { Button } from '@/components/ui/button';
import { generateAllIcons, generateAllSplashScreens } from '@/lib/imageProcessor';
import { 
  type Platform, 
  type Framework, 
  type IconConfig,
  type SplashConfig,
  type GeneratedAsset,
  DEFAULT_ICON_CONFIG,
  DEFAULT_SPLASH_CONFIG,
} from '@/types/assets';

const STEPS = ['Icon', 'Splash', 'Preview', 'Generate'];

const frameworkOptions: { id: Framework; label: string }[] = [
  { id: 'capacitor', label: 'Capacitor' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'react-native', label: 'React Native' },
  { id: 'native', label: 'Native' },
];

export function AssetGenerator() {
  const [showHero, setShowHero] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>(['android', 'ios']);
  const [framework, setFramework] = useState<Framework>('capacitor');
  const [iconConfig, setIconConfig] = useState<IconConfig>(DEFAULT_ICON_CONFIG);
  const [splashConfig, setSplashConfig] = useState<SplashConfig>(DEFAULT_SPLASH_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  const handleGetStarted = useCallback(() => {
    setShowHero(false);
  }, []);

  const handleNext = useCallback(async () => {
    if (currentStep === 2) {
      // Generate assets
      setIsGenerating(true);
      try {
        const allAssets: GeneratedAsset[] = [];

        // Generate icons
        setProgress({ current: 0, total: 0, phase: 'Generating icons...' });
        const icons = await generateAllIcons(iconConfig, platforms, (current, total) => {
          setProgress({ current, total, phase: 'Generating icons...' });
        });
        allAssets.push(...icons);

        // Generate splash screens
        setProgress({ current: 0, total: 0, phase: 'Generating splash screens...' });
        const splashScreens = await generateAllSplashScreens(
          splashConfig,
          platforms,
          (current, total) => {
            setProgress({ current, total, phase: 'Generating splash screens...' });
          }
        );
        allAssets.push(...splashScreens);

        setGeneratedAssets(allAssets);
        setCurrentStep(3);
      } catch (error) {
        console.error('Failed to generate assets:', error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  }, [currentStep, iconConfig, splashConfig, platforms]);

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      setShowHero(true);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  }, [currentStep]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setGeneratedAssets([]);
  }, []);

  const togglePlatform = (platform: Platform) => {
    if (platforms.includes(platform)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter((p) => p !== platform));
      }
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  // Show hero section
  if (showHero) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">
                <span className="text-gradient">App Asset</span> Generator
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleGetStarted}>
              Skip to Generator
            </Button>
          </div>
        </header>
        <HeroSection onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setShowHero(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">
              <span className="text-gradient">App Asset</span> Generator
            </h1>
          </button>
          <span className="text-xs text-muted-foreground">Android & iOS</span>
        </div>
      </header>

      {/* Progress */}
      <div className="py-6 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8 px-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Icon Designer */}
            {currentStep === 0 && (
              <motion.div
                key="icon"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Design Your App Icon</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose source, background, shape, and effects
                    </p>
                  </div>
                </div>

                <IconDesigner config={iconConfig} onChange={setIconConfig} />
              </motion.div>
            )}

            {/* Step 2: Splash Designer */}
            {currentStep === 1 && (
              <motion.div
                key="splash"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Image className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Design Your Splash Screen</h2>
                    <p className="text-sm text-muted-foreground">
                      Add logo, text, and customize the background
                    </p>
                  </div>
                </div>

                <SplashDesigner config={splashConfig} onChange={setSplashConfig} />
              </motion.div>
            )}

            {/* Step 3: Preview & Settings */}
            {currentStep === 2 && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Preview & Generate</h2>
                    <p className="text-sm text-muted-foreground">
                      Review your designs and select target platforms
                    </p>
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="glass-card p-6">
                  <h3 className="font-medium mb-4">Target Platforms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => togglePlatform('android')}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                        ${platforms.includes('android')
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/30'
                        }
                      `}
                    >
                      <Smartphone className={`w-5 h-5 ${platforms.includes('android') ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={platforms.includes('android') ? 'text-foreground' : 'text-muted-foreground'}>Android</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => togglePlatform('ios')}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                        ${platforms.includes('ios')
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-secondary/30'
                        }
                      `}
                    >
                      <Apple className={`w-5 h-5 ${platforms.includes('ios') ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={platforms.includes('ios') ? 'text-foreground' : 'text-muted-foreground'}>iOS</span>
                    </motion.button>
                  </div>

                  <h4 className="font-medium mt-6 mb-3 text-sm text-muted-foreground">Framework Preset</h4>
                  <div className="flex flex-wrap gap-2">
                    {frameworkOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFramework(option.id)}
                        className={`
                          px-4 py-2 rounded-lg border text-sm transition-all
                          ${framework === option.id
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-secondary/30 text-muted-foreground'
                          }
                        `}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Icon Preview */}
                  <div className="glass-card p-6">
                    <h3 className="font-medium mb-4">App Icon</h3>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                          background: iconConfig.backgroundType === 'gradient'
                            ? `linear-gradient(${iconConfig.gradient.direction.replace('to-', 'to ')}, ${iconConfig.gradient.colors.join(', ')})`
                            : iconConfig.backgroundColor,
                        }}
                      >
                        <span className="text-white text-2xl">
                          {iconConfig.sourceType === 'clipart' ? iconConfig.sourceValue : '✦'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Shape: {iconConfig.shape}</p>
                        <p>Background: {iconConfig.backgroundType}</p>
                        <p>Filename: {iconConfig.filename}.png</p>
                        {iconConfig.useAdaptiveIcon && (
                          <p className="text-primary">+ Adaptive Icon</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Splash Preview */}
                  <div className="glass-card p-6">
                    <h3 className="font-medium mb-4">Splash Screen</h3>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-14 h-24 rounded-lg flex items-center justify-center"
                        style={{
                          background: splashConfig.backgroundType === 'gradient'
                            ? `linear-gradient(${splashConfig.gradient.direction.replace('to-', 'to ')}, ${splashConfig.gradient.colors.join(', ')})`
                            : splashConfig.backgroundColor,
                        }}
                      >
                        {splashConfig.logoImage && (
                          <img 
                            src={splashConfig.logoImage} 
                            alt="Logo" 
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Content: {splashConfig.contentType}</p>
                        <p>Position: {splashConfig.position}</p>
                        <p>Scale: {splashConfig.scale}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generation Button */}
                <div className="text-center">
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 mb-4"
                    >
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="text-sm text-muted-foreground">{progress.phase}</p>
                      {progress.total > 0 && (
                        <div className="w-64 mx-auto bg-secondary rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Success/Download */}
            {currentStep === 3 && (
              <motion.div
                key="download"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <SuccessScreen
                  assets={generatedAssets}
                  platforms={platforms}
                  framework={framework}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Navigation */}
      {currentStep < 3 && (
        <footer className="border-t border-border py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isGenerating}
              className="gap-2 btn-primary-glow"
            >
              {currentStep === 2 ? (
                isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Assets
                    <Download className="w-4 h-4" />
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
