import { Sparkles, Github, Twitter, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">
                <span className="text-gradient">Splash</span>Craft
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Generate professional Android and iOS app icons and splash screens from one design.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="https://developer.android.com/develop/ui/views/launch/icon_design_adaptive" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Android Adaptive Icons
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://developer.apple.com/design/human-interface-guidelines/app-icons" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  iOS App Icon Guidelines
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://capacitorjs.com/docs/guides/splash-screens-and-icons" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Capacitor Assets Guide
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Credits */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Connect</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/yooltech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com/yooltech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} <span className="font-medium">Yooltech</span>. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for mobile developers
          </p>
        </div>
      </div>
    </footer>
  );
}
