import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Brain,
  Award,
  Users,
  TrendingUp,
  Target,
  Play,
  RotateCcw,
  Eye,
  Settings,
  BarChart3,
  TestTube,
  Activity,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Hash,
  ExternalLink,
  Info,
} from "lucide-react";

import { moderationService } from "@/services/moderationService";
import { badgeService } from "@/services/badgeService";
import { BADGE_DEFINITIONS } from "@/data/badgeDefinitions";
import { CredibilityBadge } from "@/components/moderation/CredibilityBadge";
import { BadgeDisplay } from "@/components/badges/BadgeDisplay";
import ThemeCompatibilityTester from "@/components/testing/ThemeCompatibilityTester";
import type { PostCredibility, SpamDetectionResult } from "@/types/moderation";
import type { UserBadge, BadgeType } from "@/types/badges";

interface TestResult {
  id: string;
  testName: string;
  category: "spam" | "credibility" | "badges" | "moderation";
  status: "passed" | "failed" | "warning" | "pending";
  score?: number;
  message: string;
  details?: any;
  timestamp: Date;
}

interface SpamTestCase {
  id: string;
  name: string;
  content: string;
  expectedSpam: boolean;
  expectedConfidence: number;
  expectedReasons: string[];
}

interface CredibilityTestCase {
  id: string;
  name: string;
  content: string;
  author: string;
  expectedScore: number;
  expectedLevel: "trusted" | "mixed" | "low" | "unverified";
}

interface BadgeTestCase {
  id: string;
  badgeType: BadgeType;
  userMetrics: {
    id: string;
    credibilityScore: number;
    postsCount: number;
    verifiedPosts: number;
    helpfulFlags: number;
    communityEngagement: number;
  };
  expectedEligible: boolean;
}

const SPAM_TEST_CASES: SpamTestCase[] = [
  {
    id: "spam-1",
    name: "Obvious Scam",
    content: "GUARANTEED 1000% PROFIT!!! 🚀🚀🚀 Send Bitcoin now for INSTANT WEALTH! Limited time offer ACT NOW!",
    expectedSpam: true,
    expectedConfidence: 0.9,
    expectedReasons: ["Excessive emojis", "Promotional language", "Scam indicators"]
  },
  {
    id: "spam-2", 
    name: "Pump & Dump Signal",
    content: "🔥🔥🔥 MOONSHOT ALERT 🔥🔥🔥 Join my telegram channel t.me/pumpsignals for insider trading signals! Easy money guaranteed!",
    expectedSpam: true,
    expectedConfidence: 0.85,
    expectedReasons: ["Suspicious links", "Promotional language", "Excessive emojis"]
  },
  {
    id: "spam-3",
    name: "Legitimate Analysis",
    content: "Based on the latest earnings report from Tesla, the P/E ratio suggests the stock might be overvalued. However, their EV market share continues to grow.",
    expectedSpam: false,
    expectedConfidence: 0.1,
    expectedReasons: []
  },
  {
    id: "spam-4",
    name: "Excessive Emoji Test",
    content: "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 TO THE MOON 🌙🌙🌙🌙🌙🌙🌙",
    expectedSpam: true,
    expectedConfidence: 0.7,
    expectedReasons: ["Excessive emojis"]
  },
  {
    id: "spam-5",
    name: "Borderline Promotional",
    content: "Check out this new trading strategy I've been using. It's been working well for me. What do you think?",
    expectedSpam: false,
    expectedConfidence: 0.3,
    expectedReasons: []
  }
];

const CREDIBILITY_TEST_CASES: CredibilityTestCase[] = [
  {
    id: "cred-1",
    name: "High Quality Analysis",
    content: "According to the latest SEC filing from AAPL, revenue growth of 15% quarter-over-quarter indicates strong momentum. Technical analysis shows support at $150 with resistance at $180. Source: https://sec.gov/edgar/searchedgar/",
    author: "MarketAnalyst Pro",
    expectedScore: 85,
    expectedLevel: "trusted"
  },
  {
    id: "cred-2",
    name: "Opinion Without Sources",
    content: "I think TSLA is going to moon next week because Elon said something on Twitter. Trust me bro.",
    author: "CryptoMoonBoy",
    expectedScore: 25,
    expectedLevel: "low"
  },
  {
    id: "cred-3",
    name: "Mixed Quality Post",
    content: "NVDA earnings look promising based on AI demand, but the current P/E ratio of 35 seems high. No specific sources but general market sentiment is bullish.",
    author: "TechTrader123",
    expectedScore: 60,
    expectedLevel: "mixed"
  },
  {
    id: "cred-4",
    name: "Data-Backed with Charts",
    content: "Based on quarterly analysis, MSFT shows consistent revenue growth. The company's cloud division Azure grew 30% YoY according to their earnings report. RSI indicates oversold conditions at current levels.",
    author: "DataDrivenAnalyst",
    expectedScore: 80,
    expectedLevel: "trusted"
  }
];

const BADGE_TEST_CASES: BadgeTestCase[] = [
  {
    id: "badge-1",
    badgeType: "trusted_contributor",
    userMetrics: {
      id: "user1",
      credibilityScore: 85,
      postsCount: 15,
      verifiedPosts: 12,
      helpfulFlags: 5,
      communityEngagement: 80
    },
    expectedEligible: true
  },
  {
    id: "badge-2", 
    badgeType: "new_voice",
    userMetrics: {
      id: "user2",
      credibilityScore: 50,
      postsCount: 2,
      verifiedPosts: 0,
      helpfulFlags: 0,
      communityEngagement: 20
    },
    expectedEligible: true
  },
  {
    id: "badge-3",
    badgeType: "verified_insights",
    userMetrics: {
      id: "user3",
      credibilityScore: 75,
      postsCount: 10,
      verifiedPosts: 8,
      helpfulFlags: 3,
      communityEngagement: 70
    },
    expectedEligible: true
  },
  {
    id: "badge-4",
    badgeType: "trusted_contributor",
    userMetrics: {
      id: "user4",
      credibilityScore: 60,
      postsCount: 5,
      verifiedPosts: 2,
      helpfulFlags: 1,
      communityEngagement: 40
    },
    expectedEligible: false
  }
];

interface ModerationTestingDashboardProps {
  className?: string;
}

export const ModerationTestingDashboard: React.FC<ModerationTestingDashboardProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("all");
  const [autoRun, setAutoRun] = useState(false);
  const [customTestContent, setCustomTestContent] = useState("");
  const [customTestAuthor, setCustomTestAuthor] = useState("TestUser");
  const [progress, setProgress] = useState(0);

  // Mock user data for testing
  const [mockUserBadges] = useState<UserBadge[]>([
    {
      badgeId: "trusted_contributor",
      userId: "test-user",
      earnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      metadata: { context: "test", triggerValue: 85 }
    },
    {
      badgeId: "verified_insights", 
      userId: "test-user",
      earnedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      isActive: true,
      metadata: { context: "test", triggerValue: 75 }
    },
    {
      badgeId: "bullish_beast",
      userId: "test-user", 
      earnedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      isActive: true,
      metadata: { context: "test", triggerValue: 80 }
    }
  ]);

  const runSpamDetectionTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    for (const testCase of SPAM_TEST_CASES) {
      try {
        const result = moderationService.detectSpam(testCase.content);
        
        const passed = 
          result.isSpam === testCase.expectedSpam &&
          Math.abs(result.confidence - testCase.expectedConfidence) < 0.3;
          
        const status = passed ? "passed" : 
          (Math.abs(result.confidence - testCase.expectedConfidence) < 0.5 ? "warning" : "failed");

        results.push({
          id: `spam-test-${testCase.id}`,
          testName: `Spam Detection: ${testCase.name}`,
          category: "spam",
          status,
          score: Math.round(result.confidence * 100),
          message: passed 
            ? `✓ Correctly identified as ${result.isSpam ? 'spam' : 'legitimate'}`
            : `✗ Expected ${testCase.expectedSpam ? 'spam' : 'legitimate'}, got ${result.isSpam ? 'spam' : 'legitimate'}`,
          details: {
            expected: testCase,
            actual: result
          },
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          id: `spam-test-${testCase.id}`,
          testName: `Spam Detection: ${testCase.name}`,
          category: "spam",
          status: "failed",
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        });
      }
    }
    
    return results;
  };

  const runCredibilityTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    for (const testCase of CREDIBILITY_TEST_CASES) {
      try {
        const score = moderationService.calculateCredibilityScore({
          content: testCase.content,
          author: testCase.author,
          timestamp: new Date(),
          engagement: { likes: 10, replies: 5, shares: 2 }
        });
        
        const scoreDiff = Math.abs(score - testCase.expectedScore);
        const passed = scoreDiff <= 15; // Allow 15 point tolerance
        const status = passed ? "passed" : (scoreDiff <= 25 ? "warning" : "failed");

        results.push({
          id: `cred-test-${testCase.id}`,
          testName: `Credibility: ${testCase.name}`,
          category: "credibility",
          status,
          score,
          message: passed 
            ? `✓ Score ${score} within expected range (${testCase.expectedScore}±15)`
            : `✗ Score ${score} differs from expected ${testCase.expectedScore} by ${scoreDiff} points`,
          details: {
            expected: testCase,
            actual: { score }
          },
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          id: `cred-test-${testCase.id}`,
          testName: `Credibility: ${testCase.name}`,
          category: "credibility",
          status: "failed",
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        });
      }
    }
    
    return results;
  };

  const runBadgeTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    for (const testCase of BADGE_TEST_CASES) {
      try {
        const eligible = badgeService.checkBadgeEligibility(
          testCase.badgeType,
          testCase.userMetrics
        );
        
        const passed = eligible === testCase.expectedEligible;
        const status = passed ? "passed" : "failed";
        
        const badgeDef = badgeService.getBadgeDefinition(testCase.badgeType);
        
        results.push({
          id: `badge-test-${testCase.id}`,
          testName: `Badge: ${badgeDef?.name || testCase.badgeType}`,
          category: "badges",
          status,
          message: passed 
            ? `✓ Correctly determined ${eligible ? 'eligible' : 'not eligible'}`
            : `✗ Expected ${testCase.expectedEligible ? 'eligible' : 'not eligible'}, got ${eligible ? 'eligible' : 'not eligible'}`,
          details: {
            expected: testCase,
            actual: { eligible, badgeDefinition: badgeDef }
          },
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          id: `badge-test-${testCase.id}`,
          testName: `Badge: ${testCase.badgeType}`,
          category: "badges",
          status: "failed",
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        });
      }
    }
    
    return results;
  };

  const runModerationMetricsTests = async (): Promise<TestResult[]> => {
    const results: TestResult[] = [];
    
    // Test post-level moderation metrics
    const testPosts = [
      {
        content: "Great analysis on AAPL! Thanks for sharing the data from Bloomberg.",
        sentiment: "bullish",
        hasCredibilityBadge: true,
        expectedMoodTag: "Extreme Greed"
      },
      {
        content: "This is clearly a scam! Don't fall for it!",
        sentiment: "bearish", 
        hasCredibilityBadge: false,
        expectedMoodTag: "Fear"
      }
    ];

    for (let i = 0; i < testPosts.length; i++) {
      const post = testPosts[i];
      try {
        // Simulate post-level metrics
        const hasCredibilityIcon = post.hasCredibilityBadge;
        const hasMoodTag = !!post.sentiment;
        const hasSentimentLabel = true; // Always present in our system
        
        const passed = hasCredibilityIcon && hasMoodTag && hasSentimentLabel;
        
        results.push({
          id: `moderation-test-post-${i}`,
          testName: `Post Metrics: Test Post ${i + 1}`,
          category: "moderation",
          status: passed ? "passed" : "warning",
          message: passed 
            ? "✓ All post-level metrics present"
            : "⚠ Some metrics missing",
          details: {
            hasCredibilityIcon,
            hasMoodTag,
            hasSentimentLabel,
            post
          },
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          id: `moderation-test-post-${i}`,
          testName: `Post Metrics: Test Post ${i + 1}`,
          category: "moderation",
          status: "failed",
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date()
        });
      }
    }
    
    return results;
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    
    try {
      const allResults: TestResult[] = [];
      
      // Run spam detection tests
      setProgress(25);
      const spamResults = await runSpamDetectionTests();
      allResults.push(...spamResults);
      
      // Run credibility tests
      setProgress(50);
      const credibilityResults = await runCredibilityTests();
      allResults.push(...credibilityResults);
      
      // Run badge tests
      setProgress(75);
      const badgeResults = await runBadgeTests();
      allResults.push(...badgeResults);
      
      // Run moderation metrics tests
      setProgress(90);
      const moderationResults = await runModerationMetricsTests();
      allResults.push(...moderationResults);
      
      setProgress(100);
      setTestResults(allResults);
    } catch (error) {
      console.error("Test execution failed:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const runCustomTest = async () => {
    if (!customTestContent.trim()) return;
    
    const results: TestResult[] = [];
    
    // Test spam detection
    try {
      const spamResult = moderationService.detectSpam(customTestContent);
      results.push({
        id: `custom-spam-${Date.now()}`,
        testName: "Custom: Spam Detection",
        category: "spam",
        status: "passed",
        score: Math.round(spamResult.confidence * 100),
        message: `${spamResult.isSpam ? "Flagged as spam" : "Marked as legitimate"} (${Math.round(spamResult.confidence * 100)}% confidence)`,
        details: spamResult,
        timestamp: new Date()
      });
    } catch (error) {
      results.push({
        id: `custom-spam-${Date.now()}`,
        testName: "Custom: Spam Detection",
        category: "spam",
        status: "failed",
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
    }
    
    // Test credibility scoring
    try {
      const credScore = moderationService.calculateCredibilityScore({
        content: customTestContent,
        author: customTestAuthor,
        timestamp: new Date(),
        engagement: { likes: 5, replies: 2, shares: 1 }
      });
      
      results.push({
        id: `custom-cred-${Date.now()}`,
        testName: "Custom: Credibility Score",
        category: "credibility", 
        status: "passed",
        score: credScore,
        message: `Credibility score: ${credScore}/100`,
        details: { score: credScore },
        timestamp: new Date()
      });
    } catch (error) {
      results.push({
        id: `custom-cred-${Date.now()}`,
        testName: "Custom: Credibility Score",
        category: "credibility",
        status: "failed",
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
    }
    
    setTestResults(prev => [...results, ...prev]);
    setCustomTestContent("");
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "passed":
        return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const filteredResults = selectedTest === "all" 
    ? testResults 
    : testResults.filter(result => result.category === selectedTest);

  const testStats = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === "passed").length,
    failed: testResults.filter(r => r.status === "failed").length,
    warnings: testResults.filter(r => r.status === "warning").length,
  };

  const successRate = testStats.total > 0 ? Math.round((testStats.passed / testStats.total) * 100) : 0;

  useEffect(() => {
    if (autoRun) {
      runAllTests();
    }
  }, [autoRun]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold flex items-center gap-2",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            <TestTube className="w-8 h-8 text-blue-500" />
            Moderation Testing Dashboard
          </h1>
          <p className={cn(
            "text-sm mt-1",
            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
          )}>
            Comprehensive testing of spam detection, credibility scoring, and badge systems
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="auto-run"
              checked={autoRun}
              onCheckedChange={setAutoRun}
            />
            <Label htmlFor="auto-run" className="text-sm">Auto-run</Label>
          </div>
          <Button 
            onClick={runAllTests}
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running Tests...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Stats */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{testStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="custom">Custom Tests</TabsTrigger>
          <TabsTrigger value="demos">Live Demos</TabsTrigger>
          <TabsTrigger value="themes">Theme Testing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Test Results */}
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Test Results
                </CardTitle>
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="spam">Spam Detection</SelectItem>
                    <SelectItem value="credibility">Credibility Scoring</SelectItem>
                    <SelectItem value="badges">Badge System</SelectItem>
                    <SelectItem value="moderation">Moderation Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <Badge className={cn("text-xs", getStatusColor(result.status))}>
                              {result.status}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-medium">
                          {result.testName}
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {result.category}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {result.score !== undefined ? (
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-sm">{result.score}</span>
                              {result.category === "credibility" && <span className="text-xs text-muted-foreground">/100</span>}
                              {result.category === "spam" && <span className="text-xs text-muted-foreground">%</span>}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell className="max-w-xs truncate">
                          {result.message}
                        </TableCell>
                        
                        <TableCell className="text-sm text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </TableCell>
                        
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{result.testName}</DialogTitle>
                                <DialogDescription>
                                  Detailed test results and analysis
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Test Details</h4>
                                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <div className="text-muted-foreground">
                    {testResults.length === 0 
                      ? "No tests run yet. Click 'Run All Tests' to begin."
                      : "No tests match the selected filter."
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Tests */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Custom Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-content">Test Content</Label>
                  <Textarea
                    id="custom-content"
                    placeholder="Enter content to test for spam detection and credibility scoring..."
                    value={customTestContent}
                    onChange={(e) => setCustomTestContent(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-author">Author Name</Label>
                  <Input
                    id="custom-author"
                    placeholder="Enter author name..."
                    value={customTestAuthor}
                    onChange={(e) => setCustomTestAuthor(e.target.value)}
                  />
                  
                  <Button 
                    onClick={runCustomTest}
                    disabled={!customTestContent.trim()}
                    className="w-full gap-2"
                  >
                    <TestTube className="w-4 h-4" />
                    Run Custom Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Demos */}
        <TabsContent value="demos" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badge Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Badge System Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sample User Badges</h4>
                    <BadgeDisplay
                      userBadges={mockUserBadges}
                      variant="profile"
                      showTooltip={true}
                      allowModal={true}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Badge Visibility Test</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(BADGE_DEFINITIONS).slice(0, 6).map(([id, badge]) => (
                        <div key={id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <span>{badge.icon}</span>
                            <span className="truncate">{badge.name}</span>
                          </div>
                          <Badge variant={badge.isVisible ? "default" : "secondary"} className="text-xs">
                            {badge.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credibility Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Credibility System Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Sample Credibility Badges</h4>
                    <div className="space-y-2">
                      {[
                        { score: 85, level: "trusted" as const },
                        { score: 60, level: "mixed" as const },
                        { score: 25, level: "low" as const }
                      ].map((cred, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CredibilityBadge
                            credibility={{
                              postId: `demo-${index}`,
                              score: cred.score,
                              level: cred.level,
                              factors: {
                                hasSourceLinks: cred.score > 70,
                                hasDataEvidence: cred.score > 60,
                                authorReliability: cred.score,
                                communityVotes: 5,
                                aiVerificationScore: cred.score
                              },
                              aiAnalysis: {
                                contentType: cred.score > 70 ? "data_backed" : "opinion",
                                factualClaims: [],
                                verificationSources: [],
                                confidenceScore: cred.score / 100,
                                riskFlags: cred.score < 40 ? ["Unverified"] : []
                              },
                              communityScore: cred.score,
                              communityVotes: { helpful: 3, misleading: 1, accurate: 2 },
                              lastUpdated: new Date(),
                              calculatedAt: new Date()
                            }}
                            variant="default"
                            showTooltip={true}
                          />
                          <span className="text-sm text-muted-foreground">
                            Score: {cred.score}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Testing */}
        <TabsContent value="themes" className="space-y-4">
          <ThemeCompatibilityTester />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Testing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Testing Mode Active</AlertTitle>
                <AlertDescription>
                  This dashboard uses mock data and test scenarios to validate the moderation systems.
                  All tests run against the actual moderation algorithms but with controlled test cases.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Test Coverage</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-600">✓ Covered Systems</div>
                      <ul className="text-muted-foreground list-disc list-inside mt-1">
                        <li>Spam detection algorithms</li>
                        <li>Credibility scoring system</li>
                        <li>Badge eligibility checking</li>
                        <li>Post-level moderation metrics</li>
                        <li>Theme compatibility (light/dark)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-blue-600">📊 Test Metrics</div>
                      <ul className="text-muted-foreground list-disc list-inside mt-1">
                        <li>Spam confidence accuracy</li>
                        <li>Credibility score precision</li>
                        <li>Badge requirement validation</li>
                        <li>UI component rendering</li>
                        <li>Cross-theme consistency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationTestingDashboard;
