import React, { useState } from "react";
import { RoomDetailPanel } from "@/components/rooms/RoomDetailPanel";
import { Button } from "@/components/ui/button";

const mockRooms = [
  {
    id: "aapl-traders",
    name: "$AAPL Traders",
    icon: "🍎",
    category: "Stocks",
    description: "Real-time discussion for Apple traders.",
    sentiment: { label: "Bullish", pct: 62 },
    online: 892,
    today: 180,
    activityPct: 12,
    pinned: { user: "Mod", time: "1h", text: "Welcome to the room! Share setups. No pumping/spam." }
  },
  {
    id: "crypto-central",
    name: "Crypto Central",
    icon: "₿",
    category: "Crypto",
    description: "All things BTC, ETH, and alts.",
    sentiment: { label: "Bearish", pct: 58 },
    online: 1247,
    today: 340,
    activityPct: -4,
    pinned: { user: "TradingMod", time: "2h", text: "Keep it civil. DYOR. No shilling." }
  }
];

const mockPreviewMessages = {
  "aapl-traders": [
    { id: 1, user: "AlphaTrader", time: "2m", text: "Watching $AAPL above 195 — breakout if volume expands 🚀" },
    { id: 2, user: "MarketWatcher", time: "5m", text: "Seeing neutral options flow; IV steady." },
    { id: 3, user: "OptionsPro", time: "9m", text: "Debit spread idea: 195/205 calls for next week." }
  ],
  "crypto-central": [
    { id: 10, user: "AlphaTrader", time: "2m", text: "BTC holding 50k support; buyers stepping in." },
    { id: 11, user: "CryptoQueen", time: "5m", text: "ETH gas fees easing; L2 activity rising." }
  ]
};

export const RoomDetailPanelDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("aapl-traders");
  const [authed, setAuthed] = useState(false);

  const handleSignIn = () => {
    setAuthed(true);
    alert("Signed in successfully!");
  };

  const handleJoinRoom = (roomId: string) => {
    alert(`Joining room: ${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Room Detail Panel Demo
          </h1>
          <p className="text-gray-400 mb-6">
            This demonstrates the Room Detail Panel component built from the Builder.io JSON structure.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isOpen ? "Close" : "Open"} Room Detail Panel
            </Button>
            
            <Button
              onClick={() => setAuthed(!authed)}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              {authed ? "Sign Out" : "Sign In"}
            </Button>
            
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2"
            >
              <option value="aapl-traders">$AAPL Traders</option>
              <option value="crypto-central">Crypto Central</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content Area */}
          <div className="bg-[#10162A] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Room List (Demo)
            </h2>
            <div className="space-y-3">
              {mockRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setIsOpen(true);
                  }}
                  className="bg-[#141A2B] rounded-lg p-4 cursor-pointer hover:bg-[#1A2332] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{room.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{room.name}</h3>
                      <p className="text-gray-400 text-sm">{room.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Detail Panel */}
          <div className="relative">
            <RoomDetailPanel
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              selectedRoomId={selectedRoomId}
              rooms={mockRooms}
              previewMessages={mockPreviewMessages}
              authed={authed}
              onSignIn={handleSignIn}
              onJoinRoom={handleJoinRoom}
            />
            
            {!isOpen && (
              <div className="bg-[#10162A] rounded-lg p-6 h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Click "Open Room Detail Panel" to see the component</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-[#10162A] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Component Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <ul className="space-y-2">
              <li>✅ Dynamic room data binding</li>
              <li>✅ Real-time statistics display</li>
              <li>✅ Pinned message support</li>
              <li>✅ Recent messages preview</li>
            </ul>
            <ul className="space-y-2">
              <li>✅ Authentication state handling</li>
              <li>✅ Modal preview for messages</li>
              <li>✅ Responsive design</li>
              <li>✅ Professional dark theme</li>
            </ul>
          </div>
        </div>

        {/* JSON Structure Reference */}
        <div className="mt-8 bg-[#10162A] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Builder.io JSON Structure Compliance
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            This component implements all features defined in the Builder.io JSON structure:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#141A2B] rounded p-3">
              <h4 className="text-green-400 font-medium mb-2">Layout</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• 360px width</li>
                <li>• Dark theme colors</li>
                <li>• Border radius</li>
                <li>• Proper spacing</li>
              </ul>
            </div>
            <div className="bg-[#141A2B] rounded p-3">
              <h4 className="text-blue-400 font-medium mb-2">Data Binding</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Room selection</li>
                <li>• Dynamic content</li>
                <li>• State management</li>
                <li>• Message preview</li>
              </ul>
            </div>
            <div className="bg-[#141A2B] rounded p-3">
              <h4 className="text-purple-400 font-medium mb-2">Interactions</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Sign in modal</li>
                <li>• Room joining</li>
                <li>• Preview modal</li>
                <li>• Close actions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
