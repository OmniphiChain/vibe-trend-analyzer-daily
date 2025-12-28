import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Bold,
  Italic,
  Link,
  Image,
  Smile,
  Hash,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  Paperclip,
} from "lucide-react";

interface MessageComposerProps {
  onSubmit: (message: any) => void;
  placeholder?: string;
  replyTo?: any;
  onCancel?: () => void;
}

const EMOJI_LIST = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "🚀",
  "📈",
  "📉",
  "💎",
  "🐻",
  "🐂",
  "🔥",
  "💯",
  "👍",
  "👎",
  "🎯",
];

const TICKER_SUGGESTIONS = [
  "$TSLA",
  "$NVDA",
  "$AAPL",
  "$MSFT",
  "$GOOGL",
  "$AMZN",
  "$META",
  "$SPY",
  "$QQQ",
];

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSubmit,
  placeholder = "Share your market insights... Use $TICKER for stocks",
  replyTo,
  onCancel,
}) => {
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">(
    "neutral",
  );
  const [timeframe, setTimeframe] = useState<"day" | "swing" | "long">("swing");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [tickerSuggestions, setTickerSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Auto-detect cashtags for suggestions
    const lastWord = value.split(/\s+/).pop() || "";
    if (lastWord.startsWith("$") && lastWord.length > 1) {
      const filtered = TICKER_SUGGESTIONS.filter((ticker) =>
        ticker.toLowerCase().includes(lastWord.toLowerCase()),
      );
      setTickerSuggestions(filtered);
    } else {
      setTickerSuggestions([]);
    }
  };

  const insertText = (text: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent =
      content.substring(0, start) + text + content.substring(end);
    setContent(newContent);

    // Focus back and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + text.length,
          start + text.length,
        );
      }
    }, 0);
  };

  const insertFormatting = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const formattedText = `${before}${selectedText}${after}`;

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Focus back and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = selectedText
          ? start + formattedText.length
          : start + before.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    // Parse cashtags
    const cashtags = content.match(/\$[A-Z]{1,5}/g) || [];

    const message = {
      id: Date.now().toString(),
      content: content.trim(),
      sentiment,
      timeframe,
      cashtags,
      timestamp: new Date(),
      replyTo: replyTo?.id,
      user: {
        username: "You",
        avatar: "/api/placeholder/32/32",
        role: "member",
      },
      reactions: {},
      replies: [],
    };

    onSubmit(message);
    setContent("");
    setSentiment("neutral");
    setTimeframe("swing");
  };

  const getSentimentColor = (sent: string) => {
    switch (sent) {
      case "bullish":
        return "text-green-600 bg-green-50 border-green-200";
      case "bearish":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSentimentIcon = (sent: string) => {
    switch (sent) {
      case "bullish":
        return <TrendingUp className="w-3 h-3" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
      {replyTo && (
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
          <span className="text-gray-600 dark:text-gray-400">Replying to </span>
          <span className="font-medium">{replyTo.user.username}</span>
          <p className="text-gray-500 dark:text-gray-400 truncate">
            {replyTo.content}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src="/api/placeholder/32/32" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 pb-2 border-b border-gray-200 dark:border-gray-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting("**", "**")}
              className="h-7 w-7 p-0"
              title="Bold"
            >
              <Bold className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting("*", "*")}
              className="h-7 w-7 p-0"
              title="Italic"
            >
              <Italic className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting("[", "](url)")}
              className="h-7 w-7 p-0"
              title="Link"
            >
              <Link className="w-3 h-3" />
            </Button>

            {/* Cashtag Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  title="Insert Ticker"
                >
                  <DollarSign className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="text-xs font-medium mb-2">Popular Tickers</div>
                <div className="grid grid-cols-3 gap-1">
                  {TICKER_SUGGESTIONS.map((ticker) => (
                    <Button
                      key={ticker}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => insertText(ticker + " ")}
                    >
                      {ticker}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Emoji Picker */}
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  title="Add Emoji"
                >
                  <Smile className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI_LIST.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-sm"
                      onClick={() => {
                        insertText(emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              title="Attach Image"
            >
              <Paperclip className="w-3 h-3" />
            </Button>
          </div>

          {/* Message Input */}
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* Ticker Suggestions */}
          {tickerSuggestions.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tickerSuggestions.map((ticker) => (
                <Button
                  key={ticker}
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => {
                    const words = content.split(/\s+/);
                    words[words.length - 1] = ticker;
                    setContent(words.join(" ") + " ");
                    setTickerSuggestions([]);
                    textareaRef.current?.focus();
                  }}
                >
                  {ticker}
                </Button>
              ))}
            </div>
          )}

          {/* Sentiment and Timeframe */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Sentiment:
              </span>
              <div className="flex gap-1">
                {["bullish", "neutral", "bearish"].map((sent) => (
                  <Button
                    key={sent}
                    variant={sentiment === sent ? "default" : "outline"}
                    size="sm"
                    className={`h-6 text-xs px-2 ${sentiment === sent ? getSentimentColor(sent) : ""}`}
                    onClick={() => setSentiment(sent as any)}
                  >
                    {getSentimentIcon(sent)}
                    <span className="ml-1 capitalize">{sent}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Timeframe:
              </span>
              <Select
                value={timeframe}
                onValueChange={(value: any) => setTimeframe(value)}
              >
                <SelectTrigger className="h-6 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="swing">Swing</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ⌘+Enter to send • Markdown supported
            </div>
            <div className="flex gap-2">
              {replyTo && onCancel && (
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-3 h-3 mr-1" />
                {replyTo ? "Reply" : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
