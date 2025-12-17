import { useState, useRef, useCallback } from "react";
import {
  Send,
  Image,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Hash,
  AtSign,
  X,
  Smile,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import type { SentimentType, CreatePostData } from "@/types/social";

interface PostComposerProps {
  onSubmit: (postData: CreatePostData) => void;
  placeholder?: string;
  roomId?: string;
  replyToId?: string;
  maxLength?: number;
  compact?: boolean;
}

export const PostComposer = ({
  onSubmit,
  placeholder = "What's happening in the markets?",
  roomId,
  replyToId,
  maxLength = 280,
  compact = false,
}: PostComposerProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<SentimentType>("neutral");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedCashtags, setDetectedCashtags] = useState<string[]>([]);
  const [detectedHashtags, setDetectedHashtags] = useState<string[]>([]);
  const [detectedMentions, setDetectedMentions] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cashtag detection regex patterns
  const CASHTAG_REGEX = /\$([A-Z]{1,10})\b/g;
  const HASHTAG_REGEX = /#([a-zA-Z0-9_]+)/g;
  const MENTION_REGEX = /@([a-zA-Z0-9_]+)/g;

  // Parse content for cashtags, hashtags, and mentions
  const parseContent = useCallback((text: string) => {
    const cashtags = Array.from(text.matchAll(CASHTAG_REGEX), (m) => m[1]);
    const hashtags = Array.from(text.matchAll(HASHTAG_REGEX), (m) => m[1]);
    const mentions = Array.from(text.matchAll(MENTION_REGEX), (m) => m[1]);

    setDetectedCashtags([...new Set(cashtags)]);
    setDetectedHashtags([...new Set(hashtags)]);
    setDetectedMentions([...new Set(mentions)]);
  }, []);

  // Handle content change
  const handleContentChange = (value: string) => {
    if (value.length <= maxLength) {
      setContent(value);
      parseContent(value);
    }
  };

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedImages((prev) => [...prev, ...imageFiles].slice(0, 4)); // Max 4 images
  };

  // Remove selected image
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!user || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const postData: CreatePostData = {
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        userRole: user.isPremium
          ? "premium"
          : user.isVerified
            ? "verified"
            : "member",
        content: content.trim(),
        sentiment,
        cashtags: detectedCashtags,
        hashtags: detectedHashtags,
        mentions: detectedMentions,
        type: roomId ? "chat" : "twit",
        images: [], // Would handle image upload in real implementation
        roomId,
        replyToId,
      };

      await onSubmit(postData);

      // Reset form
      setContent("");
      setSentiment("neutral");
      setSelectedImages([]);
      setDetectedCashtags([]);
      setDetectedHashtags([]);
      setDetectedMentions([]);
    } catch (error) {
      console.error("Failed to submit post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Insert cashtag at cursor
  const insertCashtag = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.slice(0, start) + `$${symbol} ` + content.slice(end);

    handleContentChange(newContent);

    // Reset cursor position
    setTimeout(() => {
      const newPosition = start + symbol.length + 2;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  // Popular tickers for quick insertion - Top 10 only
  const popularTickers = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA", "AMZN", "META", "NFLX", "SPY", "QQQ"];

  // Emoji shortcodes
  const quickEmojis = ["🚀", "📈", "📉", "💎", "🔥", "💰", "⚡", "🌙"];

  const getSentimentColor = (sentimentType: SentimentType) => {
    switch (sentimentType) {
      case "bullish":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "bearish":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getSentimentIcon = (sentimentType: SentimentType) => {
    switch (sentimentType) {
      case "bullish":
        return <TrendingUp className="h-4 w-4" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Sign in to share your market insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        {/* User Avatar and Input */}
        <div className="flex gap-3">
          <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>
              {(user.firstName?.[0] || user.username[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Text Input */}
            <Textarea
              ref={textareaRef}
              placeholder={placeholder}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`resize-none border-0 p-0 focus-visible:ring-0 text-lg placeholder:text-muted-foreground ${
                compact ? "min-h-[60px]" : "min-h-[120px]"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            {/* Character Count */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                {content.length}/{maxLength}
              </span>
              {content.length > maxLength * 0.8 && (
                <span
                  className={
                    content.length > maxLength
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {maxLength - content.length} characters remaining
                </span>
              )}
            </div>

            {/* Detected Tags */}
            {(detectedCashtags.length > 0 ||
              detectedHashtags.length > 0 ||
              detectedMentions.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {detectedCashtags.map((tag, index) => (
                  <Badge
                    key={`cash-${index}`}
                    variant="secondary"
                    className="text-blue-600"
                  >
                    ${tag}
                  </Badge>
                ))}
                {detectedHashtags.map((tag, index) => (
                  <Badge
                    key={`hash-${index}`}
                    variant="outline"
                    className="text-purple-600"
                  >
                    #{tag}
                  </Badge>
                ))}
                {detectedMentions.map((tag, index) => (
                  <Badge
                    key={`mention-${index}`}
                    variant="outline"
                    className="text-green-600"
                  >
                    @{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Selected Images Preview */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Ticker Insertion */}
            {!compact && content.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Quick insert:</p>
                <div className="flex flex-wrap gap-2">
                  {popularTickers.map((ticker) => (
                    <Button
                      key={ticker}
                      variant="outline"
                      size="sm"
                      onClick={() => insertCashtag(ticker)}
                      className="h-7 text-xs"
                    >
                      ${ticker}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {/* Image Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4 text-blue-500" />
            </Button>

            {/* Emoji Picker */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-8 w-8 p-0"
              >
                <Smile className="h-4 w-4 text-yellow-500" />
              </Button>

              {showEmojiPicker && (
                <div className="absolute top-10 left-0 z-10 bg-background border rounded-lg p-2 shadow-lg">
                  <div className="grid grid-cols-4 gap-1">
                    {quickEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => {
                          handleContentChange(content + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hashtag */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newContent = content + "#";
                handleContentChange(newContent);
                textareaRef.current?.focus();
              }}
              className="h-8 w-8 p-0"
            >
              <Hash className="h-4 w-4 text-purple-500" />
            </Button>

            {/* Mention */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newContent = content + "@";
                handleContentChange(newContent);
                textareaRef.current?.focus();
              }}
              className="h-8 w-8 p-0"
            >
              <AtSign className="h-4 w-4 text-green-500" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {/* Sentiment Selection */}
            <Select
              value={sentiment}
              onValueChange={(value: SentimentType) => setSentiment(value)}
            >
              <SelectTrigger className="w-auto h-8">
                <SelectValue>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getSentimentColor(sentiment)}`}
                  >
                    {getSentimentIcon(sentiment)}
                    <span className="capitalize">{sentiment}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bullish">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>Bullish</span>
                  </div>
                </SelectItem>
                <SelectItem value="bearish">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span>Bearish</span>
                  </div>
                </SelectItem>
                <SelectItem value="neutral">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <span>Neutral</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={
                !content.trim() || isSubmitting || content.length > maxLength
              }
              size="sm"
              className="h-8"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">{roomId ? "Send" : "Post"}</span>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        {!compact && content.length === 0 && (
          <div className="text-xs text-muted-foreground">
            <p>
              💡 Use <code>$SYMBOL</code> for stocks/crypto,{" "}
              <code>#hashtags</code> for topics, <code>@username</code> for
              mentions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
