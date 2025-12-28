import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Users, Award, AlertTriangle, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { BadgeType, BADGE_DEFINITIONS, UserCredibility } from '@/types/credibility';
import { credibilityService } from '@/services/credibilityService';
import { CredibilityBadge, CredibilityScore } from './CredibilityBadge';
import { UserCredibilityProfile } from './UserCredibilityProfile';
import { cn } from '@/lib/utils';

interface CredibilityAnalyticsDashboardProps {
  className?: string;
}

export const CredibilityAnalyticsDashboard = ({ className }: CredibilityAnalyticsDashboardProps) => {
  const { themeMode } = useMoodTheme();
  const [analytics, setAnalytics] = useState<any>(null);
  const [topUsers, setTopUsers] = useState<UserCredibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, topUsersData] = await Promise.all([
        credibilityService.getCredibilityAnalytics(),
        credibilityService.getFilteredUsers({ limit: 10 })
      ]);
      setAnalytics(analyticsData);
      setTopUsers(topUsersData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-300 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Unable to load analytics data</p>
        </CardContent>
      </Card>
    );
  }

  const getScoreDistribution = () => {
    // Mock score distribution data
    return [
      { range: '90-100', count: 12, percentage: 8, color: '#059669' },
      { range: '80-89', count: 28, percentage: 19, color: '#0891B2' },
      { range: '70-79', count: 45, percentage: 30, color: '#2563EB' },
      { range: '60-69', count: 38, percentage: 25, color: '#7C3AED' },
      { range: '50-59', count: 18, percentage: 12, color: '#DC2626' },
      { range: '0-49', count: 9, percentage: 6, color: '#991B1B' }
    ];
  };

  const getTrendData = () => {
    // Mock trend data
    return [
      { date: '7 days ago', score: 68, users: 142 },
      { date: '6 days ago', score: 69, users: 145 },
      { date: '5 days ago', score: 71, users: 148 },
      { date: '4 days ago', score: 70, users: 151 },
      { date: '3 days ago', score: 72, users: 154 },
      { date: '2 days ago', score: 74, users: 156 },
      { date: 'Yesterday', score: 75, users: 158 },
      { date: 'Today', score: analytics.averageScore, users: analytics.totalUsers }
    ];
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Credibility Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and analyze community credibility metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Top Users</TabsTrigger>
          <TabsTrigger value="badges">Badge Analytics</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold">{analytics.averageScore}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +3.2% from last period
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +12 new users
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Quality</p>
                    <p className="text-2xl font-bold">27%</p>
                    <p className="text-xs text-muted-foreground mt-1">Score 80+</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Flagged Posts</p>
                    <p className="text-2xl font-bold">{analytics.flaggedPosts}</p>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      Needs attention
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Score Distribution
              </CardTitle>
              <CardDescription>
                Distribution of credibility scores across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getScoreDistribution().map((segment, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{segment.range}</div>
                    <div className="flex-1">
                      <Progress value={segment.percentage} className="h-3" />
                    </div>
                    <div className="w-12 text-sm text-muted-foreground text-right">
                      {segment.count}
                    </div>
                    <div className="w-12 text-sm text-muted-foreground text-right">
                      {segment.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Credibility Trends
              </CardTitle>
              <CardDescription>
                Average credibility score and user growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {getTrendData().map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex flex-col items-center gap-1 mb-2">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(day.score / 100) * 160}px` }}
                      />
                      <div 
                        className="w-full bg-green-500 rounded-t opacity-60"
                        style={{ height: `${(day.users / 200) * 80}px` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      <div>{day.score}</div>
                      <div className="font-medium">{day.date.split(' ')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Avg. Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded opacity-60"></div>
                  <span>User Count</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Users</CardTitle>
              <CardDescription>
                Users with the highest credibility scores and community engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div key={user.userId} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{user.username}</span>
                        <CredibilityScore score={user.currentScore} size="sm" />
                      </div>
                      <div className="flex items-center gap-2">
                        {user.badges.slice(0, 3).map(badge => (
                          <CredibilityBadge key={badge} badge={badge} size="sm" />
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{user.totalPosts} posts</div>
                      <div>{user.accuratePredictions} accurate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badge Distribution</CardTitle>
              <CardDescription>
                How badges are distributed across the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analytics.badgeDistribution).map(([badge, count]) => {
                  const badgeInfo = BADGE_DEFINITIONS[badge as BadgeType];
                  if (!badgeInfo) return null;
                  
                  return (
                    <Card key={badge}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <CredibilityBadge badge={badge as BadgeType} size="sm" showTooltip={false} />
                          <span className="text-2xl font-bold">{count}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {badgeInfo.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Content Requiring Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Flagged Posts</span>
                    <Badge variant="destructive">{analytics.flaggedPosts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Low Score Posts</span>
                    <Badge variant="secondary">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pending Reviews</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Review Flagged Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Moderation Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Posts Reviewed Today</span>
                      <span className="font-medium">42</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Average Review Time</span>
                      <span className="font-medium">3.2 min</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Accuracy Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Moderation Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Post approved', user: 'TradingPro_2024', time: '2 minutes ago', type: 'approved' },
                  { action: 'Badge awarded', user: 'CryptoAnalyst', time: '15 minutes ago', type: 'badge' },
                  { action: 'Post flagged', user: 'NewTrader123', time: '1 hour ago', type: 'flagged' },
                  { action: 'Score updated', user: 'MarketMaven', time: '2 hours ago', type: 'update' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        item.type === 'approved' ? 'bg-green-500' :
                        item.type === 'badge' ? 'bg-blue-500' :
                        item.type === 'flagged' ? 'bg-red-500' : 'bg-gray-500'
                      )} />
                      <div>
                        <div className="font-medium">{item.action}</div>
                        <div className="text-sm text-muted-foreground">User: {item.user}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
