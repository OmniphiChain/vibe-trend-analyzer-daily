import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Flame,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Hash,
  Users,
  Volume2,
} from "lucide-react";

interface TrendingTopic {
  term: string;
  sentiment: number;
  volume: number;
  source: "reddit" | "twitter" | "discord";
}

interface TrendingTopicsWidgetProps {
  topics: TrendingTopic[];
}

export const TrendingTopicsWidget: React.FC<TrendingTopicsWidgetProps> = ({
  topics,
}) => {
  const [selectedSource, setSelectedSource] = useState<
    "all" | "reddit" | "twitter" | "discord"
  >("all");

  const filteredTopics = topics.filter(
    (topic) => selectedSource === "all" || topic.source === selectedSource,
  );

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "reddit":
        return <MessageCircle className="w-4 h-4 text-orange-500" />;
      case "twitter":
        return <Hash className="w-4 h-4 text-blue-500" />;
      case "discord":
        return <Users className="w-4 h-4 text-indigo-500" />;
      default:
        return <Volume2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "reddit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "twitter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "discord":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 60)
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (sentiment <= 40)
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 rounded-full bg-yellow-500"></div>;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const getVolumeBarWidth = (volume: number) => {
    const maxVolume = Math.max(...topics.map((t) => t.volume));
    return (volume / maxVolume) * 100;
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-800 dark:to-orange-900/20">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6" />
            <span>Trending Topics</span>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white animate-pulse"
            >
              Hot
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Source Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Sources", icon: Volume2 },
            { key: "reddit", label: "Reddit", icon: MessageCircle },
            { key: "twitter", label: "Twitter", icon: Hash },
            { key: "discord", label: "Discord", icon: Users },
          ].map((source) => {
            const Icon = source.icon;
            return (
              <Button
                key={source.key}
                variant={selectedSource === source.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSource(source.key as any)}
                className={`transition-all duration-200 ${
                  selectedSource === source.key
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {source.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {source.key === "all"
                    ? topics.length
                    : topics.filter((t) => t.source === source.key).length}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Trending Topics List */}
        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-8">
              <Flame className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                No trending topics for selected source
              </p>
            </div>
          ) : (
            filteredTopics.map((topic, index) => (
              <div
                key={`${topic.term}-${index}`}
                className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* Topic Info */}
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold text-sm">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                          {topic.term}
                        </h3>
                        <Badge
                          className={`text-xs ${getSourceColor(topic.source)}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getSourceIcon(topic.source)}
                            <span>{topic.source}</span>
                          </div>
                        </Badge>
                      </div>

                      {/* Volume Bar */}
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${getVolumeBarWidth(topic.volume)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-12">
                          {formatVolume(topic.volume)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Info */}
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${getSentimentColor(topic.sentiment)}`}
                      >
                        {Math.round(topic.sentiment)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        mood
                      </div>
                    </div>
                    {getSentimentIcon(topic.sentiment)}
                  </div>
                </div>

                {/* Hover Details */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                      <span>Volume: {formatVolume(topic.volume)} mentions</span>
                      <span>•</span>
                      <span>Source: {topic.source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">
                        Sentiment:
                      </span>
                      <span
                        className={`font-medium ${getSentimentColor(topic.sentiment)}`}
                      >
                        {topic.sentiment >= 70
                          ? "Bullish"
                          : topic.sentiment >= 50
                            ? "Neutral"
                            : "Bearish"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {filteredTopics.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Topics
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatVolume(
                  filteredTopics.reduce((sum, t) => sum + t.volume, 0),
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Volume
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(
                  filteredTopics.reduce((sum, t) => sum + t.sentiment, 0) /
                    (filteredTopics.length || 1),
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Sentiment
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredTopics.filter((t) => t.sentiment >= 70).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bullish Topics
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Real-time social monitoring</span>
              <span>•</span>
              <span>Updated every minute</span>
            </div>
            <Button variant="outline" size="sm">
              View Detailed Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopicsWidget;
