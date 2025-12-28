import { useState } from "react";
import {
  User as UserIcon,
  Camera,
  Edit3,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Trophy,
  Target,
  TrendingUp,
  Settings,
  Save,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types/user";

export const UserProfile = () => {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>(user || {});

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const success = await updateUser(editedUser);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-2xl">
                  {(user.firstName?.[0] || user.username[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full p-2"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={editedUser.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={editedUser.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editedUser.username || ""}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      placeholder="Username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editedUser.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedUser.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedUser.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedUser.website || ""}
                      onChange={(e) =>
                        handleInputChange("website", e.target.value)
                      }
                      placeholder="https://yourwebsite.com"
                      type="url"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.username}
                    </h1>
                    <div className="flex gap-2">
                      {user.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                          Verified
                        </Badge>
                      )}
                      {user.isPremium && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                        >
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-lg mb-4">
                    @{user.username}
                  </p>

                  {user.bio && (
                    <p className="text-foreground mb-4">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {user.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={user.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          {user.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Predictions
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.stats.totalPredictions}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.stats.accurateePredictions} accurate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accuracy Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${getAccuracyColor(user.stats.accuracyRate)}`}
                >
                  {user.stats.accuracyRate}%
                </div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Streak
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.stats.currentStreak}
                </div>
                <p className="text-xs text-muted-foreground">
                  Best: {user.stats.longestStreak}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Points Earned
                </CardTitle>
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.stats.totalPointsEarned}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user.stats.totalLogins} logins
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Towards Next Level */}
          <Card>
            <CardHeader>
              <CardTitle>Progress to Next Level</CardTitle>
              <CardDescription>
                Earn more points to unlock new features and badges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Level 3</span>
                <span>Level 4</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-muted-foreground">
                750 / 1000 points to next level
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges Earned</CardTitle>
              <CardDescription>
                Unlock badges by achieving milestones and demonstrating
                expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {user.stats.badgesEarned.map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-center capitalize">
                      {badge.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Available Badges</CardTitle>
              <CardDescription>
                Keep making predictions to unlock these badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "master_predictor",
                  "streak_king",
                  "sentiment_guru",
                  "community_leader",
                ].map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 bg-muted/20 rounded-lg opacity-50"
                  >
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
                      <Trophy className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-center capitalize text-muted-foreground">
                      {badge.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent actions and predictions on MoodMeter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Made a prediction on tech sentiment",
                    time: "2 hours ago",
                    type: "prediction",
                  },
                  {
                    action: 'Created new watchlist "AI Stocks"',
                    time: "1 day ago",
                    type: "watchlist",
                  },
                  {
                    action: "Saved insight about market volatility",
                    time: "2 days ago",
                    type: "insight",
                  },
                  {
                    action: "Updated profile information",
                    time: "3 days ago",
                    type: "profile",
                  },
                  {
                    action: "Joined MoodMeter community",
                    time: formatDate(user.createdAt),
                    type: "signup",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Manage your account preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Change Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserIcon className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <X className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
