import { useState } from "react";
import { ArrowLeft, Star, Trophy, Users, TrendingUp, BookOpen, Bell, MessageSquare, Share2, Flag, Calendar, DollarSign, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface TraderProfileProps {
  traderId: string;
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

export const TraderProfile = ({ traderId, onNavigate, onBack }: TraderProfileProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Mock trader data - in real app this would come from API
  const trader = {
    id: traderId,
    name: "Sarah Chen",
    username: "@sarahchen_trader",
    avatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    bio: "Options trading specialist with 8+ years of experience. Former Goldman Sachs quant analyst turned independent trader. Sharing proven strategies that generated consistent profits through bull and bear markets.",
    credibilityScore: 95,
    followers: 12500,
    following: 340,
    joinDate: "January 2019",
    expertise: ["Options Trading", "Risk Management", "Technical Analysis", "Earnings Plays"],
    monthlyReturn: "+23.4%",
    yearlyReturn: "+187.3%",
    winRate: "78%",
    maxDrawdown: "-8.2%",
    isVerified: true,
    isOnline: true,
    badges: ["Diamond Trader", "Top Educator", "Verified Professional"],
    location: "New York, NY",
    website: "https://sarahchen.trading",
    
    stats: {
      totalCourses: 8,
      totalStudents: 3420,
      totalSubscribers: 2340,
      avgRating: 4.9,
      totalEarnings: 125000,
      coursesCompleted: 156
    }
  };

  // Mock products data
  const products = [
    {
      id: 1,
      title: "Advanced Options Strategies for Bull Markets",
      type: "course",
      price: 199,
      rating: 4.9,
      students: 1200,
      duration: "8h 30m",
      lessons: 24,
      badge: "BESTSELLER",
      description: "Master advanced options strategies used by professional traders",
      lastUpdated: "2 weeks ago"
    },
    {
      id: 2,
      title: "Weekly Options Alerts",
      type: "subscription",
      price: 79,
      period: "monthly",
      subscribers: 456,
      badge: "POPULAR",
      description: "Real-time options alerts with detailed analysis and entry/exit points",
      features: ["Daily market analysis", "Real-time alerts", "Private Discord access"]
    },
    {
      id: 3,
      title: "Earnings Season Playbook",
      type: "course",
      price: 149,
      rating: 4.8,
      students: 890,
      duration: "5h 15m",
      lessons: 18,
      description: "How to profit from earnings announcements using options"
    }
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Mike Thompson",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "2 weeks ago",
      course: "Advanced Options Strategies",
      comment: "Incredible course! Sarah's teaching style is clear and practical. I've already implemented several strategies with great success. The risk management section alone was worth the price."
    },
    {
      id: 2,
      user: "Jennifer Walsh",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "1 month ago",
      course: "Weekly Options Alerts",
      comment: "The alerts are spot on. Sarah provides excellent analysis and the timing is perfect. My portfolio has grown 15% since subscribing."
    },
    {
      id: 3,
      user: "David Kim",
      avatar: "/placeholder.svg",
      rating: 4,
      date: "6 weeks ago",
      course: "Earnings Season Playbook",
      comment: "Great strategies for earnings plays. The content is well-structured and easy to follow. Would love to see more advanced techniques in future updates."
    }
  ];

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-gray-500";
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to TradeHub
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {/* Cover Image */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 to-purple-600/20 relative">
              <div className="absolute inset-0 bg-black/20" />
            </div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 md:-mt-16">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                    <AvatarImage src={trader.avatar} />
                    <AvatarFallback className="text-2xl">{trader.name[0]}</AvatarFallback>
                  </Avatar>
                  {trader.isOnline && (
                    <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Name and Actions */}
                <div className="flex-1 md:ml-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold">{trader.name}</h1>
                        {trader.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{trader.username}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📍 {trader.location}</span>
                        <span>📅 Joined {trader.joinDate}</span>
                        {trader.isOnline && <span className="text-green-500">🟢 Online</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant={isFollowing ? "secondary" : "default"}
                        onClick={handleFollow}
                        className="min-w-24"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button
                        variant={isSubscribed ? "secondary" : "outline"}
                        onClick={handleSubscribe}
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-muted-foreground leading-relaxed max-w-3xl">{trader.bio}</p>
              </div>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {trader.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Achievement Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {trader.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="bg-primary/10 text-primary">
                    <Trophy className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getCredibilityColor(trader.credibilityScore)}`}>
                {trader.credibilityScore}
              </div>
              <div className="text-sm text-muted-foreground">Credibility</div>
              <Progress value={trader.credibilityScore} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{trader.followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{trader.monthlyReturn}</div>
              <div className="text-sm text-muted-foreground">Monthly Return</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{trader.winRate}</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{trader.stats.totalCourses}</div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{trader.stats.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">📚 Products</TabsTrigger>
            <TabsTrigger value="posts">📝 Posts</TabsTrigger>
            <TabsTrigger value="reviews">⭐ Reviews</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                      {product.badge && (
                        <Badge variant={product.badge === "BESTSELLER" ? "default" : "secondary"}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {product.type === "course" ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                          <span>{product.students} students</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {product.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {product.lessons} lessons
                          </div>
                        </div>
                        
                        {product.lastUpdated && (
                          <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{product.subscribers} subscribers</span>
                          <Badge variant="outline">Subscription</Badge>
                        </div>
                        
                        {product.features && (
                          <div className="space-y-1">
                            {product.features.map((feature) => (
                              <div key={feature} className="text-xs text-muted-foreground flex items-center gap-1">
                                <div className="h-1 w-1 bg-current rounded-full" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ${product.price}
                        {product.period && <span className="text-sm text-muted-foreground">/{product.period}</span>}
                      </div>
                      <Button size="sm">
                        {product.type === "course" ? "Enroll" : "Subscribe"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground">
                  {trader.name} hasn't shared any posts yet. Follow to be notified when they do!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Student Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  {reviews.length} reviews • {trader.stats.avgRating} average rating
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{trader.stats.avgRating}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <p className="text-sm text-muted-foreground">{review.course} • {review.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
