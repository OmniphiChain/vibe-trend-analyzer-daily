import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Search,
  Menu,
  X,
  Bell,
  Settings,
  User,
  LogOut,
  Crown,
  Zap,
  TrendingUp,
  BarChart3,
  Globe,
  Users,
  ChevronDown
} from 'lucide-react';
import { MoodThemeToggle } from './ui/mood-theme-toggle';
import { MoodPulseIndicator } from './ui/mood-pulse-indicator';
import { cn } from '../lib/utils';

interface LuxuryNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const LuxuryNavigation: React.FC<LuxuryNavigationProps> = ({
  activeSection = 'luxury-home',
  onSectionChange = () => {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navItems = [
    { id: 'luxury-home', label: 'Home', icon: TrendingUp },
    { id: 'market-mood', label: 'Market Mood', icon: BarChart3 },
    { id: 'watchlist', label: 'Watchlist', icon: Crown },
    { id: 'news-feed', label: 'News Feed', icon: Globe },
    { id: 'community', label: 'Community', icon: Users }
  ];

  const mockUser = {
    name: 'Alexandra Chen',
    email: 'alex@moormeteer.com',
    avatar: '/api/placeholder/40/40',
    isPremium: true,
    tier: 'Elite'
  };

  return (
    <>
      {/* Luxury Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/10">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-light bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                    MoorMeter
                  </h1>
                  <div className="text-xs text-gray-400 -mt-1">AI Sentiment Engine</div>
                </div>
              </div>
              
              {/* Mood Pulse - Desktop Only */}
              <div className="hidden lg:block">
                <MoodPulseIndicator size="sm" className="bg-white/5 border-white/10" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-light",
                      isActive 
                        ? "bg-yellow-400/20 text-yellow-300 shadow-lg shadow-yellow-400/20" 
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                    {isActive && (
                      <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search & User Section */}
            <div className="flex items-center gap-4">
              
              {/* Search Bar - Desktop */}
              <div className="hidden md:block relative">
                <div className={cn(
                  "relative transition-all duration-300",
                  searchFocused ? "w-80" : "w-64"
                )}>
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search tickers, news, or topics..."
                    className={cn(
                      "pl-12 pr-4 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-400 transition-all duration-300",
                      "focus:bg-white/10 focus:border-yellow-400/30 focus:ring-0 focus:outline-none",
                      searchFocused && "shadow-lg shadow-yellow-400/10"
                    )}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {searchFocused && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                  )}
                </div>
              </div>

              {/* Theme Toggle */}
              <MoodThemeToggle />

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative p-3 hover:bg-white/10 rounded-xl">
                <Bell className="w-5 h-5 text-gray-300" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-yellow-400 text-black text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={mockUser.avatar} />
                      <AvatarFallback className="bg-yellow-400/20 text-yellow-300 text-sm">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm text-white font-medium">{mockUser.name}</div>
                      <div className="text-xs text-gray-400">{mockUser.tier} Member</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-72 glassmorphism border-white/10 bg-black/80 backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={mockUser.avatar} />
                        <AvatarFallback className="bg-yellow-400/20 text-yellow-300">
                          {mockUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-medium">{mockUser.name}</div>
                        <div className="text-sm text-gray-400">{mockUser.email}</div>
                        {mockUser.isPremium && (
                          <Badge className="mt-1 bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                            <Crown className="w-3 h-3 mr-1" />
                            {mockUser.tier}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuItem className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer">
                    <Zap className="w-4 h-4" />
                    <span>Upgrade to Pro</span>
                    <Badge className="ml-auto bg-yellow-400/20 text-yellow-300 border-yellow-400/30 text-xs">
                      Hot
                    </Badge>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuItem className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden p-3 hover:bg-white/10 rounded-xl"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed top-20 left-0 right-0 bg-black/90 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-sm mx-auto p-6 space-y-4">
              
              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-12 pr-4 py-3 bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-400"
                />
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-light",
                      isActive 
                        ? "bg-yellow-400/20 text-yellow-300" 
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              {/* Mobile Mood Indicator */}
              <div className="pt-4 border-t border-white/10">
                <MoodPulseIndicator size="md" className="bg-white/5 border-white/10" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
