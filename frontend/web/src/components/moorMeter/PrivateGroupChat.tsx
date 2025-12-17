import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RoomSelector } from "./RoomSelector";
import { CreateRoomModal } from "./CreateRoomModal";
import { RoomChatView } from "./RoomChatView";
import {
  Users,
  Star,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Zap,
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
  description?: string;
}

export const PrivateGroupChat: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateRoom = (roomData: any) => {
    // Mock room creation - in real app would call API
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: roomData.name,
      type: "private",
      tickers: roomData.tickers,
      memberCount: 1,
      unreadCount: 0,
      lastActivity: new Date(),
      isOwner: true,
      description: roomData.description,
    };

    setCurrentRoom(newRoom);
    console.log("Created room:", newRoom);
  };

  // Room overview with stats and quick actions
  const RoomOverview = () => (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Private Group Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create ticker-based rooms and discuss market insights with fellow
            traders
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              2.8K
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Active Members
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              156
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Trade Ideas Today
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              78%
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Avg Accuracy
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Rooms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Featured Rooms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">AI & Tech Watchlist</span>
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                      Premium
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time trade ideas and market analysis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">2,847 members</div>
                <div className="text-xs text-gray-500">12 new messages</div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Create your first private room</p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Create Room
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Private Rooms Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">🔒 Private & Secure</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Invite-only rooms for trusted traders. Share strategies without
                public exposure.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">📈 Ticker-Based</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Create rooms around specific stocks or sectors. Track
                performance together.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600">💬 Real-Time Chat</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Instant messaging with sentiment tracking and threaded
                discussions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">🎯 Trade Ideas</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Share formatted trade signals with entry, target, and stop-loss
                levels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-full">
      {/* Room Selection Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-b">
        <div className="flex items-center gap-4">
          <RoomSelector
            currentRoom={currentRoom}
            onRoomSelect={setCurrentRoom}
            onCreateRoom={() => setShowCreateModal(true)}
          />

          {currentRoom && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                "Private Room"
              </Badge>
              <span className="text-sm text-gray-500">
                {currentRoom.memberCount} members
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          >
            <Users className="w-4 h-4 mr-2" />
            Create Room
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {currentRoom ? (
          <RoomChatView
            room={currentRoom}
            onBackToRooms={() => setCurrentRoom(null)}
          />
        ) : (
          <RoomOverview />
        )}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};
