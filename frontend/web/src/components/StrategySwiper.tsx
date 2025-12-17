import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Clock,
  BarChart3,
  Users,
  Zap,
  Target,
  Crown,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Bookmark,
  MessageSquare,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

interface TradingQuestion {
  id: string;
  question: string;
  icon: React.ReactNode;
  category: "risk" | "timeframe" | "analysis" | "social" | "tech";
  gradient: string;
}

interface StrategyProfile {
  name: string;
  description: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  suggestedAssets: string[];
  suggestedRooms: string[];
  traits: string[];
}

interface StrategySwiperProps {
  onComplete?: (profile: StrategyProfile) => void;
  onClose?: () => void;
  placement?: "onboarding" | "dashboard" | "screener" | "community";
  className?: string;
}

const QUESTIONS: TradingQuestion[] = [
  {
    id: "risk-appetite",
    question: "I prefer high-risk, high-reward trades over safe investments",
    icon: <TrendingUp className="w-8 h-8" />,
    category: "risk",
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: "time-horizon",
    question: "I focus on long-term investing rather than short-term moves",
    icon: <Clock className="w-8 h-8" />,
    category: "timeframe",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "technical-analysis",
    question: "I rely heavily on technical indicators for my decisions",
    icon: <BarChart3 className="w-8 h-8" />,
    category: "analysis",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "social-sentiment",
    question: "I follow social media sentiment and community buzz closely",
    icon: <Users className="w-8 h-8" />,
    category: "social",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "ai-tools",
    question: "I use AI tools and automation to guide my trading decisions",
    icon: <Brain className="w-8 h-8" />,
    category: "tech",
    gradient: "from-violet-500 to-indigo-500"
  }
];

const STRATEGY_PROFILES: Record<string, StrategyProfile> = {
  "momentum-trader": {
    name: "Momentum Trader",
    description: "You ride the waves of market momentum and trend following",
    percentage: 0,
    icon: <TrendingUp className="w-8 h-8" />,
    color: "from-red-500 to-orange-500",
    suggestedAssets: ["TSLA", "NVDA", "MSTR", "GME"],
    suggestedRooms: ["Momentum Signals", "High Volatility Traders", "Day Trading Hub"],
    traits: ["Quick decision maker", "Risk tolerant", "Technical focused"]
  },
  "value-investor": {
    name: "Value Investor",
    description: "You seek undervalued assets with strong fundamentals",
    percentage: 0,
    icon: <Target className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    suggestedAssets: ["BRK.B", "JNJ", "KO", "PG"],
    suggestedRooms: ["Value Investing", "Dividend Aristocrats", "Long-term Holders"],
    traits: ["Patient investor", "Research focused", "Risk averse"]
  },
  "social-trader": {
    name: "Social Trader",
    description: "You leverage community insights and social sentiment",
    percentage: 0,
    icon: <Users className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500",
    suggestedAssets: ["AMC", "BB", "DOGE", "SHIB"],
    suggestedRooms: ["Social Sentiment", "Meme Stock Central", "Community Calls"],
    traits: ["Community driven", "Trend aware", "Social savvy"]
  },
  "ai-enhanced": {
    name: "AI-Enhanced Trader",
    description: "You combine technology with market analysis",
    percentage: 0,
    icon: <Brain className="w-8 h-8" />,
    color: "from-violet-500 to-indigo-500",
    suggestedAssets: ["PLTR", "C3.AI", "SNOW", "CRM"],
    suggestedRooms: ["AI Trading Signals", "Algorithmic Strategies", "Tech Analysis"],
    traits: ["Tech savvy", "Data driven", "Innovation focused"]
  },
  "technical-analyst": {
    name: "Technical Analyst",
    description: "You master charts, patterns, and technical indicators",
    percentage: 0,
    icon: <BarChart3 className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    suggestedAssets: ["SPY", "QQQ", "IWM", "DIA"],
    suggestedRooms: ["Technical Analysis", "Chart Patterns", "Indicator Signals"],
    traits: ["Chart expert", "Pattern focused", "Indicator savvy"]
  }
};

export const StrategySwiper: React.FC<StrategySwiperProps> = ({ 
  onComplete, 
  onClose, 
  placement = "dashboard",
  className 
}) => {
  const { themeMode } = useMoodTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<StrategyProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const calculateProfile = (userAnswers: Record<string, boolean>) => {
    const scores = {
      "momentum-trader": 0,
      "value-investor": 0,
      "social-trader": 0,
      "ai-enhanced": 0,
      "technical-analyst": 0
    };

    // Risk appetite (high risk = momentum trader)
    if (userAnswers["risk-appetite"]) {
      scores["momentum-trader"] += 30;
    } else {
      scores["value-investor"] += 30;
    }

    // Time horizon (long-term = value investor)
    if (userAnswers["time-horizon"]) {
      scores["value-investor"] += 25;
    } else {
      scores["momentum-trader"] += 20;
      scores["technical-analyst"] += 15;
    }

    // Technical analysis
    if (userAnswers["technical-analysis"]) {
      scores["technical-analyst"] += 35;
      scores["momentum-trader"] += 15;
    }

    // Social sentiment
    if (userAnswers["social-sentiment"]) {
      scores["social-trader"] += 40;
    }

    // AI tools
    if (userAnswers["ai-tools"]) {
      scores["ai-enhanced"] += 35;
      scores["technical-analyst"] += 10;
    }

    // Find the highest scoring profile
    const topProfile = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    );

    const profile = { ...STRATEGY_PROFILES[topProfile[0]] };
    profile.percentage = Math.min(Math.max(topProfile[1], 60), 95); // Ensure reasonable percentage

    return profile;
  };

  const handleSwipe = (liked: boolean) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(liked ? "right" : "left");

    // Save answer
    const newAnswers = { ...answers, [currentQuestion.id]: liked };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSwipeDirection(null);
        setIsAnimating(false);
      } else {
        // Calculate and show results
        const profile = calculateProfile(newAnswers);
        setMatchedProfile(profile);
        setIsComplete(true);
        setSwipeDirection(null);
        setIsAnimating(false);
        onComplete?.(profile);
      }
    }, 500);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsComplete(false);
    setMatchedProfile(null);
    setSwipeDirection(null);
    setIsAnimating(false);
  };

  const handleSaveProfile = () => {
    if (matchedProfile) {
      // Save to localStorage or user profile
      localStorage.setItem('tradingProfile', JSON.stringify(matchedProfile));
      
      // Show success message or navigate
      alert(`${matchedProfile.name} profile saved! Your preferences will now personalize your MoodMeter experience.`);
      onClose?.();
    }
  };

  const getPlacementTitle = () => {
    switch (placement) {
      case "onboarding":
        return "Let's match your trading strategy to get personalized market signals";
      case "screener":
        return "Need help choosing filters? Swipe to discover your style";
      case "community":
        return "Find stocks based on how YOU trade";
      default:
        return "Discover your trading personality";
    }
  };

  if (isComplete && matchedProfile) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border-gray-700/50", className)}>
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Success Header */}
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Profile Matched!</h2>
                <p className="text-gray-400">You're ready to trade like a pro</p>
              </div>
            </div>

            {/* Profile Result */}
            <div className="bg-gradient-to-r from-black/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r", matchedProfile.color)}>
                  {matchedProfile.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">{matchedProfile.name}</h3>
                  <p className="text-gray-400">{matchedProfile.percentage}% Match</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">{matchedProfile.description}</p>
              
              {/* Traits */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Your Trading Traits</p>
                <div className="flex flex-wrap gap-2">
                  {matchedProfile.traits.map((trait, index) => (
                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Suggested Assets */}
              <div className="bg-black/20 rounded-xl p-4 border border-gray-700/30">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Suggested Assets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {matchedProfile.suggestedAssets.map((asset, index) => (
                    <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30">
                      {asset}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Suggested Rooms */}
              <div className="bg-black/20 rounded-xl p-4 border border-gray-700/30">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  Suggested Rooms
                </h4>
                <div className="space-y-2">
                  {matchedProfile.suggestedRooms.slice(0, 3).map((room, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-purple-400" />
                      {room}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Save to Profile
              </Button>
              <Button
                onClick={handleRestart}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:text-white gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </Button>
            </div>

            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-lg mx-auto bg-white/5 backdrop-blur-xl border-gray-700/50", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold text-white">Trading Style Quiz</h2>
            <p className="text-sm text-gray-400 mt-1">{getPlacementTitle()}</p>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="relative h-96 mb-8">
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-br rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-600/30 transition-transform duration-500",
              currentQuestion.gradient,
              swipeDirection === "left" && "transform -translate-x-full rotate-12 opacity-0",
              swipeDirection === "right" && "transform translate-x-full rotate-12 opacity-0"
            )}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 text-white">
              {currentQuestion.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-4 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => handleSwipe(false)}
            variant="outline"
            className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
            disabled={isAnimating}
          >
            <TrendingDown className="w-4 h-4" />
            Disagree
          </Button>
          <Button
            onClick={() => handleSwipe(true)}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
            disabled={isAnimating}
          >
            <TrendingUp className="w-4 h-4" />
            Agree
          </Button>
        </div>

        {/* Pro Tip */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-400 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Pro Tip:</span>
            <span className="text-gray-400">Answer honestly for the most accurate match!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategySwiper;
