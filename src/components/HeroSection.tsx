import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Smartphone, 
  Download, 
  Palette, 
  Layers, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const features = [
  { icon: Palette, label: 'Icon Designer', description: 'Custom backgrounds, shapes & effects' },
  { icon: Layers, label: 'Adaptive Icons', description: 'Android foreground & background layers' },
  { icon: Smartphone, label: 'All Sizes', description: 'Every Android & iOS size generated' },
  { icon: Download, label: 'One-Click Export', description: 'Download organized ZIP folder' },
];

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(270 80% 60%) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ 
            x: [0, 20, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(200 80% 50%) 0%, transparent 70%)' }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">100% Free • No Sign-up</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Generate{' '}
              <span className="text-gradient">App Icons</span>{' '}
              &{' '}
              <span className="text-gradient">Splash Screens</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Design beautiful app icons and splash screens, then export all required sizes 
              for Android and iOS in one click. Works entirely in your browser.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="gap-2 btn-primary-glow text-base px-8"
              >
                Start Designing
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base"
                onClick={onGetStarted}
              >
                <Smartphone className="w-5 h-5" />
                Android & iOS
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {['Capacitor', 'Flutter', 'React Native', 'Native'].map((fw, i) => (
                <motion.span
                  key={fw}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-3 py-1 rounded-full bg-secondary/50 text-xs text-muted-foreground"
                >
                  {fw}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Floating Icons Animation */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Center Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                  y: [0, -10, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-3xl shadow-2xl flex items-center justify-center z-10"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>

              {/* Orbiting Icons */}
              {[
                { delay: 0, color: '#EC4899', emoji: '🚀', size: 'w-16 h-16', radius: 140, speed: 20 },
                { delay: 0.5, color: '#22C55E', emoji: '⭐', size: 'w-14 h-14', radius: 120, speed: 25 },
                { delay: 1, color: '#F97316', emoji: '💎', size: 'w-12 h-12', radius: 160, speed: 18 },
                { delay: 1.5, color: '#06B6D4', emoji: '🎯', size: 'w-14 h-14', radius: 130, speed: 22 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: item.speed, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: item.delay,
                  }}
                  className="absolute top-1/2 left-1/2"
                  style={{ 
                    width: item.radius * 2, 
                    height: item.radius * 2,
                    marginLeft: -item.radius,
                    marginTop: -item.radius,
                  }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ 
                      duration: item.speed, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: item.delay,
                    }}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 ${item.size} rounded-2xl shadow-lg flex items-center justify-center text-2xl`}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.emoji}
                  </motion.div>
                </motion.div>
              ))}

              {/* Size Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2"
              >
                {['48', '72', '96', '144', '192'].map((size, i) => (
                  <motion.span
                    key={size}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="px-2 py-1 rounded bg-secondary text-xs text-muted-foreground"
                  >
                    {size}px
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-sm mb-1">{feature.label}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
