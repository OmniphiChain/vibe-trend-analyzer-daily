import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Clock,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Bell,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  DollarSign,
  Factory,
  Eye,
  Filter,
  Volume2,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import AIAnalysisModal from './AIAnalysisModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  aiSummary?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  timestamp: string;
  category: string;
  url?: string;
  tickers?: string[];
  reactions: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };
  isExpanded?: boolean;
  topComments?: Comment[];
  sparklineData?: number[];
}

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface AIHighlight {
  id: string;
  type: 'mood_summary' | 'trending_tickers' | 'bearish_headlines';
  title: string;
  content: string;
  value?: string;
  change?: number;
  icon: React.ReactNode;
}

type FilterType = 'AI Curated' | 'Breaking News' | 'By Sector' | 'Earnings' | 'Global Macro' | 'All News' | 'Bullish' | 'Neutral' | 'Bearish';

const SmartNewsFeedPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('AI Curated');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set());
  const [userInteractions, setUserInteractions] = useState<{[key: string]: {liked: boolean, saved: boolean, following: boolean}}>({});
  const [replyOpen, setReplyOpen] = useState<{[key: string]: boolean}>({});
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsArticleId, setCommentsArticleId] = useState<string | null>(null);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(0);
  const [newCommentText, setNewCommentText] = useState("");

  const mockComments: Comment[] = [
    {
      id: '1',
      user: { username: 'TraderJoe', avatar: '/api/placeholder/32/32', verified: true },
      content: '$TSLA looking strong despite the delivery miss. Long-term outlook still bullish 🚀',
      timestamp: '2m ago',
      likes: 23,
      sentiment: 'positive'
    },
    {
      id: '2',
      user: { username: 'MarketWatcher', avatar: '/api/placeholder/32/32' },
      content: 'Supply chain issues are temporary. Q1 should see better numbers.',
      timestamp: '5m ago',
      likes: 15,
      sentiment: 'neutral'
    }
  ];

  const aiHighlights: AIHighlight[] = [
    {
      id: '1',
      type: 'mood_summary',
      title: "Today's Market Mood",
      content: 'Cautiously optimistic on tech earnings',
      value: '72%',
      change: 5.2,
      icon: <Brain className="w-5 h-5" />
    },
    {
      id: '2',
      type: 'trending_tickers',
      title: 'Trending Tickers',
      content: '$NVDA, $TSLA, $AAPL leading discussions',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      id: '3',
      type: 'bearish_headlines',
      title: 'Most Bearish',
      content: 'Banking sector regulatory concerns',
      value: '-8.3%',
      icon: <TrendingDown className="w-5 h-5" />
    }
  ];

  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Tech stocks rally as investors eye AI-driven growth opportunities ahead of earnings',
      summary: 'Major technology companies see significant gains amid optimism around artificial intelligence earnings reports and continued innovation in the sector.',
      aiSummary: 'AI Analysis: Strong institutional buying in mega-cap tech driven by Q4 earnings optimism. Key catalysts: ChatGPT adoption metrics, cloud growth, and semiconductor demand. Risk factors include valuation concerns and potential rate sensitivity.',
      sentiment: 'positive',
      source: 'Wall Street Journal',
      timestamp: '1m ago',
      category: 'Tech',
      url: 'https://www.wsj.com/tech-stocks-rally-ai-growth',
      tickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
      reactions: { likes: 142, comments: 28, shares: 15, saves: 67 },
      topComments: mockComments,
      sparklineData: [100, 102, 105, 108, 112, 115, 118]
    },
    {
      id: '2',
      title: 'Federal Reserve hints at potential pause in aggressive rate hiking cycle',
      summary: 'Fed officials signal a more cautious approach to future monetary policy decisions as inflation shows signs of cooling across multiple sectors.',
      aiSummary: 'AI Analysis: Dovish pivot anticipated based on recent comments from Fed officials. Market implications include potential rotation from defensive to growth stocks. Watch for bond market reactions and dollar strength indicators.',
      sentiment: 'neutral',
      source: 'Reuters',
      timestamp: '15m ago',
      category: 'Economy',
      url: 'https://www.reuters.com/federal-reserve-rate-pause',
      tickers: ['SPY', 'QQQ', 'TLT'],
      reactions: { likes: 89, comments: 45, shares: 12, saves: 34 },
      topComments: mockComments.slice(0, 1),
      sparklineData: [100, 98, 99, 101, 100, 102, 101]
    },
    {
      id: '3',
      title: 'Tesla deliveries fall short of analyst expectations for Q4, supply chain cited',
      summary: 'Electric vehicle manufacturer reports quarterly delivery numbers below Wall Street forecasts, citing ongoing supply chain challenges and production constraints.',
      aiSummary: 'AI Analysis: Delivery miss of ~8% vs consensus estimates. Production bottlenecks in Shanghai and Austin facilities. Positive outlook for Q1 2024 based on management guidance. Stock oversold technically.',
      sentiment: 'negative',
      source: 'CNBC',
      timestamp: '4m ago',
      category: 'Earnings',
      url: 'https://www.cnbc.com/tesla-deliveries-q4-shortfall',
      tickers: ['TSLA'],
      reactions: { likes: 67, comments: 92, shares: 8, saves: 23 },
      topComments: mockComments,
      sparklineData: [100, 95, 92, 88, 85, 87, 89]
    },
    {
      id: '4',
      title: 'Breakthrough renewable energy storage technology could reshape grid infrastructure',
      summary: 'New solid-state battery technology promises 10x energy density improvements, potentially revolutionizing renewable energy storage and electric vehicle applications.',
      aiSummary: 'AI Analysis: Paradigm shift in energy storage. Patents filed by consortium of major tech companies. Commercial viability expected within 3-5 years. Massive implications for energy transition and grid stability.',
      sentiment: 'positive',
      source: 'Nature Energy',
      timestamp: '32m ago',
      category: 'Energy',
      url: 'https://www.nature.com/energy-breakthrough',
      tickers: ['ENPH', 'SEDG', 'NEE'],
      reactions: { likes: 234, comments: 67, shares: 45, saves: 156 },
      topComments: [],
      sparklineData: [100, 105, 110, 115, 120, 125, 130]
    }
  ];

  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);

  const filterOptions: { label: FilterType; icon?: React.ReactNode }[] = [
    { label: 'AI Curated', icon: <Brain className="w-4 h-4" /> },
    { label: 'Breaking News', icon: <Zap className="w-4 h-4" /> },
    { label: 'By Sector', icon: <Factory className="w-4 h-4" /> },
    { label: 'Earnings', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Global Macro', icon: <Globe className="w-4 h-4" /> },
    { label: 'Bullish' },
    { label: 'Neutral' },
    { label: 'Bearish' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-3 h-3" />;
      case 'negative':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20';
      case 'negative':
        return 'bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'Bullish';
      case 'negative':
        return 'Bearish';
      default:
        return 'Neutral';
    }
  };

  const getSentimentGlow = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'shadow-lg shadow-green-500/10 border-green-500/20';
      case 'negative':
        return 'shadow-lg shadow-red-500/10 border-red-500/20';
      default:
        return 'shadow-lg shadow-blue-500/10 border-blue-500/20';
    }
  };

  const toggleArticleExpansion = (articleId: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleId)) {
      newExpanded.delete(articleId);
    } else {
      newExpanded.add(articleId);
    }
    setExpandedArticles(newExpanded);
  };

  const handleInteraction = (articleId: string, type: 'like' | 'save' | 'follow') => {
    setUserInteractions(prev => ({
      ...prev,
      [articleId]: {
        ...prev[articleId],
        [type === 'follow' ? 'following' : type === 'like' ? 'liked' : 'saved']:
          !prev[articleId]?.[type === 'follow' ? 'following' : type === 'like' ? 'liked' : 'saved']
      }
    }));
  };

  const toggleReply = (articleId: string) => {
    setReplyOpen(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const handleReplyChange = (articleId: string, value: string) => {
    setReplyText(prev => ({ ...prev, [articleId]: value }));
  };

  const submitReply = (articleId: string) => {
    const content = (replyText[articleId] || '').trim();
    if (!content) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: { username: 'You', avatar: '/api/placeholder/32/32' },
      content,
      timestamp: 'just now',
      likes: 0,
    };

    setArticles(prev => prev.map(a =>
      a.id === articleId
        ? {
            ...a,
            reactions: { ...a.reactions, comments: a.reactions.comments + 1 },
            topComments: [newComment, ...(a.topComments || [])]
          }
        : a
    ));

    setReplyText(prev => ({ ...prev, [articleId]: '' }));
    setReplyOpen(prev => ({ ...prev, [articleId]: false }));
  };

  const renderTickerTags = (tickers: string[] = []) => {
    return tickers.map(ticker => (
      <Badge
        key={ticker}
        variant="outline"
        className="text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/20"
      >
        ${ticker}
      </Badge>
    ));
  };

  const renderSparkline = (data: number[] = []) => {
    if (data.length === 0) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    const color = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';

    return (
      <div className="w-16 h-8 flex items-center">
        <svg width="60" height="24" className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className="opacity-80"
          />
        </svg>
      </div>
    );
  };

  const filterArticles = () => {
    let filtered = articles;

    // Apply sentiment-based filters
    if (['Bullish', 'Bearish', 'Neutral'].includes(activeFilter)) {
      const sentimentMap = {
        'Bullish': 'positive',
        'Bearish': 'negative',
        'Neutral': 'neutral'
      };
      filtered = filtered.filter(article => 
        article.sentiment === sentimentMap[activeFilter as keyof typeof sentimentMap]
      );
    }

    // Apply category-based filters
    if (activeFilter === 'By Sector') {
      filtered = filtered.filter(article => 
        ['Tech', 'Energy', 'Finance'].includes(article.category)
      );
    } else if (activeFilter === 'Earnings') {
      filtered = filtered.filter(article => 
        article.category === 'Earnings' || article.title.toLowerCase().includes('earnings')
      );
    } else if (activeFilter === 'Breaking News') {
      filtered = filtered.filter(article => {
        const timestamp = new Date(Date.now() - parseInt(article.timestamp.split('m')[0]) * 60000);
        return Date.now() - timestamp.getTime() < 30 * 60 * 1000; // Last 30 minutes
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tickers?.some(ticker => ticker.toLowerCase().includes(query.replace('$', ''))) ||
        (query.startsWith('$') && article.tickers?.some(ticker => 
          ticker.toLowerCase() === query.substring(1).toLowerCase()
        ))
      );
    }

    return filtered;
  };

  const filteredArticles = filterArticles();

  const handleAIAnalysis = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const openCommentsQuickView = (articleId: string) => {
    setCommentsArticleId(articleId);
    setSelectedCommentIndex(0);
    setNewCommentText("");
    setIsCommentsOpen(true);
  };

  const closeCommentsQuickView = () => {
    setIsCommentsOpen(false);
    setCommentsArticleId(null);
  };

  const scrollToComment = (index: number) => {
    if (!commentsArticleId) return;
    const el = document.getElementById(`comment-${commentsArticleId}-${index}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    if (isCommentsOpen) {
      scrollToComment(selectedCommentIndex);
    }
  }, [selectedCommentIndex, isCommentsOpen]);

  const handleSendNewComment = () => {
    if (!commentsArticleId) return;
    const content = newCommentText.trim();
    if (!content) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      user: { username: 'You', avatar: '/api/placeholder/32/32' },
      content,
      timestamp: 'just now',
      likes: 0,
    };
    setArticles(prev => prev.map(a =>
      a.id === commentsArticleId
        ? { ...a, topComments: [newComment, ...(a.topComments || [])], reactions: { ...a.reactions, comments: a.reactions.comments + 1 } }
        : a
    ));
    setNewCommentText("");
    setSelectedCommentIndex(0);
    setTimeout(() => scrollToComment(0), 0);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                  MoodMeter News
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full">
                    AI Powered
                  </span>
                </h1>
                <p className="text-sm text-white/60">Sentiment-aware financial news</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Search news, $TICKERS, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder-white/60 focus:ring-white/30 focus:border-white/30"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-white hover:bg-white/10"
              >
                <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Highlights Banner */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {aiHighlights.map((highlight) => (
            <Card key={highlight.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-white/80">
                    {highlight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white/90 mb-1">{highlight.title}</h3>
                    <p className="text-xs text-white/70 truncate">{highlight.content}</p>
                    {highlight.value && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-white">{highlight.value}</span>
                        {highlight.change && (
                          <span className={cn(
                            "text-xs flex items-center gap-1",
                            highlight.change > 0 ? "text-green-400" : "text-red-400"
                          )}>
                            {highlight.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(highlight.change)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <Button
              key={option.label}
              variant={activeFilter === option.label ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter(option.label)}
              className={cn(
                "text-sm whitespace-nowrap flex items-center gap-2",
                activeFilter === option.label
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/25 shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {option.icon}
              {option.label}
            </Button>
          ))}
        </div>

        {/* News Articles */}
        <div className="space-y-6">
          {filteredArticles.map((article) => {
            const isExpanded = expandedArticles.has(article.id);
            const userState = userInteractions[article.id] || {};
            
            return (
              <Card 
                key={article.id} 
                className={cn(
                  "bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-300 cursor-pointer group",
                  getSentimentGlow(article.sentiment)
                )}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-white/80 text-sm font-medium">{article.source}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.timestamp}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Badge className={cn("text-xs border", getSentimentColor(article.sentiment))}>
                        {getSentimentIcon(article.sentiment)}
                        <span className="ml-1">{getSentimentText(article.sentiment)}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                        {article.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Title */}
                  <div 
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => toggleArticleExpansion(article.id)}
                  >
                    <div className="flex-1">
                      <h2 className="text-white text-lg font-semibold mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                        {article.title}
                      </h2>

                      {/* Summary */}
                      <p className="text-white/70 text-sm mb-4 leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Tickers */}
                      {article.tickers && article.tickers.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className="text-white/60 text-xs">Related:</span>
                          {renderTickerTags(article.tickers)}
                          {article.sparklineData && renderSparkline(article.sparklineData)}
                        </div>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      {/* AI Summary */}
                      {article.aiSummary && (
                        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-400">AI Analysis</span>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">{article.aiSummary}</p>
                        </div>
                      )}

                      {/* Top Comments */}
                      {article.topComments && article.topComments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Top Community Takes
                          </h4>
                          <div className="space-y-3">
                            {article.topComments.slice(0, 3).map((comment) => (
                              <div key={comment.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={comment.user.avatar} />
                                  <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white/80 text-sm font-medium">{comment.user.username}</span>
                                    {comment.user.verified && (
                                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                      </div>
                                    )}
                                    <span className="text-white/40 text-xs">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-white/70 text-sm">{comment.content}</p>
                                  <div className="flex items-center gap-3 mt-2">
                                    <button className="flex items-center gap-1 text-white/60 hover:text-red-400 transition-colors">
                                      <Heart className="w-3 h-3" />
                                      <span className="text-xs">{comment.likes}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Post Your Take CTA */}
                          <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 text-sm">What's your take on this news?</span>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Post Your Take
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reaction Bar */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-6">
                      <button 
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          userState.liked ? "text-red-400" : "text-white/60 hover:text-red-400"
                        )}
                        onClick={() => handleInteraction(article.id, 'like')}
                      >
                        <Heart className={cn("w-4 h-4", userState.liked && "fill-current")} />
                        <span>{article.reactions.likes}</span>
                      </button>
                      
                      <button
                        className="flex items-center gap-2 text-white/60 hover:text-blue-400 text-sm transition-colors"
                        onClick={() => openCommentsQuickView(article.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{article.reactions.comments}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-white/60 hover:text-green-400 text-sm transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>{article.reactions.shares}</span>
                      </button>
                      
                      <button 
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          userState.saved ? "text-yellow-400" : "text-white/60 hover:text-yellow-400"
                        )}
                        onClick={() => handleInteraction(article.id, 'save')}
                      >
                        <Bookmark className={cn("w-4 h-4", userState.saved && "fill-current")} />
                        <span>{article.reactions.saves}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInteraction(article.id, 'follow')}
                        className={cn(
                          "text-xs",
                          userState.following
                            ? "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        {userState.following
                          ? `Following ${article.tickers?.[0] ? `$${article.tickers[0]}` : 'Topic'}`
                          : `Follow News on ${article.tickers?.[0] ? `$${article.tickers[0]}` : 'Topic'}`}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIAnalysis(article)}
                        className="text-white/60 hover:text-blue-400 hover:bg-blue-500/10 text-xs"
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI Analysis
                      </Button>
                    </div>
                  </div>

                  {replyOpen[article.id] && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyText[article.id] || ""}
                        onChange={(e) => handleReplyChange(article.id, e.target.value)}
                        className="bg-black/30 border-white/10 text-white placeholder-white/40"
                      />
                      <div className="mt-2 flex items-center gap-2 justify-end">
                        <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10" onClick={() => toggleReply(article.id)}>Cancel</Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => submitReply(article.id)}>Reply</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-2">No articles found</div>
            <div className="text-white/40 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      {selectedArticle && (
        <AIAnalysisModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          article={selectedArticle}
        />
      )}

      {/* Quick View Comments Modal */}
      {commentsArticleId && (
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-black/95 border-white/10 text-white">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg">Comments</DialogTitle>
            </DialogHeader>
            {(() => {
              const article = articles.find(a => a.id === commentsArticleId);
              const comments = article?.topComments || [];
              if (!article) return null;
              const total = comments.length;
              const current = Math.min(selectedCommentIndex, Math.max(0, total - 1));
              return (
                <div className="space-y-3">
                  {/* Controls */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-white/60">{total} comments</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setSelectedCommentIndex(Math.max(0, current - 1))}
                        disabled={current <= 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10"
                        onClick={() => setSelectedCommentIndex(Math.min(total - 1, current + 1))}
                        disabled={current >= total - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {comments.length === 0 && (
                      <div className="text-white/60 text-sm">No comments yet.</div>
                    )}
                    {comments.map((comment, idx) => (
                      <div id={`comment-${article.id}-${idx}`} key={comment.id} className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        "bg-white/5 border-white/10",
                        idx === current && "ring-1 ring-blue-400/40"
                      )}>
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white/80 text-sm font-medium">{comment.user.username}</span>
                            <span className="text-white/40 text-xs">{comment.timestamp}</span>
                          </div>
                          <p className="text-white/70 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Composer */}
                  <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <Textarea
                      placeholder="Write your comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="bg-black/30 border-white/10 text-white placeholder-white/40"
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10" onClick={() => setNewCommentText("")}>Clear</Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendNewComment}>Send</Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SmartNewsFeedPage;
