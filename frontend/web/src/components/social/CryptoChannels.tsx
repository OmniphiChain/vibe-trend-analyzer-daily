import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Send,
  Hash,
  Users,
  Eye,
  ThumbsUp,
  MessageSquare,
  Star,
  Shield,
  Zap,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useCryptoListings } from "@/hooks/useCoinMarketCap";

interface CryptoMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    badges: string[];
  };
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  tickers: string[];
  sentiment: "bullish" | "bearish" | "neutral";
}

interface CryptoChannel {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  members: number;
  online: number;
  description: string;
}

export const CryptoChannels: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState("BTC");
  const [newMessage, setNewMessage] = useState("");
  const { tickers: cryptoData = [], loading: cryptoLoading } =
    useCryptoListings(10) || {};
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock crypto channels data
  const cryptoChannels: CryptoChannel[] = [
    {
      id: "BTC",
      name: "Bitcoin",
      ticker: "$BTC",
      price: 43250,
      change24h: 2.4,
      members: 15420,
      online: 1847,
      description:
        "The original cryptocurrency - discuss Bitcoin trends, analysis, and news",
    },
    {
      id: "ETH",
      name: "Ethereum",
      ticker: "$ETH",
      price: 2650,
      change24h: -1.2,
      members: 12380,
      online: 1543,
      description: "Smart contracts and DeFi - Ethereum ecosystem discussions",
    },
    {
      id: "SOL",
      name: "Solana",
      ticker: "$SOL",
      price: 98,
      change24h: 4.7,
      members: 8920,
      online: 967,
      description: "High-speed blockchain - Solana ecosystem and developments",
    },
    {
      id: "DOGE",
      name: "Dogecoin",
      ticker: "$DOGE",
      price: 0.082,
      change24h: 8.3,
      members: 19340,
      online: 2156,
      description:
        "The meme coin that started it all - community and market discussions",
    },
    {
      id: "ADA",
      name: "Cardano",
      ticker: "$ADA",
      price: 0.48,
      change24h: -2.1,
      members: 7650,
      online: 834,
      description:
        "Academic approach to blockchain - Cardano development and staking",
    },
  ];

  // Mock messages for crypto channels
  const cryptoMessages: Record<string, CryptoMessage[]> = {
    BTC: [
      {
        id: "1",
        user: {
          name: "BitcoinMaxi",
          avatar: "BM",
          verified: true,
          badges: ["OG Hodler", "Whale"],
        },
        content:
          "$BTC breaking above $43k resistance! This could be the start of the next leg up 🚀 Volume is looking healthy",
        timestamp: new Date(Date.now() - 300000),
        likes: 47,
        replies: 12,
        tickers: ["BTC"],
        sentiment: "bullish",
      },
      {
        id: "2",
        user: {
          name: "CryptoAnalyst",
          avatar: "CA",
          verified: false,
          badges: ["TA Expert"],
        },
        content:
          "RSI is approaching overbought on the 4H chart. Expecting a pullback to $41.5k before continuation. What do you think?",
        timestamp: new Date(Date.now() - 600000),
        likes: 23,
        replies: 8,
        tickers: ["BTC"],
        sentiment: "neutral",
      },
      {
        id: "3",
        user: {
          name: "HodlStrong",
          avatar: "HS",
          verified: false,
          badges: ["Diamond Hands"],
        },
        content:
          "Just bought the dip at $42.8k! Been DCAing since 2020 and not stopping now 💎🙌",
        timestamp: new Date(Date.now() - 900000),
        likes: 156,
        replies: 34,
        tickers: ["BTC"],
        sentiment: "bullish",
      },
    ],
    ETH: [
      {
        id: "4",
        user: {
          name: "DeFiDegen",
          avatar: "DD",
          verified: true,
          badges: ["DeFi Pioneer", "Yield Farmer"],
        },
        content:
          "$ETH gas fees finally reasonable again! Perfect time to interact with protocols. What's everyone farming these days?",
        timestamp: new Date(Date.now() - 180000),
        likes: 89,
        replies: 23,
        tickers: ["ETH"],
        sentiment: "bullish",
      },
      {
        id: "5",
        user: {
          name: "SmartContractDev",
          avatar: "SD",
          verified: false,
          badges: ["Developer", "Builder"],
        },
        content:
          "Layer 2 adoption is insane right now. Arbitrum and Optimism handling more transactions than mainnet on some days",
        timestamp: new Date(Date.now() - 450000),
        likes: 67,
        replies: 19,
        tickers: ["ETH", "ARB", "OP"],
        sentiment: "bullish",
      },
    ],
    SOL: [
      {
        id: "6",
        user: {
          name: "SolanaSpeed",
          avatar: "SS",
          verified: false,
          badges: ["Sol Squad"],
        },
        content:
          "$SOL ecosystem is on fire! New projects launching daily and the speed is unmatched. Any new protocols to check out?",
        timestamp: new Date(Date.now() - 120000),
        likes: 45,
        replies: 15,
        tickers: ["SOL"],
        sentiment: "bullish",
      },
    ],
    DOGE: [
      {
        id: "7",
        user: {
          name: "DogeArmy",
          avatar: "DA",
          verified: false,
          badges: ["Meme Lord", "Shibe"],
        },
        content:
          "Much wow! $DOGE pumping hard today 🐕 Elon must have tweeted something again lol",
        timestamp: new Date(Date.now() - 240000),
        likes: 234,
        replies: 67,
        tickers: ["DOGE"],
        sentiment: "bullish",
      },
    ],
    ADA: [
      {
        id: "8",
        user: {
          name: "CardanoStaker",
          avatar: "CS",
          verified: false,
          badges: ["Staker", "Academic"],
        },
        content:
          "$ADA smart contracts getting more adoption. Slow and steady wins the race! 🐢",
        timestamp: new Date(Date.now() - 360000),
        likes: 34,
        replies: 12,
        tickers: ["ADA"],
        sentiment: "bullish",
      },
    ],
  };

  const activeChannelData = cryptoChannels.find((c) => c.id === activeChannel);
  const activeMessages = cryptoMessages[activeChannel] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Detect crypto tickers in message
    const tickerRegex = /\$[A-Z]{2,10}/g;
    const tickers = newMessage.match(tickerRegex) || [];

    // Simple sentiment analysis based on keywords
    const bullishWords = [
      "moon",
      "pump",
      "bullish",
      "buy",
      "hodl",
      "diamond",
      "🚀",
      "💎",
    ];
    const bearishWords = ["dump", "bearish", "sell", "crash", "rip", "📉"];

    let sentiment: "bullish" | "bearish" | "neutral" = "neutral";
    const lowerMessage = newMessage.toLowerCase();

    if (bullishWords.some((word) => lowerMessage.includes(word))) {
      sentiment = "bullish";
    } else if (bearishWords.some((word) => lowerMessage.includes(word))) {
      sentiment = "bearish";
    }

    console.log("Sending message:", {
      content: newMessage,
      tickers,
      sentiment,
    });
    setNewMessage("");
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  return (
    <div className="h-[600px] flex bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
      {/* Channel Sidebar */}
      <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            Crypto Channels
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time crypto discussions
          </p>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {cryptoChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.id)}
              className={`w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b transition-colors ${
                activeChannel === channel.id
                  ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {channel.ticker}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {channel.name}
                  </Badge>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    channel.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {channel.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {channel.change24h >= 0 ? "+" : ""}
                  {channel.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formatPrice(channel.price)}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {channel.members.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-green-500" />
                    {channel.online.toLocaleString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Channel Stats */}
        <div className="p-4 border-t bg-gray-100 dark:bg-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Total Channels:</span>
              <span>{cryptoChannels.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users:</span>
              <span>
                {cryptoChannels
                  .reduce((sum, c) => sum + c.online, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        {activeChannelData && (
          <div className="p-4 border-b bg-white dark:bg-gray-900">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {activeChannelData.ticker}
                  <Badge variant="outline" className="text-sm">
                    {activeChannelData.name}
                  </Badge>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activeChannelData.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatPrice(activeChannelData.price)}
                </div>
                <div
                  className={`flex items-center gap-1 justify-end ${
                    activeChannelData.change24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {activeChannelData.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {activeChannelData.change24h >= 0 ? "+" : ""}
                  {activeChannelData.change24h.toFixed(1)}% (24h)
                </div>
              </div>
            </div>

            {/* Channel Rules */}
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Channel Rules:</span>
                <span>
                  Crypto-only discussions • Use proper tickers ($BTC) • No
                  spam/shilling
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeMessages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {message.user.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {message.user.name}
                  </span>
                  {message.user.verified && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {message.user.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="text-xs px-1 py-0"
                    >
                      {badge}
                    </Badge>
                  ))}
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div
                    className={`flex items-center gap-1 ${getSentimentColor(message.sentiment)}`}
                  >
                    {getSentimentIcon(message.sentiment)}
                  </div>
                </div>

                <p className="text-sm mb-2">{message.content}</p>

                {message.tickers.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {message.tickers.map((ticker) => (
                      <Badge
                        key={ticker}
                        variant="secondary"
                        className="text-xs"
                      >
                        {ticker}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <ThumbsUp className="w-3 h-3" />
                    {message.likes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-3 h-3" />
                    {message.replies}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Share your thoughts on ${activeChannelData?.ticker}...`}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
            <DollarSign className="w-3 h-3" />
            <span>Use $ to tag crypto tickers (e.g., $BTC, $ETH)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
