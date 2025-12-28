import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp, TrendingDown, Activity, Calendar, Target, Award, AlertTriangle } from 'lucide-react';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { UserCredibility, CredibilityMetrics } from '@/types/credibility';
import { CredibilityBadge, CredibilityScore, MultipleBadges, TrendIndicator } from './CredibilityBadge';
import { credibilityService } from '@/services/credibilityService';
import { cn } from '@/lib/utils';

interface UserCredibilityProfileProps {
  userId: string;
  showFullProfile?: boolean;
  className?: string;
}

export const UserCredibilityProfile = ({ 
  userId, 
  showFullProfile = true, 
  className 
}: UserCredibilityProfileProps) => {
  const { themeMode } = useMoodTheme();
  const [credibility, setCredibility] = useState<UserCredibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadCredibilityData();
  }, [userId]);

  const loadCredibilityData = async () => {
    try {
      setLoading(true);
      const data = await credibilityService.calculateUserCredibility(userId);
      setCredibility(data);
    } catch (error) {
      console.error('Failed to load credibility data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!credibility) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Unable to load credibility data</p>
        </CardContent>
      </Card>
    );
  }

  const accuracyRate = credibility.totalPosts > 0 
    ? (credibility.accuratePredictions / credibility.totalPosts) * 100 
    : 0;

  const engagementRate = credibility.totalPosts > 0 
    ? credibility.communityUpvotes / credibility.totalPosts 
    : 0;

  const CompactView = () => (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {credibility.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium truncate">{credibility.username}</span>
            <CredibilityScore score={credibility.currentScore} size="sm" showLabel={false} />
          </div>
          <MultipleBadges badges={credibility.badges} maxVisible={2} size="sm" />
        </div>
      </div>
    </Card>
  );

  if (!showFullProfile) {
    return <CompactView />;
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className={cn(
        'pb-4',
        themeMode === 'dark' 
          ? 'bg-gradient-to-r from-gray-900 to-gray-800'
          : 'bg-gradient-to-r from-gray-50 to-gray-100'
      )}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {credibility.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">{credibility.username}</CardTitle>
                <CredibilityScore score={credibility.currentScore} size="lg" animate />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Joined {credibility.joinDate.toLocaleDateString()}
              </div>
              
              <MultipleBadges badges={credibility.badges} maxVisible={4} animate />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{accuracyRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{credibility.totalPosts}</div>
                  <div className="text-sm text-muted-foreground">Total Posts</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{engagementRate.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg. Engagement</div>
                </CardContent>
              </Card>
            </div>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Credibility Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Post Accuracy</span>
                    <span className="text-sm text-muted-foreground">85/100</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Community Feedback</span>
                    <span className="text-sm text-muted-foreground">78/100</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Data Evidence</span>
                    <span className="text-sm text-muted-foreground">92/100</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AI Validation</span>
                    <span className="text-sm text-muted-foreground">72/100</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Consistency</span>
                    <span className="text-sm text-muted-foreground">88/100</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Score History Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score History</CardTitle>
                <CardDescription>Credibility score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {credibility.scoreHistory.map((entry, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(entry.score / 100) * 160}px` }}
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs font-medium">{entry.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>Latest trading calls and their outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {credibility.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-3 h-3 rounded-full',
                          activity.outcome === 'correct' ? 'bg-green-500' :
                          activity.outcome === 'incorrect' ? 'bg-red-500' :
                          'bg-yellow-500'
                        )} />
                        <div>
                          <div className="font-medium">Post #{activity.postId}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{activity.score}/100</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {activity.outcome || 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            {/* Activity Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{credibility.accuratePredictions}</div>
                  <div className="text-sm text-muted-foreground">Accurate</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {credibility.totalPosts - credibility.accuratePredictions}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{credibility.communityUpvotes}</div>
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{credibility.averageEngagement.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Avg. Engagement</div>
                </CardContent>
              </Card>
            </div>

            {/* Badge Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Earned Badges</CardTitle>
                <CardDescription>Recognition for trading expertise and community contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {credibility.badges.map((badge, index) => (
                    <div key={badge} className="flex items-center gap-3 p-3 rounded-lg border">
                      <CredibilityBadge badge={badge} size="lg" showTooltip={false} />
                      <div className="text-sm text-muted-foreground">
                        Earned for meeting credibility requirements
                      </div>
                    </div>
                  ))}
                </div>
                
                {credibility.badges.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No badges earned yet</p>
                    <p className="text-sm">Keep posting quality content to earn your first badge!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Simplified component for inline display
export const InlineCredibilityDisplay = ({ 
  userId, 
  showScore = true, 
  showBadges = true, 
  maxBadges = 2,
  size = 'sm' as const,
  className 
}: {
  userId: string;
  showScore?: boolean;
  showBadges?: boolean;
  maxBadges?: number;
  size?: 'sm' | 'md';
  className?: string;
}) => {
  const [credibility, setCredibility] = useState<UserCredibility | null>(null);

  useEffect(() => {
    credibilityService.calculateUserCredibility(userId).then(setCredibility);
  }, [userId]);

  if (!credibility) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showScore && (
        <CredibilityScore score={credibility.currentScore} size={size} showLabel={false} />
      )}
      {showBadges && credibility.badges.length > 0 && (
        <MultipleBadges badges={credibility.badges} maxVisible={maxBadges} size={size} />
      )}
    </div>
  );
};
