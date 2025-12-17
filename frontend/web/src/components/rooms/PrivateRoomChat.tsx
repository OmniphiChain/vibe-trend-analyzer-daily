import React, { useState, useEffect, useRef } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Send,
  Smile,
  Pin,
  Reply,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Crown,
  Shield,
  AlertTriangle,
  Bot,
  Target,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PrivateRoom, RoomMessage, TradeIdea } from "@/types/rooms";
import {
  mockRoomMessages,
  parseCashtags,
  formatTradeIdea,
} from "@/data/roomsMockData";

interface PrivateRoomChatProps {
  room: PrivateRoom;
}

export const PrivateRoomChat: React.FC<PrivateRoomChatProps> = ({ room }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for the room
  useEffect(() => {
    const roomMessages = mockRoomMessages.filter(
      (msg) => msg.roomId === room.id,
    );
    setMessages(roomMessages);
  }, [room.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      // Simulate other users typing
      const timer = setTimeout(() => {
        setTypingUsers(["ChipWhisperer"]);
        setTimeout(() => setTypingUsers([]), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage, isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const cashtags = parseCashtags(newMessage);
    let tradeIdea: TradeIdea | undefined;

    // Enhanced trade idea detection
    const buyMatch = newMessage.match(/buy\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const sellMatch = newMessage.match(/sell\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const targetMatch = newMessage.match(/target\s+(\d+\.?\d*)/i);
    const slMatch = newMessage.match(/sl\s+(\d+\.?\d*)/i);

    if (buyMatch || sellMatch) {
      const match = buyMatch || sellMatch;
      tradeIdea = {
        ticker: match![1].toUpperCase(),
        action: buyMatch ? "buy" : "sell",
        entryPrice: parseFloat(match![2]),
        targetPrice: targetMatch ? parseFloat(targetMatch[1]) : undefined,
        stopLoss: slMatch ? parseFloat(slMatch[1]) : undefined,
        sentiment:
          newMessage.includes("📈") ||
          newMessage.toLowerCase().includes("bullish")
            ? "bullish"
            : newMessage.includes("📉") ||
                newMessage.toLowerCase().includes("bearish")
              ? "bearish"
              : "bullish",
        confidence: 3,
        timeframe: newMessage.toLowerCase().includes("swing")
          ? "swing"
          : newMessage.toLowerCase().includes("long")
            ? "long"
            : "day",
      };
    }

    const message: RoomMessage = {
      id: `msg-${Date.now()}`,
      roomId: room.id,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userRole: user.isPremium
        ? "premium"
        : user.isVerified
          ? "verified"
          : "member",
      content: newMessage.trim(),
      cashtags,
      sentiment: tradeIdea?.sentiment,
      tradeIdea,
      reactions: [],
      isPinned: false,
      type: tradeIdea ? "trade_idea" : "message",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setIsTyping(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            const userReacted = existingReaction.users.includes(user?.id || "");
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: userReacted ? r.count - 1 : r.count + 1,
                        users: userReacted
                          ? r.users.filter((id) => id !== user?.id)
                          : [...r.users, user?.id || ""],
                        userReacted: !userReacted,
                      }
                    : r,
                )
                .filter((r) => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  emoji,
                  count: 1,
                  users: [user?.id || ""],
                  userReacted: true,
                },
              ],
            };
          }
        }
        return msg;
      }),
    );
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case "premium":
        return <Crown className="h-3 w-3 text-purple-500" />;
      case "verified":
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTradeIdea = (tradeIdea: TradeIdea) => (
    <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <Target className="h-4 w-4 text-blue-500" />
        <span className="font-medium text-sm">Trade Signal</span>
        <Badge
          variant={
            tradeIdea.sentiment === "bullish" ? "default" : "destructive"
          }
          className="text-xs"
        >
          {tradeIdea.sentiment === "bullish" ? "📈 BULLISH" : "📉 BEARISH"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {tradeIdea.timeframe.toUpperCase()}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span>Entry: ${tradeIdea.entryPrice}</span>
        </div>
        {tradeIdea.targetPrice && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>Target: ${tradeIdea.targetPrice}</span>
          </div>
        )}
        {tradeIdea.stopLoss && (
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-red-500" />
            <span>Stop: ${tradeIdea.stopLoss}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Confidence: {tradeIdea.confidence}/5</span>
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: RoomMessage, index: number) => {
    const showAvatar =
      index === 0 ||
      messages[index - 1].userId !== message.userId ||
      message.createdAt.getTime() - messages[index - 1].createdAt.getTime() >
        5 * 60 * 1000;

    const isSystemMessage =
      message.type === "sentiment_alert" || message.userId === "system";

    if (isSystemMessage) {
      return (
        <div
          key={message.id}
          className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg mx-4 my-2"
        >
          <Bot className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            {message.content}
          </span>
          <span className="text-xs text-blue-500 ml-auto">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex gap-3 px-4 py-2 ${showAvatar ? "mt-4" : "mt-1"} group hover:bg-muted/30`}
      >
        <div className="w-10">
          {showAvatar && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={message.userAvatar} />
              <AvatarFallback>
                {message.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{message.username}</span>
              {getUserRoleIcon(message.userRole)}
              <span className="text-xs text-muted-foreground">
                {formatMessageTime(message.createdAt)}
              </span>
              {message.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
            </div>
          )}

          <div className="relative">
            <div className="text-sm leading-relaxed break-words">
              {message.content.split(" ").map((word, i) => {
                if (word.startsWith("$") && word.length > 1) {
                  return (
                    <Badge key={i} variant="outline" className="mx-1 text-xs">
                      {word}
                    </Badge>
                  );
                }
                return word + " ";
              })}
            </div>

            {message.tradeIdea && renderTradeIdea(message.tradeIdea)}

            {/* Message Actions */}
            <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 bg-background border rounded p-1 shadow-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleReaction(message.id, "📈")}
                >
                  📈
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleReaction(message.id, "📉")}
                >
                  📉
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleReaction(message.id, "🚀")}
                >
                  🚀
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Reactions */}
            {message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {message.reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReaction(message.id, reaction.emoji)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      reaction.userReacted
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[500px]">
          <div className="py-4">
            {messages.map((message, index) => renderMessage(message, index))}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span>
                  {typingUsers.join(", ")}{" "}
                  {typingUsers.length === 1 ? "is" : "are"} typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder={`Message ${room.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost">
              <Smile className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <strong>Format:</strong> Buy $TICKER at price / Target price / SL
          price 📈 Bullish • Use $SYMBOL for tickers • React with 📈📉🚀
        </div>
      </div>
    </>
  );
};
