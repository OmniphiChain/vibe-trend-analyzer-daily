import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  DollarSign,
  Hash,
  AlertCircle,
} from "lucide-react";

interface PostComposerProps {
  onSubmit: (post: any) => void;
  placeholder?: string;
}

const TRENDING_TICKERS = [
  "$TSLA",
  "$NVDA",
  "$AAPL",
  "$MSFT",
  "$GOOGL",
  "$AMZN",
  "$META",
  "$SPY",
  "$QQQ",
  "$AMD",
];

export const PostComposer: React.FC<PostComposerProps> = ({
  onSubmit,
  placeholder = "💬 Share your market sentiment… Use $TICKER for stocks and #tags for topics",
}) => {
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<
    "bullish" | "bearish" | "neutral" | null
  >(null);
  const [showTickerSuggestions, setShowTickerSuggestions] = useState(false);
  const [tickerSuggestions, setTickerSuggestions] = useState<string[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const CHARACTER_LIMIT = 150;
  const isOverLimit = content.length > CHARACTER_LIMIT;
  const isNearLimit = content.length > CHARACTER_LIMIT * 0.8;
  const canPost =
    content.trim().length > 0 && sentiment !== null && !isOverLimit;

  useEffect(() => {
    // Show tooltip for new users (simulate first-time user check)
    const hasSeenTooltip = localStorage.getItem("post-composer-tooltip-seen");
    if (!hasSeenTooltip) {
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem("post-composer-tooltip-seen", "true");
      }, 5000);
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Prevent typing if over limit
    if (value.length <= CHARACTER_LIMIT) {
      setContent(value);
    }

    // Auto-detect tickers for suggestions
    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1] || "";

    if (lastWord.startsWith("$") && lastWord.length > 1) {
      const filtered = TRENDING_TICKERS.filter((ticker) =>
        ticker.toLowerCase().includes(lastWord.toLowerCase()),
      );
      setTickerSuggestions(filtered);
      setShowTickerSuggestions(filtered.length > 0);
    } else {
      setShowTickerSuggestions(false);
      setTickerSuggestions([]);
    }
  };

  const insertTicker = (ticker: string) => {
    const words = content.split(/\s+/);
    words[words.length - 1] = ticker;
    const newContent = words.join(" ") + " ";

    if (newContent.length <= CHARACTER_LIMIT) {
      setContent(newContent);
      setShowTickerSuggestions(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    if (!canPost) return;

    // Parse cashtags and hashtags
    const cashtags = content.match(/\$[A-Z]{1,5}/g) || [];
    const hashtags = content.match(/#\w+/g) || [];

    const post = {
      id: Date.now().toString(),
      content: content.trim(),
      sentiment,
      timeframe: "day", // Default for quick posts
      cashtags,
      hashtags,
      timestamp: new Date(),
      user: {
        username: "You",
        avatar: "/api/placeholder/32/32",
        role: "member",
      },
      reactions: {},
      replies: [],
    };

    onSubmit(post);

    // Reset form
    setContent("");
    setSentiment(null);
    setShowTickerSuggestions(false);
  };

  const getSentimentIcon = (sent: string | null) => {
    switch (sent) {
      case "bullish":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "neutral":
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSentimentColor = (sent: string | null) => {
    switch (sent) {
      case "bullish":
        return "border-green-500 bg-green-50 dark:bg-green-900/10";
      case "bearish":
        return "border-red-500 bg-red-50 dark:bg-red-900/10";
      case "neutral":
        return "border-gray-500 bg-gray-50 dark:bg-gray-800/50";
      default:
        return "border-gray-300 dark:border-gray-600";
    }
  };

  const highlightContent = (text: string) => {
    return text
      .replace(
        /(\$[A-Z]{1,5})/g,
        '<span style="color: #3b82f6; font-weight: 600;">$1</span>',
      )
      .replace(
        /(#\w+)/g,
        '<span style="color: #8b5cf6; font-weight: 600;">$1</span>',
      );
  };

  return (
    <TooltipProvider>
      <div
        className={`relative border-2 rounded-lg p-4 transition-all duration-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/20 ${getSentimentColor(sentiment)}`}
      >
        {/* New User Tooltip */}
        {showTooltip && (
          <div className="absolute -top-12 left-4 text-xs px-3 py-2 rounded-lg z-10 shadow-lg transition-all duration-200 bg-white dark:bg-black text-[#1E1E1E] dark:text-white border border-[#E0E0E0] dark:border-transparent">
            💡 Tip: Start typing and use $TICKER to tag a stock!
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-black"></div>
          </div>
        )}

        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Sentiment Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Market Sentiment:
                </span>
                <Select
                  value={sentiment || ""}
                  onValueChange={(value: any) => setSentiment(value)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(sentiment)}
                      <SelectValue placeholder="Required" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bullish">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span>Bullish</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="neutral">
                      <div className="flex items-center gap-2">
                        <Minus className="w-3 h-3 text-gray-500" />
                        <span>Neutral</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bearish">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        <span>Bearish</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Character Counter */}
              <div
                className={`text-sm font-medium ${
                  isOverLimit
                    ? "text-red-600 dark:text-red-400"
                    : isNearLimit
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {content.length} / {CHARACTER_LIMIT}
                {isOverLimit && (
                  <span className="ml-1 text-red-600">
                    <AlertCircle className="w-4 h-4 inline" />
                  </span>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder={placeholder}
                className={`min-h-[80px] resize-none transition-all duration-200 ${
                  isOverLimit
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (e.metaKey || e.ctrlKey) &&
                    canPost
                  ) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />

              {/* Live ticker suggestions */}
              {showTickerSuggestions && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-2">
                  <div className="text-xs text-gray-500 mb-1">
                    Trending Tickers:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tickerSuggestions.map((ticker) => (
                      <Button
                        key={ticker}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() => insertTicker(ticker)}
                      >
                        {ticker}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Post Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Quick Ticker Button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      <DollarSign className="w-3 h-3 mr-1" />
                      Tickers
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-3">
                    <div className="text-xs font-medium mb-2">
                      Popular Tickers:
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {TRENDING_TICKERS.slice(0, 9).map((ticker) => (
                        <Button
                          key={ticker}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const newContent =
                              content +
                              (content.endsWith(" ") ? "" : " ") +
                              ticker +
                              " ";
                            if (newContent.length <= CHARACTER_LIMIT) {
                              setContent(newContent);
                            }
                          }}
                        >
                          {ticker}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="text-xs text-gray-500">⌘+Enter to post</div>
              </div>

              <div className="flex items-center gap-2">
                {/* Error indicator */}
                {isOverLimit && (
                  <Badge variant="destructive" className="text-xs">
                    Over limit
                  </Badge>
                )}

                {/* Post Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleSubmit}
                      disabled={!canPost}
                      size="sm"
                      className={`h-8 px-4 transition-all duration-200 ${
                        canPost
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Post
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!content.trim() && "Write something to post"}
                    {content.trim() && !sentiment && "Select market sentiment"}
                    {isOverLimit && "Post is too long"}
                    {canPost && "Ready to post! (⌘+Enter)"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Preview of parsed content */}
            {content.trim() && (
              <div className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="font-medium mb-1">Preview:</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlightContent(content),
                  }}
                  className="leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
