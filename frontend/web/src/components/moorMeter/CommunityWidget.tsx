import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChatInterface } from "./ChatInterface";
import {
  MessageCircle,
  Heart,
  Share,
  Send,
  Users,
  Hash,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";

interface CommunityMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  sentiment: number;
  timestamp: Date;
  likes: number;
  platform: "reddit" | "twitter" | "discord";
}

interface CommunityWidgetProps {
  messages: CommunityMessage[];
}

export const CommunityWidget: React.FC<CommunityWidgetProps> = ({
  messages: initialMessages,
}) => {
  const [messages, setMessages] = useState<CommunityMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "all" | "reddit" | "twitter" | "discord"
  >("all");
  const [activeSubcategory, setActiveSubcategory] = useState<
    "social-feed" | "chat" | "forums" | "discussions"
  >("social-feed");

  // Simulate live message updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new messages to simulate real-time activity
      if (Math.random() > 0.7) {
        const mockMessages = [
          {
            user: "MarketBull2024",
            message:
              "Tech stocks looking strong today! $NVDA breaking resistance 🚀",
            sentiment: 85,
            platform: "reddit" as const,
          },
          {
            user: "CryptoTrader",
            message: "BTC holding support levels nicely, cautiously optimistic",
            sentiment: 65,
            platform: "twitter" as const,
          },
          {
            user: "ValueInvestor",
            message:
              "Market volatility creating some great opportunities in defensive stocks",
            sentiment: 45,
            platform: "discord" as const,
          },
          {
            user: "DayTrader99",
            message: "Fed meeting tomorrow, expecting some wild swings",
            sentiment: 30,
            platform: "twitter" as const,
          },
        ];

        const randomMessage =
          mockMessages[Math.floor(Math.random() * mockMessages.length)];
        const newMsg: CommunityMessage = {
          id: Date.now().toString(),
          user: randomMessage.user,
          avatar: `/api/placeholder/32/32`,
          message: randomMessage.message,
          sentiment: randomMessage.sentiment,
          timestamp: new Date(),
          likes: Math.floor(Math.random() * 100),
          platform: randomMessage.platform,
        };

        setMessages((prev) => [newMsg, ...prev.slice(0, 9)]); // Keep only latest 10 messages
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredMessages = messages.filter(
    (msg) => selectedPlatform === "all" || msg.platform === selectedPlatform,
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "reddit":
        return <MessageCircle className="w-3 h-3 text-orange-500" />;
      case "twitter":
        return <Hash className="w-3 h-3 text-blue-500" />;
      case "discord":
        return <Users className="w-3 h-3 text-indigo-500" />;
      default:
        return <MessageCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
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

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 60)
      return <TrendingUp className="w-3 h-3 text-green-500" />;
    if (sentiment <= 40)
      return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 dark:text-green-400";
    if (sentiment >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const sentiment = 40 + Math.random() * 40; // Random sentiment between 40-80
    const userMsg: CommunityMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "/api/placeholder/32/32",
      message: newMessage,
      sentiment: sentiment,
      timestamp: new Date(),
      likes: 0,
      platform: "discord",
    };

    setMessages((prev) => [userMsg, ...prev]);
    setNewMessage("");
  };

  const toggleLike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg,
      ),
    );
  };

  const subcategoryOptions = [
    { value: "social-feed", label: "Social Feed", icon: Users },
    { value: "chat", label: "Chat", icon: MessageCircle },
    { value: "forums", label: "Forums", icon: Hash },
    { value: "discussions", label: "Discussions", icon: Share },
  ];

  const renderContent = () => {
    switch (activeSubcategory) {
      case "chat":
        return <ChatInterface />;
      case "social-feed":
      default:
        return renderSocialFeed();
    }
  };

  const renderSocialFeed = () => (
    <>
      {/* Platform Filter */}
      <div className="flex space-x-1 mb-4">
        {[
          { key: "all", label: "All", icon: MessageCircle },
          { key: "reddit", label: "Reddit", icon: MessageCircle },
          { key: "twitter", label: "Twitter", icon: Hash },
          { key: "discord", label: "Discord", icon: Users },
        ].map((platform) => {
          const Icon = platform.icon;
          return (
            <Button
              key={platform.key}
              variant={
                selectedPlatform === platform.key ? "default" : "outline"
              }
              size="sm"
              onClick={() => setSelectedPlatform(platform.key as any)}
              className={`text-xs transition-all duration-200 ${
                selectedPlatform === platform.key
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                  : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
            >
              <Icon className="w-3 h-3 mr-1" />
              {platform.label}
            </Button>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="flex space-x-2 mb-4 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <Avatar className="w-8 h-8">
          <AvatarImage src="/api/placeholder/32/32" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex space-x-2">
          <Input
            type="text"
            placeholder="Share your market thoughts..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No messages for selected platform
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className="group p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 bg-white dark:bg-gray-800"
            >
              {/* Message Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback className="text-xs">
                      {message.user.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.user}
                  </span>
                  <Badge
                    className={`text-xs ${getPlatformColor(message.platform)}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getPlatformIcon(message.platform)}
                      <span>{message.platform}</span>
                    </div>
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {getTimeAgo(message.timestamp)}
                  </span>
                  {getSentimentIcon(message.sentiment)}
                </div>
              </div>

              {/* Message Content */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                {message.message}
              </p>

              {/* Message Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                    onClick={() => toggleLike(message.id)}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    <span className="text-xs">{message.likes}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    <Share className="w-3 h-3 mr-1" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sentiment:
                  </span>
                  <span
                    className={`text-xs font-medium ${getSentimentColor(message.sentiment)}`}
                  >
                    {Math.round(message.sentiment)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Community Stats */}
      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {filteredMessages.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Messages
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(
                filteredMessages.reduce((sum, msg) => sum + msg.sentiment, 0) /
                  (filteredMessages.length || 1),
              )}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Avg Mood
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {filteredMessages.filter((msg) => msg.sentiment >= 60).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Bullish
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Real-time community sentiment • Discord-style chat
        </p>
      </div>
    </>
  );

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/20 h-full">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">Community</span>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white animate-pulse"
            >
              Live
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Online</span>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Subcategory Dropdown */}
      <div className="p-4 border-b bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category:
          </span>
          <Select
            value={activeSubcategory}
            onValueChange={(value: any) => setActiveSubcategory(value)}
          >
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subcategoryOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CardContent
        className={`${activeSubcategory === "chat" ? "p-0 h-full" : "p-4"}`}
      >
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default CommunityWidget;
