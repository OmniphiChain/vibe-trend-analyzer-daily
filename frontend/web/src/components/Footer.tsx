import { Code2, Github, Twitter, Linkedin, Mail, ExternalLink, Puzzle, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { cn } from '@/lib/utils';

interface FooterProps {
  onNavigate?: (section: string) => void;
  compact?: boolean;
  className?: string;
}

export const Footer = ({ onNavigate, compact = false, className }: FooterProps) => {
  const { themeMode } = useMoodTheme();

  const footerLinks = {
    explore: [
      { label: 'Analytics', icon: BarChart3, action: () => onNavigate?.('analytics') },
      { label: 'Community', icon: Users, action: () => onNavigate?.('community') },
      { label: 'Plugin Hub', icon: Puzzle, action: () => onNavigate?.('plugins'), badge: 'NEW' },
      { label: 'Settings', icon: Settings, action: () => onNavigate?.('settings') },
    ],
    plugins: [
      { label: 'Browse Plugins', action: () => onNavigate?.('plugins') },
      { label: 'Submit Plugin', action: () => onNavigate?.('plugin-submission') },
      { label: 'Developer Docs', action: () => onNavigate?.('plugin-submission') },
      { label: 'Plugin API', action: () => onNavigate?.('plugin-submission') },
    ],
    company: [
      { label: 'About Us', action: () => onNavigate?.('about') },
      { label: 'Careers', action: () => {} },
      { label: 'Contact', action: () => {} },
      { label: 'Blog', action: () => onNavigate?.('blog') },
    ],
    legal: [
      { label: 'Privacy Policy', action: () => {} },
      { label: 'Terms of Service', action: () => {} },
      { label: 'Cookie Policy', action: () => {} },
      { label: 'Security', action: () => {} },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@neomsense.com', label: 'Email' },
  ];

  return (
    <footer className={cn(
      "border-t",
      compact ? "mt-4" : "mt-20",
      themeMode === 'light'
        ? "bg-gray-50 border-gray-200"
        : "bg-black/40 border-purple-500/20 backdrop-blur-xl",
      className
    )}>
      <div
        className={cn(
          "max-w-7xl mx-auto px-6",
          compact ? "py-4" : "py-12"
        )}
      >
        {compact ? (
          // Compact layout for chart pages
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "text-lg font-bold",
                themeMode === 'light'
                  ? "text-[#111827]"
                  : "text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
              )}>
                NeomSense
              </div>
              <Badge variant="secondary" className="text-xs">
                v2.0
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {socialLinks.slice(0, 2).map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-8 h-8 p-0",
                        themeMode === 'light'
                          ? "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                          : "hover:bg-purple-500/20 text-gray-400 hover:text-white"
                      )}
                      onClick={() => window.open(social.href, '_blank')}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>
              <div className={cn(
                "text-xs",
                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
              )}>
                © 2024 NeomSense
              </div>
            </div>
          </div>
        ) : (
          // Full layout for other pages
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className={cn(
                "text-2xl font-bold",
                themeMode === 'light'
                  ? "text-[#111827]"
                  : "text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
              )}>
                NeomSense
              </div>
              <Badge variant="secondary" className="text-xs">
                v2.0
              </Badge>
            </div>
            <p className={cn(
              "text-sm mb-6 max-w-xs",
              themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
            )}>
              Advanced sentiment analysis and market intelligence platform for modern traders and investors.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-8 h-8 p-0",
                      themeMode === 'light'
                        ? "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                        : "hover:bg-purple-500/20 text-gray-400 hover:text-white"
                    )}
                    onClick={() => window.open(social.href, '_blank')}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className={cn(
              "text-sm font-semibold mb-4",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Explore
            </h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 p-0 h-auto text-sm",
                        themeMode === 'light'
                          ? "text-gray-600 hover:text-gray-900 hover:bg-transparent"
                          : "text-gray-400 hover:text-white hover:bg-transparent"
                      )}
                      onClick={link.action}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                      {link.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {link.badge}
                        </Badge>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Plugins Section */}
          <div>
            <h3 className={cn(
              "text-sm font-semibold mb-4",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Plugins
            </h3>
            <ul className="space-y-3">
              {footerLinks.plugins.map((link, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-0 h-auto text-sm",
                      themeMode === 'light'
                        ? "text-gray-600 hover:text-gray-900 hover:bg-transparent"
                        : "text-gray-400 hover:text-white hover:bg-transparent"
                    )}
                    onClick={link.action}
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className={cn(
              "text-sm font-semibold mb-4",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-0 h-auto text-sm",
                      themeMode === 'light'
                        ? "text-gray-600 hover:text-gray-900 hover:bg-transparent"
                        : "text-gray-400 hover:text-white hover:bg-transparent"
                    )}
                    onClick={link.action}
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className={cn(
              "text-sm font-semibold mb-4",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start p-0 h-auto text-sm",
                      themeMode === 'light'
                        ? "text-gray-600 hover:text-gray-900 hover:bg-transparent"
                        : "text-gray-400 hover:text-white hover:bg-transparent"
                    )}
                    onClick={link.action}
                  >
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
            </div>

            {/* Bottom Section */}
            <div className={cn(
              "border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4",
              themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
            )}>
              <div className={cn(
                "text-sm",
                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
              )}>
                © 2024 NeomSense. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "text-xs",
                    themeMode === 'light'
                      ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                      : "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  )}
                  onClick={() => onNavigate?.('plugin-submission')}
                >
                  <Code2 className="w-3 h-3 mr-1" />
                  Build Plugins
                </Button>
                <div className={cn(
                  "text-xs",
                  themeMode === 'light' ? 'text-gray-500' : 'text-gray-500'
                )}>
                  Made with ❤️ for traders
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
};
