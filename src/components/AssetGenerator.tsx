import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { StepIndicator } from '@/components/StepIndicator';
import { UploadZone } from '@/components/UploadZone';
import { PlatformSelector } from '@/components/PlatformSelector';
import { SplashCustomizer } from '@/components/SplashCustomizer';
import { SuccessScreen } from '@/components/SuccessScreen';
import { Button } from '@/components/ui/button';
import { generateIcons, generateSplashScreens } from '@/lib/imageProcessor';
import type { Platform, Framework, UploadedImage, GeneratedAsset } from '@/types/assets';

const STEPS = ['Upload', 'Customize', 'Generate', 'Download'];

export function AssetGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [iconImage, setIconImage] = useState<UploadedImage | null>(null);
  const [splashLogo, setSplashLogo] = useState<UploadedImage | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(['android', 'ios']);
  const [framework, setFramework] = useState<Framework>('capacitor');
  const [backgroundColor, setBackgroundColor] = useState('#00D4AA');
  const [isDarkSplash, setIsDarkSplash] = useState(false);
  const [padding, setPadding] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: '' });
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);

  const canProceedFromUpload = iconImage !== null && splashLogo !== null;
  const canProceedFromCustomize = platforms.length > 0;

  const handleNext = useCallback(async () => {
    if (currentStep === 2) {
      // Generate assets
      setIsGenerating(true);
      try {
        const allAssets: GeneratedAsset[] = [];
        
        // Generate icons
        setProgress({ current: 0, total: 0, phase: 'Generating icons...' });
        const icons = await generateIcons(iconImage!, platforms, (current, total) => {
          setProgress({ current, total, phase: 'Generating icons...' });
        });
        allAssets.push(...icons);

        // Generate splash screens
        setProgress({ current: 0, total: 0, phase: 'Generating splash screens...' });
        const effectiveBackground = isDarkSplash ? '#0a0a0f' : backgroundColor;
        const splashScreens = await generateSplashScreens(
          splashLogo!,
          platforms,
          effectiveBackground,
          padding,
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
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }, [currentStep, iconImage, splashLogo, platforms, backgroundColor, isDarkSplash, padding]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIconImage(null);
    setSplashLogo(null);
    setGeneratedAssets([]);
  }, []);

  const canProceed = 
    (currentStep === 0 && canProceedFromUpload) ||
    (currentStep === 1 && canProceedFromCustomize) ||
    currentStep === 2;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">
              <span className="text-gradient">Asset</span> Generator
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">Android & iOS</span>
        </div>
      </header>

      {/* Progress */}
      <div className="py-8 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Upload Your Assets</h2>
                  <p className="text-muted-foreground">
                    Start by uploading your app icon and splash logo
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <UploadZone
                    label="App Icon"
                    description="PNG, exactly 1024×1024 px"
                    requiredWidth={1024}
                    requiredHeight={1024}
                    accept="image/png"
                    value={iconImage}
                    onChange={setIconImage}
                  />
                  <UploadZone
                    label="Splash Logo"
                    description="PNG or SVG, any size"
                    accept="image/png,image/svg+xml"
                    value={splashLogo}
                    onChange={setSplashLogo}
                  />
                </div>

                <PlatformSelector
                  platforms={platforms}
                  framework={framework}
                  onPlatformsChange={setPlatforms}
                  onFrameworkChange={setFramework}
                />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="customize"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Customize Splash Screen</h2>
                  <p className="text-muted-foreground">
                    Choose colors and adjust your splash screen design
                  </p>
                </div>

                <SplashCustomizer
                  logoImage={splashLogo}
                  backgroundColor={backgroundColor}
                  isDarkSplash={isDarkSplash}
                  padding={padding}
                  onBackgroundColorChange={setBackgroundColor}
                  onDarkSplashToggle={setIsDarkSplash}
                  onPaddingChange={setPadding}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-12"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Ready to Generate</h2>
                  <p className="text-muted-foreground">
                    Click the button below to generate all your assets
                  </p>
                </div>

                <div className="glass-card p-8 mb-8">
                  <div className="grid grid-cols-2 gap-6 text-left mb-8">
                    <div>
                      <h3 className="font-medium mb-2">App Icon</h3>
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary">
                        {iconImage && (
                          <img src={iconImage.dataUrl} alt="Icon" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Splash Logo</h3>
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex items-center justify-center">
                        {splashLogo && (
                          <img src={splashLogo.dataUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Platforms: {platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</p>
                    <p>Framework: {framework.charAt(0).toUpperCase() + framework.slice(1).replace('-', ' ')}</p>
                    <p>Background: {isDarkSplash ? 'Dark' : backgroundColor}</p>
                  </div>
                </div>

                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground">{progress.phase}</p>
                    {progress.total > 0 && (
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${(progress.current / progress.total) * 100}%` }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

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
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed || isGenerating}
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
                    <Sparkles className="w-4 h-4" />
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
