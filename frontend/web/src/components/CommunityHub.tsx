import React, { useState, useEffect } from "react";
import "@/styles/community-hub.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Users,
  ThumbsUp,
  Heart,
  Share2,
  Award,
  Trophy,
  Star,
  Flame,
  Smile,
  Image,
  Upload,
  MoreHorizontal,
  TrendingUp,
  Zap,
  Coffee,
  Gamepad2,
  Calendar,
  Clock,
  Pin,
  Send,
  Camera,
  BarChart3,
  Laugh,
  Crown,
  Target,
  PartyPopper
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMoodTheme } from "@/contexts/MoodThemeContext";

interface CommunityHubProps {
  onNavigateToProfile?: (userId: string) => void;
}

interface CategoryStats {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  memberCount: number;
  onlineCount: number;
  todayPosts: number;
  description: string;
}

interface CommunityPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    badges: string[];
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  awards: number;
  isPinned?: boolean;
  category: string;
  tags?: string[];
  media?: {
    type: 'image' | 'gif' | 'video';
    url: string;
    thumbnail?: string;
  };
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
  };
}

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  change: number;
  badge: string;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  participants: number;
  prize: string;
  status: 'upcoming' | 'active' | 'completed';
}

export const CommunityHub: React.FC<CommunityHubProps> = ({ onNavigateToProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const { themeMode } = useMoodTheme();
  const [activeCategory, setActiveCategory] = useState("general");
  const [newPostContent, setNewPostContent] = useState("");
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [rotatingBannerIndex, setRotatingBannerIndex] = useState(0);

  // Rotating banner content
  const bannerContent = [
    {
      type: "meme",
      title: "Meme of the Week",
      subtitle: "When you diamond hand through a 40% dip",
      image: "💎🙌",
      action: "View Winner"
    },
    {
      type: "event",
      title: "Trading Meme Contest",
      subtitle: "Win 1000 tokens! Submissions end in 3 days",
      image: "🏆",
      action: "Enter Now"
    },
    {
      type: "poll",
      title: "Poll of the Day",
      subtitle: "What's your biggest trading fear?",
      image: "📊",
      action: "Vote Now"
    }
  ];

  // Categories with neon accent colors
  const categories: CategoryStats[] = [
    {
      id: "general",
      name: "General Chat",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500",
      memberCount: 2847,
      onlineCount: 142,
      todayPosts: 89,
      description: "Random market & lifestyle talk"
    },
    {
      id: "memes",
      name: "Meme Central",
      icon: <Laugh className="h-4 w-4" />,
      color: "from-purple-500 to-pink-500",
      memberCount: 1923,
      onlineCount: 98,
      todayPosts: 156,
      description: "Trading humor & images"
    },
    {
      id: "polls",
      name: "Polls & Contests",
      icon: <Trophy className="h-4 w-4" />,
      color: "from-yellow-500 to-orange-500",
      memberCount: 1456,
      onlineCount: 67,
      todayPosts: 23,
      description: "Weekly competitions & giveaways"
    },
    {
      id: "lifestyle",
      name: "Life & Lifestyle",
      icon: <Coffee className="h-4 w-4" />,
      color: "from-green-500 to-teal-500",
      memberCount: 1156,
      onlineCount: 45,
      todayPosts: 34,
      description: "Hobbies, travel, personal wins"
    },
    {
      id: "halloffame",
      name: "Hall of Fame",
      icon: <Crown className="h-4 w-4" />,
      color: "from-amber-500 to-yellow-500",
      memberCount: 234,
      onlineCount: 12,
      todayPosts: 5,
      description: "Top contributors & best posts"
    }
  ];

  // Mock posts data
  const communityPosts: CommunityPost[] = [
    {
      id: "1",
      author: {
        id: "1",
        name: "MemeKing2024",
        avatar: "/api/placeholder/40/40",
        level: 15,
        xp: 2847,
        badges: ["Top Contributor", "Meme Champion"],
        verified: true
      },
      content: "When you finally understand options trading but your portfolio still looks like modern art 🎨📉 #TradingMemes #OptionsLife",
      timestamp: "2m ago",
      likes: 234,
      comments: 67,
      shares: 23,
      awards: 5,
      isPinned: true,
      category: "memes",
      tags: ["memes", "options", "trading"],
      media: {
        type: "gif",
        url: "/api/placeholder/300/200"
      }
    },
    {
      id: "2",
      author: {
        id: "2",
        name: "ZenTrader",
        avatar: "/api/placeholder/40/40",
        level: 22,
        xp: 4521,
        badges: ["Wisdom Guru", "Contest Winner"]
      },
      content: "Market reminder: The best trades happen when you're not emotionally attached. Take breaks, touch grass, then come back with fresh eyes 🌱✨",
      timestamp: "8m ago",
      likes: 189,
      comments: 34,
      shares: 45,
      awards: 12,
      category: "lifestyle",
      tags: ["mindset", "wisdom", "trading"]
    },
    {
      id: "3",
      author: {
        id: "3",
        name: "PollMaster",
        avatar: "/api/placeholder/40/40",
        level: 18,
        xp: 3205,
        badges: ["Poll Creator"]
      },
      content: "Community Poll: What's your biggest trading fear?",
      timestamp: "15m ago",
      likes: 89,
      comments: 156,
      shares: 12,
      awards: 3,
      category: "polls",
      poll: {
        question: "What's your biggest trading fear?",
        options: [
          { text: "Missing the perfect entry", votes: 145 },
          { text: "Holding too long", votes: 203 },
          { text: "FOMO buying at the top", votes: 167 },
          { text: "Not setting stop losses", votes: 89 }
        ],
        totalVotes: 604
      }
    }
  ];

  // Leaderboards
  const leaderboards = {
    topPosters: [
      { id: "1", username: "MemeKing2024", avatar: "/api/placeholder/32/32", score: 847, change: 12, badge: "🔥" },
      { id: "2", username: "ZenTrader", avatar: "/api/placeholder/32/32", score: 723, change: 8, badge: "📈" },
      { id: "3", username: "CoffeeHODLer", avatar: "/api/placeholder/32/32", score: 656, change: -3, badge: "☕" }
    ],
    mostLiked: [
      { id: "1", username: "WisdomOWL", avatar: "/api/placeholder/32/32", score: 2341, change: 45, badge: "❤️" },
      { id: "2", username: "TradingGuru", avatar: "/api/placeholder/32/32", score: 1998, change: 23, badge: "👑" },
      { id: "3", username: "MoodMaster", avatar: "/api/placeholder/32/32", score: 1756, change: 12, badge: "🌟" }
    ],
    funniestMeme: [
      { id: "1", username: "MemeKing2024", avatar: "/api/placeholder/32/32", score: 156, change: 8, badge: "😂" },
      { id: "2", username: "LaughTrader", avatar: "/api/placeholder/32/32", score: 134, change: 5, badge: "🤣" },
      { id: "3", username: "JokeGOAT", avatar: "/api/placeholder/32/32", score: 98, change: -2, badge: "😄" }
    ]
  };

  // Mock events
  const upcomingEvents: CommunityEvent[] = [
    {
      id: "1",
      title: "Weekly Meme Contest",
      description: "Best trading meme wins 1000 tokens",
      date: "2 days left",
      participants: 156,
      prize: "1000 Tokens",
      status: "active"
    },
    {
      id: "2",
      title: "Community AMA",
      description: "Q&A with top traders",
      date: "Friday 3PM EST",
      participants: 89,
      prize: "Knowledge",
      status: "upcoming"
    }
  ];

  // Rotate banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingBannerIndex((prev) => (prev + 1) % bannerContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = bannerContent[rotatingBannerIndex];
  const selectedCategory = categories.find(c => c.id === activeCategory);
  const filteredPosts = communityPosts.filter(post => post.category === activeCategory);

  const handlePostSubmit = () => {
    if (newPostContent.trim()) {
      // Handle post submission
      setNewPostContent("");
    }
  };

  const renderPoll = (poll: CommunityPost['poll']) => {
    if (!poll) return null;

    return (
      <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
        <h4 className="text-white font-medium mb-3">{poll.question}</h4>
        <div className="space-y-2">
          {poll.options.map((option, index) => {
            const percentage = (option.votes / poll.totalVotes) * 100;
            return (
              <button
                key={index}
                className="w-full text-left p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700 hover:border-blue-500/50"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">{option.text}</span>
                  <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                </div>
                <Progress value={percentage} className="h-1" />
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">{poll.totalVotes} total votes</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Community Hub
              </h1>
              <p className="text-xl text-gray-400 italic">
                Where traders hang out, laugh, and share beyond the markets.
              </p>
            </div>

            {/* Rotating Banner Carousel */}
            <Card className="banner-carousel bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm community-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{currentBanner.image}</div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{currentBanner.title}</h3>
                      <p className="text-gray-400">{currentBanner.subtitle}</p>
                    </div>
                  </div>
                  <Button 
                    className={`bg-gradient-to-r ${selectedCategory?.color} text-white font-medium`}
                  >
                    {currentBanner.action}
                  </Button>
                </div>
                
                {/* Banner indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {bannerContent.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === rotatingBannerIndex
                          ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            {/* Mobile Category Dropdown */}
            <div className="lg:hidden mb-4">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 border ${
                          activeCategory === category.id
                            ? `bg-gradient-to-r ${category.color} bg-opacity-20 border-opacity-50`
                            : "bg-gray-800/30 border-gray-700"
                        }`}
                      >
                        <div className={`p-1 rounded bg-gradient-to-r ${category.color}`}>
                          {category.icon}
                        </div>
                        <span className="text-white font-medium text-sm">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Category Sidebar */}
            <div className="hidden lg:block">
              <Card className="bg-gray-800/50 border-gray-700/50 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full p-3 rounded-lg transition-all duration-200 text-left border ${
                        activeCategory === category.id
                          ? `bg-gradient-to-r ${category.color} bg-opacity-20 border-opacity-50`
                          : "bg-gray-800/30 hover:bg-gray-700/50 border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded bg-gradient-to-r ${category.color}`}>
                          {category.icon}
                        </div>
                        <span className="text-white font-medium text-sm">{category.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{category.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {category.memberCount.toLocaleString()}
                        </span>
                        <span className="text-green-400 flex items-center gap-1">
                          <div className="relative">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
                          </div>
                          {category.onlineCount}
                        </span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Live Member Activity - Desktop Only */}
            <div className="hidden lg:block">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    Live Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Online:</span>
                      <span className="text-green-400 font-medium">
                        {categories.reduce((sum, c) => sum + c.onlineCount, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Posts Today:</span>
                      <span className="text-blue-400 font-medium">
                        {categories.reduce((sum, c) => sum + c.todayPosts, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Active Contests:</span>
                      <span className="text-purple-400 font-medium">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Post Composer */}
            {isAuthenticated && (
              <Card className="bg-gray-800/50 border-gray-700/50 mb-6 sticky top-4 z-10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share something with the community..."
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => setShowPollCreator(!showPollCreator)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handlePostSubmit}
                      disabled={!newPostContent.trim()}
                      className={`bg-gradient-to-r ${selectedCategory?.color} text-white font-medium`}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="post-card bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50 transition-all">
                  <CardContent className="p-4">
                    {post.isPinned && (
                      <div className="flex items-center gap-2 mb-3 text-yellow-400">
                        <Pin className="h-3 w-3" />
                        <span className="text-xs font-medium">Pinned Post</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{post.author.name}</span>
                          {post.author.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-yellow-400" />
                            <span className="text-gray-400">Level {post.author.level}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{post.timestamp}</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-1 mb-2">
                          {post.author.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant="secondary"
                              className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-gray-300 mb-3">{post.content}</div>
                        
                        {/* Tags */}
                        {post.tags && (
                          <div className="flex items-center gap-1 mb-3">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Media */}
                        {post.media && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <img 
                              src={post.media.url} 
                              alt="Post media" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Poll */}
                        {renderPoll(post.poll)}
                        
                        {/* Engagement */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                          <div className="flex items-center gap-4">
                            <button className="engagement-button flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="engagement-button flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm">{post.comments}</span>
                            </button>
                            <button className="engagement-button flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                              <Share2 className="h-4 w-4" />
                              <span className="text-sm">{post.shares}</span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            {post.awards > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                                <Award className="h-3 w-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">{post.awards}</span>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 border border-yellow-500/30"
                            >
                              <Award className="h-3 w-3 mr-1" />
                              Award
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Stack on Mobile */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-last lg:order-none">
            {/* Live Poll of the Day */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-teal-400" />
                  Poll of the Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">Best time to trade?</h4>
                  <div className="space-y-2">
                    {["Morning", "Afternoon", "Evening", "I don't sleep"].map((option, index) => {
                      const votes = [45, 32, 18, 25][index];
                      const percentage = (votes / 120) * 100;
                      return (
                        <button
                          key={option}
                          className="w-full text-left p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{option}</span>
                            <span className="text-gray-400">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} className="h-1" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400">120 votes • 2h left</p>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboards */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Leaderboards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top Posters */}
                  <div>
                    <h4 className="text-xs text-gray-400 font-medium mb-2">Top Posters</h4>
                    <div className="space-y-1">
                      {leaderboards.topPosters.slice(0, 3).map((user, index) => (
                        <div key={user.id} className="flex items-center gap-2 p-1">
                          <span className="text-xs w-4 text-gray-400">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white flex-1 truncate">{user.username}</span>
                          <span className="text-xs text-gray-400">{user.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Most Liked */}
                  <div>
                    <h4 className="text-xs text-gray-400 font-medium mb-2">Most Liked</h4>
                    <div className="space-y-1">
                      {leaderboards.mostLiked.slice(0, 3).map((user, index) => (
                        <div key={user.id} className="flex items-center gap-2 p-1">
                          <span className="text-xs w-4 text-gray-400">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white flex-1 truncate">{user.username}</span>
                          <span className="text-xs text-red-400">{user.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Countdown */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <PartyPopper className="h-3 w-3 text-purple-400" />
                        <span className="text-xs text-white font-medium">{event.title}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{event.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="text-yellow-400 font-medium">{event.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* XP Progress & Gamification (if authenticated) */}
            {isAuthenticated && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
                          <span className="text-white font-bold text-lg">15</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-white font-medium mb-1">Level 15 Trader</p>
                      <p className="text-xs text-gray-400 mb-3">2,847 / 3,000 XP</p>
                      <Progress value={94.9} className="h-2 mb-3" />
                      <p className="text-xs text-purple-300 font-medium">🔥 153 XP to next level!</p>

                      {/* Daily XP Goals */}
                      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                        <p className="text-xs text-gray-400 mb-2">Daily Goals</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Post content: ✅</span>
                            <span className="text-green-400">+10 XP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Engage 5 times: ✅</span>
                            <span className="text-green-400">+15 XP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Win a poll: ⏳</span>
                            <span className="text-gray-400">+25 XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Token Rewards */}
                <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">$</span>
                        </div>
                        <span className="text-white font-medium">1,247 Tokens</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">Earn tokens for winning contests & awards</p>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium"
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        View Rewards Shop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
