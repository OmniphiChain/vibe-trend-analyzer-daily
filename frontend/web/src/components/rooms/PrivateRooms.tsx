import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Users,
  Settings,
  Crown,
  Shield,
  Hash,
  TrendingUp,
  TrendingDown,
  Bell,
  MoreHorizontal,
  Lock,
  Copy,
  UserPlus,
  Pin,
  Archive,
  Trash2,
  AlertTriangle,
  Clock,
  MessageSquare,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  mockPrivateRooms,
  mockUserLimits,
  mockPremiumUserLimits,
  getUserWatchlistTickers,
  canUserCreateRoom,
  mockWatchlistRooms,
} from "@/data/roomsMockData";
import { PrivateRoom, UserLimits, WatchlistRoom } from "@/types/rooms";
import { CreateRoomModal } from "./CreateRoomModal";
import { PrivateRoomChat } from "./PrivateRoomChat";
import { RoomSettingsModal } from "./RoomSettingsModal";
import { InviteUsersModal } from "./InviteUsersModal";
import { InviteManagementModal } from "./InviteManagementModal";
import { UserLimitsDisplay } from "./UserLimitsDisplay";

export const PrivateRooms: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState<PrivateRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [enhancedInviteOpen, setEnhancedInviteOpen] = useState(false);
  const [userLimits, setUserLimits] = useState<UserLimits>(mockUserLimits);
  const [watchlistTickers] = useState<string[]>(getUserWatchlistTickers());

  // Simulate user data loading
  useEffect(() => {
    if (isAuthenticated) {
      setRooms(mockPrivateRooms);
      // Set limits based on user subscription
      const limits = user?.isPremium ? mockPremiumUserLimits : mockUserLimits;
      setUserLimits(limits);

      // Auto-select first room if none selected
      if (mockPrivateRooms.length > 0 && !selectedRoom) {
        setSelectedRoom(mockPrivateRooms[0].id);
      }
    }
  }, [isAuthenticated, user, selectedRoom]);

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tickers.some((ticker) =>
        ticker.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const currentRoom = rooms.find((r) => r.id === selectedRoom);
  const isRoomAdmin = currentRoom?.createdBy === user?.id;
  const canCreateNewRoom = canUserCreateRoom(rooms.length, userLimits);

  const handleInviteSent = (
    method: "email" | "username" | "link",
    target: string,
  ) => {
    console.log(`Invite sent via ${method} to ${target}`);
    // Here you would implement the actual invite logic
    // This could involve API calls to send emails, create notifications, etc.
  };

  const handleCreateRoom = (roomData: any) => {
    const newRoom: PrivateRoom = {
      id: `room-${Date.now()}`,
      name: roomData.name,
      description: roomData.description,
      createdBy: user?.id || "",
      creatorName: user?.username || "",
      tickers: roomData.tickers,
      members: [
        {
          userId: user?.id || "",
          username: user?.username || "",
          avatar: user?.avatar,
          role: "admin",
          joinedAt: new Date(),
          isOnline: true,
          lastSeen: new Date(),
        },
      ],
      inviteToken: `inv-${roomData.name.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substr(2, 9)}`,
      tokenExpiry: new Date(Date.now() + 48 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastActivity: new Date(),
      isArchived: false,
      messageCount: 0,
      unreadCount: 0,
      settings: {
        isPrivate: true,
        allowReactions: true,
        allowThreads: true,
        alertOnSentimentChange: true,
        aiSummaryEnabled: false,
      },
    };

    setRooms((prev) => [newRoom, ...prev]);
    setSelectedRoom(newRoom.id);
    setCreateRoomOpen(false);
  };

  const handleCopyInviteLink = (room: PrivateRoom) => {
    const inviteUrl = `${window.location.origin}/invite/${room.inviteToken}`;
    navigator.clipboard.writeText(inviteUrl);
    // Show toast notification
  };

  const getTickerSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-600 bg-green-100";
    if (sentiment >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Private Rooms</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to create private watchlist rooms and chat with invited
              members.
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Private Rooms
                </CardTitle>
                <Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canCreateNewRoom}
                      title={
                        !canCreateNewRoom
                          ? `Limit: ${userLimits.maxPrivateRooms} rooms`
                          : ""
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <CreateRoomModal
                    onCreateRoom={handleCreateRoom}
                    watchlistTickers={watchlistTickers}
                    userLimits={userLimits}
                    existingRooms={rooms}
                    userId={user?.id || ""}
                  />
                </Dialog>
              </div>

              {/* User Limits Display */}
              <UserLimitsDisplay
                userId={user?.id || ""}
                userLimits={userLimits}
                existingRooms={rooms}
                isPremium={user?.isPremium}
                isVerified={user?.isVerified}
                onUpgrade={() => console.log("Upgrade to Premium!")}
              />

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
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedRoom === room.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted/50 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {room.name}
                            </span>
                            {room.createdBy === user?.id && (
                              <Crown className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {room.tickers.slice(0, 3).map((ticker) => (
                              <Badge
                                key={ticker}
                                variant="secondary"
                                className="text-xs"
                              >
                                ${ticker}
                              </Badge>
                            ))}
                            {room.tickers.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{room.tickers.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {room.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs opacity-75">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {room.members.length}
                        </div>
                        <span>{formatTimeAgo(room.lastActivity)}</span>
                      </div>
                    </div>
                  ))}

                  {filteredRooms.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No rooms found</p>
                    </div>
                  )}

                  {rooms.length === 0 && !searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Lock className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No private rooms yet</p>
                      <p className="text-xs mt-1">
                        Create your first watchlist room
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="col-span-3">
          {currentRoom ? (
            <Card className="h-full flex flex-col">
              {/* Room Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {currentRoom.name}
                        {isRoomAdmin && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentRoom.description}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {currentRoom.tickers.map((ticker) => (
                          <Badge
                            key={ticker}
                            variant="outline"
                            className="text-xs"
                          >
                            ${ticker}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {currentRoom.members.length} members
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEnhancedInviteOpen(true)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Members
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleCopyInviteLink(currentRoom)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Invite Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isRoomAdmin && (
                          <>
                            <DropdownMenuItem
                              onClick={() => setSettingsOpen(true)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Room Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Room
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Content */}
              <PrivateRoomChat room={currentRoom} />
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Room</h3>
                <p>
                  Choose a private room to start chatting with your watchlist
                  group
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      {currentRoom && (
        <>
          <RoomSettingsModal
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            room={currentRoom}
            isAdmin={isRoomAdmin}
          />
          <InviteUsersModal
            open={inviteOpen}
            onOpenChange={setInviteOpen}
            room={currentRoom}
            userLimits={userLimits}
          />

          {/* Enhanced Invite Management Modal */}
          <Dialog
            open={enhancedInviteOpen}
            onOpenChange={setEnhancedInviteOpen}
          >
            {currentRoom && (
              <InviteManagementModal
                room={currentRoom}
                userLimits={userLimits}
                onInviteSent={handleInviteSent}
              />
            )}
          </Dialog>
        </>
      )}
    </div>
  );
};
