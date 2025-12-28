import React, { useState, useEffect } from 'react';
import { Brain, Search, Bell, User, Menu, X, Home, ChevronDown } from 'lucide-react';
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

interface ResponsiveModernHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onNavigate?: (section: string) => void;
  currentMoodScore?: number;
}

export const ResponsiveModernHeader: React.FC<ResponsiveModernHeaderProps> = ({
  activeSection,
  setActiveSection,
  onNavigate,
  currentMoodScore = 72,
}) => {
  const { themeMode, isDynamicMode } = useMoodTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Theme-responsive styles
  const isLightMode = themeMode === 'light';
  const isDarkMode = themeMode === 'dark' || isDynamicMode;

  // Enhanced scroll detection for header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      setIsScrolled(currentScrollY > 24);

      // Header visibility logic for all screen sizes
      if (currentScrollY < 10) {
        setHeaderVisible(true);
      } else if (scrollDirection === 'down' && currentScrollY > 100) {
        setHeaderVisible(false);
        setMobileMenuOpen(false); // Close mobile menu when hiding header
      } else if (scrollDirection === 'up') {
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [lastScrollY]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileMenuOpen(false);
        setSideDrawerOpen(false);
        // Don't force header visibility - let scroll behavior handle it
      }
    };
    
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { label: 'Mood', key: 'market-mood', icon: '🧠' },
    { label: 'Smart News', key: 'smart-news-feed', icon: '🤖' },
    { label: 'TradeHub', key: 'tradehub', icon: '💼' },
  ];



  const financeItems = [
    { label: 'Finance Hub', key: 'finance', icon: '💰' },
    { label: 'Watchlist', key: 'watchlist', icon: '👁️' },
    { label: 'Market Analytics', key: 'market', icon: '📈' },
    { label: 'Stock Screener', key: 'screener', icon: '🔍' },
    { label: 'Crypto Dashboard', key: 'crypto-dashboard', icon: '₿' },
    { label: 'Earnings Calendar', key: 'earnings', icon: '📅' },
    { label: 'Trading Chart Pro', key: 'trading-chart', icon: '📊' },
    { label: 'Trending', key: 'trending', icon: '🔥' },
    { label: 'Trade Journal', key: 'trade-journal', icon: '📝' },
    { label: 'Sentiment Polls', key: 'sentiment-polls', icon: '📊' },
  ];

  const handleNavigation = (key: string) => {
    setActiveSection(key);     // Update the main app's activeSection
    setMobileMenuOpen(false);
    setSideDrawerOpen(false);
    if (onNavigate) {
      onNavigate(key);         // Call additional navigation handler if provided
    }
  };

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 ease-in-out h-16",
          headerVisible ? "translate-y-0" : "-translate-y-full",
          isLightMode
            ? isScrolled
              ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
              : "bg-background/90 backdrop-blur-md border-b border-border/50"
            : isScrolled
              ? "bg-[#0A0A23]/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20"
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
                aria-label="NeomSense Home"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 group-hover:shadow-lg transition-all duration-200">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold group-hover:drop-shadow-lg transition-all duration-200">
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-cyan-300">
                    NeomSense
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
                        ? "text-primary-foreground bg-primary font-semibold shadow-sm"
                        : "text-pink-400 bg-pink-500/10"
                      : isLightMode
                        ? "text-secondary hover:text-primary hover:bg-muted"
                        : "text-gray-300 hover:text-gray-200"
                  )}
                  aria-current={activeSection === key ? "page" : undefined}
                >
                  {label}
                  {activeSection === key && (
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                      isLightMode
                        ? "bg-primary"
                        : "bg-gradient-to-r from-pink-400 to-purple-500"
                    )} />
                  )}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    isLightMode
                      ? "bg-primary"
                      : "bg-gradient-to-r from-pink-400 to-purple-500"
                  )} />
                </button>
              ))}

              {/* Community Hub */}
              <button
                onClick={() => handleNavigation("community")}
                className={cn(
                  "text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                  activeSection === "community"
                    ? isLightMode
                      ? "text-primary-foreground bg-primary font-semibold shadow-sm"
                      : "text-pink-400 bg-pink-500/10"
                    : isLightMode
                      ? "text-secondary hover:text-primary hover:bg-muted"
                      : "text-gray-300 hover:text-gray-200"
                )}
                aria-current={activeSection === "community" ? "page" : undefined}
              >
                <p>Community</p>
                {activeSection === "community" && (
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                    isLightMode
                      ? "bg-[#3A7AFE]"
                      : "bg-gradient-to-r from-pink-400 to-purple-500"
                  )} />
                )}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  isLightMode
                    ? "bg-[#3A7AFE]"
                    : "bg-gradient-to-r from-pink-400 to-purple-500"
                )} />
              </button>

              {/* Finance Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1 text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 relative group",
                    isLightMode
                      ? "text-[#4B5563] hover:text-[#3A7AFE] hover:bg-[#F3F4F6]"
                      : "text-gray-300 hover:text-gray-200"
                  )}>
                    Finance
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      isLightMode
                        ? "bg-[#3A7AFE]"
                        : "bg-gradient-to-r from-pink-400 to-purple-500"
                    )} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className={cn(
                    "w-56 backdrop-blur-xl rounded-xl z-[100] shadow-xl",
                    isLightMode
                      ? "!bg-background !border-border !text-foreground"
                      : "!bg-[#0A0A23]/95 !border-gray-700 !text-white"
                  )}
                  sideOffset={5}
                  style={{
                    backgroundColor: isLightMode ? 'white' : 'rgba(10, 10, 35, 0.95)',
                    borderColor: isLightMode ? 'rgb(229 231 235)' : 'rgb(55 65 81)',
                    color: isLightMode ? 'rgb(17 24 39)' : 'white',
                    zIndex: 100
                  }}
                >
                  {financeItems.map(({ label, key, icon }) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleNavigation(key)}
                      className={cn(
                        "hover:bg-purple-500/20 focus:bg-purple-500/20 cursor-pointer rounded-lg px-3 py-2 transition-colors",
                        isLightMode ? "hover:bg-blue-500/10" : "hover:bg-purple-500/20"
                      )}
                    >
                      <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3 text-lg" />
                      <span className="font-medium">{label}</span>
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
                <Badge className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 p-0 text-primary-foreground text-xs flex items-center justify-center rounded-full animate-pulse",
                  isLightMode ? "bg-destructive" : "bg-pink-500"
                )}>
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
            "md:hidden backdrop-blur-xl animate-in slide-in-from-top duration-300",
            isLightMode
              ? "bg-background/95 border-t border-border/50"
              : "bg-[#0A0A23]/95 border-t border-gray-800/50"
          )}>
            <div className="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
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
                {navigationItems.map(({ label, key, icon }) => (
                  <Button
                    key={key}
                    variant="ghost"
                    onClick={() => handleNavigation(key)}
                    className={cn(
                      "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                      activeSection === key
                        ? isLightMode
                          ? "text-white bg-[#3A7AFE] font-semibold shadow-sm border border-[#3A7AFE]"
                          : "text-pink-400 bg-pink-500/10 border border-pink-500/20"
                        : isLightMode
                          ? "text-[#4B5563] hover:text-[#3A7AFE] hover:bg-[#F3F4F6]"
                          : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                    )}
                  >
                    <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Mobile Community Section */}
              <div className={cn(
                "pt-4 border-t",
                isLightMode ? "border-gray-200/50" : "border-gray-700/50"
              )}>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation("community")}
                    className={cn(
                      "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                      isLightMode
                        ? "text-gray-900 hover:text-blue-600 hover:bg-blue-500/10"
                        : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                    )}
                  >
                    <span className="mr-3">👥</span>
                    Community Hub
                  </Button>
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
            </div>
          </div>
        )}
      </header>

      {/* Floating Drawer Button (appears when header is hidden on mobile) */}
      {isMobile && !headerVisible && (
        <button
          onClick={toggleSideDrawer}
          className={cn(
            "fixed top-4 left-4 z-[60] w-12 h-12 rounded-full shadow-lg transition-all duration-300 animate-in slide-in-from-left",
            isLightMode
              ? "bg-white/95 backdrop-blur-xl border border-gray-200/50 text-gray-700 hover:bg-white hover:shadow-xl"
              : "bg-[#0A0A23]/95 backdrop-blur-xl border border-gray-700/50 text-gray-300 hover:bg-[#0A0A23] hover:shadow-xl hover:shadow-purple-500/20"
          )}
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5 mx-auto" />
        </button>
      )}

      {/* Side Drawer */}
      {sideDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] animate-in fade-in duration-300 md:hidden"
            onClick={() => setSideDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className={cn(
            "fixed top-0 left-0 h-full w-80 z-[75] transition-transform duration-300 animate-in slide-in-from-left md:hidden",
            isLightMode
              ? "bg-white/95 backdrop-blur-xl border-r border-gray-200/50"
              : "bg-[#0A0A23]/95 backdrop-blur-xl border-r border-gray-700/50"
          )}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className={cn(
                  "text-lg font-semibold",
                  isLightMode ? "text-gray-900" : "text-white"
                )}>
                  NeomSense
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSideDrawerOpen(false)}
                className="p-2 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 h-full overflow-y-auto">
              {/* Search */}
              <div className="mb-6">
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

              {/* Navigation Items */}
              <div className="space-y-6">
                {/* Main Navigation */}
                <div>
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-3",
                    isLightMode ? "text-gray-600" : "text-gray-400"
                  )}>
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {navigationItems.map(({ label, key, icon }) => (
                      <Button
                        key={key}
                        variant="ghost"
                        onClick={() => handleNavigation(key)}
                        className={cn(
                          "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                          activeSection === key
                            ? isLightMode
                              ? "text-white bg-[#3A7AFE] font-semibold shadow-sm border border-[#3A7AFE]"
                              : "text-pink-400 bg-pink-500/10 border border-pink-500/20"
                            : isLightMode
                              ? "text-[#4B5563] hover:text-[#3A7AFE] hover:bg-[#F3F4F6]"
                              : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                        )}
                      >
                        <IconText value={icon} className="w-4 h-4 mr-3" textClassName="mr-3" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Community */}
                <div>
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-3",
                    isLightMode ? "text-gray-600" : "text-gray-400"
                  )}>
                    Community
                  </h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation("community")}
                      className={cn(
                        "w-full justify-start text-left py-3 rounded-xl transition-all duration-200",
                        isLightMode
                          ? "text-gray-900 hover:text-blue-600 hover:bg-blue-500/10"
                          : "text-gray-300 hover:text-gray-200 hover:bg-purple-500/20"
                      )}
                    >
                      <span className="mr-3">👥</span>
                      Community Hub
                    </Button>
                  </div>
                </div>

                {/* Finance */}
                <div>
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wider mb-3",
                    isLightMode ? "text-gray-600" : "text-gray-400"
                  )}>
                    Finance
                  </h3>
                  <div className="space-y-1">
                    {financeItems.slice(0, 6).map(({ label, key, icon }) => (
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
              </div>

              {/* User Section */}
              <div className="mt-8 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <UserAuthenticationToggle onNavigate={onNavigate} />
                <div className="mt-4">
                  <ThemeSettingsPanel currentMoodScore={currentMoodScore} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
