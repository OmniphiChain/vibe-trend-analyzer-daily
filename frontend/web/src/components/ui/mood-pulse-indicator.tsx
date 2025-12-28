import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useMoodTheme } from '../../contexts/MoodThemeContext';
import { Badge } from './badge';
import { cn } from '../../lib/utils';

interface MoodPulseIndicatorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MoodPulseIndicator: React.FC<MoodPulseIndicatorProps> = ({
  className,
  showLabel = true,
  size = 'md'
}) => {
  const { moodState, moodScore, moodEmoji, moodLabel, isDynamicMode, accentColor } = useMoodTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevScore, setPrevScore] = useState<number | null>(null);

  // Trigger animation when mood score changes significantly
  useEffect(() => {
    if (moodScore && prevScore !== null) {
      const scoreDiff = Math.abs(moodScore.overall - prevScore);
      if (scoreDiff >= 5) { // Threshold for significant change
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 2000);
      }
    }
    if (moodScore) {
      setPrevScore(moodScore.overall);
    }
  }, [moodScore, prevScore]);

  const getMoodIcon = () => {
    switch (moodState) {
      case 'bearish':
        return <TrendingDown className={`${getSizeClasses().icon} text-red-400`} />;
      case 'bullish':
        return <TrendingUp className={`${getSizeClasses().icon} text-green-400`} />;
      case 'extreme':
        return <Zap className={`${getSizeClasses().icon} text-purple-400`} />;
      default:
        return <Activity className={`${getSizeClasses().icon} text-blue-400`} />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-8 px-2',
          icon: 'h-3 w-3',
          emoji: 'text-sm',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'h-12 px-4',
          icon: 'h-6 w-6',
          emoji: 'text-xl',
          text: 'text-base'
        };
      default:
        return {
          container: 'h-10 px-3',
          icon: 'h-4 w-4',
          emoji: 'text-base',
          text: 'text-sm'
        };
    }
  };

  const getPulseIntensity = () => {
    if (!moodScore) return 'animate-pulse';
    
    const score = Math.abs(moodScore.overall);
    if (score >= 80) return 'animate-ping';
    if (score >= 60) return 'animate-pulse';
    return '';
  };

  const getMoodBorderColor = () => {
    switch (moodState) {
      case 'bearish':
        return 'border-red-500/30';
      case 'bullish':
        return 'border-green-500/30';
      case 'extreme':
        return 'border-purple-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  const getMoodGlow = () => {
    if (!isDynamicMode) return '';
    
    switch (moodState) {
      case 'bearish':
        return 'shadow-lg shadow-red-500/20';
      case 'bullish':
        return 'shadow-lg shadow-green-500/20';
      case 'extreme':
        return 'shadow-lg shadow-purple-500/30';
      default:
        return 'shadow-lg shadow-blue-500/20';
    }
  };

  if (!isDynamicMode) return null;

  return (
    <div className={cn(
      'relative flex items-center gap-2 rounded-full border backdrop-blur-sm transition-all duration-300',
      getSizeClasses().container,
      getMoodBorderColor(),
      getMoodGlow(),
      'bg-black/20 dark:bg-white/10',
      isAnimating && 'scale-110',
      className
    )}>
      {/* Pulse Ring */}
      <div className={cn(
        'absolute inset-0 rounded-full border-2 opacity-75',
        getMoodBorderColor(),
        getPulseIntensity()
      )} />
      
      {/* Content */}
      <div className="relative flex items-center gap-2 z-10">
        {/* Mood Emoji */}
        <span className={cn(
          getSizeClasses().emoji,
          isAnimating && 'animate-bounce'
        )}>
          {moodEmoji}
        </span>
        
        {/* Mood Icon */}
        {getMoodIcon()}
        
        {/* Mood Score */}
        {moodScore && (
          <span className={cn(
            'font-mono font-bold',
            getSizeClasses().text,
            'text-white/90'
          )}>
            {Math.round(moodScore.overall)}
          </span>
        )}
        
        {/* Mood Label */}
        {showLabel && (
          <span className={cn(
            'font-medium',
            getSizeClasses().text,
            'text-white/80'
          )}>
            {moodLabel}
          </span>
        )}
      </div>
      
      {/* Animated Background Gradient */}
      <div className={cn(
        'absolute inset-0 rounded-full opacity-20 transition-all duration-500',
        accentColor,
        isAnimating && 'opacity-40'
      )} />
    </div>
  );
};
