import { cn } from "@/lib/utils";
import { getSentimentEmoji, getSentimentColor } from "@/data/watchlistMockData";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentScoreBarProps {
  score: number;
  trend: 'rising' | 'falling' | 'stable';
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const SentimentScoreBar = ({ 
  score, 
  trend, 
  showEmoji = true, 
  size = 'md',
  animated = true,
  className 
}: SentimentScoreBarProps) => {
  const { themeMode } = useMoodTheme();
  const emoji = getSentimentEmoji(score);
  const colorName = getSentimentColor(score);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const getGradientClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'from-emerald-500 via-green-400 to-emerald-300';
      case 'yellow':
        return 'from-yellow-500 via-amber-400 to-yellow-300';
      case 'red':
        return 'from-red-500 via-rose-400 to-red-300';
      default:
        return 'from-gray-500 via-gray-400 to-gray-300';
    }
  };

  const getTrendIcon = () => {
    const iconClass = `w-3 h-3 ${
      trend === 'rising' ? 
        (themeMode === 'light' ? 'text-[#4CAF50]' : 'text-emerald-400') : 
      trend === 'falling' ? 
        (themeMode === 'light' ? 'text-[#F44336]' : 'text-red-400') : 
        (themeMode === 'light' ? 'text-[#666]' : 'text-gray-400')
    }`;
    
    switch (trend) {
      case 'rising':
        return <TrendingUp className={iconClass} />;
      case 'falling':
        return <TrendingDown className={iconClass} />;
      default:
        return <Minus className={iconClass} />;
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showEmoji && (
        <div className="flex items-center gap-1">
          <span className="text-sm">{emoji}</span>
          {getTrendIcon()}
        </div>
      )}
      
      <div className="flex-1 flex items-center gap-2">
        <div className={cn(
          "relative overflow-hidden rounded-full",
          themeMode === 'light' ? 'bg-[#E0E0E0]' : 'bg-gray-800/50',
          sizeClasses[size]
        )}>
          {/* Background glow */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-20 blur-sm",
              getGradientClasses(colorName)
            )}
          />
          
          {/* Main bar */}
          <div 
            className={cn(
              "h-full bg-gradient-to-r rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
              getGradientClasses(colorName),
              animated && "animate-pulse"
            )}
            style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
          >
            {/* Shimmer effect */}
            {animated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>
          
          {/* Score markers */}
          <div className="absolute inset-0 flex justify-between px-1">
            {[25, 50, 75].map((marker) => (
              <div 
                key={marker}
                className={cn(
                  "w-px h-full",
                  themeMode === 'light' ? 'bg-[#BDBDBD]' : 'bg-gray-600/40'
                )}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={cn(
            "text-xs font-medium tabular-nums",
            themeMode === 'light' ? (
              colorName === 'emerald' ? 'text-[#4CAF50]' :
              colorName === 'yellow' ? 'text-[#FF9800]' :
              'text-[#F44336]'
            ) : (
              colorName === 'emerald' ? 'text-emerald-400' :
              colorName === 'yellow' ? 'text-yellow-400' :
              'text-red-400'
            )
          )}>
            {score}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Mini trend bars for showing historical sentiment
interface MiniSentimentBarsProps {
  trendData?: number[];
  className?: string;
}

export const MiniSentimentBars = ({ 
  trendData = [65, 68, 72, 70, 75, 78, 76, 80], 
  className 
}: MiniSentimentBarsProps) => {
  const { themeMode } = useMoodTheme();
  const maxValue = Math.max(...trendData);
  
  return (
    <div className={cn("flex items-end gap-0.5 h-6", className)}>
      {trendData.map((value, index) => {
        const height = (value / maxValue) * 100;
        const color = getSentimentColor(value);
        
        return (
          <div
            key={index}
            className={cn(
              "w-1 rounded-t transition-all duration-300 hover:opacity-80",
              themeMode === 'light' ? (
                color === 'emerald' ? 'bg-[#4CAF50]' :
                color === 'yellow' ? 'bg-[#FF9800]' :
                'bg-[#F44336]'
              ) : (
                color === 'emerald' ? 'bg-emerald-400' :
                color === 'yellow' ? 'bg-yellow-400' :
                'bg-red-400'
              )
            )}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
};
