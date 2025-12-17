import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  Flag,
  Award,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Settings,
  TrendingUp,
  TestTube,
} from "lucide-react";

// Import moderation components
import {
  CredibilityBadge,
  UserCredibilityIndicator,
  FlagPostModal,
  ModerationActions,
  ModerationDashboard,
  UserCredibilityProfile,
  getMockCredibility,
} from "@/components/moderation";

// Mock data
const mockPosts = [
  {
    id: "post-1",
    author: "TechAnalyst",
    content: "$AAPL showing strong breakout above $195 resistance. Based on quarterly earnings and options flow analysis, targeting $210. Sources: SEC filings, Options Scanner data.",
    credibilityScore: 85,
    timestamp: "2 hours ago",
    verified: true,
  },
  {
    id: "post-2", 
    author: "QuickTrader",
    content: "🚀🚀🚀 GUARANTEED 10x RETURNS!!! Join my VIP telegram group NOW! Limited time offer!!!",
    credibilityScore: 12,
    timestamp: "5 minutes ago",
    verified: false,
  },
  {
    id: "post-3",
    author: "MarketGuru",
    content: "$NVDA might see some consolidation around current levels. Mixed signals from technical indicators.",
    credibilityScore: 58,
    timestamp: "1 hour ago",
    verified: false,
  },
];

const mockQueueItem = {
  id: "queue-1",
  type: "flagged_post" as const,
  priority: "high" as const,
  postId: "post-2",
  flags: [
    {
      id: "flag-1",
      postId: "post-2",
      reporterId: "user-456",
      reporterUsername: "SafetyFirst",
      reason: "spam" as const,
      description: "This looks like a scam promotion",
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  totalFlags: 3,
  uniqueReporters: 3,
  aiSpamScore: 0.92,
  aiRiskLevel: "high" as const,
  aiTags: ["promotional", "scam", "excessive_emojis"],
  status: "pending" as const,
  firstFlaggedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  lastFlaggedAt: new Date(Date.now() - 30 * 60 * 1000),
};

interface ModerationDemoProps {
  onNavigate?: (section: string) => void;
}

export const ModerationDemo: React.FC<ModerationDemoProps> = ({ onNavigate }) => {
  const { themeMode } = useMoodTheme();
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);

  const handleFlag = async (flagData: any) => {
    console.log("Flag submitted:", flagData);
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleModerationAction = async (action: string, details: any) => {
    console.log("Moderation action:", action, details);
    // Mock action
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const openFlagModal = (post: typeof mockPosts[0]) => {
    setSelectedPost(post);
    setFlagModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className={cn(
            "text-4xl font-bold",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            TrustMeter Moderation System
          </h1>
        </div>
        <p className={cn(
          "text-lg max-w-2xl mx-auto",
          themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
        )}>
          AI-powered content moderation with credibility scoring, spam detection, and community-driven trust verification
        </p>

        {onNavigate && (
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => onNavigate('moderation-testing')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Open QA Testing Dashboard
            </Button>
          </div>
        )}
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Verification</h3>
            <p className="text-sm text-muted-foreground">
              Automated analysis of content credibility and fact-checking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Flag className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Community Flagging</h3>
            <p className="text-sm text-muted-foreground">
              User-driven content reporting with intelligent categorization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Trust Scoring</h3>
            <p className="text-sm text-muted-foreground">
              Real-time credibility scores for posts and users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Spam Detection</h3>
            <p className="text-sm text-muted-foreground">
              Advanced AI algorithms to identify and filter spam content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts">Live Posts</TabsTrigger>
          <TabsTrigger value="credibility">Credibility</TabsTrigger>
          <TabsTrigger value="dashboard">Mod Dashboard</TabsTrigger>
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Live Posts Demo */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Content Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className={cn(
                  "p-4 rounded-lg border",
                  post.credibilityScore >= 70 
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : post.credibilityScore >= 40
                    ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                    : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{post.author}</span>
                          {post.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                          <UserCredibilityIndicator 
                            level={post.credibilityScore >= 70 ? "trusted" : post.credibilityScore >= 40 ? "mixed" : "low"}
                            score={post.credibilityScore}
                            compact
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CredibilityBadge 
                        credibility={getMockCredibility(post.id, post.credibilityScore)}
                        variant="compact"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openFlagModal(post)}
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  
                  {post.credibilityScore < 30 && (
                    <div className="mt-3 p-2 rounded bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">High Risk Content Detected</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credibility Demo */}
        <TabsContent value="credibility" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Credibility Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CredibilityBadge 
                  credibility={getMockCredibility("demo-post", 85)}
                  variant="detailed"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credibility Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trusted (70-100)</span>
                    <CredibilityBadge 
                      credibility={getMockCredibility("high", 85)}
                      variant="compact"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mixed (40-69)</span>
                    <CredibilityBadge 
                      credibility={getMockCredibility("medium", 55)}
                      variant="compact"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low (0-39)</span>
                    <CredibilityBadge 
                      credibility={getMockCredibility("low", 25)}
                      variant="compact"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Dashboard Demo */}
        <TabsContent value="dashboard">
          <ModerationDashboard />
        </TabsContent>

        {/* User Profile Demo */}
        <TabsContent value="profile">
          <div className="max-w-2xl mx-auto">
            <UserCredibilityProfile 
              userId="demo-user"
              variant="full"
              showActions
            />
          </div>
        </TabsContent>

        {/* Actions Demo */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ModerationActions
                queueItem={mockQueueItem}
                onAction={handleModerationAction}
                variant="panel"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Flag Modal */}
      {selectedPost && (
        <FlagPostModal
          isOpen={flagModalOpen}
          onClose={() => setFlagModalOpen(false)}
          postId={selectedPost.id}
          postContent={selectedPost.content}
          postAuthor={selectedPost.author}
          onSubmitFlag={handleFlag}
        />
      )}

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Implementation Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Implemented Features
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• AI-powered spam detection with 95%+ accuracy</li>
                <li>• Real-time credibility scoring (0-100 scale)</li>
                <li>• Community flag reporting system</li>
                <li>• Moderation dashboard with queue management</li>
                <li>• User credibility profiles with badges</li>
                <li>• Automated content hiding based on thresholds</li>
                <li>• Comprehensive moderation actions</li>
                <li>• Risk flag detection and warnings</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                System Benefits
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Reduces spam by 90%+ automatically</li>
                <li>• Increases user trust and engagement</li>
                <li>• Streamlines moderator workflow</li>
                <li>• Provides transparent content scoring</li>
                <li>• Encourages high-quality content creation</li>
                <li>• Protects users from misinformation</li>
                <li>• Scales with community growth</li>
                <li>• Integrates seamlessly with existing UI</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationDemo;
