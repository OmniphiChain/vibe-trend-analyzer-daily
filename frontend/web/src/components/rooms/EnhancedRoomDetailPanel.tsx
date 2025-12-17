import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Hash,
  Pin,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Image,
  ChevronRight,
  Bell,
  BellOff,
  MessageCircle,
  Activity,
  Zap
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  category: string;
  categoryColor: string;
  membersOnline: number;
  totalMembers: number;
  messagesToday: number;
  activityTrend: number;
  sentiment: {
    type: 'bullish' | 'bearish' | 'neutral';
    percentage: number;
  };
  isJoined: boolean;
  pinnedMessage?: {
    id: string;
    author: string;
    content: string;
    timestamp: string;
  };
  recentMessages: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    hasMedia?: boolean;
    mediaThumbnail?: string;
  }>;
  topContributors: Array<{
    id: string;
    name: string;
    avatar: string;
    messageCount: number;
  }>;
  tags: string[];
}

interface EnhancedRoomDetailPanelProps {
  room: Room | null;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  onOpenRoom: (roomId: string) => void;
  onNavigateToProfile?: (userId: string) => void;
}

export const EnhancedRoomDetailPanel: React.FC<EnhancedRoomDetailPanelProps> = ({
  room,
  onClose,
  onJoinRoom,
  onOpenRoom,
  onNavigateToProfile
}) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  if (!room) return null;

  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'bearish': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSentimentIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-3 w-3" />;
      case 'bearish': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const handleJoinToggle = () => {
    if (room.isJoined) {
      onOpenRoom(room.id);
    } else {
      onJoinRoom(room.id);
    }
  };

  const extractHashtags = (text: string) => {
    const parts = text.split(/(\s|$)/);
    return parts.map((part, index) => {
      if (part.startsWith('#') || part.startsWith('$')) {
        return (
          <span 
            key={index}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 mx-0.5"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      
      {/* Enhanced Detail Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:static lg:inset-auto lg:z-auto lg:w-[360px] lg:h-auto">
        <Card 
          className="h-[90vh] lg:h-auto lg:max-h-[calc(100vh-100px)] overflow-hidden shadow-2xl"
          style={{ 
            background: "#10162A",
            borderLeft: "1px solid rgba(255, 255, 255, 0.06)"
          }}
        >
          {/* Enhanced Header */}
          <CardHeader className="pb-4" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {/* Room Icon - Enhanced */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-lg"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                    borderColor: "rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {room.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Room Name - Bold 20px */}
                  <h2 className="text-white font-bold text-xl mb-1 truncate">{room.name}</h2>
                  
                  {/* Subtitle/Tagline */}
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{room.tagline}</p>
                  
                  {/* Category + Sentiment Badges Side-by-Side */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      className={`text-xs px-3 py-1 font-medium rounded-full ${room.categoryColor}`}
                    >
                      {room.category}
                    </Badge>
                    
                    <Badge 
                      className={`text-xs px-3 py-1 font-medium rounded-full border ${getSentimentColor(room.sentiment.type)}`}
                    >
                      {getSentimentIcon(room.sentiment.type)}
                      <span className="ml-1.5">
                        {room.sentiment.type === 'bullish' ? 'Bullish' : 
                         room.sentiment.type === 'bearish' ? 'Bearish' : 'Neutral'} 
                        {room.sentiment.percentage}%
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Close (X) Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 h-9 w-9 rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Enhanced Stats Row - Three Mini Cards */}
              <div className="grid grid-cols-3 gap-3">
                <Card 
                  className="p-3 rounded-xl border transition-all hover:scale-105"
                  style={{ 
                    background: "#141A2B",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{room.membersOnline.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 font-medium">Online</div>
                  </div>
                </Card>
                
                <Card 
                  className="p-3 rounded-xl border transition-all hover:scale-105"
                  style={{ 
                    background: "#141A2B",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{room.messagesToday}</div>
                    <div className="text-xs text-gray-400 font-medium">Today</div>
                  </div>
                </Card>
                
                <Card 
                  className="p-3 rounded-xl border transition-all hover:scale-105"
                  style={{ 
                    background: "#141A2B",
                    borderColor: "rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {room.activityTrend > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-400" />
                      ) : room.activityTrend < 0 ? (
                        <ArrowDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      room.activityTrend > 0 ? 'text-green-400' : 
                      room.activityTrend < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {room.activityTrend > 0 ? '+' : ''}{room.activityTrend}%
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Activity</div>
                  </div>
                </Card>
              </div>

              {/* Enhanced Pinned Message Section */}
              {room.pinnedMessage && (
                <div className="space-y-3">
                  <Card 
                    className="rounded-xl overflow-hidden border-0"
                    style={{ 
                      background: "#141A2B",
                      borderTop: "3px solid #F59E0B",
                      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)"
                    }}
                  >
                    <CardContent className="p-4">
                      {/* Enhanced Pinned Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <Pin className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold text-sm">📌 Pinned Message</span>
                      </div>
                      
                      {/* Author + Timestamp */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-yellow-400">{room.pinnedMessage.author}</span>
                        <span className="text-xs text-gray-400">{room.pinnedMessage.timestamp}</span>
                      </div>
                      
                      {/* Message Content */}
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {extractHashtags(room.pinnedMessage.content)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Enhanced Recent Messages Preview */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                  Recent Messages
                </h3>
                <div className="space-y-3">
                  {room.recentMessages.slice(0, 4).map((message, index) => (
                    <Card 
                      key={message.id}
                      className={`p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                        index === 3 ? 'opacity-60' : ''
                      }`}
                      style={{ 
                        background: "#141A2B",
                        borderColor: "rgba(255, 255, 255, 0.06)"
                      }}
                      onClick={() => onNavigateToProfile?.(message.author.name)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Enhanced Avatar */}
                        <Avatar className="h-10 w-10 ring-2 ring-white/10">
                          <AvatarImage src={message.author.avatar} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {message.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          {/* Username + Sentiment + Timestamp */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-medium text-white truncate">
                              {message.author.name}
                            </span>
                            
                            {/* Sentiment Tag Inline */}
                            {message.sentiment && (
                              <Badge 
                                className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(message.sentiment)}`}
                              >
                                {message.sentiment}
                              </Badge>
                            )}
                            
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          
                          {/* Message Content with Hashtags */}
                          <p className="text-sm text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                            {extractHashtags(message.content)}
                          </p>
                          
                          {/* Media Preview */}
                          {message.hasMedia && (
                            <div className="flex items-center gap-1 text-xs text-blue-400">
                              <Image className="h-3 w-3" />
                              <span>Media attached</span>
                            </div>
                          )}
                        </div>
                        
                        {index === 3 && (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Enhanced Top Members Row */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Top Members Today
                </h3>
                <div className="flex items-center gap-3">
                  {room.topContributors.slice(0, 5).map((contributor, index) => (
                    <div 
                      key={contributor.id}
                      className="group relative cursor-pointer transition-all hover:scale-110"
                      onClick={() => onNavigateToProfile?.(contributor.id)}
                    >
                      <Avatar 
                        className={`h-12 w-12 ring-2 transition-all ${
                          index === 0 ? 'ring-yellow-400 shadow-lg shadow-yellow-400/30' : 
                          index === 1 ? 'ring-gray-300 shadow-lg shadow-gray-300/30' : 
                          index === 2 ? 'ring-orange-400 shadow-lg shadow-orange-400/30' : 'ring-white/20'
                        }`}
                      >
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {contributor.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Enhanced Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
                        <div className="font-medium">{contributor.name}</div>
                        <div className="text-gray-300">{contributor.messageCount} messages today</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                      </div>
                      
                      {/* Rank Badge */}
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-black' :
                          index === 1 ? 'bg-gray-300 text-black' :
                          'bg-orange-400 text-black'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Tags */}
              {room.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        className="text-xs bg-white/10 text-gray-300 hover:bg-white/20 cursor-pointer transition-all hover:scale-105 rounded-full px-3 py-1"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Enhanced CTA Button - Fixed at Bottom */}
          <div 
            className="p-4 border-t"
            style={{ 
              background: "#10162A",
              borderColor: "rgba(255, 255, 255, 0.06)"
            }}
          >
            {/* Big Join/Open Room CTA */}
            <Button
              onClick={handleJoinToggle}
              className={`w-full h-14 font-bold text-base rounded-xl transition-all duration-300 hover:scale-105 shadow-xl ${
                room.isJoined
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/30'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/30'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {room.isJoined ? (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    Open Room
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    Join & Start Chatting
                  </>
                )}
              </div>
            </Button>
            
            {/* Subtext */}
            <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
              {room.isJoined 
                ? 'Continue your conversation with the trading community'
                : 'Get instant updates and join real-time market discussions'
              }
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
