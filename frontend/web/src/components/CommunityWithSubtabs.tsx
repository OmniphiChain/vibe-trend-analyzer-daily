import { useState } from "react";
import {
  Users,
  MessageSquare,
  Gamepad2,
  Coffee,
  Hash,
  TrendingUp,
  Flame,
  Eye,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SentimentPostWall } from "./SentimentPostWall";
import { ChatSubcategory } from "./social/ChatSubcategory";
import { LiveChatRooms } from "./social/LiveChatRooms";
import { CommunityRooms } from "./social/CommunityRooms";
import { PrivateRoomsContainer } from "./privateRooms/PrivateRoomsContainer";
import { CommunityHubUpgraded } from "./CommunityHubUpgraded";
import { ProfileNavigationProvider } from "./social/ProfileNavigationProvider";
import { UnifiedRoomsBuilder } from "./builder/UnifiedRoomsBuilder";

interface CommunityWithSubtabsProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const CommunityWithSubtabs = ({ onNavigateToProfile }: CommunityWithSubtabsProps) => {
  const [activeSubtab, setActiveSubtab] = useState("sentiment-feed");

  const handleNavigateToProfile = (userId: string) => {
    console.log(`Navigating to profile: ${userId}`);
    onNavigateToProfile?.(userId);
  };

  const handleTickerClick = (ticker: string) => {
    console.log(`Navigating to ticker: ${ticker}`);
    // Handle ticker navigation
  };

  const handleHashtagClick = (hashtag: string) => {
    console.log(`Navigating to hashtag: ${hashtag}`);
    // Handle hashtag navigation
  };

  return (
    <ProfileNavigationProvider
      onNavigate={handleNavigateToProfile}
      onTickerClick={handleTickerClick}
      onHashtagClick={handleHashtagClick}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="text-center space-y-3 py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MoodMeter Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with traders, share insights, and build your network in our comprehensive community platform
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="sticky top-16 z-40 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-4">
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <Tabs value={activeSubtab} onValueChange={setActiveSubtab}>
                  <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800">
                    <TabsTrigger
                      value="sentiment-feed"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Pro Feed</span>
                      <span className="sm:hidden">Feed</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="unified-rooms"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      <Hash className="h-4 w-4" />
                      <span className="hidden sm:inline">Rooms</span>
                      <span className="sm:hidden">Rooms</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="private-watchlist"
                      className="flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Private Watchlist</span>
                      <span className="sm:hidden">Watchlist</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="space"
                      className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="hidden sm:inline">Community</span>
                      <span className="sm:hidden">Community</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content */}
                  <div className="mt-6">
                    <TabsContent value="sentiment-feed" className="m-0">
                      <SentimentPostWall onNavigateToProfile={handleNavigateToProfile} />
                    </TabsContent>

                    <TabsContent value="unified-rooms" className="m-0">
                      <UnifiedRoomsBuilder
                        title="Rooms"
                        subtitle="Join real-time discussions by ticker, sector, and strategy."
                        showSearch={true}
                        showFilters={true}
                        showSort={true}
                        maxRooms={8}
                        onNavigateToProfile={handleNavigateToProfile}
                      />
                    </TabsContent>

                    <TabsContent value="private-watchlist" className="m-0">
                      <div className="mb-4">
                        <h2 className="text-2xl font-semibold mb-2">Private Watchlist</h2>
                        <p className="text-muted-foreground">
                          Your personal collection of stocks, crypto, and securities for tracking and analysis
                        </p>
                      </div>
                      <PrivateRoomsContainer />
                    </TabsContent>

                    <TabsContent value="space" className="m-0">
                      <CommunityHubUpgraded onNavigateToProfile={handleNavigateToProfile} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProfileNavigationProvider>
  );
};
