import { motion } from 'framer-motion';
import { IconPreview } from '@/components/icon-designer/IconPreview';
import type { IconConfig, ExtendedIconOptions } from '@/types/assets';
import type { PlatformTab } from './PlatformTabs';

interface PlatformPreviewProps {
  activeTab: PlatformTab;
  iconConfig: IconConfig;
  extendedOptions: ExtendedIconOptions;
}

export function PlatformPreview({
  activeTab,
  iconConfig,
  extendedOptions,
}: PlatformPreviewProps) {
  // Android phone mockup preview
  const renderAndroidPreview = () => (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-[40px] p-3 shadow-2xl">
        {/* Screen */}
        <div className="relative w-full h-full bg-gradient-to-b from-sky-200 to-amber-100 rounded-[28px] overflow-hidden">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-2 text-xs text-slate-700">
            <span>10:08</span>
            <div className="flex items-center gap-1">
              <span>📶</span>
              <span>🔋 100%</span>
            </div>
          </div>
          
          {/* Notification */}
          <div className="mx-4 mt-4 bg-white/80 backdrop-blur rounded-xl p-3 shadow-sm">
            <p className="text-sm font-medium text-slate-800">Lunch with Jane</p>
            <p className="text-xs text-slate-500">📅 4:00 PM - 4:30 PM</p>
          </div>
          
          {/* App Icons Row */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4">
            {/* Other app icons */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center">
                <span className="text-white text-2xl">📞</span>
              </div>
              <span className="text-xs text-slate-600">Phone</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow">
                <span className="text-2xl">✉️</span>
              </div>
              <span className="text-xs text-slate-600">Gmail</span>
            </div>
            
            {/* Your App Icon */}
            <div className="flex flex-col items-center gap-1">
              <IconPreview config={iconConfig} size={56} />
              <span className="text-xs text-slate-600">App Name</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center">
                <span className="text-white text-2xl">🧮</span>
              </div>
              <span className="text-xs text-slate-600">Calculator</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow">
                <span className="text-2xl">▶️</span>
              </div>
              <span className="text-xs text-slate-600">Play Store</span>
            </div>
          </div>
          
          {/* Landscape background */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-200 to-transparent" />
        </div>
      </div>
    </div>
  );

  // iOS phone mockup preview
  const renderIOSPreview = () => (
    <div className="relative">
      {/* iPhone Frame */}
      <div className="relative w-[280px] h-[560px] mx-auto bg-black rounded-[50px] p-3 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
        
        {/* Screen */}
        <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-[38px] overflow-hidden">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 pt-12 pb-2 text-xs text-white">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
          
          {/* App Icons Grid */}
          <div className="grid grid-cols-4 gap-4 p-6 pt-4">
            {/* Row 1 */}
            <div className="flex flex-col items-center gap-1">
              <IconPreview config={iconConfig} size={52} />
              <span className="text-[10px] text-white">My App</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-13 h-13 rounded-xl bg-blue-500 flex items-center justify-center" style={{ width: 52, height: 52 }}>
                <span className="text-white text-xl">📱</span>
              </div>
              <span className="text-[10px] text-white">Phone</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-13 h-13 rounded-xl bg-green-500 flex items-center justify-center" style={{ width: 52, height: 52 }}>
                <span className="text-white text-xl">💬</span>
              </div>
              <span className="text-[10px] text-white">Messages</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-13 h-13 rounded-xl bg-white flex items-center justify-center" style={{ width: 52, height: 52 }}>
                <span className="text-xl">🎵</span>
              </div>
              <span className="text-[10px] text-white">Music</span>
            </div>
          </div>
          
          {/* Dock */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-xl rounded-3xl p-3">
            <div className="flex justify-around">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <span className="text-white">📞</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <span>🧭</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <span className="text-white">✉️</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <span>⚙️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Web preview (browser with icons)
  const renderWebPreview = () => (
    <div className="relative max-w-lg mx-auto">
      {/* Browser Frame */}
      <div className="bg-slate-100 rounded-xl overflow-hidden shadow-2xl">
        {/* Browser Header */}
        <div className="bg-slate-200 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 ml-4">
            <IconPreview config={iconConfig} size={16} />
            <span className="text-xs text-slate-600">{extendedOptions.webAppName || 'My App'}</span>
            <span className="text-xs text-slate-400 ml-auto">myapp.com</span>
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="bg-white p-8">
          <div className="text-center mb-8">
            <IconPreview config={iconConfig} size={120} />
            <h2 className="text-xl font-bold mt-4 text-slate-800">{extendedOptions.webAppName || 'My App'}</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center text-xs text-slate-500">
            <div>
              <div className="bg-slate-100 rounded-lg p-2 mb-1">
                <IconPreview config={iconConfig} size={32} />
              </div>
              <span>16×16</span>
            </div>
            <div>
              <div className="bg-slate-100 rounded-lg p-2 mb-1">
                <IconPreview config={iconConfig} size={32} />
              </div>
              <span>32×32</span>
            </div>
            <div>
              <div className="bg-slate-100 rounded-lg p-2 mb-1">
                <IconPreview config={iconConfig} size={48} />
              </div>
              <span>192×192</span>
            </div>
            <div>
              <div className="bg-slate-100 rounded-lg p-2 mb-1">
                <IconPreview config={iconConfig} size={64} />
              </div>
              <span>512×512</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Play Store banner preview
  const renderPlayStorePreview = () => (
    <div className="max-w-2xl mx-auto">
      {/* Feature Graphic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: '1024/500' }}
      >
        <div 
          className="w-full h-full flex flex-col items-center justify-center"
          style={{
            background: iconConfig.backgroundType === 'gradient'
              ? `linear-gradient(${iconConfig.gradient.direction.replace('to-', 'to ')}, ${iconConfig.gradient.colors.join(', ')})`
              : iconConfig.backgroundColor,
          }}
        >
          <IconPreview config={iconConfig} size={100} />
          <h2 className="text-3xl font-bold text-white mt-4 drop-shadow-lg">
            {extendedOptions.playStoreAppName || 'Your App'}
          </h2>
        </div>
      </motion.div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Feature Graphic (1024 × 500)
      </p>
    </div>
  );

  // Android TV banner preview
  const renderAndroidTVPreview = () => (
    <div className="max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: '320/180' }}
      >
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            background: iconConfig.backgroundType === 'gradient'
              ? `linear-gradient(${iconConfig.gradient.direction.replace('to-', 'to ')}, ${iconConfig.gradient.colors.join(', ')})`
              : iconConfig.backgroundColor,
          }}
        >
          <IconPreview config={iconConfig} size={80} />
        </div>
      </motion.div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Leanback Banner (320 × 180)
      </p>
    </div>
  );

  // tvOS preview
  const renderTVOSPreview = () => (
    <div className="max-w-xl mx-auto">
      {/* TV Frame */}
      <div className="bg-slate-900 rounded-xl p-6 shadow-2xl">
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-8">
          <div className="flex items-center gap-6">
            <IconPreview config={iconConfig} size={120} />
            <div>
              <h3 className="text-white text-xl font-semibold">App Name</h3>
              <p className="text-slate-400 text-sm">Apple TV</p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        tvOS App Icon Preview
      </p>
    </div>
  );

  // Splash Screen preview
  const renderSplashPreview = () => (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-[40px] p-3 shadow-2xl">
        {/* Screen */}
        <div 
          className="relative w-full h-full rounded-[28px] overflow-hidden flex flex-col items-center justify-center"
          style={{
            background: iconConfig.backgroundType === 'gradient'
              ? `linear-gradient(${iconConfig.gradient.direction.replace('to-', 'to ')}, ${iconConfig.gradient.colors.join(', ')})`
              : iconConfig.backgroundColor,
          }}
        >
          {/* Only show icon if splashShowIcon is true */}
          {extendedOptions.splashShowIcon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <IconPreview config={iconConfig} size={100} />
            </motion.div>
          )}
          
          {extendedOptions.splashShowName !== false && (
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-2xl font-bold drop-shadow-lg ${extendedOptions.splashShowIcon ? 'mt-6' : ''}`}
              style={{ color: extendedOptions.splashTextColor || '#FFFFFF' }}
            >
              {extendedOptions.splashAppName || 'My App'}
            </motion.h2>
          )}
          
          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-16"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/60"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Splash Screen Preview
      </p>
    </div>
  );

  // macOS preview
  const renderMacOSPreview = () => (
    <div className="max-w-2xl mx-auto">
      {/* macOS Desktop Mockup */}
      <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl p-8 shadow-2xl">
        {/* Mac Screen */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          {/* Menu Bar */}
          <div className="h-6 bg-slate-700/50 flex items-center px-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          
          {/* Desktop */}
          <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8 min-h-[300px]">
            {/* Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl rounded-2xl px-4 py-2 flex items-end gap-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <span className="text-white text-lg">🔍</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <span className="text-lg">⚙️</span>
              </div>
              <div className="relative">
                <IconPreview config={iconConfig} size={48} />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-white text-lg">📧</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <span className="text-lg">📁</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Size Grid */}
      <div className="mt-6 grid grid-cols-5 gap-4 text-center text-xs text-muted-foreground">
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={iconConfig} size={16} />
          </div>
          <span>16×16</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={iconConfig} size={32} />
          </div>
          <span>32×32</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={iconConfig} size={64} />
          </div>
          <span>128×128</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={iconConfig} size={64} />
          </div>
          <span>256×256</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={iconConfig} size={64} />
          </div>
          <span>512×512</span>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        macOS App Icon (10 sizes @ 1x and 2x)
      </p>
    </div>
  );

  // watchOS preview
  const renderWatchOSPreview = () => (
    <div className="flex flex-col items-center gap-8">
      {/* Apple Watch Mockup */}
      <div className="relative">
        {/* Watch Frame */}
        <div className="w-[180px] h-[220px] bg-gradient-to-br from-slate-700 to-slate-900 rounded-[40px] p-2 shadow-2xl">
          {/* Watch Band Top */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[140px] h-12 bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-xl" />
          {/* Watch Band Bottom */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[140px] h-12 bg-gradient-to-t from-slate-600 to-slate-700 rounded-b-xl" />
          
          {/* Screen */}
          <div className="relative w-full h-full bg-black rounded-[32px] overflow-hidden flex flex-col">
            {/* Time */}
            <div className="text-center pt-4">
              <span className="text-white text-2xl font-light">10:09</span>
            </div>
            
            {/* App Grid */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
                <IconPreview config={{...iconConfig, shape: 'circle'}} size={40} />
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-sm">❤️</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm">🎵</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm">📍</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Digital Crown */}
          <div className="absolute top-1/4 -right-1 w-2 h-8 bg-slate-600 rounded-r-full" />
          {/* Side Button */}
          <div className="absolute top-1/2 -right-1 w-2 h-4 bg-slate-600 rounded-r-full" />
        </div>
      </div>
      
      {/* Size Requirements */}
      <div className="grid grid-cols-4 gap-4 text-center text-xs text-muted-foreground">
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={{...iconConfig, shape: 'circle'}} size={24} />
          </div>
          <span>24@2x</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={{...iconConfig, shape: 'circle'}} size={40} />
          </div>
          <span>40@2x</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={{...iconConfig, shape: 'circle'}} size={44} />
          </div>
          <span>44@2x</span>
        </div>
        <div>
          <div className="bg-card rounded-lg p-3 mb-2 flex items-center justify-center">
            <IconPreview config={{...iconConfig, shape: 'circle'}} size={50} />
          </div>
          <span>50@2x</span>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        watchOS App Icon (14 sizes, circular)
      </p>
    </div>
  );

  return (
    <div className="h-full flex items-start justify-center p-8 pt-12 bg-muted/30 rounded-xl overflow-auto">
      {activeTab === 'android' && renderAndroidPreview()}
      {activeTab === 'ios' && renderIOSPreview()}
      {activeTab === 'web' && renderWebPreview()}
      {activeTab === 'playStore' && renderPlayStorePreview()}
      {activeTab === 'androidTV' && renderAndroidTVPreview()}
      {activeTab === 'tvOS' && renderTVOSPreview()}
      {activeTab === 'splash' && renderSplashPreview()}
      {activeTab === 'macOS' && renderMacOSPreview()}
      {activeTab === 'watchOS' && renderWatchOSPreview()}
    </div>
  );
}
