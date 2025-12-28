import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Brain, Sparkles, TrendingUp, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AIInsight } from "@/types/watchlist";

interface AIInsightFooterBlockProps {
  insight: string;
  ticker?: string;
  confidence?: number;
  category?: 'earnings' | 'news' | 'technical' | 'sentiment' | 'general';
  timestamp?: Date;
  expandable?: boolean;
  className?: string;
}

export const AIInsightFooterBlock = ({
  insight,
  ticker,
  confidence = 75,
  category = 'general',
  timestamp,
  expandable = false,
  className
}: AIInsightFooterBlockProps) => {
  const { themeMode } = useMoodTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = () => {
    switch (category) {
      case 'earnings':
        return <TrendingUp className="w-3 h-3" />;
      case 'news':
        return <AlertCircle className="w-3 h-3" />;
      case 'technical':
        return <Sparkles className="w-3 h-3" />;
      case 'sentiment':
        return <Brain className="w-3 h-3" />;
      default:
        return <Brain className="w-3 h-3" />;
    }
  };

  const getCategoryColor = () => {
    if (themeMode === 'light') {
      switch (category) {
        case 'earnings':
          return 'text-[#4CAF50] bg-[#E8F5E9] border-[#4CAF50]/30';
        case 'news':
          return 'text-[#2196F3] bg-[#E3F2FD] border-[#2196F3]/30';
        case 'technical':
          return 'text-[#9C27B0] bg-[#F3E5F5] border-[#9C27B0]/30';
        case 'sentiment':
          return 'text-[#6A1B9A] bg-[#F3E5F5] border-[#6A1B9A]/30';
        default:
          return 'text-[#00BCD4] bg-[#E0F2F1] border-[#00BCD4]/30';
      }
    } else {
      switch (category) {
        case 'earnings':
          return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        case 'news':
          return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        case 'technical':
          return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'sentiment':
          return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
        default:
          return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      }
    }
  };

  const getConfidenceColor = () => {
    if (themeMode === 'light') {
      if (confidence >= 80) return 'text-[#4CAF50]';
      if (confidence >= 60) return 'text-[#FFEB3B]';
      return 'text-[#F44336]';
    } else {
      if (confidence >= 80) return 'text-emerald-400';
      if (confidence >= 60) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      "relative group rounded-xl p-3 backdrop-blur-sm transition-all duration-200",
      themeMode === 'light'
        ? "bg-gradient-to-br from-[#F9FAFB] to-[#ECEEFF] border border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-[#EEF1F5] hover:scale-[1.01]"
        : "bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 border border-gray-700/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
      className
    )}>
      {/* Header with category and confidence */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs border", getCategoryColor())}
          >
            {getCategoryIcon()}
            <span className="ml-1 capitalize">{category}</span>
          </Badge>
          
          {ticker && (
            <span className={cn(
              "text-xs font-mono",
              themeMode === 'light' ? 'text-[#333]' : 'text-gray-400'
            )}>{ticker}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {timestamp && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-500'
            )}>
              <Clock className="w-3 h-3" />
              {formatTimeAgo(timestamp)}
            </div>
          )}
          
          <div className={cn(
            "text-xs font-medium",
            getConfidenceColor()
          )}>
            {confidence}%
          </div>
        </div>
      </div>

      {/* AI Insight Text */}
      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm leading-relaxed",
              themeMode === 'light' ? 'text-[#1C1E21]' : 'text-gray-300',
              !isExpanded && expandable && "line-clamp-2"
            )}>
              {insight}
            </p>
            
            {expandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "h-auto p-0 mt-1 text-xs underline",
                  themeMode === 'light'
                    ? 'text-[#5E35B1] hover:text-[#4527A0]'
                    : 'text-purple-400 hover:text-purple-300'
                )}
              >
                {isExpanded ? 'Show less' : 'Read more'}
                <ChevronRight className={cn(
                  "w-3 h-3 ml-1 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </Button>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className={cn(
            "text-xs",
            themeMode === 'light' ? 'text-[#1C1E21]' : 'text-gray-500'
          )}>Confidence:</span>
          <div className={cn(
            "flex-1 h-1.5 rounded-full overflow-hidden",
            themeMode === 'light' ? 'bg-[#E0E0E0]' : 'bg-gray-700'
          )}>
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out",
                themeMode === 'light'
                  ? (confidence >= 80 ? "bg-[#4CAF50]" :
                     confidence >= 60 ? "bg-[#FFEB3B]" :
                     "bg-[#F44336]")
                  : (confidence >= 80 ? "bg-emerald-400" :
                     confidence >= 60 ? "bg-yellow-400" :
                     "bg-red-400")
              )}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={cn("text-xs font-medium", getConfidenceColor())}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        themeMode === 'light'
          ? 'bg-gradient-to-r from-[#D2E3FC]/20 via-[#E8F1FD]/20 to-[#F0F6FE]/20'
          : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5'
      )} />
    </div>
  );
};

// Compact version for smaller spaces
export const AIInsightCompact = ({
  insight,
  confidence = 75,
  className
}: Pick<AIInsightFooterBlockProps, 'insight' | 'confidence' | 'className'>) => {
  const { themeMode } = useMoodTheme();

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded",
      themeMode === 'light'
        ? 'bg-[#F5F7FA] border border-[#E0E0E0]'
        : 'bg-gray-800/40 border border-gray-700/30',
      className
    )}>
      <Brain className={cn(
        "w-3 h-3 flex-shrink-0",
        themeMode === 'light' ? 'text-[#6A1B9A]' : 'text-purple-400'
      )} />
      <p className={cn(
        "text-xs line-clamp-1 flex-1",
        themeMode === 'light' ? 'text-[#1C1E21]' : 'text-gray-400'
      )}>{insight}</p>
      <div className={cn(
        "text-xs font-medium",
        themeMode === 'light'
          ? (confidence >= 80 ? 'text-[#4CAF50]' :
             confidence >= 60 ? 'text-[#FFEB3B]' :
             'text-[#F44336]')
          : (confidence >= 80 ? 'text-emerald-400' :
             confidence >= 60 ? 'text-yellow-400' :
             'text-red-400')
      )}>
        {confidence}%
      </div>
    </div>
  );
};
