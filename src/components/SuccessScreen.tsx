import { motion } from 'framer-motion';
import { Check, Folder, Smartphone, Apple, ExternalLink } from 'lucide-react';
import type { Platform, Framework, GeneratedAsset } from '@/types/assets';
import { Button } from '@/components/ui/button';
import { createZipAndDownload } from '@/lib/zipExport';

interface SuccessScreenProps {
  assets: GeneratedAsset[];
  platforms: Platform[];
  framework: Framework;
  onReset: () => void;
}

const frameworkDocs: Record<Framework, { label: string; url: string; steps: string[] }> = {
  capacitor: {
    label: 'Capacitor',
    url: 'https://capacitorjs.com/docs/guides/splash-screens-and-icons',
    steps: [
      'Unzip assets to your project root',
      'Copy icons to android/app/src/main/res/',
      'Copy iOS icons to ios/App/App/Assets.xcassets/AppIcon.appiconset/',
      'Run npx cap sync to apply changes',
    ],
  },
  flutter: {
    label: 'Flutter',
    url: 'https://docs.flutter.dev/deployment/android#adding-a-launcher-icon',
    steps: [
      'Copy Android icons to android/app/src/main/res/',
      'Copy iOS icons to ios/Runner/Assets.xcassets/AppIcon.appiconset/',
      'Use flutter_native_splash package for splash screens',
      'Run flutter pub get && flutter pub run flutter_native_splash:create',
    ],
  },
  'react-native': {
    label: 'React Native',
    url: 'https://reactnative.dev/docs/images#static-image-resources',
    steps: [
      'Copy Android icons to android/app/src/main/res/',
      'Copy iOS icons to ios/YourApp/Images.xcassets/AppIcon.appiconset/',
      'Use react-native-splash-screen for splash screens',
      'Link the native modules and rebuild your app',
    ],
  },
  native: {
    label: 'Native Development',
    url: 'https://developer.android.com/guide/topics/resources/providing-resources',
    steps: [
      'Copy Android icons to app/src/main/res/ mipmap folders',
      'Copy iOS icons to Assets.xcassets/AppIcon.appiconset/',
      'Configure splash screens in your native project',
      'Rebuild and test on both platforms',
    ],
  },
};

export function SuccessScreen({ assets, platforms, framework, onReset }: SuccessScreenProps) {
  const androidIcons = assets.filter((a) => a.path.includes('android/icons')).length;
  const iosIcons = assets.filter((a) => a.path.includes('ios/icons')).length;
  const androidSplash = assets.filter((a) => a.path.includes('android/splash')).length;
  const iosSplash = assets.filter((a) => a.path.includes('ios/splash')).length;

  const docs = frameworkDocs[framework];

  const handleDownload = async () => {
    await createZipAndDownload(assets);
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Assets Generated Successfully!</h2>
        <p className="text-muted-foreground">
          {assets.length} files ready for download
        </p>
      </motion.div>

      {/* Asset Summary */}
      <div className="grid grid-cols-2 gap-4">
        {platforms.includes('android') && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="font-medium">Android</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="w-4 h-4" />
                <span>{androidIcons} icons</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="w-4 h-4" />
                <span>{androidSplash} splash screens</span>
              </div>
            </div>
          </motion.div>
        )}

        {platforms.includes('ios') && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Apple className="w-5 h-5 text-primary" />
              <span className="font-medium">iOS</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="w-4 h-4" />
                <span>{iosIcons} icons</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Folder className="w-4 h-4" />
                <span>{iosSplash} splash screens</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Download Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleDownload}
          size="lg"
          className="w-full btn-primary-glow"
        >
          Download ZIP
        </Button>
      </motion.div>

      {/* Framework Instructions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Next Steps for {docs.label}</h3>
          <a
            href={docs.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm flex items-center gap-1 hover:underline"
          >
            Docs <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <ol className="space-y-3">
          {docs.steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Start Over */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <button
          onClick={onReset}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Generate new assets →
        </button>
      </motion.div>
    </div>
  );
}
