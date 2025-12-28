import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Users,
  Brain,
  BarChart3,
  Sparkles,
  Crown,
  ArrowRight,
  X,
} from "lucide-react";
import StrategySwiper from "./StrategySwiper";

interface StrategyProfilerProps {
  placement: "onboarding" | "dashboard" | "screener" | "community";
  className?: string;
  onComplete?: (profile: any) => void;
  compact?: boolean;
}

interface SavedProfile {
  name: string;
  percentage: number;
  icon: string;
  color: string;
  traits: string[];
}

export const StrategyProfiler: React.FC<StrategyProfilerProps> = ({ 
  placement, 
  className, 
  onComplete,
  compact = false 
}) => {
  const { themeMode } = useMoodTheme();
  const [showSwiper, setShowSwiper] = useState(false);
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already completed the profiler
    const profile = localStorage.getItem('tradingProfile');
    if (profile) {
      try {
        setSavedProfile(JSON.parse(profile));
      } catch (e) {
        console.error('Error parsing saved profile:', e);
      }
    }

    // Check if user has dismissed this placement
    const dismissedKey = `strategy-profiler-dismissed-${placement}`;
    const wasDismissed = localStorage.getItem(dismissedKey);
    if (wasDismissed) {
      setDismissed(true);
    }
  }, [placement]);

  const handleComplete = (profile: any) => {
    setSavedProfile(profile);
    setShowSwiper(false);
    onComplete?.(profile);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(`strategy-profiler-dismissed-${placement}`, 'true');
  };

  const handleRetake = () => {
    setSavedProfile(null);
    localStorage.removeItem('tradingProfile');
    setShowSwiper(true);
  };

  if (dismissed && placement !== "onboarding") {
    return null;
  }

  if (showSwiper) {
    return (
      <StrategySwiper
        placement={placement}
        onComplete={handleComplete}
        onClose={() => setShowSwiper(false)}
        className={className}
      />
    );
  }

  // Onboarding Flow - Full screen
  if (placement === "onboarding") {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <StrategySwiper
          placement="onboarding"
          onComplete={handleComplete}
          onClose={() => setShowSwiper(false)}
        />
      </div>
    );
  }

  // Dashboard Widget
  if (placement === "dashboard") {
    if (savedProfile && !compact) {
      return (
        <Card className={cn("bg-white/5 backdrop-blur-xl border-gray-700/50", className)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Your Trading Profile</h3>
              <Button
                onClick={handleRetake}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Update
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r", savedProfile.color)}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{savedProfile.name}</h4>
                <p className="text-gray-400 text-sm">{savedProfile.percentage}% Match</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {savedProfile.traits.slice(0, 3).map((trait, index) => (
                <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={cn("bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Match Your Strategy</h3>
                <p className="text-gray-400 text-sm">Discover your trading personality</p>
              </div>
            </div>
            {!compact && (
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <Button
            onClick={() => setShowSwiper(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Start Profiling
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Screener Banner
  if (placement === "screener") {
    if (savedProfile) {
      return (
        <Card className={cn("bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/30", className)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <span className="text-white font-medium">Your Profile: {savedProfile.name}</span>
                  <p className="text-gray-400 text-xs">Filters optimized for your trading style</p>
                </div>
              </div>
              <Button
                onClick={handleRetake}
                variant="outline"
                size="sm"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className={cn("bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-white font-medium">Need help choosing filters?</span>
                <p className="text-gray-400 text-xs">Swipe to discover your trading style</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowSwiper(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Match Strategy
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Community Widget
  if (placement === "community") {
    if (savedProfile) {
      return (
        <div className={cn("bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-3 border border-purple-500/20", className)}>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">{savedProfile.name}</span>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 text-xs">
              {savedProfile.percentage}% Match
            </Badge>
          </div>
          <p className="text-gray-400 text-xs">Trading personality visible on your posts</p>
        </div>
      );
    }

    return (
      <Card className={cn("bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <span className="text-white font-medium">Find stocks based on how YOU trade</span>
                <p className="text-gray-400 text-xs">Show your trading style to the community</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowSwiper(true)}
                size="sm"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Get Matched
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default StrategyProfiler;
