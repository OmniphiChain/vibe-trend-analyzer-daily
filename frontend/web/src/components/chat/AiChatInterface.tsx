import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  TrendingUp,
  BarChart3,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAiChat } from "@/hooks/useAiChat";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  links?: { label: string; action: () => void }[];
}

export const AiChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useAiChat();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "assistant",
      content:
        "Hi! I'm your MoodMeter AI assistant, powered by DeepSeek. I can help you with:\n\n• Analyzing sentiment for specific tickers (e.g., \"What's the mood for $AAPL?\")\n• Summarizing FinTwits Social posts\n• Recommending watchlist additions based on trends\n• Providing detailed app guidance and market insights\n• Answering general financial questions\n\nWhat would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "What's the sentiment for $AAPL?",
        "Summarize recent posts about Tesla",
        "How do I use the Dashboard?",
        "Recommend trending stocks to watch",
      ],
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        links: response.links,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I'm sorry, I encountered an error while processing your request. This might be a temporary issue with the AI service. Please try again in a moment.",
        timestamp: new Date(),
        suggestions: [
          "Try asking again",
          "Check connection",
          "Get help with MoodMeter",
          "What can you help me with?",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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

  const quickActions = [
    { icon: TrendingUp, label: "Trending", query: "What's trending today?" },
    { icon: BarChart3, label: "Analytics", query: "How do I use Analytics?" },
    { icon: DollarSign, label: "Sentiment", query: "Check $AAPL sentiment" },
    { icon: HelpCircle, label: "Help", query: "How do I get started?" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 min-h-0 overflow-hidden">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] min-w-0 ${message.type === "user" ? "order-1" : ""}`}
              >
                <Card
                  className={`${
                    message.type === "user"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-muted border-muted"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="whitespace-pre-wrap text-sm break-words overflow-hidden">
                      {message.content}
                    </div>

                    {/* Suggestion Pills */}
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    {message.links && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.links.map((link, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={link.action}
                            className="h-7 text-xs"
                          >
                            {link.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div
                  className={`text-xs text-muted-foreground mt-1 ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {message.type === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center order-2">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <Card className="bg-muted border-muted">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 border-t bg-muted/30 flex-shrink-0">
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 text-xs overflow-hidden"
              onClick={() => handleSuggestionClick(action.query)}
            >
              <action.icon className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about MoodMeter..."
            className="flex-1 min-w-0"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
