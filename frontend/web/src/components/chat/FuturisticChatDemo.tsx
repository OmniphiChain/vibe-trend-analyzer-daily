import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Hash,
  DollarSign,
  Users,
  Zap,
  Bot,
  TrendingUp,
  Star,
} from "lucide-react";
import { FuturisticChatInterface } from "./FuturisticChatInterface";

export const FuturisticChatDemo = () => {
  const [activeRoom, setActiveRoom] = useState("crypto-central");

  const chatRooms = [
    {
      id: "crypto-central",
      name: "Crypto Central",
      type: "crypto" as const,
      description: "Real-time crypto discussions and analysis",
      online: 1247,
      icon: DollarSign,
      color: "from-orange-500 to-yellow-500",
    },
    {
      id: "ai-signals",
      name: "AI Signals",
      type: "ai" as const,
      description: "AI-powered trading insights and alerts",
      online: 892,
      icon: Bot,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "general-trading",
      name: "General Trading",
      type: "general" as const,
      description: "General market discussions and strategies",
      online: 634,
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
    },
    {
      id: "options-hub",
      name: "Options Hub",
      type: "stocks" as const,
      description: "Options trading strategies and analysis",
      online: 423,
      icon: Star,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const currentRoom = chatRooms.find(room => room.id === activeRoom);

  const handleNavigateToProfile = (userId: string) => {
    console.log(`Navigating to profile: ${userId}`);
    // In a real app, this would navigate to the user's profile
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Futuristic Chat Interface
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of financial community chat with AI-powered sentiment analysis, 
            real-time mood tracking, and immersive glassmorphism design
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: MessageSquare,
              title: "Sentiment Rings",
              description: "Color-coded avatar rings showing user sentiment in real-time",
              color: "from-emerald-500 to-green-400",
            },
            {
              icon: Bot,
              title: "AI Detection",
              description: "Automatic sentiment analysis with confidence scores",
              color: "from-cyan-500 to-blue-400",
            },
            {
              icon: Hash,
              title: "Smart Mentions",
              description: "Auto-linking for $tickers, @users, and #hashtags",
              color: "from-purple-500 to-pink-400",
            },
            {
              icon: Zap,
              title: "Live Reactions",
              description: "Real-time reactions and interactive message bubbles",
              color: "from-yellow-500 to-orange-400",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-3`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Room Selection */}
        <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Hash className="h-5 w-5 text-purple-400" />
              Select Chat Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {chatRooms.map(room => {
                const IconComponent = room.icon;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      activeRoom === room.id
                        ? "border-purple-500/50 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                        : "border-gray-600/30 bg-black/20 hover:border-purple-500/30 hover:bg-purple-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${room.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-white">{room.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{room.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        <Users className="h-3 w-3 mr-1" />
                        {room.online.toLocaleString()} online
                      </Badge>
                      {activeRoom === room.id && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        {currentRoom && (
          <FuturisticChatInterface
            roomName={currentRoom.name}
            roomType={currentRoom.type}
            onNavigateToProfile={handleNavigateToProfile}
          />
        )}

        {/* Feature Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                Chat Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Sentiment-Aware Avatars</h4>
                    <p className="text-sm text-gray-400">Avatar rings change color based on user sentiment: green for bullish, red for bearish, gray for neutral</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">AI Sentiment Detection</h4>
                    <p className="text-sm text-gray-400">Automatic analysis of message sentiment with confidence scores displayed as badges</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Smart Auto-linking</h4>
                    <p className="text-sm text-gray-400">Automatic detection and linking of $TICKERS, @mentions, and #hashtags</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Pinned Messages</h4>
                    <p className="text-sm text-gray-400">Important announcements and market alerts displayed at the top of chat</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Sidebar Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Room Mood Meter</h4>
                    <p className="text-sm text-gray-400">Real-time sentiment analysis of the entire room with visual mood indicators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Active Traders</h4>
                    <p className="text-sm text-gray-400">Top traders currently online with follow/alert buttons and sentiment indicators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Trending Tickers</h4>
                    <p className="text-sm text-gray-400">Most mentioned stocks/crypto with real-time prices and mention counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-white">Collapsible Design</h4>
                    <p className="text-sm text-gray-400">Sidebar can be collapsed for focused chat experience on smaller screens</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
