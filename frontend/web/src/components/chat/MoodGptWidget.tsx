import { useState, useEffect, useRef } from "react";
import { Brain, X, Minimize2, Send, Bot, User, Loader2, TrendingUp, DollarSign, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { useAiChat } from "@/hooks/useAiChat";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const PRESET_PROMPTS = [
  {
    icon: TrendingUp,
    label: "Top Bullish Stocks",
    query: "What are the top bullish stocks based on current sentiment data?"
  },
  {
    icon: DollarSign,
    label: "Crypto Sentiment Summary", 
    query: "Give me a summary of current crypto sentiment across major coins"
  },
  {
    icon: BarChart3,
    label: "Check Watchlist Mood",
    query: "Analyze the sentiment mood for my current watchlist tickers"
  }
];

export const MoodGptWidget = () => {
  const { themeMode } = useMoodTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useAiChat();

  // Load chat session from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('moodgpt-chat-session');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) })));
      } catch (error) {
        console.error('Failed to load chat session:', error);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('moodgpt-chat-session', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm Mood GPT, your AI Market Companion! 🧠✨\n\nI'm trained on MoodMeter's sentiment data, watchlist analytics, and market insights to help you make informed trading decisions.\n\n💡 **What I can help you with:**\n• Real-time sentiment analysis for any ticker\n• Watchlist mood tracking and alerts  \n• Crypto market sentiment summaries\n• Trading strategy insights\n• Market trend analysis\n• Portfolio optimization suggestions\n\n🚀 **Try asking me:**\n\"What's the mood for $AAPL?\"\n\"Show me the most bullish crypto\"\n\"How should I diversify my portfolio?\"\n\nOr use the quick action buttons below!",
      timestamp: new Date(),
      suggestions: [
        "What's the sentiment for $TSLA today?",
        "Show me the most bullish sectors",
        "How is crypto performing this week?",
        "Analyze my watchlist mood",
        "Give me a market overview",
        "Help me with trading strategy"
      ],
    };
    setMessages([welcomeMessage]);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeWidget = () => {
    setIsMinimized(true);
  };

  const closeWidget = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Mood GPT error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment, or use one of the preset prompts below.",
        timestamp: new Date(),
        suggestions: [
          "Try again",
          "Check top bullish stocks",
          "Get crypto sentiment",
          "What can you help with?",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetPrompt = (query: string) => {
    setInputValue(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    localStorage.removeItem('moodgpt-chat-session');
    setMessages([]);
    initializeWelcomeMessage();
  };

  return (
    <>
      {/* Floating Assistant Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleWidget}
            size="lg"
            className={cn(
              "relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border-2",
              "hover:scale-105 active:scale-95",
              themeMode === 'light'
                ? "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-purple-500/30"
                : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-purple-400/40"
            )}
            aria-label="Open Mood GPT Assistant"
          >
            <Brain className="h-6 w-6 text-white drop-shadow-sm" />
            <Sparkles className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 text-yellow-300 animate-pulse" />
          </Button>
        </div>
      )}

      {/* Chat Panel - Sliding from right */}
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 pointer-events-none",
            "animate-in fade-in-0 duration-300"
          )}
        >
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto md:pointer-events-none"
            onClick={closeWidget}
          />

          {/* Chat Panel */}
          <div
            className={cn(
              "absolute right-2 bottom-20 w-[calc(100vw-16px)] max-w-sm max-h-[calc(100vh-96px)] md:right-0 md:bottom-auto md:top-0 md:w-[400px] md:h-full md:max-h-none md:max-w-none pointer-events-auto",
              "animate-in slide-in-from-right-0 duration-300",
              isMinimized && "h-auto"
            )}
          >
            <Card
              className={cn(
                "h-full flex flex-col shadow-xl border-0 overflow-hidden",
                "rounded-l-2xl md:rounded-l-xl rounded-r-none",
                themeMode === 'light'
                  ? "bg-white"
                  : "bg-gray-950"
              )}
            >
              {/* Header */}
              <div className={cn(
                "flex items-center justify-between p-3 border-b flex-shrink-0",
                "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm flex items-center gap-1.5">
                      Mood GPT
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs py-0 px-1.5">
                        Live
                      </Badge>
                    </h3>
                    <p className="text-xs opacity-85">AI Market Companion</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {!isMinimized && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={minimizeWidget}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Minimize chat"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeWidget}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              {!isMinimized && (
                <>
                  {/* Preset Prompt Buttons */}
                  <div className={cn(
                    "px-3 py-2 border-b flex-shrink-0",
                    themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-900/30 border-gray-800'
                  )}>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PROMPTS.map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePresetPrompt(prompt.query)}
                          className={cn(
                            "h-8 text-xs font-medium transition-all hover:scale-105 rounded-full px-3",
                            themeMode === 'light'
                              ? "border-purple-200 text-purple-700 bg-white hover:bg-purple-50"
                              : "border-purple-500/30 text-purple-300 bg-transparent hover:bg-purple-500/20"
                          )}
                        >
                          <prompt.icon className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{prompt.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 px-3 py-3 min-h-0">
                    <div className="space-y-2.5">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                            message.type === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          {message.type === "assistant" && (
                            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}

                          <div className={cn(
                            "max-w-[80%] min-w-0",
                            message.type === "user" ? "order-1" : ""
                          )}>
                            <div
                              className={cn(
                                "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                                message.type === "user"
                                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none"
                                  : themeMode === 'light'
                                    ? "bg-gray-100 text-gray-900 rounded-bl-none"
                                    : "bg-gray-800/60 text-gray-100 rounded-bl-none"
                              )}
                            >
                              <div className="whitespace-pre-wrap break-words">
                                {message.content}
                              </div>

                              {/* Suggestion Pills */}
                              {message.suggestions && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {message.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSuggestionClick(suggestion)}
                                      className={cn(
                                        "text-xs px-2 py-1 rounded-full transition-all hover:scale-105 font-medium",
                                        message.type === "user"
                                          ? "bg-white/20 text-white hover:bg-white/30"
                                          : themeMode === 'light'
                                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                            : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                      )}
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className={cn(
                              "text-xs mt-0.5 px-1 opacity-70",
                              message.type === "user" ? "text-right" : "text-left"
                            )}>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          {message.type === "user" && (
                            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center order-2 bg-gradient-to-br from-gray-600 to-gray-700 shadow-sm">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Loading indicator */}
                      {isLoading && (
                        <div className="flex gap-2 justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                          <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className={cn(
                            "rounded-2xl px-3 py-2 rounded-bl-none",
                            themeMode === 'light' ? 'bg-gray-100' : 'bg-gray-800/60'
                          )}>
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin text-purple-500" />
                              <span className="text-xs text-gray-500">Analyzing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Input Area */}
                  <div className={cn(
                    "p-2.5 border-t flex-shrink-0",
                    themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900/30 border-gray-800'
                  )}>
                    <div className="flex gap-1.5">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me something..."
                        className={cn(
                          "flex-1 min-w-0 h-10 text-sm rounded-full px-4",
                          themeMode === 'light'
                            ? "bg-gray-100 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                            : "bg-gray-800 border-gray-700 focus:border-purple-400 focus:ring-purple-500/30"
                        )}
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        size="sm"
                        className={cn(
                          "px-3 h-10 flex-shrink-0 rounded-full",
                          themeMode === 'light'
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        )}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <button
                      onClick={clearChat}
                      className={cn(
                        "text-xs mt-1.5 px-2 py-0.5 hover:opacity-80 transition-opacity",
                        themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
                      )}
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
