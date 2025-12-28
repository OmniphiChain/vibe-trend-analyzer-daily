import React, { useState, useEffect } from "react";
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
  CheckCircle,
  XCircle,
  EyeOff,
} from "lucide-react";
import { RoomMessage, TradeIdea } from "@/types/privateRooms";
import { getTimeAgo } from "@/data/privateRoomsMockData";
import { CredibilityBadge, UserCredibilityIndicator } from "@/components/moderation/CredibilityBadge";
import { FlagPostModal } from "@/components/moderation/FlagPostModal";
import { moderationService, getMockCredibility } from "@/services/moderationService";
import type { PostCredibility, CreateFlagData, SpamDetectionResult } from "@/types/moderation";
import type { SocialPost } from "@/types/social";

interface EnhancedChatPostCardProps {
  message: RoomMessage;
  currentUserId: string;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: RoomMessage) => void;
  onPin?: (messageId: string) => void;
  onFlag?: (flagData: CreateFlagData) => Promise<void>;
  showModerationFeatures?: boolean;
  isModerator?: boolean;
  className?: string;
}

// Trade Signal Sub-component (same as original)
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

export const EnhancedChatPostCard: React.FC<EnhancedChatPostCardProps> = ({
  message,
  currentUserId,
  onReaction,
  onReply,
  onPin,
  onFlag,
  showModerationFeatures = true,
  isModerator = false,
  className,
}) => {
  const { themeMode } = useMoodTheme();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [credibility, setCredibility] = useState<PostCredibility | null>(null);
  const [spamDetection, setSpamDetection] = useState<SpamDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Convert RoomMessage to SocialPost for moderation analysis
  const convertToSocialPost = (msg: RoomMessage): SocialPost => ({
    id: msg.id,
    userId: msg.userId,
    username: msg.username,
    userAvatar: msg.userAvatar,
    userRole: msg.userRole,
    content: msg.content || '', // Ensure content is never undefined
    sentiment: msg.sentiment || "neutral",
    cashtags: msg.cashtags || [],
    hashtags: [],
    mentions: msg.mentions || [],
    type: "chat",
    likes: 0, // RoomMessage uses reactions instead
    comments: 0,
    shares: 0,
    bookmarks: 0,
    createdAt: msg.createdAt,
    updatedAt: msg.createdAt, // Use createdAt if updatedAt doesn't exist
    roomId: msg.roomId,
  });

  // Analyze post on mount
  useEffect(() => {
    if (showModerationFeatures) {
      const analyzePost = async () => {
        setIsAnalyzing(true);
        try {
          // Validate message has required content
          if (!message || !message.content) {
            console.warn("Message or content is missing, skipping analysis");
            return;
          }

          const socialPost = convertToSocialPost(message);

          // Get credibility score
          const credResult = await moderationService.calculateCredibility(socialPost);
          setCredibility(credResult);

          // Run spam detection
          const spamResult = await moderationService.analyzeSpam(socialPost);
          setSpamDetection(spamResult);
        } catch (error) {
          console.error("Failed to analyze post:", error);
          // Fallback to mock data
          setCredibility(getMockCredibility(message.id));
        } finally {
          setIsAnalyzing(false);
        }
      };

      analyzePost();
    }
  }, [message.id, showModerationFeatures]);
  
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

  const handleFlag = async (flagData: CreateFlagData) => {
    try {
      if (onFlag) {
        await onFlag(flagData);
      } else {
        await moderationService.submitFlag(flagData);
      }
    } catch (error) {
      console.error("Failed to submit flag:", error);
      throw error;
    }
  };

  const reactionButtons = [
    { emoji: "❤️", label: "Like", icon: Heart },
    { emoji: "💎", label: "Diamond Hands", icon: Diamond },
    { emoji: "🚀", label: "Rocket", icon: Rocket },
    { emoji: "⚠️", label: "Risky", icon: AlertTriangle },
    { emoji: "🧠", label: "Smart", icon: Brain },
  ];

  // Check if post is hidden due to spam detection
  const isHidden = spamDetection?.isSpam && spamDetection.confidence > 0.8;
  const hasWarnings = spamDetection && (
    spamDetection.riskScore > 50 || 
    spamDetection.riskFlags.length > 0
  );

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md border rounded-xl",
          isHidden && "opacity-50 border-red-300 dark:border-red-700",
          hasWarnings && !isHidden && "border-yellow-300 dark:border-yellow-700",
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
          {/* Hidden Content Warning */}
          {isHidden && (
            <div className={cn(
              "mb-4 p-3 rounded-lg border border-red-200 dark:border-red-800",
              "bg-red-50 dark:bg-red-900/20"
            )}>
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <EyeOff className="w-4 h-4" />
                <span className="text-sm font-medium">Content Hidden - Potential Spam</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                This content was automatically hidden due to spam detection. 
                Confidence: {Math.round((spamDetection?.confidence || 0) * 100)}%
              </p>
            </div>
          )}

          {/* Moderation Warnings */}
          {hasWarnings && !isHidden && (
            <div className={cn(
              "mb-4 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800",
              "bg-yellow-50 dark:bg-yellow-900/20"
            )}>
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Content Warning</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {spamDetection?.riskFlags.map((flag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
                  
                  {/* User Credibility Indicator */}
                  {showModerationFeatures && credibility && (
                    <UserCredibilityIndicator 
                      level={credibility.level}
                      score={credibility.score}
                      compact
                    />
                  )}
                  
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

              {/* Credibility Score Badge */}
              {showModerationFeatures && credibility && (
                <CredibilityBadge 
                  credibility={credibility}
                  variant="compact"
                />
              )}
            </div>

            {/* Message Content */}
            <div className={cn(
              "text-sm leading-relaxed break-words",
              isHidden && "blur-sm",
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
                    
                    {/* Moderation Actions for Moderators */}
                    {isModerator && (
                      <>
                        <DropdownMenuItem className="text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          <XCircle className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem 
                      className="text-red-600 dark:text-red-400"
                      onClick={() => setFlagModalOpen(true)}
                    >
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

      {/* Flag Modal */}
      <FlagPostModal
        isOpen={flagModalOpen}
        onClose={() => setFlagModalOpen(false)}
        postId={message.id}
        postContent={message.content}
        postAuthor={message.username}
        onSubmitFlag={handleFlag}
      />
    </>
  );
};

export default EnhancedChatPostCard;
