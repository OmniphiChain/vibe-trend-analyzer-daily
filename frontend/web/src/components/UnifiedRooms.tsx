import React, { useState, useMemo } from 'react';
import { Search, Users, MessageSquare, Star, Shield, TrendingUp, Hash, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// CSS Variables for the dark mode theme
const cssVars = `
  .unified-rooms-theme {
    --bg: #0B1020;
    --panel: #10162A;
    --panel-soft: #141A2B;
    --text: #E7ECF4;
    --muted: #8EA0B6;
    --accent: #7FD1FF;
    --success: #1DD882;
    --warn: #F8C06B;
    --danger: #FF7A7A;
    --shadow: 0 8px 24px rgba(0,0,0,0.35);
  }
`;

// Room interface matching the requirements
interface Room {
  id: string;
  name: string;
  type: 'general' | 'stocks' | 'crypto' | 'options' | 'vip';
  membersOnline: number;
  msgsPerHr: number;
  sentimentPct: number;
  sentimentLabel: 'Bullish' | 'Bearish' | 'Neutral';
  unread: number;
  pinnedCount: number;
  isVIP: boolean;
  icon: string;
}

// Mock room data as specified
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Chat',
    type: 'general',
    membersOnline: 112,
    msgsPerHr: 260,
    sentimentPct: 62,
    sentimentLabel: 'Bullish',
    unread: 0,
    pinnedCount: 3,
    isVIP: false,
    icon: '💬'
  },
  {
    id: '2',
    name: '$AAPL Traders',
    type: 'stocks',
    membersOnline: 892,
    msgsPerHr: 180,
    sentimentPct: 51,
    sentimentLabel: 'Neutral',
    unread: 2,
    pinnedCount: 7,
    isVIP: false,
    icon: '🍎'
  },
  {
    id: '3',
    name: 'Crypto Central',
    type: 'crypto',
    membersOnline: 1247,
    msgsPerHr: 340,
    sentimentPct: 58,
    sentimentLabel: 'Bearish',
    unread: 0,
    pinnedCount: 12,
    isVIP: false,
    icon: '₿'
  },
  {
    id: '4',
    name: 'Options Trading',
    type: 'options',
    membersOnline: 234,
    msgsPerHr: 95,
    sentimentPct: 54,
    sentimentLabel: 'Bullish',
    unread: 1,
    pinnedCount: 2,
    isVIP: false,
    icon: '📊'
  },
  {
    id: '5',
    name: 'VIP Signals',
    type: 'vip',
    membersOnline: 23,
    msgsPerHr: 42,
    sentimentPct: 71,
    sentimentLabel: 'Bullish',
    unread: 0,
    pinnedCount: 15,
    isVIP: true,
    icon: '🎯'
  },
  {
    id: '6',
    name: '$TSLA Bulls',
    type: 'stocks',
    membersOnline: 567,
    msgsPerHr: 125,
    sentimentPct: 68,
    sentimentLabel: 'Bullish',
    unread: 3,
    pinnedCount: 5,
    isVIP: false,
    icon: '🚗'
  },
  {
    id: '7',
    name: '$NVDA Tech Talk',
    type: 'stocks',
    membersOnline: 445,
    msgsPerHr: 85,
    sentimentPct: 45,
    sentimentLabel: 'Bearish',
    unread: 0,
    pinnedCount: 8,
    isVIP: false,
    icon: '🎮'
  },
  {
    id: '8',
    name: 'DeFi Alpha',
    type: 'crypto',
    membersOnline: 89,
    msgsPerHr: 67,
    sentimentPct: 73,
    sentimentLabel: 'Bullish',
    unread: 5,
    pinnedCount: 4,
    isVIP: true,
    icon: '🦄'
  }
];

// Sample posts for room preview
const samplePosts = [
  {
    id: '1',
    username: 'TraderJoe',
    avatar: '/placeholder.svg',
    content: 'Just spotted huge volume on $AAPL calls expiring this Friday. Something big brewing? 🚀',
    timestamp: '2m ago'
  },
  {
    id: '2',
    username: 'CryptoQueen',
    avatar: '/placeholder.svg',
    content: 'BTC breaking above 50k resistance. Time to load up? #bitcoin #bullish',
    timestamp: '5m ago'
  }
];

type FilterType = 'all' | 'general' | 'stocks' | 'crypto' | 'options' | 'vip';
type SortType = 'active' | 'quality' | 'new';

interface UnifiedRoomsState {
  query: string;
  filter: FilterType;
  sort: SortType;
  selectedRoomId: string | null;
  rooms: Room[];
}

export const UnifiedRooms: React.FC = () => {
  const [state, setState] = useState<UnifiedRoomsState>({
    query: '',
    filter: 'all',
    sort: 'active',
    selectedRoomId: null,
    rooms: mockRooms
  });

  // Filter and sort rooms
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = state.rooms;

    // Apply search filter
    if (state.query) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(state.query.toLowerCase())
      );
    }

    // Apply type filter
    if (state.filter !== 'all') {
      if (state.filter === 'vip') {
        filtered = filtered.filter(room => room.isVIP);
      } else {
        filtered = filtered.filter(room => room.type === state.filter);
      }
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (state.sort) {
        case 'active':
          if (b.msgsPerHr !== a.msgsPerHr) return b.msgsPerHr - a.msgsPerHr;
          return b.membersOnline - a.membersOnline;
        case 'quality':
          if (b.pinnedCount !== a.pinnedCount) return b.pinnedCount - a.pinnedCount;
          return Math.abs(b.sentimentPct - 50) - Math.abs(a.sentimentPct - 50);
        case 'new':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.query, state.filter, state.sort, state.rooms]);

  const selectedRoom = state.rooms.find(room => room.id === state.selectedRoomId);

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'Bullish': return 'bg-[var(--success)] text-white';
      case 'Bearish': return 'bg-[var(--danger)] text-white';
      case 'Neutral': return 'bg-[var(--warn)] text-black';
      default: return 'bg-[var(--muted)] text-white';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-gray-500/20 text-gray-300';
      case 'stocks': return 'bg-blue-500/20 text-blue-300';
      case 'crypto': return 'bg-orange-500/20 text-orange-300';
      case 'options': return 'bg-purple-500/20 text-purple-300';
      case 'vip': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <>
      <style>{cssVars}</style>
      <div className="unified-rooms-theme min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--text)] mb-2">Rooms</h1>
            <p className="text-[var(--muted)] text-lg">Join real-time discussions by ticker, sector, and strategy.</p>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              <Input
                placeholder="Search rooms or tickers…"
                value={state.query}
                onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10 bg-[var(--panel)] border-[var(--muted)]/30 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)]/50"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[var(--panel)] rounded-lg p-1">
              {(['all', 'general', 'stocks', 'crypto', 'options', 'vip'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setState(prev => ({ ...prev, filter }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    state.filter === filter
                      ? 'bg-[var(--accent)] text-black'
                      : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-soft)]'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <Select value={state.sort} onValueChange={(value: SortType) => setState(prev => ({ ...prev, sort: value }))}>
              <SelectTrigger className="w-48 bg-[var(--panel)] border-[var(--muted)]/30 text-[var(--text)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--panel)] border-[var(--muted)]/30">
                <SelectItem value="active" className="text-[var(--text)] focus:bg-[var(--panel-soft)]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="quality" className="text-[var(--text)] focus:bg-[var(--panel-soft)]">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    High Quality
                  </div>
                </SelectItem>
                <SelectItem value="new" className="text-[var(--text)] focus:bg-[var(--panel-soft)]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    New
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room List */}
            <div className="lg:col-span-2">
              <ScrollArea className="h-[600px]">
                <div className="space-y-3 pr-4">
                  {filteredAndSortedRooms.map((room) => (
                    <Card
                      key={room.id}
                      onClick={() => setState(prev => ({ ...prev, selectedRoomId: room.id }))}
                      className={`bg-[var(--panel)] border-[var(--muted)]/20 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:bg-[var(--panel-soft)] hover:shadow-[var(--shadow)] hover:-translate-y-1 ${
                        state.selectedRoomId === room.id ? 'ring-2 ring-[var(--accent)] shadow-[var(--shadow)]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="text-2xl">{room.icon}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Type Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-[var(--text)] truncate">{room.name}</h3>
                            <Badge className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(room.type)}`}>
                              {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                            </Badge>
                            {room.isVIP && (
                              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                                <Shield className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>

                          {/* Metadata Chips */}
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-[var(--muted)]" />
                              <span className="text-[var(--text)] font-medium">{room.membersOnline}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-[var(--muted)]" />
                              <span className="text-[var(--text)] font-medium">{room.msgsPerHr}</span>
                            </div>
                            <Badge className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(room.sentimentLabel)}`}>
                              {room.sentimentLabel} {room.sentimentPct}%
                            </Badge>
                          </div>
                        </div>

                        {/* Right Side Indicators */}
                        <div className="flex flex-col items-end gap-2">
                          {room.unread > 0 && (
                            <Badge className="bg-[var(--danger)] text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                              {room.unread}
                            </Badge>
                          )}
                          {room.pinnedCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                              <Star className="h-3 w-3 text-yellow-400" />
                              <span>{room.pinnedCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Room Preview */}
            <div className="lg:col-span-1">
              <Card className="bg-[var(--panel)] border-[var(--muted)]/20 rounded-2xl p-6 h-[600px] flex flex-col">
                {selectedRoom ? (
                  <>
                    {/* Preview Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{selectedRoom.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[var(--text)]">{selectedRoom.name}</h3>
                          <Badge className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(selectedRoom.type)}`}>
                            {selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}
                          </Badge>
                        </div>
                        <Button 
                          className="bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-black font-semibold"
                          onClick={() => {
                            if (selectedRoom.isVIP) {
                              alert('VIP room access requires Pro membership. Please upgrade to continue.');
                            } else {
                              window.location.href = `/rooms/${selectedRoom.id}`;
                            }
                          }}
                        >
                          Join
                        </Button>
                      </div>

                      {/* Meta Chips */}
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-[var(--muted)]" />
                          <span className="text-[var(--text)] font-medium">{selectedRoom.membersOnline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-[var(--muted)]" />
                          <span className="text-[var(--text)] font-medium">{selectedRoom.msgsPerHr}</span>
                        </div>
                        <Badge className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(selectedRoom.sentimentLabel)}`}>
                          {selectedRoom.sentimentLabel} {selectedRoom.sentimentPct}%
                        </Badge>
                      </div>
                    </div>

                    {/* Sample Posts */}
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[var(--muted)] mb-3">Recent Messages</h4>
                      <div className="space-y-4">
                        {samplePosts.map((post) => (
                          <div key={post.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post.avatar} />
                              <AvatarFallback>{post.username[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-[var(--text)]">{post.username}</span>
                                <span className="text-xs text-[var(--muted)]">{post.timestamp}</span>
                              </div>
                              <p className="text-sm text-[var(--text)] line-clamp-2">
                                {post.content.split(' ').map((word, idx) => 
                                  word.startsWith('$') ? (
                                    <Badge key={idx} className="bg-[var(--accent)]/20 text-[var(--accent)] text-xs px-1 py-0.5 mx-0.5 rounded">
                                      {word}
                                    </Badge>
                                  ) : word + ' '
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-[var(--muted)]/20">
                      <Button 
                        className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-black font-semibold"
                        onClick={() => {
                          if (selectedRoom.isVIP) {
                            alert('VIP room access requires Pro membership. Please upgrade to continue.');
                          } else {
                            window.location.href = `/rooms/${selectedRoom.id}`;
                          }
                        }}
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        Open Room
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-[var(--muted)] mx-auto mb-3" />
                      <p className="text-[var(--muted)] text-sm">Select a room to see preview</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Mobile Fixed Bottom Button */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
            {selectedRoom && (
              <Button 
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-black font-semibold shadow-[var(--shadow)]"
                onClick={() => {
                  if (selectedRoom.isVIP) {
                    alert('VIP room access requires Pro membership. Please upgrade to continue.');
                  } else {
                    window.location.href = `/rooms/${selectedRoom.id}`;
                  }
                }}
              >
                Open {selectedRoom.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
