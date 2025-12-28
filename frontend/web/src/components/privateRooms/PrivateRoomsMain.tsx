import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog } from "@/components/ui/dialog";
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
  Lock,
  Crown,
  Shield,
  MessageCircle,
  TrendingUp,
  Settings,
  Star,
  Zap,
  Filter,
  MoreHorizontal,
  Eye,
  Archive,
  UserPlus,
  Clock,
  Hash,
  AlertCircle,
} from "lucide-react";

import { PrivateRoom, User, UserLimits } from "@/types/privateRooms";
import {
  mockPrivateRooms,
  mockUsers,
  getUserLimits,
  getTimeAgo,
} from "@/data/privateRoomsMockData";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRoomsMainProps {
  onRoomSelect: (room: PrivateRoom) => void;
  onCreateRoom: () => void;
}

export const PrivateRoomsMain: React.FC<PrivateRoomsMainProps> = ({
  onRoomSelect,
  onCreateRoom,
}) => {
  const { user: currentUser } = useAuth();
  const [rooms, setRooms] = useState<PrivateRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "owned" | "joined">(
    "all",
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock current user with tier
  const mockCurrentUser: User = mockUsers[0]; // TechBull2024 (premium user)
  const userLimits = getUserLimits(mockCurrentUser.tier);

  useEffect(() => {
    // Filter rooms based on user access
    const userRooms = mockPrivateRooms.filter((room) => {
      if (room.type === "stocktwist") return true; // Everyone can see StockTwist
      return room.members.some(
        (member) => member.userId === mockCurrentUser.id,
      );
    });
    setRooms(userRooms);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tickers.some((ticker) =>
        ticker.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter = (() => {
      switch (filterType) {
        case "owned":
          return room.createdBy === mockCurrentUser.id;
        case "joined":
          return (
            room.members.some(
              (member) => member.userId === mockCurrentUser.id,
            ) && room.createdBy !== mockCurrentUser.id
          );
        default:
          return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  const userOwnedRooms = rooms.filter(
    (room) => room.createdBy === mockCurrentUser.id,
  ).length;
  const canCreateRoom = userOwnedRooms < userLimits.maxPrivateRooms;

  const getRoomIcon = (room: PrivateRoom) => {
    if (room.type === "stocktwist") {
      return <Zap className="w-5 h-5 text-yellow-500" />;
    }
    return room.createdBy === mockCurrentUser.id ? (
      <Crown className="w-5 h-5 text-purple-500" />
    ) : (
      <Lock className="w-5 h-5 text-blue-500" />
    );
  };

  const getRoomBadge = (room: PrivateRoom) => {
    if (room.type === "stocktwist") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
          Featured
        </Badge>
      );
    }
    if (room.createdBy === mockCurrentUser.id) {
      return (
        <Badge className="bg-purple-100 text-purple-800 text-xs">Owner</Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs">
        Member
      </Badge>
    );
  };

  const getSentimentColor = (tickers: string[]) => {
    // Mock sentiment calculation
    const avgSentiment = Math.random() * 100;
    if (avgSentiment >= 70) return "text-green-600";
    if (avgSentiment >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const RoomCard: React.FC<{ room: PrivateRoom }> = ({ room }) => (
    <Card
      className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600"
      onClick={() => onRoomSelect(room)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getRoomIcon(room)}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {room.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {room.description || "No description"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getRoomBadge(room)}
            {room.unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {room.unreadCount}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </DropdownMenuItem>
                {room.createdBy === mockCurrentUser.id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Room Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive Room
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tickers */}
        {room.tickers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {room.tickers.slice(0, 4).map((ticker) => (
              <Badge
                key={ticker}
                variant="outline"
                className={`text-xs ${getSentimentColor([ticker])}`}
              >
                ${ticker}
              </Badge>
            ))}
            {room.tickers.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{room.tickers.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* Room Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{room.members?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{room.messageCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(room.lastActivity)}</span>
            </div>
          </div>

          {room.type === "stocktwist" && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="h-3 w-3" />
              <span className="text-xs">Live</span>
            </div>
          )}
        </div>

        {/* Active Members Preview */}
        {room.members && room.members.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <div className="flex -space-x-2">
              {room.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member.userId}
                  className="h-6 w-6 border-2 border-white"
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">
                    {member.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {room.members.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    +{room.members.length - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {room.members.filter((m) => m.isOnline).length} online
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {filterType === "owned"
          ? "No rooms created yet"
          : filterType === "joined"
            ? "No joined rooms"
            : "No rooms found"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {filterType === "owned"
          ? "Create your first private watchlist room to start collaborating with fellow traders"
          : filterType === "joined"
            ? "Join rooms to participate in watchlist discussions"
            : "Try adjusting your search or filters"}
      </p>
      {filterType === "owned" && canCreateRoom && (
        <Button
          onClick={onCreateRoom}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Room
        </Button>
      )}
    </div>
  );

  const StatsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
          <div className="text-sm text-gray-600">Total Rooms</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {rooms.filter((r) => r.createdBy === mockCurrentUser.id).length}
          </div>
          <div className="text-sm text-gray-600">Owned</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {rooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Unread</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {rooms.reduce((sum, room) => sum + room.messageCount, 0)}
          </div>
          <div className="text-sm text-gray-600">Messages</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔐 Private Watchlist Rooms
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create invite-only discussion channels tied to your watchlist
            tickers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Room Button */}
          <Button
            onClick={onCreateRoom}
            disabled={!canCreateRoom}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>

          {/* User Limits Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {!canCreateRoom && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span>Limit reached</span>
              </div>
            )}
            <span>
              {userOwnedRooms}/{userLimits.maxPrivateRooms} rooms
            </span>
            {mockCurrentUser.tier !== "premium" && (
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                Upgrade for more
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search rooms, tickers, or descriptions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {filterType === "all"
                ? "All Rooms"
                : filterType === "owned"
                  ? "Owned"
                  : "Joined"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterType("all")}>
              <Hash className="h-4 w-4 mr-2" />
              All Rooms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("owned")}>
              <Crown className="h-4 w-4 mr-2" />
              Owned by Me
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("joined")}>
              <Users className="h-4 w-4 mr-2" />
              Joined Rooms
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Rooms List */}
      <ScrollArea className="h-[600px]">
        {filteredRooms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* User Tier Information */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mockCurrentUser.tier === "premium" ? (
                <Crown className="h-5 w-5 text-purple-500" />
              ) : mockCurrentUser.tier === "verified" ? (
                <Shield className="h-5 w-5 text-blue-500" />
              ) : (
                <Users className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium">
                  {mockCurrentUser.tier === "premium"
                    ? "Premium Account"
                    : mockCurrentUser.tier === "verified"
                      ? "Verified Account"
                      : "Free Account"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userLimits.maxPrivateRooms === -1
                    ? "Unlimited"
                    : userLimits.maxPrivateRooms}{" "}
                  private rooms •{" "}
                  {userLimits.maxJoinedRooms === -1
                    ? "Unlimited"
                    : userLimits.maxJoinedRooms}{" "}
                  joined rooms • {userLimits.maxRoomMembers} members per room
                </div>
              </div>
            </div>

            {mockCurrentUser.tier !== "premium" && (
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
