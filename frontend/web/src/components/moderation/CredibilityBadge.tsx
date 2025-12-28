import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  TrendingUp,
  Link,
  Brain,
  Users,
  Award,
  Clock,
} from "lucide-react";
import { EmojiIcon, getIconFromEmoji } from "../../lib/iconUtils";
import type { PostCredibility, CredibilityLevel } from "@/types/moderation";

interface CredibilityBadgeProps {
  credibility: PostCredibility;
  variant?: "default" | "compact" | "detailed";
  showTooltip?: boolean;
  className?: string;
}

const getCredibilityConfig = (score: number, level: CredibilityLevel) => {
  if (score >= 70) {
    return {
      label: "Trusted",
      sublabel: "Data-Backed Insight",
      icon: <CheckCircle className="w-3 h-3" />,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-800 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      iconEmoji: <EmojiIcon emoji="🟢" className="w-3 h-3" />,
    };
  } else if (score >= 40) {
    return {
      label: "Mixed",
      sublabel: "Needs More Validation",
      icon: <AlertTriangle className="w-3 h-3" />,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      textColor: "text-yellow-800 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconEmoji: <EmojiIcon emoji="🟡" className="w-3 h-3" />,
    };
  } else {
    return {
      label: "Low",
      sublabel: "Unverified Claim",
      icon: <XCircle className="w-3 h-3" />,
      bgColor: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-800 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
      iconEmoji: <EmojiIcon emoji="🔴" className="w-3 h-3" />,
    };
  }
};

const CredibilityDetails: React.FC<{ credibility: PostCredibility }> = ({ credibility }) => {
  const { themeMode } = useMoodTheme();
  const config = getCredibilityConfig(credibility.score, credibility.level);

  return (
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="flex items-center gap-2">
        {config.icon}
        <div>
          <div className="font-semibold text-sm">{config.label} Credibility</div>
          <div className={cn(
            "text-xs",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            Score: {credibility.score}/100
          </div>
        </div>
      </div>

      {/* Scoring Factors */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Scoring Factors
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Link className="w-3 h-3 text-blue-500" />
            <span>Sources: {credibility.factors.hasSourceLinks ? "✓" : "✗"}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span>Data: {credibility.factors.hasDataEvidence ? "✓" : "✗"}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-purple-500" />
            <span>AI Verified: {credibility.factors.aiVerificationScore}/100</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-orange-500" />
            <span>Community: {credibility.communityScore}/100</span>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          AI Analysis
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Type:</span>
            <Badge variant="outline" className="text-xs py-0 px-1 h-5">
              {credibility.aiAnalysis.contentType.replace('_', ' ')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Confidence:</span>
            <span>{Math.round(credibility.aiAnalysis.confidenceScore * 100)}%</span>
          </div>
          
          {credibility.aiAnalysis.riskFlags.length > 0 && (
            <div className="space-y-1">
              <span className="font-medium text-red-600 dark:text-red-400">Risk Flags:</span>
              <div className="flex flex-wrap gap-1">
                {credibility.aiAnalysis.riskFlags.map((flag, index) => (
                  <Badge key={index} variant="destructive" className="text-xs py-0 px-1 h-5">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community Feedback */}
      {(credibility.communityVotes.helpful > 0 || 
        credibility.communityVotes.misleading > 0 || 
        credibility.communityVotes.accurate > 0) && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Community Votes
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-green-600">{credibility.communityVotes.helpful}</div>
              <div className="text-muted-foreground">Helpful</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-blue-600">{credibility.communityVotes.accurate}</div>
              <div className="text-muted-foreground">Accurate</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">{credibility.communityVotes.misleading}</div>
              <div className="text-muted-foreground">Misleading</div>
            </div>
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
        <Clock className="w-3 h-3" />
        <span>Updated {new Date(credibility.lastUpdated).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export const CredibilityBadge: React.FC<CredibilityBadgeProps> = ({
  credibility,
  variant = "default",
  showTooltip = true,
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const config = getCredibilityConfig(credibility.score, credibility.level);

  const CompactBadge = () => (
    <Badge
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.iconEmoji}
      <span>{credibility.score}</span>
    </Badge>
  );

  const DefaultBadge = () => (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium border px-2 py-1",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
      <span className="font-mono text-xs">({credibility.score})</span>
    </Badge>
  );

  const DetailedBadge = () => (
    <div className={cn(
      "inline-flex flex-col items-start gap-1 p-2 rounded-lg border",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className={cn("flex items-center gap-1.5", config.textColor)}>
        {config.icon}
        <span className="font-medium text-sm">{config.label}</span>
        <span className="font-mono text-xs">({credibility.score}/100)</span>
      </div>
      <div className={cn(
        "text-xs",
        themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
      )}>
        {config.sublabel}
      </div>
    </div>
  );

  const renderBadge = () => {
    switch (variant) {
      case "compact":
        return <CompactBadge />;
      case "detailed":
        return <DetailedBadge />;
      default:
        return <DefaultBadge />;
    }
  };

  if (!showTooltip) {
    return renderBadge();
  }

  return (
    <TooltipProvider>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-help">
            {renderBadge()}
          </div>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-80 p-0" 
          side="top"
          align="start"
        >
          <CredibilityDetails credibility={credibility} />
        </HoverCardContent>
      </HoverCard>
    </TooltipProvider>
  );
};

// Utility component for user credibility level
export const UserCredibilityIndicator: React.FC<{
  level: CredibilityLevel;
  score: number;
  compact?: boolean;
  showBadge?: boolean;
  topBadge?: string;
}> = ({ level, score, compact = false, showBadge = false, topBadge }) => {
  const config = getCredibilityConfig(score, level);

  // Import badge definitions only when needed
  let badgeIcon = null;
  let badgeColor = null;

  if (showBadge && topBadge) {
    try {
      // Dynamically import badge definitions to avoid circular dependencies
      const badges = {
        "trusted_contributor": { icon: <EmojiIcon emoji="✅" className="w-3 h-3" />, color: "#10B981" },
        "verified_insights": { icon: <EmojiIcon emoji="📊" className="w-3 h-3" />, color: "#3B82F6" },
        "top_predictor": { icon: <EmojiIcon emoji="🚀" className="w-3 h-3" />, color: "#DC2626" },
        "bullish_beast": { icon: <EmojiIcon emoji="🐂" className="w-3 h-3" />, color: "#059669" },
        "bear_watcher": { icon: <EmojiIcon emoji="🐻" className="w-3 h-3" />, color: "#DC2626" },
        "diamond_hands": { icon: <EmojiIcon emoji="💎" className="w-3 h-3" />, color: "#3B82F6" },
        "premium_member": { icon: <EmojiIcon emoji="⭐" className="w-3 h-3" />, color: "#F59E0B" },
        "new_voice": { icon: <EmojiIcon emoji="🧪" className="w-3 h-3" />, color: "#6B7280" },
      };

      const badge = badges[topBadge as keyof typeof badges];
      if (badge) {
        badgeIcon = badge.icon;
        badgeColor = badge.color;
      }
    } catch (error) {
      // Fallback if badge not found
    }
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <div className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
                config.bgColor,
                config.textColor
              )}>
                {config.iconEmoji}
              </div>
              {showBadge && badgeIcon && (
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: badgeColor || '#6B7280' }}
                  title={`Top Badge: ${topBadge?.replace('_', ' ')}`}
                >
                  {badgeIcon}
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p>{config.label} Contributor ({score}/100)</p>
              {showBadge && topBadge && (
                <p className="text-xs">Top Badge: {topBadge.replace('_', ' ')}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Badge
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium",
          config.bgColor,
          config.textColor,
          config.borderColor
        )}
      >
        {config.icon}
        <span>{config.label} Contributor</span>
      </Badge>
      {showBadge && badgeIcon && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
          style={{ backgroundColor: badgeColor || '#6B7280' }}
          title={`Top Badge: ${topBadge?.replace('_', ' ')}`}
        >
          {badgeIcon}
        </div>
      )}
    </div>
  );
};

export default CredibilityBadge;
