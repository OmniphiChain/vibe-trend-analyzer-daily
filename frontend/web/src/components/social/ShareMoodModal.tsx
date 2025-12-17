import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  Image as ImageIcon,
  BarChart3,
  X,
  Send,
  Plus,
  Brain,
  TrendingUp,
} from "lucide-react";

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
  score: number;
}

interface ShareMoodModalProps {
  trigger?: React.ReactNode;
  onMoodPost?: (moodPost: MoodPost) => void;
}

interface MoodPost {
  mood: MoodOption;
  content: string;
  tickers: string[];
  media?: {
    type: 'image' | 'chart';
    url: string;
    alt: string;
  };
  timestamp: Date;
}

const moodOptions: MoodOption[] = [
  { id: 'extreme-greed', label: 'Extreme Greed', emoji: '🤑', color: 'from-green-500 to-green-600', score: 90 },
  { id: 'greedy', label: 'Greedy', emoji: '💰', color: 'from-yellow-500 to-yellow-600', score: 70 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'from-gray-500 to-gray-600', score: 50 },
  { id: 'fearful', label: 'Fearful', emoji: '😰', color: 'from-orange-500 to-red-500', score: 30 },
  { id: 'extreme-fear', label: 'Extreme Fear', emoji: '😱', color: 'from-red-500 to-red-600', score: 10 },
];

const popularTickers = ['$TSLA', '$AAPL', '$NVDA', '$AMZN', '$GOOGL', '$MSFT'];

export const ShareMoodModal = ({ trigger, onMoodPost }: ShareMoodModalProps) => {
  const { themeMode } = useMoodTheme();
  const [open, setOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [content, setContent] = useState("");
  const [tickerInput, setTickerInput] = useState("");
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [media, setMedia] = useState<{ type: 'image' | 'chart'; url: string; alt: string } | null>(null);

  const addTicker = (ticker: string) => {
    const formattedTicker = ticker.startsWith('$') ? ticker : `$${ticker}`;
    if (!selectedTickers.includes(formattedTicker) && selectedTickers.length < 5) {
      setSelectedTickers([...selectedTickers, formattedTicker]);
      setTickerInput("");
    }
  };

  const removeTicker = (ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  };

  const handleSubmit = () => {
    if (!selectedMood || !content.trim()) return;

    const moodPost: MoodPost = {
      mood: selectedMood,
      content: content.trim(),
      tickers: selectedTickers,
      media,
      timestamp: new Date(),
    };

    onMoodPost?.(moodPost);
    
    // Reset form
    setSelectedMood(null);
    setContent("");
    setSelectedTickers([]);
    setMedia(null);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button 
      size="sm" 
      className={cn(
        "flex items-center gap-2",
        themeMode === 'light' 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
          : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
      )}
    >
      <Brain className="w-4 h-4" />
      Share Mood
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-md max-h-[90vh] overflow-y-auto",
        themeMode === 'light' ? 'bg-white' : 'bg-gray-900 border-gray-700'
      )}>
        <DialogHeader>
          <DialogTitle className={cn(
            "text-xl font-semibold",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            Share Your Mood
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Input */}
          <div>
            <Textarea
              placeholder="What's your market mood today? Share your thoughts on the latest moves..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "min-h-[100px] resize-none",
                themeMode === 'light' 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-gray-800 border-gray-600 text-white'
              )}
              maxLength={280}
            />
            <div className={cn(
              "text-xs mt-1 text-right",
              themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {content.length}/280
            </div>
          </div>

          {/* Mood Score Selection */}
          <div>
            <h3 className={cn(
              "text-sm font-medium mb-3",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Mood Score
            </h3>
            <div className="space-y-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={cn(
                    "w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                    selectedMood?.id === mood.id
                      ? `border-transparent bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105`
                      : themeMode === 'light'
                        ? 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                        : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
                  )}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="font-medium">{mood.label}</span>
                  <Badge variant="outline" className="ml-auto">
                    {mood.score}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Add Tickers */}
          <div>
            <h3 className={cn(
              "text-sm font-medium mb-3",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Add Tickers
            </h3>
            
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="TSLA, AAPL..."
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTicker(tickerInput);
                  }
                }}
                className={cn(
                  "flex-1",
                  themeMode === 'light' 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-gray-800 border-gray-600 text-white'
                )}
              />
              <Button 
                size="sm" 
                onClick={() => addTicker(tickerInput)}
                disabled={!tickerInput.trim() || selectedTickers.length >= 5}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Popular Tickers */}
            <div className="flex flex-wrap gap-1 mb-3">
              {popularTickers.map((ticker) => (
                <Button
                  key={ticker}
                  variant="outline"
                  size="sm"
                  onClick={() => addTicker(ticker)}
                  disabled={selectedTickers.includes(ticker) || selectedTickers.length >= 5}
                  className="text-xs"
                >
                  {ticker}
                </Button>
              ))}
            </div>

            {/* Selected Tickers */}
            {selectedTickers.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedTickers.map((ticker) => (
                  <Badge
                    key={ticker}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {ticker}
                    <button
                      onClick={() => removeTicker(ticker)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Media Upload */}
          <div>
            <h3 className={cn(
              "text-sm font-medium mb-3",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              Add Media (Optional)
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ImageIcon className="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                Chart
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedMood || !content.trim()}
              className={cn(
                "flex-1 flex items-center gap-2",
                themeMode === 'light' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
              )}
            >
              <Send className="w-4 h-4" />
              Post Mood
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Mood post component for displaying in chat
interface MoodPostDisplayProps {
  post: MoodPost;
  user: {
    username: string;
    avatar?: string;
  };
  onLike?: () => void;
  onComment?: () => void;
}

export const MoodPostDisplay = ({ post, user, onLike, onComment }: MoodPostDisplayProps) => {
  const { themeMode } = useMoodTheme();

  return (
    <div className={cn(
      "p-4 rounded-xl border space-y-3",
      themeMode === 'light' 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' 
        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600'
    )}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-medium text-sm",
              themeMode === 'light' ? 'text-gray-900' : 'text-white'
            )}>
              {user.username}
            </span>
            <Badge 
              className={cn(
                "text-xs bg-gradient-to-r text-white border-0",
                post.mood.color
              )}
            >
              {post.mood.emoji} {post.mood.label}
            </Badge>
          </div>
          <div className={cn(
            "text-xs",
            themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {post.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <p className={cn(
        "text-sm leading-relaxed",
        themeMode === 'light' ? 'text-gray-800' : 'text-gray-200'
      )}>
        {post.content}
      </p>

      {/* Tickers */}
      {post.tickers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tickers.map((ticker) => (
            <Badge key={ticker} variant="outline" className="text-xs">
              {ticker}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={onLike} className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          Like
        </Button>
        <Button variant="ghost" size="sm" onClick={onComment} className="text-xs">
          <Brain className="w-3 h-3 mr-1" />
          Discuss
        </Button>
      </div>
    </div>
  );
};
