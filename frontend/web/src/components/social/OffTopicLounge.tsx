import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coffee,
  Send,
  Image,
  Smile,
  Users,
  ThumbsUp,
  MessageSquare,
  Share2,
  Star,
  Trophy,
  Zap,
  Heart,
  Flame,
  TrendingUp,
  Camera,
  Video,
  Link,
  Pin,
  Award,
  Laugh,
} from "lucide-react";
import { PostInteractionBar } from "./PostInteractionBar";
import {
  CheckCircle,
  AlertTriangle,
  Award as AwardIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OffTopicPost {
  id: string;
  userId: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    badges: string[];
    level: number;
  };
  content: string;
  type: "text" | "meme" | "poll" | "media";
  timestamp: Date;
  likes: number;
  replies: number;
  shares: number;
  tags: string[];
  isPinned?: boolean;
  mediaUrl?: string;
  pollOptions?: { option: string; votes: number }[];
  credibilityScore?: number;
  needsReview?: boolean;
  communityFavorite?: boolean;
}

interface LoungeTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  posts: number;
  trending: boolean;
}

export const OffTopicLounge: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "feed" | "memes" | "polls" | "trending"
  >("feed");
  const [newPost, setNewPost] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  // Mock lounge topics
  const loungeTopics: LoungeTopic[] = [
    {
      id: "general",
      title: "General Chat",
      description: "Random thoughts and discussions",
      icon: <Coffee className="w-4 h-4" />,
      posts: 1247,
      trending: false,
    },
    {
      id: "memes",
      title: "Meme Central",
      description: "Trading memes and market humor",
      icon: <Laugh className="w-4 h-4" />,
      posts: 892,
      trending: true,
    },
    {
      id: "life",
      title: "Life & Lifestyle",
      description: "Non-trading life discussions",
      icon: <Heart className="w-4 h-4" />,
      posts: 634,
      trending: false,
    },
    {
      id: "tech",
      title: "Tech Talk",
      description: "Technology and innovation",
      icon: <Zap className="w-4 h-4" />,
      posts: 445,
      trending: true,
    },
    {
      id: "sports",
      title: "Sports Corner",
      description: "Sports and entertainment",
      icon: <Trophy className="w-4 h-4" />,
      posts: 312,
      trending: false,
    },
  ];

  // Mock off-topic posts
  const offTopicPosts: OffTopicPost[] = [
    {
      id: "1",
      userId: "user-meme-king",
      user: {
        name: "MemeKing",
        avatar: "MK",
        verified: false,
        badges: ["Meme Lord", "Comedy Gold"],
        level: 15,
      },
      content:
        "When you finally understand options trading but your portfolio is still red 😅📉\n\n*Insert Spider-Man pointing meme*",
      type: "meme",
      timestamp: new Date(Date.now() - 300000),
      likes: 234,
      replies: 45,
      shares: 67,
      tags: ["meme", "options", "trading"],
      isPinned: true,
      credibilityScore: 7.8,
      needsReview: false,
      communityFavorite: true,
    },
    {
      id: "2",
      userId: "user-tech-enthusiast",
      user: {
        name: "TechEnthusiast",
        avatar: "TE",
        verified: true,
        badges: ["Tech Expert", "Early Adopter"],
        level: 22,
      },
      content:
        "Anyone else excited about the new Apple Vision Pro? Thinking about the implications for AR/VR stocks 🥽\n\nNot financial advice, but the future is looking pretty immersive!",
      type: "text",
      timestamp: new Date(Date.now() - 600000),
      likes: 89,
      replies: 23,
      shares: 12,
      tags: ["tech", "apple", "ar", "vr"],
      credibilityScore: 8.5,
      needsReview: false,
      communityFavorite: false,
    },
    {
      id: "3",
      userId: "user-poll-master",
      user: {
        name: "PollMaster",
        avatar: "PM",
        verified: false,
        badges: ["Survey Guru"],
        level: 8,
      },
      content:
        "What's your favorite trading movie? Let's settle this once and for all! 🎬",
      type: "poll",
      timestamp: new Date(Date.now() - 900000),
      likes: 156,
      replies: 78,
      shares: 34,
      tags: ["poll", "movies", "trading"],
      pollOptions: [
        { option: "The Wolf of Wall Street", votes: 123 },
        { option: "The Big Short", votes: 98 },
        { option: "Wall Street (1987)", votes: 76 },
        { option: "Margin Call", votes: 45 },
      ],
      credibilityScore: 6.9,
      needsReview: true,
      communityFavorite: false,
    },
    {
      id: "4",
      userId: "user-work-life-balance",
      user: {
        name: "WorkLifeBalance",
        avatar: "WB",
        verified: false,
        badges: ["Zen Master", "Life Coach"],
        level: 12,
      },
      content:
        "Remember to take breaks from the charts! Just went for a hike and feel so much better. The markets will be there when you get back 🌲⛰️\n\n#MentalHealth #Balance",
      type: "text",
      timestamp: new Date(Date.now() - 1200000),
      likes: 278,
      replies: 56,
      shares: 89,
      tags: ["wellness", "mental-health", "balance"],
      credibilityScore: 8.1,
      needsReview: false,
      communityFavorite: true,
    },
    {
      id: "5",
      userId: "user-weekend-warrior",
      user: {
        name: "WeekendWarrior",
        avatar: "WW",
        verified: false,
        badges: ["Fun Time", "TGIF"],
        level: 7,
      },
      content:
        "Friday trading session finished! Time to enjoy the weekend. Anyone have fun plans? 🎉\n\nMarkets are closed but the vibes are OPEN! 😎",
      type: "text",
      timestamp: new Date(Date.now() - 1500000),
      likes: 167,
      replies: 42,
      shares: 23,
      tags: ["weekend", "fun", "lifestyle"],
      credibilityScore: 7.2,
      needsReview: false,
      communityFavorite: false,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [offTopicPosts]);

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    console.log("Posting to off-topic lounge:", newPost);
    setNewPost("");
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "meme":
        return <Laugh className="w-4 h-4 text-yellow-500" />;
      case "poll":
        return <Star className="w-4 h-4 text-purple-500" />;
      case "media":
        return <Image className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 20) return "bg-purple-500";
    if (level >= 15) return "bg-blue-500";
    if (level >= 10) return "bg-green-500";
    if (level >= 5) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9.0) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20";
    if (score >= 8.0) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
    if (score >= 7.0) return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="h-[600px] flex bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
      {/* Topic Sidebar */}
      <div className="w-80 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Coffee className="w-5 h-5 text-purple-500" />
            Off-Topic Lounge
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Relax, share memes, and have fun!
          </p>
        </div>

        {/* View Tabs */}
        <div className="p-3 border-b">
          <Tabs
            value={activeView}
            onValueChange={(v) => setActiveView(v as typeof activeView)}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="feed" className="text-xs">
                Feed
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-xs">
                Trending
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Topics List */}
        <div className="flex-1 overflow-y-auto">
          {loungeTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`w-full p-3 text-left hover:bg-white/50 dark:hover:bg-gray-700/50 border-b transition-colors ${
                selectedTopic === topic.id
                  ? "bg-white dark:bg-gray-700 border-l-4 border-l-purple-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {topic.icon}
                  <span className="font-medium text-sm">{topic.title}</span>
                  {topic.trending && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-red-100 text-red-700"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {topic.description}
              </p>

              <div className="text-xs text-gray-500">
                {topic.posts.toLocaleString()} posts
              </div>
            </button>
          ))}
        </div>

        {/* Weekly Challenge */}
        <div className="p-4 border-t bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-medium">Meme of the Week</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Submit your best trading meme!
            </div>
            <Button size="sm" variant="outline" className="mt-2 w-full">
              Submit Meme
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Off-Topic Central
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No tickers, no stress - just good vibes!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Users className="w-3 h-3 mr-1" />
                2,847 online
              </Badge>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-green-700 dark:text-green-300">
              <strong>Community Vibes:</strong> Be kind • Share laughs • Support
              each other • All topics welcome (except financial advice)
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {offTopicPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border p-4 ${
                post.isPinned
                  ? "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10"
                  : ""
              }`}
            >
              {post.isPinned && (
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm mb-3">
                  <Pin className="w-4 h-4" />
                  <span className="font-medium">Pinned Post</span>
                </div>
              )}

              <div className="flex gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-sm">
                      {post.user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold ${getLevelColor(post.user.level)}`}
                  >
                    {post.user.level}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{post.user.name}</span>

                      {/* Verified Icon */}
                      {post.user.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}

                      {/* Credibility Score */}
                      {post.credibilityScore && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                className={`text-xs px-2 py-0.5 font-semibold ${getCredibilityColor(post.credibilityScore)}`}
                              >
                                {post.credibilityScore.toFixed(1)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Credibility Score: {post.credibilityScore.toFixed(1)}/10.0</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* User Badges */}
                      {post.user.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="text-xs px-1 py-0"
                        >
                          {badge}
                        </Badge>
                      ))}

                      {/* Needs Review Badge */}
                      {post.needsReview && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs px-2 py-0.5">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Needs Review
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This post requires community review</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {/* Community Favorite Badge */}
                      {post.communityFavorite && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 text-xs px-2 py-0.5">
                                <AwardIcon className="h-3 w-3 mr-1" />
                                Community Favorite
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Highly appreciated by the community</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <div className="flex items-center gap-1">
                        {getPostTypeIcon(post.type)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(post.timestamp)}
                      </span>
                    </div>

                    {/* Post Interaction Bar for Off-Topic Posts */}
                    <PostInteractionBar
                      userId={post.userId}
                      username={post.user.name}
                      compact={true}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                      onToggleAlerts={handleToggleAlerts}
                    />
                  </div>

                  <div className="mb-3">
                    <p className="text-sm whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.type === "poll" && post.pollOptions && (
                      <div className="mt-3 space-y-2">
                        {post.pollOptions.map((option, index) => {
                          const totalVotes = post.pollOptions!.reduce(
                            (sum, opt) => sum + opt.votes,
                            0,
                          );
                          const percentage =
                            totalVotes > 0
                              ? (option.votes / totalVotes) * 100
                              : 0;

                          return (
                            <div
                              key={index}
                              className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">
                                  {option.option}
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {option.votes} votes ({percentage.toFixed(1)}
                                  %)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex gap-1 mb-3 flex-wrap">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      {post.replies}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      {post.shares}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Post Creator */}
        <div className="p-4 border-t bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share something fun with the community..."
                className="mb-2 min-h-[60px] resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
