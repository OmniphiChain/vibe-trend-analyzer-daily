import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User,
  Mail,
  Calendar,
  Crown,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Award,
  Eye,
  EyeOff,
  Share2,
  Edit3,
  Settings,
  BarChart3,
  Activity,
  Zap,
  Star,
  MessageSquare,
  Users,
  ChevronRight,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

const ViewProfilePage = () => {
  const { user } = useAuth();
  const { moodState, moodIcon } = useMoodTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'Passionate about market sentiment analysis and fintech innovation.');
  const [isProfilePublic, setIsProfilePublic] = useState(true);

  // Mock data for demonstration
  const profileStats = {
    joinedDate: 'March 2024',
    moodScoreAvg: 72,
    predictionAccuracy: 78,
    watchlistSize: 12,
    communityRank: '#1,247',
    streakDays: 15
  };

  const watchlistData = [
    { symbol: 'AAPL', name: 'Apple Inc', sentiment: 'bullish', change: '+2.34%' },
    { symbol: 'TSLA', name: 'Tesla Inc', sentiment: 'bearish', change: '-1.23%' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', sentiment: 'bullish', change: '+5.67%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', sentiment: 'neutral', change: '+0.45%' }
  ];

  const achievements = [
    { 
      id: 1, 
      name: 'Mood Master', 
      description: '7-day mood tracking streak', 
      icon: '🎯', 
      earned: true,
      progress: 100
    },
    { 
      id: 2, 
      name: 'Bull Spotter', 
      description: 'Predicted 10 bullish moves correctly', 
      icon: '🐂', 
      earned: true,
      progress: 100
    },
    { 
      id: 3, 
      name: 'AI Whisperer', 
      description: 'Used AI insights 50 times', 
      icon: '🤖', 
      earned: false,
      progress: 76
    },
    { 
      id: 4, 
      name: 'Community Leader', 
      description: 'Top 10% in community engagement', 
      icon: '👑', 
      earned: false,
      progress: 45
    }
  ];

  const recentActivity = [
    { type: 'prediction', content: 'Predicted AAPL bullish move', time: '2 hours ago' },
    { type: 'watchlist', content: 'Added NVDA to watchlist', time: '5 hours ago' },
    { type: 'comment', content: 'Commented on Tesla sentiment analysis', time: '1 day ago' },
    { type: 'insight', content: 'Shared AI insight about tech sector', time: '2 days ago' }
  ];

  const savedNotes = [
    {
      id: 1,
      ticker: 'AAPL',
      title: 'Q4 Earnings Analysis',
      content: 'Strong revenue growth expected, watching for guidance on iPhone 15 sales...',
      tags: ['earnings', 'tech'],
      date: '2024-01-15'
    },
    {
      id: 2,
      ticker: 'TSLA',
      title: 'Cybertruck Production Update',
      content: 'Production ramp seems slower than expected, potential impact on Q1 deliveries...',
      tags: ['production', 'ev'],
      date: '2024-01-14'
    }
  ];

  const handleSaveBio = () => {
    setIsEditing(false);
    // Implementation for saving bio
    console.log('Saving bio:', bio);
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    // Show toast notification
    console.log('Profile URL copied to clipboard');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'bearish':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1F2937] via-[#3730A3] to-[#4338CA] dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-gray-400">View and manage your MoodMeter profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleShareProfile} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Snapshot */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-purple-500/30">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-2xl">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-400 mb-2">@{user?.username}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{user?.email}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Joined {profileStats.joinedDate}</span>
                    </div>
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                      <Crown className="w-3 h-3 mr-1" />
                      {user?.isPremium ? 'Pro' : 'Free'}
                    </Badge>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-300">Bio</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isEditing ? handleSaveBio() : setIsEditing(true)}
                      className="h-8 px-2 text-purple-400 hover:text-purple-300"
                    >
                      {isEditing ? <span className="text-xs">Save</span> : <Edit3 className="w-3 h-3" />}
                    </Button>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-black/20 border-purple-500/30 text-white resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed">{bio}</p>
                  )}
                </div>

                {/* Profile Visibility */}
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    {isProfilePublic ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                    <span className="text-sm text-white">Profile is {isProfilePublic ? 'Public' : 'Private'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProfilePublic(!isProfilePublic)}
                    className="h-8 text-purple-400 hover:text-purple-300"
                  >
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-300">Avg Mood Score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{profileStats.moodScoreAvg}</span>
                    <moodIcon.icon className="w-5 h-5" style={{ color: moodIcon.color }} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Prediction Accuracy</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{profileStats.predictionAccuracy}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Tracking Streak</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-400">{profileStats.streakDays} days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Community Rank</span>
                  </div>
                  <span className="text-lg font-bold text-blue-400">{profileStats.communityRank}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              {/* Tab Navigation */}
              <div className="bg-black/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-2">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-transparent gap-2">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="watchlist" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                    Watchlist
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Activity Overview */}
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <BarChart3 className="w-5 h-5" />
                      Activity Overview
                    </CardTitle>
                    <CardDescription>Your recent MoodMeter activity and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border border-purple-500/10 rounded-lg hover:bg-purple-500/5 transition-colors">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                            {activity.type === 'prediction' && <TrendingUp className="w-4 h-4 text-green-400" />}
                            {activity.type === 'watchlist' && <Star className="w-4 h-4 text-yellow-400" />}
                            {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                            {activity.type === 'insight' && <Brain className="w-4 h-4 text-purple-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{activity.content}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Mood Score Chart Placeholder */}
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Activity className="w-5 h-5" />
                      Mood Score History
                    </CardTitle>
                    <CardDescription>Your sentiment tracking over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-400">Mood Score Chart</p>
                        <p className="text-sm text-gray-500">Interactive chart showing your mood tracking history</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Watchlist Tab */}
              <TabsContent value="watchlist" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Star className="w-5 h-5" />
                      My Watchlist ({watchlistData.length}/12)
                    </CardTitle>
                    <CardDescription>Stocks you're tracking with sentiment analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {watchlistData.map((stock, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg hover:bg-purple-500/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                              <span className="font-bold text-purple-300">{stock.symbol}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{stock.symbol}</h4>
                              <p className="text-sm text-gray-400">{stock.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={`${getSentimentColor(stock.sentiment)} border`}>
                              {stock.sentiment}
                            </Badge>
                            <span className={`font-medium ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {stock.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-purple-500/30 hover:bg-purple-500/10">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Add New Stock
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements Tab */}
              <TabsContent value="achievements" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Award className="w-5 h-5" />
                      Achievements & Badges
                    </CardTitle>
                    <CardDescription>Your MoodMeter accomplishments and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className={`p-4 border rounded-lg transition-all ${
                            achievement.earned 
                              ? 'border-green-500/30 bg-green-500/5' 
                              : 'border-purple-500/20 hover:bg-purple-500/5'
                          }`}
                        >
                          <div className="flex items-start gap-4 mb-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white">{achievement.name}</h4>
                                {achievement.earned && (
                                  <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                                    Earned
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-white">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <MessageSquare className="w-5 h-5" />
                      Saved Notes & Insights
                    </CardTitle>
                    <CardDescription>Your personal research notes and AI insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {savedNotes.map((note) => (
                        <div key={note.id} className="p-4 border border-purple-500/20 rounded-lg hover:bg-purple-500/5 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                                {note.ticker}
                              </Badge>
                              <h4 className="font-medium text-white">{note.title}</h4>
                            </div>
                            <span className="text-xs text-gray-400">{note.date}</span>
                          </div>
                          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{note.content}</p>
                          <div className="flex items-center gap-2">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 border-purple-500/30 hover:bg-purple-500/10">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Create New Note
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
