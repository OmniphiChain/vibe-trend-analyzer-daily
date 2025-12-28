import { useState } from 'react';
import { Filter, X, Shield, AlertTriangle, CheckCircle, Star, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { BadgeType, BADGE_DEFINITIONS, CredibilityFilter as FilterType } from '@/types/credibility';
import { CredibilityBadge } from './CredibilityBadge';
import { cn } from '@/lib/utils';

interface CredibilityFilterProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
  className?: string;
}

export const CredibilityFilter = ({ onFilterChange, currentFilter, className }: CredibilityFilterProps) => {
  const { themeMode } = useMoodTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleScoreRangeChange = (values: number[]) => {
    onFilterChange({
      ...currentFilter,
      minScore: values[0],
      maxScore: values[1]
    });
  };

  const handleBadgeToggle = (badge: BadgeType, required: boolean) => {
    const requiredBadges = currentFilter.requiredBadges || [];
    const excludeBadges = currentFilter.excludeBadges || [];

    if (required) {
      const newRequired = requiredBadges.includes(badge)
        ? requiredBadges.filter(b => b !== badge)
        : [...requiredBadges, badge];
      
      onFilterChange({
        ...currentFilter,
        requiredBadges: newRequired,
        excludeBadges: excludeBadges.filter(b => b !== badge)
      });
    } else {
      const newExcluded = excludeBadges.includes(badge)
        ? excludeBadges.filter(b => b !== badge)
        : [...excludeBadges, badge];
      
      onFilterChange({
        ...currentFilter,
        excludeBadges: newExcluded,
        requiredBadges: requiredBadges.filter(b => b !== badge)
      });
    }
  };

  const resetFilters = () => {
    onFilterChange({
      sortBy: 'score',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = Boolean(
    currentFilter.minScore ||
    currentFilter.maxScore ||
    currentFilter.requiredBadges?.length ||
    currentFilter.excludeBadges?.length ||
    currentFilter.moderationStatus?.length
  );

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2',
          hasActiveFilters && 'border-primary text-primary'
        )}
      >
        <Filter className="w-4 h-4" />
        Credibility Filter
        {hasActiveFilters && (
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Panel */}
          <Card className={cn(
            'absolute top-full left-0 z-20 w-96 mt-2 shadow-lg',
            themeMode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white'
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filter by Credibility</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Filter content based on user credibility and post quality
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Score Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Credibility Score Range</Label>
                <div className="px-2">
                  <Slider
                    value={[currentFilter.minScore || 0, currentFilter.maxScore || 100]}
                    onValueChange={handleScoreRangeChange}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{currentFilter.minScore || 0}</span>
                    <span>{currentFilter.maxScore || 100}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Required Badges */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Required Badges</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {Object.entries(BADGE_DEFINITIONS).map(([key, badge]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <CredibilityBadge badge={badge.type} size="sm" showTooltip={false} />
                      </div>
                      <Checkbox
                        checked={currentFilter.requiredBadges?.includes(badge.type) || false}
                        onCheckedChange={(checked) => handleBadgeToggle(badge.type, !!checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Moderation Status */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Content Status</Label>
                <div className="space-y-2">
                  {[
                    { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600' },
                    { value: 'flagged', label: 'Flagged', icon: AlertTriangle, color: 'text-yellow-600' },
                    { value: 'under-review', label: 'Under Review', icon: Shield, color: 'text-blue-600' }
                  ].map(status => (
                    <div key={status.value} className="flex items-center gap-2">
                      <Checkbox
                        id={status.value}
                        checked={currentFilter.moderationStatus?.includes(status.value as any) || false}
                        onCheckedChange={(checked) => {
                          const statuses = currentFilter.moderationStatus || [];
                          const newStatuses = checked
                            ? [...statuses, status.value as any]
                            : statuses.filter(s => s !== status.value);
                          onFilterChange({ ...currentFilter, moderationStatus: newStatuses });
                        }}
                      />
                      <Label htmlFor={status.value} className="flex items-center gap-2 cursor-pointer">
                        <status.icon className={cn('w-4 h-4', status.color)} />
                        {status.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sort Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sort By</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={currentFilter.sortBy || 'score'}
                    onValueChange={(value) => onFilterChange({ ...currentFilter, sortBy: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Credibility Score</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={currentFilter.sortOrder || 'desc'}
                    onValueChange={(value) => onFilterChange({ ...currentFilter, sortOrder: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Highest First</SelectItem>
                      <SelectItem value="asc">Lowest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

interface QuickFilterProps {
  onFilterSelect: (filter: Partial<FilterType>) => void;
  className?: string;
}

export const QuickCredibilityFilters = ({ onFilterSelect, className }: QuickFilterProps) => {
  const quickFilters = [
    {
      label: 'High Quality Only',
      description: 'Score 80+',
      filter: { minScore: 80 },
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      label: 'Verified Users',
      description: 'Verified insights only',
      filter: { requiredBadges: ['verified-insight' as BadgeType] },
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Analyst Grade',
      description: 'Professional analysis',
      filter: { requiredBadges: ['analyst-grade' as BadgeType] },
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      label: 'Hide Speculative',
      description: 'Remove low-quality posts',
      filter: { excludeBadges: ['speculative' as BadgeType] },
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {quickFilters.map((filter, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onFilterSelect(filter.filter)}
          className="flex items-center gap-2 h-auto py-2 px-3"
        >
          <filter.icon className={cn('w-4 h-4', filter.color)} />
          <div className="text-left">
            <div className="text-sm font-medium">{filter.label}</div>
            <div className="text-xs text-muted-foreground">{filter.description}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

interface ModerationToolsProps {
  onReport: (reason: string) => void;
  onFlag: (type: string) => void;
  className?: string;
}

export const CredibilityModerationTools = ({ onReport, onFlag, className }: ModerationToolsProps) => {
  const { themeMode } = useMoodTheme();

  const reportReasons = [
    'Misleading information',
    'Market manipulation',
    'Spam or low quality',
    'Inappropriate content',
    'Fraudulent claims',
    'Other'
  ];

  const flagTypes = [
    { type: 'speculative', label: 'Mark as Speculative', icon: AlertTriangle },
    { type: 'needs-review', label: 'Needs Review', icon: Shield },
    { type: 'accurate', label: 'Mark as Accurate', icon: CheckCircle }
  ];

  return (
    <Card className={cn('p-4', className)}>
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Moderation Tools
        </CardTitle>
        <CardDescription>
          Help maintain content quality and credibility
        </CardDescription>
      </CardHeader>

      <div className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {flagTypes.map((flagType) => (
            <Button
              key={flagType.type}
              variant="outline"
              size="sm"
              onClick={() => onFlag(flagType.type)}
              className="flex items-center gap-2 justify-start"
            >
              <flagType.icon className="w-4 h-4" />
              {flagType.label}
            </Button>
          ))}
        </div>

        <Separator />

        {/* Report Options */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Report Content</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Select Report Reason
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {reportReasons.map((reason, index) => (
                <DropdownMenuItem key={index} onClick={() => onReport(reason)}>
                  {reason}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Community Guidelines */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Help maintain a trustworthy trading community by reporting misleading content and 
            recognizing quality analysis. Your actions help improve credibility scoring.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};
