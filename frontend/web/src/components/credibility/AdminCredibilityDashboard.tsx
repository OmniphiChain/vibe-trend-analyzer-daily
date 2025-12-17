import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, Award, AlertTriangle, BarChart3, PieChart, Activity, 
  Search, Settings, Shield, Eye, EyeOff, Ban, Check, X, Download, Filter, 
  Clock, Flag, UserCheck, Zap, Sliders, RotateCcw, Save, FileText, Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { BadgeType, BADGE_DEFINITIONS, UserCredibility, CREDIBILITY_WEIGHTS } from '@/types/credibility';
import { credibilityService, generateMockPostData } from '@/services/credibilityService';
import { CredibilityBadge, CredibilityScore } from './CredibilityBadge';
import { cn } from '@/lib/utils';

interface AdminCredibilityDashboardProps {
  className?: string;
}

interface PostIntelligence {
  id: string;
  content: string;
  author: string;
  score: number;
  badges: BadgeType[];
  likes: number;
  flags: number;
  status: 'approved' | 'flagged' | 'pending' | 'removed';
  timestamp: Date;
  hasChart: boolean;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface AuditLog {
  id: string;
  action: string;
  admin: string;
  target: string;
  details: string;
  timestamp: Date;
  type: 'badge_override' | 'ban' | 'config_change' | 'post_action' | 'user_action';
}

export const AdminCredibilityDashboard = ({ className }: AdminCredibilityDashboardProps) => {
  const { themeMode } = useMoodTheme();
  const [analytics, setAnalytics] = useState<any>(null);
  const [topUsers, setTopUsers] = useState<UserCredibility[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostIntelligence[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserCredibility | null>(null);
  
  // Scoring model state
  const [scoringWeights, setScoringWeights] = useState({
    postAccuracy: CREDIBILITY_WEIGHTS.POST_ACCURACY * 100,
    communityFeedback: CREDIBILITY_WEIGHTS.COMMUNITY_FEEDBACK * 100,
    dataEvidence: CREDIBILITY_WEIGHTS.DATA_EVIDENCE * 100,
    aiValidation: CREDIBILITY_WEIGHTS.AI_VALIDATION * 100,
    userConsistency: CREDIBILITY_WEIGHTS.USER_CONSISTENCY * 100
  });
  
  // Auto-moderation settings
  const [autoModerationSettings, setAutoModerationSettings] = useState({
    autoFlagEnabled: true,
    lowScoreThreshold: 30,
    flagThreshold: 2,
    autoHideEnabled: false,
    reviewRequired: true
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [analyticsData, topUsersData] = await Promise.all([
        credibilityService.getCredibilityAnalytics(),
        credibilityService.getFilteredUsers({ limit: 20 })
      ]);
      
      setAnalytics(analyticsData);
      setTopUsers(topUsersData);
      setRecentPosts(generateMockPostIntelligence());
      setAuditLogs(generateMockAuditLogs());
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPostIntelligence = (): PostIntelligence[] => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: `post_${i}`,
      content: [
        'AAPL looking strong with technical breakout pattern. Price target $200+',
        'Bitcoin sentiment turning bullish as institutional adoption increases',
        'TSLA earnings beat expectations. Expecting continued momentum',
        'Market sentiment mixed due to inflation concerns',
        'NVDA AI dominance will continue driving growth'
      ][i % 5],
      author: `user_${i}`,
      score: Math.floor(Math.random() * 100),
      badges: ['verified-insight', 'analyst-grade'].slice(0, Math.floor(Math.random() * 2 + 1)) as BadgeType[],
      likes: Math.floor(Math.random() * 200),
      flags: Math.floor(Math.random() * 5),
      status: ['approved', 'flagged', 'pending'][Math.floor(Math.random() * 3)] as any,
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      hasChart: Math.random() > 0.6,
      sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as any
    }));
  };

  const generateMockAuditLogs = (): AuditLog[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `log_${i}`,
      action: [
        'Badge Override: Verified Insight awarded',
        'User Banned: Spam activity detected',
        'Config Change: Scoring weights updated',
        'Post Flagged: Misleading information',
        'Badge Removed: Performance degradation'
      ][i % 5],
      admin: `admin_${Math.floor(Math.random() * 3)}`,
      target: `user_${Math.floor(Math.random() * 10)}`,
      details: 'System action triggered by threshold breach',
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      type: ['badge_override', 'ban', 'config_change', 'post_action', 'user_action'][Math.floor(Math.random() * 5)] as any
    }));
  };

  const handlePostAction = (postId: string, action: string) => {
    setRecentPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: action as any }
        : post
    ));
    
    // Add to audit log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      action: `Post ${action}`,
      admin: 'current_admin',
      target: postId,
      details: `Post status changed to ${action}`,
      timestamp: new Date(),
      type: 'post_action'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleScoringUpdate = () => {
    // Simulate saving scoring weights
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      action: 'Scoring weights updated',
      admin: 'current_admin',
      target: 'system',
      details: `Weights: Accuracy(${scoringWeights.postAccuracy}%), Community(${scoringWeights.communityFeedback}%), Data(${scoringWeights.dataEvidence}%), AI(${scoringWeights.aiValidation}%), Consistency(${scoringWeights.userConsistency}%)`,
      timestamp: new Date(),
      type: 'config_change'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const exportData = (type: string) => {
    // Mock export functionality
    console.log(`Exporting ${type} data...`);
  };

  if (loading) {
    return (
      <div className={cn('space-y-6 p-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            Admin Credibility Dashboard
            <Badge variant="destructive" className="text-xs">
              ADMIN ONLY
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor, analyze, and manage the credibility scoring system across MoodMeter
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => exportData('full')} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button onClick={loadAllData} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={cn(themeMode === 'dark' ? 'bg-gray-900' : 'bg-white')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Platform Avg Score</p>
                    <p className="text-3xl font-bold">{analytics?.averageScore || 73}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +3.2% vs last week
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={cn(themeMode === 'dark' ? 'bg-gray-900' : 'bg-white')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Trust Users</p>
                    <p className="text-3xl font-bold">27%</p>
                    <p className="text-sm text-muted-foreground">Score 80+</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={cn(themeMode === 'dark' ? 'bg-gray-900' : 'bg-white')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Flagged Content</p>
                    <p className="text-3xl font-bold text-red-500">{analytics?.flaggedPosts || 12}</p>
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      Needs review
                    </p>
                  </div>
                  <Flag className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={cn(themeMode === 'dark' ? 'bg-gray-900' : 'bg-white')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sentiment Accuracy</p>
                    <p className="text-3xl font-bold">84%</p>
                    <p className="text-sm text-green-600">vs market moves</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <span>Review Flagged</span>
                  <Badge variant="destructive">{analytics?.flaggedPosts || 12}</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Users className="w-6 h-6 text-blue-500" />
                  <span>Pending Users</span>
                  <Badge variant="secondary">8</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Shield className="w-6 h-6 text-purple-500" />
                  <span>Moderation Queue</span>
                  <Badge variant="outline">24</Badge>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Settings className="w-6 h-6 text-gray-500" />
                  <span>System Config</span>
                  <Badge variant="secondary">OK</Badge>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Post Activity</CardTitle>
                <CardDescription>Real-time credibility scoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 rounded border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{post.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <CredibilityScore score={post.score} size="sm" />
                          <span className="text-xs text-muted-foreground">by {post.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.hasChart && <BarChart3 className="w-4 h-4 text-blue-500" />}
                        <Badge variant={
                          post.status === 'approved' ? 'default' :
                          post.status === 'flagged' ? 'destructive' : 'secondary'
                        }>
                          {post.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Performance</CardTitle>
                <CardDescription>Badge adoption and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics?.badgeDistribution || {}).slice(0, 4).map(([badge, count]) => {
                    const badgeInfo = BADGE_DEFINITIONS[badge as BadgeType];
                    if (!badgeInfo) return null;
                    
                    return (
                      <div key={badge} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CredibilityBadge badge={badge as BadgeType} size="sm" showTooltip={false} />
                          <span className="text-sm">{count} users</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">4.2x</div>
                          <div className="text-xs text-muted-foreground">engagement</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Insights Panel</CardTitle>
                  <CardDescription>Search and analyze any user's credibility data</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search by username or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {topUsers.filter(user => 
                    searchQuery === '' || 
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.userId.includes(searchQuery)
                  ).map((user) => (
                    <div 
                      key={user.userId} 
                      className={cn(
                        "p-4 rounded border cursor-pointer transition-colors",
                        selectedUser?.userId === user.userId && "border-primary bg-primary/5"
                      )}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">ID: {user.userId}</div>
                          </div>
                        </div>
                        <CredibilityScore score={user.currentScore} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Details */}
                <div>
                  {selectedUser ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{selectedUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          {selectedUser.username}
                        </CardTitle>
                        <CardDescription>Detailed credibility breakdown</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Score Breakdown */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Overall Score</span>
                            <CredibilityScore score={selectedUser.currentScore} size="sm" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Accuracy Rate</span>
                              <span>{((selectedUser.accuratePredictions / selectedUser.totalPosts) * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={(selectedUser.accuratePredictions / selectedUser.totalPosts) * 100} />
                          </div>
                        </div>

                        {/* Badges */}
                        <div>
                          <Label className="text-sm font-medium">Current Badges</Label>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {selectedUser.badges.map(badge => (
                              <CredibilityBadge key={badge} badge={badge} size="sm" />
                            ))}
                          </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="pt-4 border-t">
                          <Label className="text-sm font-medium mb-2 block">Admin Actions</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm">
                              <Award className="w-4 h-4 mr-2" />
                              Award Badge
                            </Button>
                            <Button variant="outline" size="sm">
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Recalculate
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Monitor
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a user to view details
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Post Intelligence Monitor</CardTitle>
                  <CardDescription>Live feed of posts with credibility analysis</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="low-score">Low Score (&lt;40)</SelectItem>
                      <SelectItem value="high-impact">High Impact (100+ likes)</SelectItem>
                      <SelectItem value="flagged">Recently Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Card key={post.id} className={cn(
                    "p-4",
                    post.status === 'flagged' && "border-red-500 bg-red-50 dark:bg-red-950"
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">@{post.author}</span>
                          <CredibilityScore score={post.score} size="sm" />
                          <div className="flex gap-1">
                            {post.badges.map(badge => (
                              <CredibilityBadge key={badge} badge={badge} size="sm" />
                            ))}
                          </div>
                          {post.hasChart && (
                            <Badge variant="outline" className="text-xs">
                              <BarChart3 className="w-3 h-3 mr-1" />
                              Chart
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>👍 {post.likes}</span>
                          <span>🚩 {post.flags}</span>
                          <span>{post.timestamp.toLocaleTimeString()}</span>
                          <Badge variant={
                            post.sentiment === 'bullish' ? 'default' :
                            post.sentiment === 'bearish' ? 'destructive' : 'secondary'
                          } className="text-xs">
                            {post.sentiment}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePostAction(post.id, 'approved')}
                          disabled={post.status === 'approved'}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePostAction(post.id, 'flagged')}
                          disabled={post.status === 'flagged'}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePostAction(post.id, 'recalculate')}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handlePostAction(post.id, 'removed')}>
                              Remove Post
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Contact Author
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Add to Training
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Tab */}
        <TabsContent value="model" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scoring Model Tuner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Scoring Model Tuner
                </CardTitle>
                <CardDescription>
                  Adjust credibility scoring weights with real-time impact preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(scoringWeights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </Label>
                        <span className="text-sm text-muted-foreground">{value}%</span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => 
                          setScoringWeights(prev => ({ ...prev, [key]: newValue }))
                        }
                        max={50}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Total Weight</AlertTitle>
                  <AlertDescription>
                    Current total: {Object.values(scoringWeights).reduce((sum, val) => sum + val, 0)}%
                    {Object.values(scoringWeights).reduce((sum, val) => sum + val, 0) !== 100 && (
                      <span className="text-red-500 ml-2">⚠️ Should equal 100%</span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button onClick={handleScoringUpdate} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setScoringWeights({
                    postAccuracy: 35,
                    communityFeedback: 25,
                    dataEvidence: 15,
                    aiValidation: 15,
                    userConsistency: 10
                  })}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Auto-Moderation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Auto-Moderation Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic moderation and enforcement rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-Flag Low Quality</Label>
                      <p className="text-xs text-muted-foreground">Automatically flag posts below threshold</p>
                    </div>
                    <Switch 
                      checked={autoModerationSettings.autoFlagEnabled}
                      onCheckedChange={(checked) => 
                        setAutoModerationSettings(prev => ({ ...prev, autoFlagEnabled: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Low Score Threshold: {autoModerationSettings.lowScoreThreshold}
                    </Label>
                    <Slider
                      value={[autoModerationSettings.lowScoreThreshold]}
                      onValueChange={([value]) => 
                        setAutoModerationSettings(prev => ({ ...prev, lowScoreThreshold: value }))
                      }
                      max={50}
                      min={10}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Flag Threshold: {autoModerationSettings.flagThreshold} reports
                    </Label>
                    <Slider
                      value={[autoModerationSettings.flagThreshold]}
                      onValueChange={([value]) => 
                        setAutoModerationSettings(prev => ({ ...prev, flagThreshold: value }))
                      }
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Auto-Hide Content</Label>
                      <p className="text-xs text-muted-foreground">Hide flagged content from public view</p>
                    </div>
                    <Switch 
                      checked={autoModerationSettings.autoHideEnabled}
                      onCheckedChange={(checked) => 
                        setAutoModerationSettings(prev => ({ ...prev, autoHideEnabled: checked }))
                      }
                    />
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Current rule: Score &lt; {autoModerationSettings.lowScoreThreshold} + {autoModerationSettings.flagThreshold} reports = 
                    {autoModerationSettings.autoHideEnabled ? ' auto-hide' : ' flag for review'}
                  </AlertDescription>
                </Alert>

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Moderation Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Audit Logs & System Events
                  </CardTitle>
                  <CardDescription>Complete log of all admin actions and system events</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search logs..." 
                    className="w-48"
                  />
                  <Button variant="outline" onClick={() => exportData('logs')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded border">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        log.type === 'badge_override' ? 'bg-blue-500' :
                        log.type === 'ban' ? 'bg-red-500' :
                        log.type === 'config_change' ? 'bg-purple-500' :
                        log.type === 'post_action' ? 'bg-green-500' : 'bg-gray-500'
                      )} />
                      <div>
                        <div className="font-medium text-sm">{log.action}</div>
                        <div className="text-xs text-muted-foreground">
                          by {log.admin} → {log.target}
                        </div>
                        <div className="text-xs text-muted-foreground">{log.details}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {log.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">142ms</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">1.2M</div>
                <div className="text-sm text-muted-foreground">Events Processed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
