import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  ArrowRight, 
  MessageSquare, 
  Users, 
  Eye,
  Navigation,
  Mouse,
  Smartphone,
} from "lucide-react";

interface ProfileNavigationDemoProps {
  onNavigateToProfile?: (userId: string) => void;
}

export const ProfileNavigationDemo: React.FC<ProfileNavigationDemoProps> = ({ 
  onNavigateToProfile 
}) => {
  const demoUsers = [
    {
      id: "user-cryptowolf",
      username: "cryptowolf",
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
      role: "Top 1% Trader"
    },
    {
      id: "user-techtrader", 
      username: "techtrader",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=faces",
      role: "AI Specialist"
    },
    {
      id: "user-quantanalyst",
      username: "quantanalyst",
      name: "Michael Rodriguez", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
      role: "Quant Expert"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Navigation className="h-6 w-6" />
            Profile Navigation System
          </CardTitle>
          <p className="text-muted-foreground">
            Seamless navigation to trader profiles throughout MoodMeter - just like Instagram, Twitter, or StockTwits
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Navigation Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Mouse className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Click Navigation</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Click username anywhere → User profile</li>
                  <li>• Click profile picture → User profile</li>
                  <li>• Click @mentions in posts → User profile</li>
                  <li>• Click your own avatar → Your profile</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Smart Routing</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dynamic user profile URLs</li>
                  <li>• Back navigation to previous page</li>
                  <li>• Context-aware breadcrumbs</li>
                  <li>• Mobile-optimized navigation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo User Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Try It: Click Any User to View Their Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
                  onClick={() => onNavigateToProfile?.(user.id)}
                >
                  <CardContent className="p-4 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-gray-200 hover:ring-blue-500 transition-all">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {user.role}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Implementation Details */}
          <Card className="bg-gray-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Implementation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Where It Works:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Community posts and comments</li>
                    <li>• Chat messages and mentions</li>
                    <li>• Leaderboards and rankings</li>
                    <li>• Social feeds and timelines</li>
                    <li>• User search results</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⚡ Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Instant navigation (no page reload)</li>
                    <li>• Dynamic user data loading</li>
                    <li>• Back button support</li>
                    <li>• Mobile-friendly design</li>
                    <li>• Breadcrumb navigation</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2">💡 Example Navigation Paths:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Community Feed</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">@cryptowolf Profile</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Back to Community</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Header Avatar</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono bg-green-100 dark:bg-green-900 px-2 py-1 rounded">My Profile</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Implementation */}
          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Technical Implementation
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Dynamic Routing:</strong> App.tsx handles user profile routes with userId parameters
                </p>
                <p>
                  <strong>Component Props:</strong> PostCard, Community, and other components accept onUserClick handlers
                </p>
                <p>
                  <strong>Navigation Utils:</strong> Centralized profile navigation utilities in utils/profileNavigation.ts
                </p>
                <p>
                  <strong>User Data:</strong> Mock user resolver that will be replaced with real API calls
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileNavigationDemo;
