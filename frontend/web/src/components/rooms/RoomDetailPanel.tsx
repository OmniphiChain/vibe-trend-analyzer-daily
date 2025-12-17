import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/auth/AuthModal";

interface RoomMessage {
  id: number;
  user: string;
  time: string;
  text: string;
}

interface Room {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  sentiment: { label: string; pct: number };
  online: number;
  today: number;
  activityPct: number;
  pinned?: {
    user: string;
    time: string;
    text: string;
  };
}

interface RoomDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId: string;
  rooms: Room[];
  previewMessages: Record<string, RoomMessage[]>;
  authed: boolean;
  onSignIn?: () => void;
  onJoinRoom?: (roomId: string) => void;
  className?: string;
}

export const RoomDetailPanel: React.FC<RoomDetailPanelProps> = ({
  isOpen,
  onClose,
  selectedRoomId,
  rooms,
  previewMessages,
  authed,
  onSignIn,
  onJoinRoom,
  className,
}) => {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const messages = previewMessages[selectedRoomId] || [];

  if (!selectedRoom) return null;

  const getActivityIcon = (activityPct: number) => {
    return activityPct >= 0 ? "📈" : "📉";
  };

  const getActivityPrefix = (activityPct: number) => {
    return activityPct >= 0 ? "+" : "";
  };

  return (
    <>
      {isOpen && (
        <div className={cn(
          "w-full bg-[#10162A] border-l border-white/6 overflow-y-auto",
          "p-5 rounded-2xl shadow-2xl shadow-black/35 h-full",
          className
        )}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedRoom.icon}</span>
              <h2 className="text-[#E7ECF4] text-lg font-bold">{selectedRoom.name}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white/80 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-[#8EA0B6] text-sm mb-3">{selectedRoom.description}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#141A2B] rounded-xl p-3 text-[#E7ECF4] text-xs text-center">
              <div className="font-medium">👥 {selectedRoom.online}</div>
              <div className="text-[#8EA0B6] text-xs mt-1">Online</div>
            </div>
            <div className="bg-[#141A2B] rounded-xl p-3 text-[#E7ECF4] text-xs text-center">
              <div className="font-medium">💬 {selectedRoom.today}</div>
              <div className="text-[#8EA0B6] text-xs mt-1">Today</div>
            </div>
            <div className="bg-[#141A2B] rounded-xl p-3 text-[#E7ECF4] text-xs text-center">
              <div className="font-medium">{getActivityIcon(selectedRoom.activityPct)} {getActivityPrefix(selectedRoom.activityPct)}{Math.abs(selectedRoom.activityPct)}%</div>
              <div className="text-[#8EA0B6] text-xs mt-1">Activity</div>
            </div>
          </div>

          {/* Pinned Message */}
          {selectedRoom.pinned && (
            <div className="bg-[#141A2B] border border-yellow-400/35 rounded-xl p-3 mb-3.5">
              <div className="text-yellow-400 text-xs mb-1.5">📌 Pinned Message</div>
              <p className="text-[#E7ECF4] text-sm">{selectedRoom.pinned.text}</p>
            </div>
          )}

          {/* Recent Messages */}
          <h3 className="text-[#E7ECF4] text-sm font-semibold mb-2">Recent Messages</h3>
          
          <div className="space-y-2 mb-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-[#141A2B] rounded-xl p-2.5">
                <p className="text-[#E7ECF4] text-sm">
                  <span className="font-medium">{message.user}:</span> {message.text}
                </p>
                {!authed && (
                  <p className="text-[#8EA0B6] text-xs mt-1.5 opacity-80">
                    🔒 Sign in to like or reply
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CTAs */}
          {!authed ? (
            <div className="space-y-2.5">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="w-full bg-[#1DD882] text-[#041311] font-bold py-3 px-3.5 rounded-xl hover:bg-[#1DD882]/90"
              >
                Sign in to Join & Chat
              </Button>
              <Button
                onClick={() => setPreviewModalOpen(true)}
                variant="outline"
                className="w-full bg-[rgba(127,209,255,0.12)] text-[#7FD1FF] border-[rgba(127,209,255,0.45)] py-2.5 px-3 rounded-xl hover:bg-[rgba(127,209,255,0.2)]"
              >
                View more messages (preview)
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => onJoinRoom?.(selectedRoomId)}
              className="w-full bg-gradient-to-r from-[#4DA8FF] to-[#6CCEFF] text-white font-bold py-3 px-3.5 rounded-xl mt-2"
            >
              Open Room
            </Button>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="bg-[#10162A] text-[#E7ECF4] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#E7ECF4]">Room Preview</DialogTitle>
            <DialogDescription className="text-[#8EA0B6]">
              Showing up to 20 recent messages. Sign in to interact.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="bg-[#141A2B] rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-[#E7ECF4]">{message.user}</span>
                  <span className="text-xs text-[#8EA0B6]">{message.time}</span>
                </div>
                <p className="text-[#E7ECF4] text-sm">{message.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="flex-1 bg-[#1DD882] text-[#041311] font-bold hover:bg-[#1DD882]/90"
            >
              Sign in to Join
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreviewModalOpen(false)}
              className="border-white/20 text-[#E7ECF4] hover:bg-white/5"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />
    </>
  );
};
