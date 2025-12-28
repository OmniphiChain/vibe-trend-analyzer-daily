import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  Users,
  MessageCircle,
  Plus,
  TrendingUp,
  Star,
  Lock,
  Hash,
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: "private";
  tickers: string[];
  memberCount: number;
  unreadCount: number;
  lastActivity: Date;
  isOwner: boolean;
}

interface RoomSelectorProps {
  currentRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  onCreateRoom: () => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  currentRoom,
  onRoomSelect,
  onCreateRoom,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock rooms data
  const rooms: Room[] = [
    {
      id: "room-1",
      name: "AI & Tech Watchlist",
      type: "private",
      tickers: ["NVDA", "GOOGL", "MSFT"],
      memberCount: 8,
      unreadCount: 3,
      lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      isOwner: true,
    },
    {
      id: "room-2",
      name: "EV Revolution",
      type: "private",
      tickers: ["TSLA", "RIVN", "LCID"],
      memberCount: 12,
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isOwner: false,
    },
    {
      id: "room-3",
      name: "Dividend Kings",
      type: "private",
      tickers: ["JNJ", "PG", "KO"],
      memberCount: 15,
      unreadCount: 7,
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isOwner: false,
    },
  ];

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const getRoomIcon = (room: Room) => {
    return room.isOwner ? (
      <Lock className="w-4 h-4 text-blue-500" />
    ) : (
      <Users className="w-4 h-4 text-gray-500" />
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-gray-200 dark:border-gray-700 hover:from-gray-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-blue-800/30"
        >
          <div className="flex items-center gap-2 max-w-48">
            {currentRoom ? (
              <>
                {getRoomIcon(currentRoom)}
                <span className="truncate font-medium text-sm">
                  {currentRoom.name}
                </span>
                {currentRoom.unreadCount > 0 && (
                  <Badge className="h-5 px-1 text-xs bg-[#FFEBEE] text-[#C62828] border-[#C62828]/20 font-semibold">
                    {currentRoom.unreadCount}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">My Rooms</span>
              </>
            )}
          </div>
          <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-80 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      >
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          My Rooms
        </div>

        {rooms.map((room) => (
          <DropdownMenuItem
            key={room.id}
            onClick={() => {
              onRoomSelect(room);
              setIsOpen(false);
            }}
            className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                {getRoomIcon(room)}
                {room.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">
                    {room.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(room.lastActivity)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {/* Tickers */}
                  <div className="flex gap-1">
                    {room.tickers.slice(0, 3).map((ticker) => (
                      <Badge
                        key={ticker}
                        variant="outline"
                        className="text-xs px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700"
                      >
                        ${ticker}
                      </Badge>
                    ))}
                    {room.tickers.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{room.tickers.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {room.memberCount}
                  </div>

                  {room.unreadCount > 0 && (
                    <Badge className="h-4 px-1 text-xs bg-red-500 text-white">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={() => {
            onCreateRoom();
            setIsOpen(false);
          }}
          className="p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">Create New Room</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
