import { useState, useEffect, useRef } from "react";
import {
  Hash,
  Lock,
  Users,
  Crown,
  Shield,
  Mic,
  MicOff,
  Settings,
  Plus,
  Search,
  Send,
  Smile,
  Pin,
  Reply,
  Heart,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  UserPlus,
  VolumeX,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockCommunityRooms,
  mockChatMessages,
  mockSocialProfiles,
} from "@/data/socialMockData";
import type { CommunityRoom, ChatMessage, SocialProfile } from "@/types/social";
import { UserCredibilityIndicator } from "@/components/moderation/CredibilityBadge";
import { FlagPostModal } from "@/components/moderation/FlagPostModal";
import { PostInteractionBar } from "./PostInteractionBar";
import { EnhancedCommunityMessage } from "./EnhancedCommunityMessage";
import { UserAvatar } from "./UserAvatar";
import { UsernameLink } from "./UsernameLink";
import { MentionText } from "./MentionText";
import { ProfileNavigationProvider, useProfileNavigation } from "./ProfileNavigationProvider";
import ChatSubcategory from "./ChatSubcategory";
import { moderationService } from "@/services/moderationService";
import type { CreateFlagData } from "@/types/moderation";

interface CommunityRoomsProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const CommunityRooms = ({ onNavigateToProfile }: CommunityRoomsProps) => {
  const { user, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<"rooms" | "chat">("rooms");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<CommunityRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load rooms
  useEffect(() => {
    setRooms(mockCommunityRooms);
    if (mockCommunityRooms.length > 0 && !selectedRoom) {
      setSelectedRoom(mockCommunityRooms[0].id);
    }
  }, [selectedRoom]);

  // Load messages for selected room
  useEffect(() => {
    if (selectedRoom) {
      const roomMessages = mockChatMessages.filter(
        (msg) => msg.roomId === selectedRoom,
      );
      setMessages(roomMessages);
    }
  }, [selectedRoom]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      const timer = setTimeout(() => setTypingUsers([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  const currentRoom = rooms.find((r) => r.id === selectedRoom);
  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !selectedRoom) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userRole: user.isPremium
        ? "premium"
        : user.isVerified
          ? "verified"
          : "member",
      content: newMessage.trim(),
      sentiment: "neutral",
      cashtags: [],
      hashtags: [],
      mentions: [],
      type: "chat",
      roomId: selectedRoom,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
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

  const handleFlag = async (flagData: CreateFlagData) => {
    try {
      await moderationService.submitFlag(flagData);
      console.log("Message flagged successfully");
    } catch (error) {
      console.error("Failed to flag message:", error);
      throw error;
    }
  };

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
    // In real app, call API to follow user
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
    // In real app, call API to unfollow user
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
    // In real app, call API to update alert preferences
  };

  const openFlagModal = (message: ChatMessage) => {
    setSelectedMessage(message);
    setFlagModalOpen(true);
  };

  const getRoomIcon = (room: CommunityRoom) => {
    if (room.isPrivate) return <Lock className="h-4 w-4" />;
    if (room.type === "ticker") return <Hash className="h-4 w-4" />;
    return <Hash className="h-4 w-4" />;
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3 text-red-500" />;
      case "moderator":
        return <Shield className="h-3 w-3 text-purple-500" />;
      case "verified":
        return <Shield className="h-3 w-3 text-blue-500" />;
      case "premium":
        return <Crown className="h-3 w-3 text-yellow-500" />;
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to access community rooms and chat with other traders.
            </p>
            <Button>Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-4 gap-6 h-[800px]">
        {/* Rooms Sidebar */}
        <div className="col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Community Rooms</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom === room.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex-shrink-0">{getRoomIcon(room)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {room.name}
                          </span>
                          {room.requiresVerification && (
                            <Shield className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {room.onlineCount} online
                        </div>
                      </div>

                      {room.onlineCount > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="col-span-3">
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentRoom && getRoomIcon(currentRoom)}
                  <div>
                    <h3 className="font-semibold">{currentRoom?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentRoom?.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {currentRoom?.memberCount.toLocaleString()} members
                  </Badge>

                  <Badge variant="secondary" className="text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                    {currentRoom?.onlineCount} online
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        Pinned Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Members
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <VolumeX className="h-4 w-4 mr-2" />
                        Mute Room
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Room Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[500px]">
                <div className="p-4 space-y-4">
                  {messages.map((message, index) => {
                    const showAvatar =
                      index === 0 ||
                      messages[index - 1].userId !== message.userId;
                    const isConsecutive =
                      index > 0 &&
                      messages[index - 1].userId === message.userId;

                    return (
                      <div
                        key={message.id}
                        className={isConsecutive ? "mt-1" : "mt-4"}
                      >
                        <EnhancedCommunityMessage
                          message={message}
                          showAvatar={showAvatar}
                          onReaction={handleReaction}
                          onFlag={openFlagModal}
                          onFollow={handleFollow}
                          onUnfollow={handleUnfollow}
                          onToggleAlerts={handleToggleAlerts}
                          onNavigateToProfile={onNavigateToProfile}
                          compact={false}
                        />
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    placeholder={`Message ${currentRoom?.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="resize-none"
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
                Use $SYMBOL for tickers, @username for mentions, #topic for
                hashtags
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Flag Modal */}
      {selectedMessage && (
        <FlagPostModal
          isOpen={flagModalOpen}
          onClose={() => setFlagModalOpen(false)}
          postId={selectedMessage.id}
          postContent={selectedMessage.content}
          postAuthor={selectedMessage.username}
          onSubmitFlag={handleFlag}
        />
      )}
    </div>
  );
};
