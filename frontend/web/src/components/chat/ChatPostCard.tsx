import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  ThumbsUp,
  TrendingUp,
  TrendingDown,
  Star,
  Brain,
  AlertTriangle,
  Target,
  DollarSign,
  Reply,
  MoreHorizontal,
  Pin,
  Share,
  Copy,
  Flag,
  Crown,
  Shield,
  MessageSquare,
  Zap,
  Flame,
  Diamond,
  Rocket,
} from "lucide-react";
import { RoomMessage, TradeIdea } from "@/types/privateRooms";
import { getTimeAgo } from "@/data/privateRoomsMockData";

interface ChatPostCardProps {
  message: RoomMessage;
  currentUserId: string;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: RoomMessage) => void;
  onPin?: (messageId: string) => void;
  className?: string;
}

// Trade Signal Sub-component
const TradeSignalBlock: React.FC<{ tradeIdea: TradeIdea }> = ({ tradeIdea }) => {
  const { themeMode } = useMoodTheme();
  
  return (
    <div className={cn(
      "mt-3 p-4 rounded-lg border-2",
      themeMode === 'light' 
        ? 'bg-blue-50 border-blue-200' 
        : 'bg-blue-950/30 border-blue-800'
    )}>
      {/* Signal Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-500" />
          <span className={cn(
            "font-medium text-sm",
            themeMode === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            Trade Signal
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            className={cn(
              "text-xs font-medium border-0",
              tradeIdea.sentiment === "bullish" 
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            🟢 {tradeIdea.sentiment === "bullish" ? "BULLISH" : "BEARISH"}
          </Badge>
          
          <Badge variant="outline" className="text-xs">
            🕒 {tradeIdea.timeframe.toUpperCase()}
          </Badge>
          
          {/* Rating Stars */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < tradeIdea.confidence
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Signal Details - 2 Column Layout */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="w-3 h-3 text-green-500" />
          <span className={cn(
            "font-medium",
            themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
          )}>
            📍Entry: ${tradeIdea.entryPrice}
          </span>
        </div>
        
        {tradeIdea.targetPrice && (
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className={cn(
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              🎯Target: ${tradeIdea.targetPrice}
            </span>
          </div>
        )}
        
        {tradeIdea.stopLoss && (
          <div className="flex items-center gap-2">
            <TrendingDown className="w-3 h-3 text-red-500" />
            <span className={cn(
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              🛑 Stop: ${tradeIdea.stopLoss}
            </span>
          </div>
        )}
        
        {tradeIdea.strategy && (
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-purple-500" />
            <span className={cn(
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            )}>
              💼 Strategy: {tradeIdea.strategy}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatPostCard: React.FC<ChatPostCardProps> = ({
  message,
  currentUserId,
  onReaction,
  onReply,
  onPin,
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "premium":
        return <Crown className="w-3 h-3 text-purple-500" title="Premium" />;
      case "verified":
        return <Shield className="w-3 h-3 text-blue-500" title="Verified" />;
      case "admin":
        return <Star className="w-3 h-3 text-yellow-500" title="Admin" />;
      default:
        return null;
    }
  };

  const reactionButtons = [
    { emoji: "❤️", label: "Like", icon: Heart },
    { emoji: "💎", label: "Diamond Hands", icon: Diamond },
    { emoji: "🚀", label: "Rocket", icon: Rocket },
    { emoji: "⚠️", label: "Risky", icon: AlertTriangle },
    { emoji: "🧠", label: "Smart", icon: Brain },
  ];

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md border rounded-xl",
        themeMode === 'light'
          ? 'bg-white border-2 border-transparent bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 p-[2px] shadow-sm hover:shadow-lg'
          : 'bg-gray-900 border-gray-700 shadow-sm hover:shadow-lg',
        className
      )}
      style={{ 
        boxShadow: themeMode === 'light' 
          ? '0 2px 6px rgba(0,0,0,0.06)' 
          : '0 2px 6px rgba(0,0,0,0.3)'
      }}
    >
      <CardContent className={cn(
        "p-5 rounded-xl",
        themeMode === 'light' ? 'bg-white' : ''
      )}>
        {/* TOP SECTION - User Metadata + Message */}
        <div className="space-y-3">
          {/* User Info Row */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={message.userAvatar} alt={message.username} />
              <AvatarFallback className="text-sm font-medium">
                {message.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn(
                  "font-bold text-sm",
                  themeMode === 'light' ? 'text-gray-900' : 'text-white'
                )}>
                  {message.username}
                </span>
                
                {getUserRoleIcon(message.userRole)}
                
                {message.isPinned && (
                  <Pin className="w-3 h-3 text-yellow-500" title="Pinned" />
                )}
                
                <span className={cn(
                  "text-xs",
                  themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {getTimeAgo(message.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className={cn(
            "text-sm leading-relaxed break-words",
            themeMode === 'light' ? 'text-gray-800' : 'text-gray-200'
          )}>
            {message.content.split(" ").map((word, i) => {
              if (word.startsWith("$") && word.length > 1) {
                return (
                  <Badge 
                    key={i} 
                    className={cn(
                      "mx-1 text-xs font-medium rounded-full px-2 py-1",
                      themeMode === 'light' 
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    )}
                  >
                    {word}
                  </Badge>
                );
              }
              if (word.startsWith("@") && word.length > 1) {
                return (
                  <span key={i} className="mx-1 text-blue-600 dark:text-blue-400 font-medium">
                    {word}
                  </span>
                );
              }
              return word + " ";
            })}
          </div>

          {/* Trade Signal Block */}
          {message.tradeIdea && <TradeSignalBlock tradeIdea={message.tradeIdea} />}
        </div>

        {/* BOTTOM SECTION - Reactions & Controls */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Reaction Buttons */}
            <div className="flex items-center gap-1">
              {reactionButtons.map(({ emoji, label, icon: Icon }) => {
                const reaction = message.reactions.find(r => r.emoji === emoji);
                const isActive = reaction?.userReacted;
                
                return (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    onClick={() => onReaction(message.id, emoji)}
                    className={cn(
                      "h-8 px-2 text-xs transition-all duration-200 hover:scale-105",
                      isActive 
                        ? themeMode === 'light'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-blue-900/30 text-blue-400 hover:bg-blue-800/40'
                        : themeMode === 'light'
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-gray-800'
                    )}
                    title={label}
                  >
                    <span className="mr-1">{emoji}</span>
                    {reaction && reaction.count > 0 && (
                      <span className="font-medium">{reaction.count}</span>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(message)}
                className={cn(
                  "h-8 px-3 text-xs gap-1",
                  themeMode === 'light' 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-400 hover:bg-gray-800'
                )}
              >
                <Reply className="w-3 h-3" />
                Reply
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "h-8 w-8 p-0",
                      themeMode === 'light' 
                        ? 'text-gray-600 hover:bg-gray-100' 
                        : 'text-gray-400 hover:bg-gray-800'
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  {currentUserId === message.userId && onPin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onPin(message.id)}>
                        <Pin className="w-4 h-4 mr-2" />
                        {message.isPinned ? "Unpin" : "Pin"} Message
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatPostCard;
