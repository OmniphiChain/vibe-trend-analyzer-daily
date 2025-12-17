import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { 
  TrendingUp, 
  TrendingDown, 
  X, 
  MoreHorizontal, 
  Bell, 
  Star,
  ExternalLink,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SentimentScoreBar, MiniSentimentBars } from "./SentimentScoreBar";
import { AIInsightFooterBlock } from "./AIInsightFooterBlock";
import { formatCurrency, formatLargeNumber } from "@/data/watchlistMockData";
import type { WatchlistAsset } from "@/types/watchlist";
import { PollWidget } from "../PollWidget";

interface WatchlistAssetCardProps {
  asset: WatchlistAsset;
  onRemove?: (id: string) => void;
  onToggleAlert?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const WatchlistAssetCard = ({
  asset,
  onRemove,
  onToggleAlert,
  onToggleFavorite,
  className
}: WatchlistAssetCardProps) => {
  const { themeMode } = useMoodTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isPositive = asset.dailyChange > 0;
  const sentimentColor = asset.sentimentScore >= 70 ? 'emerald' : 
                        asset.sentimentScore >= 50 ? 'yellow' : 'red';

  const getCardGlowColor = () => {
    switch (sentimentColor) {
      case 'emerald': return 'shadow-emerald-500/20 hover:shadow-emerald-500/30';
      case 'yellow': return 'shadow-yellow-500/20 hover:shadow-yellow-500/30';
      case 'red': return 'shadow-red-500/20 hover:shadow-red-500/30';
      default: return 'shadow-purple-500/20 hover:shadow-purple-500/30';
    }
  };

  // Mock trend data for mini bars
  const mockTrendData = [65, 68, 72, 70, 75, asset.sentimentScore - 5, asset.sentimentScore - 2, asset.sentimentScore];

  return (
    <div
      className={cn(
        "group relative rounded-xl p-4 backdrop-blur-sm transition-all duration-300 cursor-pointer",
        themeMode === 'light'
          ? "bg-white border border-[#E0E0E0] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#D2E3FC] hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          : "bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 border border-gray-700/50 hover:border-purple-500/40 hover:scale-[1.02] " + getCardGlowColor(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Top Section: Ticker & Price */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Logo/Emoji */}
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
            themeMode === 'light'
              ? "bg-gradient-to-br from-[#F5F7FA] to-[#E8F1FD] border border-[#E0E0E0]"
              : "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600/50"
          )}>
            {asset.logo || '📊'}
          </div>
          
          {/* Ticker & Name */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-bold text-lg",
                themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'
              )}>{asset.ticker}</h3>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  themeMode === 'light'
                    ? (asset.type === 'crypto'
                        ? "text-[#EA580C] border-[#FCD34D] bg-[#FFF7ED]"
                        : "text-[#2563EB] border-[#93C5FD] bg-[#DBEAFE]")
                    : (asset.type === 'crypto'
                        ? "text-orange-400 border-orange-400/30 bg-orange-400/10"
                        : "text-blue-400 border-blue-400/30 bg-blue-400/10")
                )}
              >
                {asset.type === 'crypto' ? 'CRYPTO' : 'STOCK'}
              </Badge>
            </div>
            <p className={cn(
              "text-sm truncate max-w-32",
              themeMode === 'light' ? 'text-[#2c2c2c]' : 'text-gray-400'
            )}>{asset.name}</p>
          </div>
        </div>

        {/* Price & Change */}
        <div className="text-right">
          <div className={cn(
            "text-xl font-bold",
            themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'
          )}>
            {formatCurrency(asset.currentPrice, asset.type)}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            themeMode === 'light'
              ? (isPositive ? "text-[#4CAF50]" : "text-[#F44336]")
              : (isPositive ? "text-emerald-400" : "text-red-400")
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{asset.dailyChange.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{asset.dailyChangePercent.toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Sentiment Section */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            "text-xs font-medium",
            themeMode === 'light' ? 'text-[#1a1a1a]' : 'text-gray-400'
          )}>SENTIMENT SCORE</span>
          <div className="flex items-center gap-2">
            <MiniSentimentBars trendData={mockTrendData} />
            <Activity className={cn(
              "w-3 h-3",
              themeMode === 'light' ? 'text-[#666]' : 'text-gray-500'
            )} />
          </div>
        </div>
        <SentimentScoreBar 
          score={asset.sentimentScore} 
          trend={asset.sentimentTrend}
          animated={isHovered}
        />
      </div>

      {/* AI Insight */}
      <AIInsightFooterBlock
        insight={asset.aiInsight}
        ticker={asset.ticker}
        confidence={Math.floor(75 + Math.random() * 20)} // Mock confidence
        category="sentiment"
        timestamp={asset.lastUpdated}
        expandable={asset.aiInsight.length > 100}
      />

      {/* Action Buttons (visible on hover) */}
      <div className={cn(
        "absolute top-3 right-3 flex items-center gap-1 transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-7 w-7 p-0",
            themeMode === 'light'
              ? 'hover:bg-[#FFEBEE] hover:text-[#F44336]'
              : 'hover:bg-red-500/20 hover:text-red-400'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(asset.id);
          }}
        >
          <X className="w-3 h-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                "h-7 w-7 p-0",
                themeMode === 'light'
                  ? 'hover:bg-[#F5F5F5] hover:text-[#333]'
                  : 'hover:bg-gray-700/50'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onToggleFavorite?.(asset.id)}>
              <Star className="w-4 h-4 mr-2" />
              Add to Favorites
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleAlert?.(asset.id)}>
              <Bell className="w-4 h-4 mr-2" />
              Set Price Alert
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn(
          "mt-4 pt-4 border-t space-y-3",
          themeMode === 'light' ? 'border-[#E0E0E0]' : 'border-gray-700/50'
        )}>
          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {asset.volume && (
              <div>
                <span className={cn(
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>Volume</span>
                <div className={cn(
                  "font-medium",
                  themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'
                )}>{formatLargeNumber(asset.volume)}</div>
              </div>
            )}
            {asset.marketCap && (
              <div>
                <span className={cn(
                  themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'
                )}>Market Cap</span>
                <div className={cn(
                  "font-medium",
                  themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'
                )}>{formatLargeNumber(asset.marketCap)}</div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Buy
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Sell
            </Button>
            <Button size="sm" variant="outline">
              <Bell className="w-3 h-3" />
            </Button>
          </div>

          {/* Community Sentiment Poll */}
          <div className="mt-3">
            <PollWidget
              ticker={asset.ticker}
              variant="inline"
              showAI={true}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        `bg-gradient-to-r from-${sentimentColor}-500/5 via-purple-500/5 to-pink-500/5`
      )} />
    </div>
  );
};
