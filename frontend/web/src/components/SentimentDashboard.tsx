import { useState } from "react";
import {
  Filter,
  RefreshCw,
  Globe,
  Zap,
  Lightbulb,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our enhanced components
import { MoodScore } from "./MoodScore";
import { SentimentBreakdown } from "./SentimentBreakdown";
import { MoodTrendChart } from "./MoodTrendChart";
import { TrendingKeywords } from "./TrendingKeywords";
import { AiVibeSummary } from "./AiVibeSummary";
import { TopNews } from "./TopNews";

// Import data
import {
  sentimentDashboardData,
  sentimentSources,
  weeklyTrend,
  regions,
  topics,
} from "@/data/mockData";

export const SentimentDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("GLOBAL");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [darkModeToggle, setDarkModeToggle] = useState(false);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, this would trigger data refresh
    console.log("Refreshing sentiment data...");
  };

  const handleTopicFilter = (topic: string) => {
    setSelectedTopic(topic);
    // In a real app, this would filter data by topic
    console.log("Filtering by topic:", topic);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[#111827] dark:text-transparent dark:bg-gradient-to-r dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 dark:bg-clip-text">
          Sentiment Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced AI-powered sentiment analysis aggregating real-time insights
          from news, social media, forums, and financial markets
        </p>
      </div>

      {/* Controls */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Dashboard Controls & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.code} value={region.code}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {region.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={selectedTopic} onValueChange={handleTopicFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="real-time"
                checked={realTimeUpdates}
                onCheckedChange={setRealTimeUpdates}
              />
              <label htmlFor="real-time" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Real-time
                </div>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={darkModeToggle}
                onCheckedChange={setDarkModeToggle}
              />
              <label htmlFor="dark-mode" className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Dark Mode
                </div>
              </label>
            </div>

            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${realTimeUpdates ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Badge variant={realTimeUpdates ? "default" : "secondary"}>
              {realTimeUpdates ? "Live" : "Static"} Mode
            </Badge>
            <Badge variant="outline">
              Region: {regions.find((r) => r.code === selectedRegion)?.name}
            </Badge>
            <Badge variant="outline">
              Topic: {topics.find((t) => t.value === selectedTopic)?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Keywords</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Top Row - Mood Score and Source Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <MoodScore
                score={sentimentDashboardData.score}
                previousScore={
                  sentimentDashboardData.trend[
                    sentimentDashboardData.trend.length - 2
                  ]
                }
              />
            </div>
            <div className="lg:col-span-2">
              <SentimentBreakdown
                sources={sentimentSources}
                sourceExplanations={sentimentDashboardData.sourceExplanations}
              />
            </div>
          </div>

          {/* Trend Chart */}
          <MoodTrendChart data={weeklyTrend} />

          {/* Bottom Row - AI Summary and News */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AiVibeSummary
              summary={sentimentDashboardData.summary}
              score={sentimentDashboardData.score}
              confidenceLevel={87}
            />
            <TopNews />
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-8">
          {/* Detailed Analysis View */}
          <div className="grid grid-cols-1 gap-8">
            <SentimentBreakdown
              sources={sentimentSources}
              sourceExplanations={sentimentDashboardData.sourceExplanations}
            />
            <MoodTrendChart data={weeklyTrend} />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-8">
          {/* Trends and Keywords */}
          <TrendingKeywords keywords={sentimentDashboardData.keywords} />
          <MoodTrendChart data={weeklyTrend} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          {/* AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AiVibeSummary
              summary={sentimentDashboardData.summary}
              score={sentimentDashboardData.score}
              confidenceLevel={91}
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Key Market Drivers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-l-green-500">
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Positive Drivers
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 mt-1 space-y-1">
                      <li>• Strong tech earnings reports</li>
                      <li>• Renewed investor confidence in AI sector</li>
                      <li>• Positive employment data</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-l-red-500">
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      Risk Factors
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 mt-1 space-y-1">
                      <li>• Interest rate uncertainty</li>
                      <li>• Inflation concerns persist</li>
                      <li>• Geopolitical tensions</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-l-blue-500">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Market Opportunities
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                      <li>• Green energy investment surge</li>
                      <li>• Healthcare innovation momentum</li>
                      <li>• Digital transformation acceleration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <TrendingKeywords keywords={sentimentDashboardData.keywords} />
        </TabsContent>
      </Tabs>

      {/* Real-time Status Footer */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${realTimeUpdates ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              <span className="text-sm font-medium">
                {realTimeUpdates
                  ? "Real-time monitoring active"
                  : "Real-time monitoring paused"}
              </span>
              <Badge variant="outline" className="text-xs">
                {sentimentSources
                  .reduce((sum, source) => sum + source.samples, 0)
                  .toLocaleString()}{" "}
                data points
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Next update in {realTimeUpdates ? "4:32" : "---"}</span>
              <Badge variant="secondary">AI Confidence: 91%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
