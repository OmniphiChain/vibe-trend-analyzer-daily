import React, { useState, useEffect } from "react";
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
  PartyPopper,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  MessageCircle,
  ArrowUp,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Gift,
  Coins
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import "@/styles/community-hub.css";

interface CommunityHubUpgradedProps {
  onNavigateToProfile?: (userId: string) => void;
}

// Define all interfaces for the upgraded hub
interface Post {
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
  category: string;
  likes: number;
  comments: number;
  shares: number;
  awards: number;
  isPinned?: boolean;
  hashtags?: string[];
  mediaType?: 'image' | 'gif' | 'video' | 'poll';
  mediaUrl?: string;
  mediaThumbnail?: string;
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    myVote?: number;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  dateISO: string;
  participants: number;
  prize: string;
  rsvp: boolean;
  status: 'upcoming' | 'active' | 'completed';
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  memberCount: number;
  onlineCount: number;
  todayPosts: number;
  description: string;
}

export const CommunityHubUpgraded: React.FC<CommunityHubUpgradedProps> = ({ onNavigateToProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const { themeMode } = useMoodTheme();

  // Enhanced State Management
  const [state, setState] = useState({
    category: "general",
    query: "",
    posts: [] as Post[],
    reactions: {} as Record<string, Record<string, number>>,
    myReactions: {} as Record<string, string>,
    myXP: 2487,
    level: 15,
    dailyStreak: 3,
    events: [] as Event[],
    poll: {
      question: "Best time to trade?",
      options: [
        { text: "Morning", votes: 45 },
        { text: "Afternoon", votes: 32 },
        { text: "Evening", votes: 18 },
        { text: "I don't sleep", votes: 25 }
      ],
      totalVotes: 120,
      myVote: null
    }
  });

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newPostContent, setNewPostContent] = useState("");
  const [showPollModal, setShowPollModal] = useState(false);
  const [showThreadDrawer, setShowThreadDrawer] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Categories with neon accent colors
  const categories: Category[] = [
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
      id: "hall",
      name: "Hall of Fame",
      icon: <Crown className="h-4 w-4" />,
      color: "from-amber-500 to-yellow-500",
      memberCount: 234,
      onlineCount: 12,
      todayPosts: 5,
      description: "Top contributors & best posts"
    }
  ];

  // Carousel slides
  const carouselSlides = [
    {
      type: "meme",
      title: "Meme of the Week",
      subtitle: "When you diamond hand through a 40% dip",
      image: "💎🙌",
      media: "/api/placeholder/400/200",
      action: "View Gallery",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      type: "poll",
      title: "Poll of the Day",
      subtitle: state.poll.question,
      image: "📊",
      action: "Vote Now",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      type: "event",
      title: "Trading Meme Contest",
      subtitle: "Win 1000 tokens! Submissions end in 3 days",
      image: "🏆",
      action: "RSVP Now",
      gradient: "from-yellow-500/20 to-orange-500/20"
    }
  ];

  // Dummy posts with enhanced media
  const dummyPosts: Post[] = [
    {
      id: "1",
      author: {
        id: "1",
        name: "MemeKing2024",
        avatar: "/api/placeholder/40/40",
        level: 25,
        xp: 4521,
        badges: ["Top Contributor", "Meme Champion"],
        verified: true
      },
      content: "When you finally understand options trading but your portfolio still looks like modern art 🎨���� #TradingMemes #OptionsLife",
      timestamp: "2m ago",
      category: "memes",
      likes: 234,
      comments: 67,
      shares: 23,
      awards: 5,
      isPinned: true,
      hashtags: ["TradingMemes", "OptionsLife"],
      mediaType: "image",
      mediaUrl: "/api/placeholder/680/400",
      mediaThumbnail: "/api/placeholder/200/120"
    },
    {
      id: "2",
      author: {
        id: "2",
        name: "ZenTrader",
        avatar: "/api/placeholder/40/40",
        level: 22,
        xp: 3890,
        badges: ["Wisdom Guru", "Contest Winner"]
      },
      content: "Market reminder: The best trades happen when you're not emotionally attached. Take breaks, touch grass, then come back with fresh eyes 🌱✨ #TradingWisdom #Mindset",
      timestamp: "8m ago",
      category: "lifestyle",
      likes: 189,
      comments: 34,
      shares: 45,
      awards: 12,
      hashtags: ["TradingWisdom", "Mindset"],
      mediaType: "video",
      mediaUrl: "/api/placeholder/680/400",
      mediaThumbnail: "/api/placeholder/200/120"
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
      content: "Community Poll: What's your biggest trading fear? Let's discuss our common challenges! 🤔",
      timestamp: "15m ago",
      category: "polls",
      likes: 89,
      comments: 156,
      shares: 12,
      awards: 3,
      mediaType: "poll",
      poll: {
        question: "What's your biggest trading fear?",
        options: [
          { text: "Missing the perfect entry", votes: 145 },
          { text: "Holding too long", votes: 203 },
          { text: "FOMO buying at the top", votes: 167 },
          { text: "Not setting stop losses", votes: 89 }
        ],
        totalVotes: 604,
        myVote: undefined
      }
    }
  ];

  // Events data
  const dummyEvents: Event[] = [
    {
      id: "1",
      title: "Weekly Meme Contest",
      description: "Best trading meme wins 1000 tokens",
      dateISO: "2024-01-20T15:00:00Z",
      participants: 156,
      prize: "1000 Tokens",
      rsvp: false,
      status: "active"
    },
    {
      id: "2",
      title: "Community AMA",
      description: "Q&A with top traders",
      dateISO: "2024-01-22T19:00:00Z",
      participants: 89,
      prize: "Knowledge",
      rsvp: true,
      status: "upcoming"
    }
  ];

  // Initialize state
  useEffect(() => {
    setState(prev => ({
      ...prev,
      posts: dummyPosts,
      events: dummyEvents,
      reactions: {
        "1": { rocket: 45, lol: 23, fire: 12 },
        "2": { rocket: 32, lol: 8, fire: 25 },
        "3": { rocket: 15, lol: 67, fire: 8 }
      }
    }));
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Gamification functions
  const addXP = (amount: number) => {
    setState(prev => {
      const newXP = prev.myXP + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      return {
        ...prev,
        myXP: newXP,
        level: newLevel > prev.level ? newLevel : prev.level
      };
    });
  };

  const handleReaction = (postId: string, emoji: string) => {
    if (state.myReactions[postId] === emoji) return; // Already reacted with this emoji
    
    setState(prev => ({
      ...prev,
      reactions: {
        ...prev.reactions,
        [postId]: {
          ...prev.reactions[postId],
          [emoji]: (prev.reactions[postId]?.[emoji] || 0) + 1
        }
      },
      myReactions: {
        ...prev.myReactions,
        [postId]: emoji
      }
    }));
    addXP(1);
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        id: user?.id || "current",
        name: user?.username || "You",
        avatar: user?.avatar || "/api/placeholder/40/40",
        level: state.level,
        xp: state.myXP,
        badges: ["Community Member"],
        verified: false
      },
      content: newPostContent,
      timestamp: "now",
      category: state.category,
      likes: 0,
      comments: 0,
      shares: 0,
      awards: 0,
      hashtags: newPostContent.match(/#\w+/g)?.map(tag => tag.slice(1)) || []
    };

    setState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
    setNewPostContent("");
    addXP(10);
  };

  const handlePollVote = (optionIndex: number) => {
    setState(prev => ({
      ...prev,
      poll: {
        ...prev.poll,
        myVote: optionIndex as any, // FIXME: Type issue with poll state
        options: prev.poll.options.map((opt, idx) => 
          idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
        ),
        totalVotes: prev.poll.totalVotes + 1
      }
    }));
    addXP(5);
  };

  const handleRSVP = (eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId ? { ...event, rsvp: !event.rsvp } : event
      )
    }));
  };

  const filteredPosts = state.posts.filter(post => {
    const matchesCategory = state.category === "general" || post.category === state.category;
    const matchesQuery = !state.query || 
      post.content.toLowerCase().includes(state.query.toLowerCase()) ||
      post.author.name.toLowerCase().includes(state.query.toLowerCase()) ||
      post.hashtags?.some(tag => tag.toLowerCase().includes(state.query.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const currentSlide = carouselSlides[carouselIndex];
  const selectedCategory = categories.find(c => c.id === state.category);

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: "var(--bg, #0B1020)",
        color: "var(--text, #E7ECF4)"
      }}
    >
      {/* Animated Hero Carousel */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: "var(--panelSoft, #141A2B)" }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Community Hub
            </h1>
            <p className="text-xl text-gray-400 italic">
              Where traders hang out, laugh, and share beyond the markets.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <Card 
              className="overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              style={{ 
                background: `linear-gradient(90deg, var(--panelSoft, #141A2B), var(--panel, #10162A))`,
                border: "1px solid var(--panelSoft, #141A2B)",
                boxShadow: "var(--shadow, 0 8px 24px rgba(0,0,0,0.35))"
              }}
            >
              <CardContent className="p-6">
                <div className={`rounded-lg p-6 bg-gradient-to-r ${currentSlide.gradient}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl animate-bounce">{currentSlide.image}</div>
                      <div>
                        <h3 className="text-white font-bold text-2xl mb-1">{currentSlide.title}</h3>
                        <p className="text-gray-300 text-lg">{currentSlide.subtitle}</p>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      className={`bg-gradient-to-r ${selectedCategory?.color} text-white font-semibold shadow-lg hover:scale-105 transition-all`}
                      onClick={() => {
                        if (currentSlide.type === "poll") setShowPollModal(true);
                        if (currentSlide.type === "event") handleRSVP("1");
                      }}
                    >
                      {currentSlide.action}
                    </Button>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex gap-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCarouselIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === carouselIndex 
                            ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselSlides.length)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Left Sidebar - Categories & Live Activity */}
          <div className="lg:col-span-1">
            {/* Mobile Category Selector */}
            <div className="lg:hidden mb-4">
              <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setState(prev => ({ ...prev, category: category.id }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 border ${
                          state.category === category.id
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

            {/* Desktop Categories */}
            <div className="hidden lg:block">
              <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }} className="mb-6">
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
                      onClick={() => setState(prev => ({ ...prev, category: category.id }))}
                      className={`w-full p-3 rounded-lg transition-all duration-300 text-left border hover:scale-[1.02] ${
                        state.category === category.id
                          ? `bg-gradient-to-r ${category.color} bg-opacity-20 border-opacity-50 category-active`
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

              {/* Live Activity */}
              <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}>
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
            {/* Search & Filter */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={state.query}
                    onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                    placeholder="Search posts, hashtags, or users..."
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-gray-600 text-gray-400 hover:text-white">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Composer */}
            {isAuthenticated && (
              <Card 
                style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}
                className="mb-6 sticky top-4 z-10 community-card"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 level-badge">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xs">
                          L{state.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Share something with the community..."
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white engagement-button">
                        <Image className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white engagement-button">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-white engagement-button"
                        onClick={() => setShowPollModal(true)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white engagement-button">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handlePost}
                      disabled={!newPostContent.trim()}
                      className={`bg-gradient-to-r ${selectedCategory?.color} text-white font-medium disabled:opacity-50 hover:scale-105 transition-all`}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post (+10 XP)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}
                  className="post-card hover:scale-[1.01] transition-all duration-300"
                >
                  <CardContent className="p-6">
                    {post.isPinned && (
                      <div className="flex items-center gap-2 mb-4 text-yellow-400">
                        <Pin className="h-4 w-4" />
                        <span className="text-sm font-medium">Pinned Post</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12 ring-2 ring-gray-600">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        {post.author.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{post.author.name}</span>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                            Level {post.author.level}
                          </Badge>
                          {post.author.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant="secondary"
                              className="text-xs bg-gray-700/50 text-gray-300"
                            >
                              {badge}
                            </Badge>
                          ))}
                          <span className="text-gray-400 text-sm">{post.timestamp}</span>
                        </div>
                        
                        <div className="text-gray-300 mb-4 text-base leading-relaxed">{post.content}</div>
                        
                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            {post.hashtags.map((tag) => (
                              <span key={tag} className="text-blue-400 text-sm hover:text-blue-300 cursor-pointer">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Large Media Display */}
                        {post.mediaType && post.mediaUrl && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-gray-700">
                            {post.mediaType === 'image' && (
                              <img 
                                src={post.mediaUrl} 
                                alt="Post media" 
                                className="w-full max-w-[680px] h-auto object-cover hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            {post.mediaType === 'video' && (
                              <div className="relative group cursor-pointer">
                                <img 
                                  src={post.mediaThumbnail} 
                                  alt="Video thumbnail" 
                                  className="w-full max-w-[680px] h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <PlayCircle className="h-16 w-16 text-white group-hover:scale-110 transition-transform" />
                                </div>
                              </div>
                            )}
                            {post.mediaType === 'gif' && (
                              <img 
                                src={post.mediaUrl} 
                                alt="GIF" 
                                className="w-full max-w-[680px] h-auto object-cover"
                              />
                            )}
                          </div>
                        )}
                        
                        {/* Poll Display */}
                        {post.poll && (
                          <div className="mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                            <h4 className="text-white font-medium mb-3">{post.poll.question}</h4>
                            <div className="space-y-2">
                              {post.poll.options.map((option, index) => {
                                const percentage = (option.votes / post.poll!.totalVotes) * 100;
                                const isSelected = post.poll!.myVote === index;
                                return (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      if (post.poll!.myVote === undefined) {
                                        setState(prev => ({
                                          ...prev,
                                          posts: prev.posts.map(p => 
                                            p.id === post.id && p.poll
                                              ? {
                                                  ...p,
                                                  poll: {
                                                    ...p.poll,
                                                    myVote: index,
                                                    options: p.poll.options.map((opt, idx) => 
                                                      idx === index ? { ...opt, votes: opt.votes + 1 } : opt
                                                    ),
                                                    totalVotes: p.poll.totalVotes + 1
                                                  }
                                                }
                                              : p
                                          )
                                        }));
                                        addXP(5);
                                      }
                                    }}
                                    disabled={post.poll.myVote !== undefined}
                                    className={`w-full text-left p-3 rounded-lg transition-all poll-option ${
                                      isSelected 
                                        ? 'bg-blue-500/20 border-blue-500/50' 
                                        : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700 hover:border-blue-500/50'
                                    } border`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-sm text-gray-300">{option.text}</span>
                                      <span className="text-xs text-gray-400">{percentage.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">{post.poll.totalVotes} votes</p>
                          </div>
                        )}
                        
                        {/* Quick Reactions Bar */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/20 rounded-lg">
                          {[
                            { emoji: "🚀", key: "rocket" },
                            { emoji: "😂", key: "lol" },
                            { emoji: "🔥", key: "fire" }
                          ].map(({ emoji, key }) => {
                            const count = state.reactions[post.id]?.[key] || 0;
                            const isMyReaction = state.myReactions[post.id] === key;
                            return (
                              <button
                                key={key}
                                onClick={() => handleReaction(post.id, key)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all hover:scale-110 ${
                                  isMyReaction 
                                    ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300' 
                                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-400'
                                }`}
                              >
                                <span className="text-sm">{emoji}</span>
                                <span className="text-xs font-medium">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Action Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                          <div className="flex items-center gap-4">
                            <button className="engagement-button flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedPost(post.id);
                                setShowThreadDrawer(true);
                              }}
                              className="engagement-button flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                            >
                              <MessageCircle className="h-4 w-4" />
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
                              className="award-button bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:scale-105 transition-all"
                            >
                              <Gift className="h-3 w-3 mr-1" />
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

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 order-last lg:order-none">
            {/* Poll of the Day */}
            <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-teal-400" />
                  Poll of the Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-white font-medium text-sm">{state.poll.question}</h4>
                  <div className="space-y-2">
                    {state.poll.options.map((option, index) => {
                      const percentage = (option.votes / state.poll.totalVotes) * 100;
                      const isSelected = state.poll.myVote === index;
                      return (
                        <button
                          key={index}
                          onClick={() => state.poll.myVote === null && handlePollVote(index)}
                          disabled={state.poll.myVote !== null}
                          className={`w-full text-left p-2 rounded-lg transition-all poll-option ${
                            isSelected 
                              ? 'bg-teal-500/20 border-teal-500/50' 
                              : 'bg-gray-800/50 hover:bg-gray-700/50'
                          } border border-gray-700`}
                        >
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-300">{option.text}</span>
                            <span className="text-gray-400">{percentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={percentage} className="h-1" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400">{state.poll.totalVotes} votes • 2h left</p>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card with Streak */}
            {isAuthenticated && (
              <Card
                className="token-glow overflow-hidden"
                style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}
              >
                <CardContent className="p-4 overflow-hidden">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center level-badge">
                        <span className="text-white font-bold text-lg">{state.level}</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <p className="text-white font-medium mb-1">Level {state.level} Trader</p>
                    <p className="text-xs text-gray-400 mb-3">{state.myXP} / {(state.level) * 1000} XP</p>
                    <div className="w-full mb-3">
                      <Progress
                        value={(state.myXP % 1000) / 10}
                        className="h-3 w-full bg-gray-700/50"
                      />
                    </div>
                    <p className="text-xs text-purple-300 font-medium">
                      🔥 {(state.level * 1000) - state.myXP} XP to next level!
                    </p>
                    
                    {/* Daily Streak */}
                    <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Daily Streak</p>
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <div
                            key={day}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              day <= state.dailyStreak
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-700 text-gray-400'
                            }`}
                            title={`Day ${day} - ${day <= state.dailyStreak ? '+5 XP' : 'Not completed'}`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-orange-300">
                        {state.dailyStreak} day streak • +{state.dailyStreak * 5} XP bonus
                      </p>
                    </div>
                    
                    {/* Tokens */}
                    <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-medium">1,247 Tokens</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium"
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        Rewards Shop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboards */}
            <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  Leaderboards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs text-gray-400 font-medium mb-2">Top Posters</h4>
                    <div className="space-y-1">
                      {[
                        { name: "MemeKing2024", score: 847, avatar: "/api/placeholder/24/24" },
                        { name: "ZenTrader", score: 723, avatar: "/api/placeholder/24/24" },
                        { name: "CoffeeHODLer", score: 656, avatar: "/api/placeholder/24/24" }
                      ].map((user, index) => (
                        <div key={user.name} className="leaderboard-entry flex items-center gap-2 p-2 rounded-lg">
                          <span className="text-xs w-4 text-gray-400">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white flex-1 truncate">{user.name}</span>
                          <span className="text-xs text-gray-400">{user.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator style={{ background: "var(--panelSoft, #141A2B)" }} />

                  <div>
                    <h4 className="text-xs text-gray-400 font-medium mb-2">Most Liked</h4>
                    <div className="space-y-1">
                      {[
                        { name: "WisdomOWL", score: 2341, avatar: "/api/placeholder/24/24" },
                        { name: "TradingGuru", score: 1998, avatar: "/api/placeholder/24/24" },
                        { name: "MoodMaster", score: 1756, avatar: "/api/placeholder/24/24" }
                      ].map((user, index) => (
                        <div key={user.name} className="leaderboard-entry flex items-center gap-2 p-2 rounded-lg">
                          <span className="text-xs w-4 text-gray-400">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-white flex-1 truncate">{user.name}</span>
                          <span className="text-xs text-red-400">{user.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card style={{ background: "var(--panel, #10162A)", border: "1px solid var(--panelSoft, #141A2B)" }}>
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {state.events.map((event) => (
                    <div key={event.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <PartyPopper className="h-3 w-3 text-purple-400" />
                            <span className="text-xs text-white font-medium">{event.title}</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{event.description}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(event.dateISO).toLocaleDateString()}
                            </span>
                            <span className="text-yellow-400 font-medium">{event.prize}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={event.rsvp ? "default" : "outline"}
                          onClick={() => handleRSVP(event.id)}
                          className={`text-xs ${
                            event.rsvp 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'border-gray-600 text-gray-400 hover:text-white'
                          }`}
                        >
                          {event.rsvp ? 'RSVP\'d' : 'RSVP'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
