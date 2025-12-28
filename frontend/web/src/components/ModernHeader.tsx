import React, { useState, useEffect } from 'react';
import { Brain, Search, Bell, User, ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { IconText } from '../lib/iconUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { UserAuthenticationToggle } from './UserAuthenticationToggle';
import { ThemeSettingsPanel } from './ThemeSettingsPanel';
import { useMoodTheme } from '../contexts/MoodThemeContext';

interface ModernHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigate?: (section: string) => void;
  currentMoodScore?: number;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  activeSection,
  setActiveSection,
  onNavigate,
  currentMoodScore = 72,
}) => {
  const { themeMode, isDynamicMode } = useMoodTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Theme-responsive styles
  const isLightMode = themeMode === 'light';
  const isDarkMode = themeMode === 'dark' || isDynamicMode;

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { label: 'Mood', key: 'market-mood' },
    { label: 'News', key: 'news-feed' },
    { label: 'TradeHub', key: 'tradehub' },
  ];

  const communityItems = [
    { label: 'Community Hub', key: 'community', icon: '👥' },
    { label: 'Live Chat', key: 'chat', icon: '💬' },
    { label: 'Trading Rooms', key: 'rooms', icon: '🏠' },
    { label: 'Space', key: 'space', icon: '🌌' },
  ];

  const financeItems = [
    { label: 'Finance Hub', key: 'finance', icon: '💰' },
    { label: 'Watchlist', key: 'watchlist', icon: '👁️' },
    { label: 'Market Analytics', key: 'market', icon: '📈' },
    { label: 'Stock Screener', key: 'screener', icon: '🔍' },
    { label: 'Crypto Dashboard', key: 'crypto', icon: '₿' },
    { label: 'Earnings Calendar', key: 'earnings', icon: '📅' },
    { label: 'Charts', key: 'charts', icon: '📊' },
    { label: 'Trending', key: 'trending', icon: '🔥' },
    { label: 'Trade Journal', key: 'trade-journal', icon: '📝' },
    { label: 'Sentiment Polls', key: 'sentiment-polls', icon: '📊' },
  ];

  const handleNavigation = (key: string) => {
    setActiveSection(key);
    setMobileMenuOpen(false);
    onNavigate?.(key);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 h-16",
        isLightMode
          ? isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-lg shadow-gray-500/5"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200/50"
          : isScrolled
            ? "bg-[#0A0A23]/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-purple-500/5"
            : "bg-[#0A0A23]/80 backdrop-blur-md border-b border-gray-800/30"
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left Section - Brand */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-3 group transition-all duration-200"
              aria-label="MoodMeter Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 group-hover:shadow-lg transition-all duration-200">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold group-hover:drop-shadow-lg transition-all duration-200">
                <span className={cn(
                  isLightMode
                    ? "text-gray-900 group-hover:text-gray-700"
                    : "text-white group-hover:text-purple-100"
                )}>🧠 Mood</span>
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-cyan-300">
                  Meter
                </span>
              </h1>
            </button>
          </div>

          {/* Center Section - Navigation Menu */}
          <nav className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6">
            {navigationItems.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => handleNavigation(key)}
                className={cn(
                  "text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                  activeSection === key
                    ? isLightMode
                      ? "text-pink-600 bg-pink-500/10"
                      : "text-pink-400 bg-pink-500/10"
                    : isLightMode
                      ? "text-gray-900 hover:text-blue-600"
                      : "text-gray-300 hover:text-gray-200"
                )}
                aria-current={activeSection === key ? "page" : undefined}
              >
                {label}
                {activeSection === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            ))}

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center gap-1 text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                  isLightMode
                    ? "text-gray-900 hover:text-blue-600"
                    : "text-gray-300 hover:text-gray-200"
                )}>
                  Community
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className={cn(
                  "w-56 backdrop-blur-xl rounded-xl",
                  isLightMode
                    ? "bg-white/95 border-gray-200 text-gray-900"
                    : "bg-[#0A0A23]/95 border-gray-700 text-white"
                )}
              >
                {communityItems.map(({ label, key, icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer rounded-lg"
                  >
                    <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Finance Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center gap-1 text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                  isLightMode
                    ? "text-gray-900 hover:text-blue-600"
                    : "text-gray-300 hover:text-gray-200"
                )}>
                  Finance
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className={cn(
                  "w-56 backdrop-blur-xl rounded-xl",
                  isLightMode
                    ? "bg-white/95 border-gray-200 text-gray-900"
                    : "bg-[#0A0A23]/95 border-gray-700 text-white"
                )}
              >
                {financeItems.map(({ label, key, icon }) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className="hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer rounded-lg"
                  >
                    <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Section - Utilities */}
          <div className="flex items-center justify-end space-x-3">
            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <div className={cn(
                "relative transition-all duration-300",
                searchFocused ? "w-64" : "w-48"
              )}>
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isLightMode ? "text-gray-500" : "text-gray-400"
                )} />
                <Input
                  type="text"
                  placeholder="Search"
                  className={cn(
                    "pl-10 pr-4 py-2 rounded-full transition-all duration-200 text-sm",
                    isLightMode
                      ? "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                      : "bg-black/30 border-gray-600/50 text-white placeholder-gray-400 focus:bg-black/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20",
                    "focus:outline-none",
                    searchFocused && (isLightMode ? "shadow-md shadow-blue-500/10" : "shadow-lg shadow-purple-500/10")
                  )}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "relative p-2 rounded-lg group transition-all duration-200",
                isLightMode
                  ? "hover:bg-blue-500/10"
                  : "hover:bg-purple-500/20"
              )}
              aria-label="Notifications"
            >
              <Bell className={cn(
                "w-5 h-5 transition-colors",
                isLightMode
                  ? "text-gray-700 group-hover:text-blue-500"
                  : "text-gray-300 group-hover:text-purple-400"
              )} />
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-pink-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                3
              </Badge>
            </Button>

            {/* Theme Settings Panel */}
            <ThemeSettingsPanel currentMoodScore={currentMoodScore} />

            {/* User Authentication */}
            <UserAuthenticationToggle onNavigate={onNavigate} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "md:hidden p-2 rounded-lg ml-2",
                isLightMode
                  ? "hover:bg-blue-500/10"
                  : "hover:bg-purple-500/20"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className={cn(
                  "w-5 h-5",
                  isLightMode ? "text-gray-700" : "text-gray-300"
                )} />
              ) : (
                <Menu className={cn(
                  "w-5 h-5",
                  isLightMode ? "text-gray-700" : "text-gray-300"
                )} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden backdrop-blur-xl",
          isLightMode
            ? "bg-white/95 border-t border-gray-200/50"
            : "bg-[#0A0A23]/95 border-t border-gray-800/50"
        )}>
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className={cn(
                  "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                  isLightMode ? "text-gray-500" : "text-gray-400"
                )} />
                <Input
                  type="text"
                  placeholder="Search"
                  className={cn(
                    "pl-10 pr-4 py-3 rounded-full w-full",
                    isLightMode
                      ? "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
                      : "bg-black/30 border-gray-600/50 text-white placeholder-gray-400"
                  )}
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map(({ label, key }) => (
                <Button
                  key={key}
                  variant="ghost"
                  onClick={() => handleNavigation(key)}
                  className={cn(
                    "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                    activeSection === key
                      ? isLightMode
                        ? "text-pink-600 bg-pink-500/10 border border-pink-500/20"
                        : "text-pink-400 bg-pink-500/10 border border-pink-500/20"
                      : isLightMode
                        ? "text-gray-900 hover:text-blue-600 hover:bg-blue-500/10"
                        : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Mobile Community Section */}
            <div className={cn(
              "pt-4 border-t",
              isLightMode ? "border-gray-200/50" : "border-gray-700/50"
            )}>
              <div className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-3 px-3",
                isLightMode ? "text-gray-600" : "text-gray-400"
              )}>
                Community
              </div>
              <div className="space-y-1">
                {communityItems.map(({ label, key, icon }) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => handleNavigation(key)}
                    className={cn(
                      "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                      isLightMode
                        ? "text-gray-900 hover:text-blue-600 hover:bg-blue-500/10"
                        : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                    )}
                  >
                    <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Finance Section */}
            <div className={cn(
              "pt-4 border-t",
              isLightMode ? "border-gray-200/50" : "border-gray-700/50"
            )}>
              <div className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-3 px-3",
                isLightMode ? "text-gray-600" : "text-gray-400"
              )}>
                Finance
              </div>
              <div className="space-y-1">
                {financeItems.map(({ label, key, icon }) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => handleNavigation(key)}
                    className={cn(
                      "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                      isLightMode
                        ? "text-gray-900 hover:text-blue-600 hover:bg-blue-500/10"
                        : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                    )}
                  >
                    <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Theme Settings */}
            <div className={cn(
              "pt-4 border-t",
              isLightMode ? "border-gray-200/50" : "border-gray-700/50"
            )}>
              <div className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-3 px-3",
                isLightMode ? "text-gray-600" : "text-gray-400"
              )}>
                Theme Settings
              </div>
              <div className="px-3">
                <ThemeSettingsPanel currentMoodScore={currentMoodScore} />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
