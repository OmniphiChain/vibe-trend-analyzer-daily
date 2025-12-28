import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { BadgeType, BADGE_DEFINITIONS } from '@/types/credibility';
import { cn } from '@/lib/utils';

interface CredibilityBadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
}

export const CredibilityBadge = ({ 
  badge, 
  size = 'md', 
  showTooltip = true, 
  animate = false,
  className 
}: CredibilityBadgeProps) => {
  const { themeMode } = useMoodTheme();
  const [isHovered, setIsHovered] = useState(false);
  const badgeDefinition = BADGE_DEFINITIONS[badge];

  if (!badgeDefinition) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 h-5',
    md: 'text-xs px-2 py-1 h-6',
    lg: 'text-sm px-3 py-1.5 h-8'
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const badgeElement = (
    <Badge
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-xl border transition-all duration-200',
        sizeClasses[size],
        animate && 'animate-in fade-in-0 slide-in-from-bottom-1 duration-300',
        isHovered && 'scale-105 shadow-lg',
        className
      )}
      style={{
        backgroundColor: themeMode === 'dark' ? badgeDefinition.darkBgColor : badgeDefinition.bgColor,
        color: themeMode === 'dark' ? badgeDefinition.darkColor : badgeDefinition.color,
        borderColor: themeMode === 'dark' ? badgeDefinition.darkColor + '40' : badgeDefinition.color + '40'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={cn('leading-none', iconSizes[size])}>
        {badgeDefinition.icon}
      </span>
      <span className="leading-none truncate">
        {badgeDefinition.label}
      </span>
    </Badge>
  );

  if (!showTooltip) return badgeElement;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeElement}
        </TooltipTrigger>
        <TooltipContent 
          side="top"
          className={cn(
            'max-w-xs p-3 text-sm',
            themeMode === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          )}
        >
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              <span className="text-base">{badgeDefinition.icon}</span>
              {badgeDefinition.label}
            </div>
            <p className="text-xs opacity-90">
              {badgeDefinition.description}
            </p>
            {badgeDefinition.requirements.length > 0 && (
              <div className="text-xs opacity-75">
                <div className="font-medium">Requirements:</div>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {badgeDefinition.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface CredibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

export const CredibilityScore = ({ 
  score, 
  size = 'md', 
  showLabel = true, 
  animate = false,
  className 
}: CredibilityScoreProps) => {
  const { themeMode } = useMoodTheme();

  const getScoreColor = (score: number): string => {
    if (score >= 80) return themeMode === 'dark' ? '#34D399' : '#059669'; // Green
    if (score >= 60) return themeMode === 'dark' ? '#60A5FA' : '#2563EB'; // Blue
    if (score >= 40) return themeMode === 'dark' ? '#FBBF24' : '#D97706'; // Yellow
    return themeMode === 'dark' ? '#F87171' : '#DC2626'; // Red
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return themeMode === 'dark' ? '#064E3B' : '#D1FAE5'; // Green
    if (score >= 60) return themeMode === 'dark' ? '#1E3A8A' : '#DBEAFE'; // Blue
    if (score >= 40) return themeMode === 'dark' ? '#78350F' : '#FEF3C7'; // Yellow
    return themeMode === 'dark' ? '#7F1D1D' : '#FEE2E2'; // Red
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 h-6',
    md: 'text-sm px-3 py-1.5 h-7',
    lg: 'text-base px-4 py-2 h-9'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 font-semibold rounded-xl border transition-all duration-200 hover:scale-105',
              sizeClasses[size],
              animate && 'animate-in fade-in-0 slide-in-from-right-1 duration-300',
              className
            )}
            style={{
              backgroundColor: getScoreBgColor(score),
              color: getScoreColor(score),
              borderColor: getScoreColor(score) + '40'
            }}
          >
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-current opacity-75"></div>
              <span>{score}</span>
            </div>
            {showLabel && size !== 'sm' && (
              <span className="text-xs opacity-90 font-medium">
                {getScoreLabel(score)}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-semibold">Credibility Score</div>
            <div className="text-sm opacity-90">{score}/100 - {getScoreLabel(score)}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MultipleBadgesProps {
  badges: BadgeType[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  animate?: boolean;
  className?: string;
}

export const MultipleBadges = ({ 
  badges, 
  maxVisible = 3, 
  size = 'md', 
  showTooltip = true,
  animate = false,
  className 
}: MultipleBadgesProps) => {
  const { themeMode } = useMoodTheme();
  const visibleBadges = badges.slice(0, maxVisible);
  const hiddenCount = badges.length - maxVisible;

  return (
    <div className={cn('flex items-center gap-1 flex-wrap', className)}>
      {visibleBadges.map((badge, index) => (
        <CredibilityBadge
          key={badge}
          badge={badge}
          size={size}
          showTooltip={showTooltip}
          animate={animate}
          style={{ animationDelay: animate ? `${index * 100}ms` : undefined }}
        />
      ))}
      
      {hiddenCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                className={cn(
                  'inline-flex items-center justify-center font-medium rounded-xl border transition-all duration-200 hover:scale-105',
                  size === 'sm' ? 'text-xs px-1.5 py-0.5 h-5 min-w-[20px]' : 
                  size === 'md' ? 'text-xs px-2 py-1 h-6 min-w-[24px]' :
                  'text-sm px-3 py-1.5 h-8 min-w-[32px]'
                )}
                style={{
                  backgroundColor: themeMode === 'dark' ? '#374151' : '#F3F4F6',
                  color: themeMode === 'dark' ? '#D1D5DB' : '#6B7280',
                  borderColor: themeMode === 'dark' ? '#4B5563' : '#D1D5DB'
                }}
              >
                +{hiddenCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div className="font-semibold">Additional Badges:</div>
                {badges.slice(maxVisible).map(badge => (
                  <div key={badge} className="text-sm flex items-center gap-2">
                    <span>{BADGE_DEFINITIONS[badge]?.icon}</span>
                    <span>{BADGE_DEFINITIONS[badge]?.label}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrendIndicator = ({ direction, size = 'md', className }: TrendIndicatorProps) => {
  const { themeMode } = useMoodTheme();

  const getIcon = () => {
    switch (direction) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
    }
  };

  const getColor = () => {
    switch (direction) {
      case 'up': return themeMode === 'dark' ? '#34D399' : '#059669';
      case 'down': return themeMode === 'dark' ? '#F87171' : '#DC2626';
      case 'stable': return themeMode === 'dark' ? '#D1D5DB' : '#6B7280';
    }
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <span 
      className={cn('inline-flex items-center', sizeClasses[size], className)}
      style={{ color: getColor() }}
      title={`Trend: ${direction}`}
    >
      {getIcon()}
    </span>
  );
};
