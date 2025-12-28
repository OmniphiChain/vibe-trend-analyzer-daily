import { useState } from "react";
import { Filter, RefreshCw, Globe, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MoodScore } from "./MoodScore";
import { SourceBreakdown } from "./SourceBreakdown";
import { TrendChart } from "./TrendChart";
import { VibeSummary } from "./VibeSummary";
import { TopNews } from "./TopNews";
import { currentMoodScore, sentimentSources, weeklyTrend, vibePhrases, regions, topics } from "@/data/mockData";
import { useStockSentiment } from "@/hooks/useStockSentiment";
import { useYFinanceSentiment } from "@/hooks/useYFinance";

export const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("GLOBAL");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Get real-time stock sentiment data
  const { data: stockSentimentData, loading: stockLoading } = useStockSentiment(300000); // 5 minutes
  
  // Get YFinance sentiment data
  const { data: yfinanceSentimentData, isLoading: yfinanceLoading } = useYFinanceSentiment(300000); // 5 minutes

  // Update sentiment sources with real stock market and YFinance data
  const updatedSentimentSources = sentimentSources.map(source => {
    if (source.name === "Stock Market" && stockSentimentData) {
      return {
        ...source,
        score: stockSentimentData.score,
        change: stockSentimentData.change,
        samples: stockSentimentData.samples
      };
    }
    if (source.name === "News" && yfinanceSentimentData && !yfinanceSentimentData.error && yfinanceSentimentData.sentiment_score !== undefined) {
      return {
        ...source,
        score: yfinanceSentimentData.sentiment_score,
        change: yfinanceSentimentData.raw_sentiment * 100, // Convert to percentage
        samples: yfinanceSentimentData.article_count
      };
    }
    return source;
  });

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, this would trigger data refresh
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-[#111827] dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:via-primary/80 dark:to-primary/60 dark:bg-clip-text">
          MoodMeter
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-powered sentiment analysis aggregating insights from news, social media, forums, and financial markets
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Controls & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
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

            <Button onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Badge variant={realTimeUpdates ? "default" : "secondary"}>
              {realTimeUpdates ? "Live" : "Static"} Mode
            </Badge>
            <Badge variant="outline">
              Region: {regions.find(r => r.code === selectedRegion)?.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mood Score */}
        <div className="lg:col-span-1">
          <MoodScore score={currentMoodScore} />
        </div>

        {/* Source Breakdown */}
        <div className="lg:col-span-2">
          <SourceBreakdown sources={updatedSentimentSources} />
        </div>
      </div>

      {/* Trend Chart */}
      <TrendChart data={weeklyTrend} />

      {/* News & Vibe Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top News */}
        <TopNews />
        
        {/* Vibe Summary */}
        <VibeSummary phrases={vibePhrases} />
      </div>

      {/* Real-time Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-positive animate-pulse' : 'bg-muted'}`} />
              <span className="text-sm font-medium">
                {realTimeUpdates ? 'Real-time monitoring active' : 'Real-time monitoring paused'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Next update in {realTimeUpdates ? '4:32' : '---'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};