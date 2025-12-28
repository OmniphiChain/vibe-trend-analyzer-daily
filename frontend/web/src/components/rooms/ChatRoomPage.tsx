import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Heart, MessageCircle, Share2, Reply } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

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
}

interface Message {
  id: number;
  user: string;
  time: string;
  text: string;
  sentiment?: string;
  type?: string;
  likes?: number;
  replies?: number;
  isLiked?: boolean;
  isShared?: boolean;
}

interface ChatRoomPageProps {
  room: Room;
  onBack?: () => void;
  authed?: boolean;
}

export const ChatRoomPage: React.FC<ChatRoomPageProps> = ({
  room,
  onBack,
  authed = false
}) => {
  // State management matching Builder.io JSON structure
  const [filter, setFilter] = useState<string>("all");
  const [sentiment, setSentiment] = useState<string>("neutral");
  const [messageBody, setMessageBody] = useState<string>("");
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  // Mock data for preview and feed
  const [previewFeed] = useState<Message[]>([
    { id: 1, user: "Alex", time: "2m", text: "Watching $AAPL above 195 for a breakout.", likes: 3, replies: 1, isLiked: false, isShared: false },
    { id: 2, user: "Sasha", time: "4m", text: "IV steady; considering debit spread.", likes: 2, replies: 0, isLiked: false, isShared: false }
  ]);

  const [feed, setFeed] = useState<Message[]>([
    { id: 101, user: "You", time: "Just now", text: "Hello room!", sentiment: "neutral", type: "text", likes: 0, replies: 0, isLiked: false, isShared: false }
  ]);

  // Handle message sending
  const handleSendMessage = () => {
    if (!(messageBody && messageBody.trim().length)) return;

    const newMessage: Message = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: messageBody,
      type: "text",
      sentiment: sentiment,
      likes: 0,
      replies: 0
    };

    setFeed([newMessage, ...feed]);
    setMessageBody("");
  };

  // Handle sign-in button clicks
  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  // Handle message interactions
  const handleLike = (messageId: number) => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }

    const updateMessages = (messages: Message[]) =>
      messages.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              isLiked: !msg.isLiked,
              likes: (msg.likes || 0) + (msg.isLiked ? -1 : 1)
            }
          : msg
      );

    setFeed(updateMessages);
  };

  const handleReply = (message: Message) => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }
    setReplyToMessage(message);
  };

  const handleShare = (messageId: number) => {
    if (!authed) {
      setShowAuthModal(true);
      return;
    }

    const updateMessages = (messages: Message[]) =>
      messages.map(msg =>
        msg.id === messageId
          ? { ...msg, isShared: !msg.isShared }
          : msg
      );

    setFeed(updateMessages);

    // Show share confirmation
    alert("Message shared!");
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !replyToMessage) return;

    const newReply: Message = {
      id: Date.now(),
      user: "You",
      time: "Just now",
      text: `@${replyToMessage.user} ${replyText}`,
      type: "reply",
      sentiment: sentiment,
      likes: 0,
      replies: 0,
      isLiked: false,
      isShared: false
    };

    setFeed([newReply, ...feed]);

    // Update original message reply count
    setFeed(prev => prev.map(msg =>
      msg.id === replyToMessage.id
        ? { ...msg, replies: (msg.replies || 0) + 1 }
        : msg
    ));

    setReplyText("");
    setReplyToMessage(null);
  };

  // Get activity icon and prefix
  const getActivityDisplay = () => {
    const icon = room.activityPct >= 0 ? "📈" : "📉";
    const prefix = room.activityPct >= 0 ? "+" : "";
    return `${icon} ${prefix}${Math.abs(room.activityPct)}% Activity`;
  };

  const currentFeed = authed ? feed : previewFeed;

  return (
    <div className="bg-[#0B1020] p-4 min-h-screen">
      {/* Header */}
      <div className="bg-[#10162A] rounded-2xl p-4 mb-3 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white/60 hover:text-white/80 mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-[22px]">{room.icon}</span>
          <div>
            <h1 className="text-[#E7ECF4] font-bold text-lg">{room.name}</h1>
            <p className="text-[#8EA0B6] text-sm">{room.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#141A2B] px-2.5 py-2 rounded-xl text-[#E7ECF4] text-sm">
            👥 {room.online} Online
          </div>
          <div className="bg-[#141A2B] px-2.5 py-2 rounded-xl text-[#E7ECF4] text-sm">
            💬 {room.today} Today
          </div>
          <div className="bg-[#141A2B] px-2.5 py-2 rounded-xl text-[#E7ECF4] text-sm">
            {getActivityDisplay()}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Preview Banner for Unauthenticated Users */}
          {!authed && (
            <div className="bg-[rgba(127,209,255,0.12)] border border-[rgba(127,209,255,0.35)] rounded-xl p-3">
              <p className="text-[#7FD1FF] text-sm mb-2">
                Preview mode: read-only. Sign in to post, react, and get alerts.
              </p>
              <Button
                onClick={handleSignIn}
                className="bg-[#1DD882] text-[#041311] font-bold rounded-xl hover:bg-[#1DD882]/90"
              >
                Sign in to Join & Chat
              </Button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-2.5">
            {["all", "charts", "options", "news"].map((filterOption) => (
              <Button
                key={filterOption}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(filterOption)}
                className={`rounded-xl text-sm ${
                  filter === filterOption 
                    ? "bg-[#1b2741] text-[#E7ECF4]" 
                    : "bg-[#141A2B] text-[#8EA0B6] hover:bg-[#1b2741]"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Button>
            ))}
          </div>

          {/* Message Feed */}
          <div className="space-y-2.5 mb-4">
            {currentFeed.map((message) => (
              <div key={message.id} className="bg-[#10162A] rounded-xl p-3">
                <div className="text-[#8EA0B6] text-xs mb-1">
                  {message.user} • {message.time}
                </div>
                <div className="text-[#E7ECF4] text-sm mb-2">
                  {message.text}
                </div>
                
                {authed ? (
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(message.id)}
                      className={`h-7 px-2 text-xs gap-1 ${
                        message.isLiked
                          ? "text-red-400 hover:text-red-300"
                          : "text-[#8EA0B6] hover:text-[#E7ECF4]"
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${message.isLiked ? "fill-current" : ""}`} />
                      {(message.likes || 0) > 0 && message.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReply(message)}
                      className="h-7 px-2 text-xs gap-1 text-[#8EA0B6] hover:text-[#E7ECF4]"
                    >
                      <MessageCircle className="w-3 h-3" />
                      {(message.replies || 0) > 0 && message.replies}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(message.id)}
                      className={`h-7 px-2 text-xs gap-1 ${
                        message.isShared
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-[#8EA0B6] hover:text-[#E7ECF4]"
                      }`}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-[#8EA0B6] text-xs opacity-90">
                    🔒 Sign in to like or reply
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Composer for Authenticated Users */}
          {authed && (
            <div className="sticky bottom-0 bg-[#0F162C] border-t border-white/6 shadow-[0_-8px_28px_rgba(0,0,0,0.45)] p-3 rounded-xl">
              {/* Sentiment Row */}
              <div className="flex gap-2 mb-2">
                {[
                  { key: "bullish", label: "Bullish", color: "rgba(29,216,130,0.16)" },
                  { key: "bearish", label: "Bearish", color: "rgba(255,122,122,0.16)" },
                  { key: "neutral", label: "Neutral", color: "rgba(248,192,107,0.16)" }
                ].map((sentimentOption) => (
                  <Button
                    key={sentimentOption.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSentiment(sentimentOption.key)}
                    className="rounded-xl text-sm"
                    style={{
                      backgroundColor: sentiment === sentimentOption.key 
                        ? sentimentOption.color.replace('0.16', '0.22')
                        : sentimentOption.color,
                      color: sentiment === sentimentOption.key ? "#E7ECF4" : "#8EA0B6"
                    }}
                  >
                    {sentimentOption.label}
                  </Button>
                ))}
              </div>

              {/* Message Input */}
              <textarea
                placeholder="Share your setup, levels, or news insight…"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full min-h-[56px] bg-[#0B1020] border border-[rgba(127,209,255,0.25)] text-[#E7ECF4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[rgba(127,209,255,0.4)]"
              />

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!(messageBody && messageBody.trim().length)}
                className="mt-2 bg-gradient-to-r from-[#4DA8FF] to-[#6CCEFF] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                Send
              </Button>
            </div>
          )}

          {/* Sticky Auth CTA for Unauthenticated Users */}
          {!authed && (
            <div className="sticky bottom-0 bg-[#0F162C] border-t border-white/6 p-2.5 flex justify-between items-center rounded-xl">
              <span className="text-[#8EA0B6] text-sm">
                Sign in to post, react, and follow traders.
              </span>
              <Button
                onClick={handleSignIn}
                className="bg-[#1DD882] text-[#041311] font-bold rounded-xl"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Room Guide */}
          <div className="bg-[#10162A] rounded-xl p-3">
            <h3 className="text-[#E7ECF4] font-bold mb-1.5">Room Guide</h3>
            <p className="text-[#8EA0B6] text-sm mb-2">
              Share clear setups, use tickers, be respectful. No spam.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRules(true)}
              className="bg-[rgba(231,236,244,0.06)] text-[#E7ECF4] rounded-xl hover:bg-[rgba(231,236,244,0.1)]"
            >
              Read full rules
            </Button>
          </div>
        </div>
      </div>

      {/* Rules Modal */}
      <Dialog open={showRules} onOpenChange={setShowRules}>
        <DialogContent className="bg-[#10162A] text-[#E7ECF4] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#E7ECF4]">Room Rules</DialogTitle>
          </DialogHeader>
          <div className="text-[#8EA0B6] whitespace-pre-line">
            1) Be respectful
            {"\n"}2) No spam/pumps
            {"\n"}3) Use $TICKER and details for setups.
          </div>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={!!replyToMessage} onOpenChange={() => setReplyToMessage(null)}>
        <DialogContent className="bg-[#10162A] text-[#E7ECF4] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#E7ECF4]">Reply to {replyToMessage?.user}</DialogTitle>
            <DialogDescription className="text-[#8EA0B6]">
              Replying to: "{replyToMessage?.text}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full min-h-[80px] bg-[#0B1020] border border-[rgba(127,209,255,0.25)] text-[#E7ECF4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[rgba(127,209,255,0.4)]"
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setReplyToMessage(null)}
                className="border-white/20 text-[#E7ECF4] hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="bg-gradient-to-r from-[#4DA8FF] to-[#6CCEFF] text-white font-bold hover:opacity-90 disabled:opacity-50"
              >
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </div>
  );
};
