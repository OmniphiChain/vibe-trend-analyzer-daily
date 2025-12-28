import { useState } from "react";
import { Search, Filter, Star, TrendingUp, BookOpen, Bell, Trophy, Play, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TradeHubProps {
  onNavigate?: (section: string) => void;
}

export const TradeHub = ({ onNavigate }: TradeHubProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Mock data for featured traders
  const featuredTraders = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      credibilityScore: 95,
      followers: 12500,
      expertise: "Options Trading",
      monthlyReturn: "+23.4%",
      isVerified: true,
      badge: "Diamond Trader",
      courses: 8,
      subscribers: 2340
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      avatar: "/placeholder.svg",
      credibilityScore: 88,
      followers: 8900,
      expertise: "Swing Trading",
      monthlyReturn: "+18.7%",
      isVerified: true,
      badge: "Gold Trader",
      courses: 5,
      subscribers: 1850
    },
    {
      id: 3,
      name: "Alex Thompson",
      avatar: "/placeholder.svg",
      credibilityScore: 92,
      followers: 15200,
      expertise: "Crypto Analysis",
      monthlyReturn: "+31.2%",
      isVerified: true,
      badge: "Platinum Trader",
      courses: 12,
      subscribers: 3120
    }
  ];

  // Mock data for trending content
  const trendingContent = [
    {
      id: 1,
      title: "Advanced Options Strategies for Bull Markets",
      type: "course",
      price: 199,
      rating: 4.9,
      students: 1200,
      instructor: "Sarah Chen",
      duration: "8h 30m",
      badge: "BESTSELLER"
    },
    {
      id: 2,
      title: "Daily Swing Trade Alerts",
      type: "subscription",
      price: 49,
      period: "monthly",
      rating: 4.7,
      subscribers: 340,
      instructor: "Marcus Rodriguez",
      badge: "HOT"
    },
    {
      id: 3,
      title: "Crypto Technical Analysis Masterclass",
      type: "course",
      price: 299,
      rating: 4.8,
      students: 890,
      instructor: "Alex Thompson",
      duration: "12h 15m",
      badge: "NEW"
    }
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: TrendingUp },
    { id: "courses", label: "📚 Courses", icon: BookOpen },
    { id: "signals", label: "📈 Signals", icon: Bell },
    { id: "strategies", label: "🧠 Strategies", icon: Trophy },
    { id: "mentorship", label: "🎓 Mentorship", icon: Users }
  ];

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-yellow-500";
    return "text-gray-500";
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 90) return "Diamond";
    if (score >= 80) return "Platinum";
    if (score >= 70) return "Gold";
    return "Silver";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-foreground dark:text-transparent dark:bg-gradient-to-r dark:from-primary dark:to-purple-600 dark:bg-clip-text">
              💼 TradeHub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground dark:text-white max-w-2xl mx-auto font-medium">
            Learn from verified traders, access premium strategies, and monetize your trading expertise
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Badge className="text-sm bg-green-50 text-green-800 border-green-200 hover:bg-green-100 transition-colors font-semibold px-4 py-2">
              <Star className="h-3 w-3 mr-1" />
              Verified Educators Only
            </Badge>
            <Badge className="text-sm bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 transition-colors font-semibold px-4 py-2">
              <Trophy className="h-3 w-3 mr-1" />
              Credibility-Based Rankings
            </Badge>
            <Badge className="text-sm bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 transition-colors font-semibold px-4 py-2">
              <Users className="h-3 w-3 mr-1" />
              Community Driven
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, strategies, or traders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="under50">Under $50</SelectItem>
                <SelectItem value="50to200">$50 - $200</SelectItem>
                <SelectItem value="over200">Over $200</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="marketplace" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace">🏪 Marketplace</TabsTrigger>
            <TabsTrigger value="featured">⭐ Featured</TabsTrigger>
            <TabsTrigger value="trending">🔥 Trending</TabsTrigger>
            <TabsTrigger value="creators">👥 Top Creators</TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingContent.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "BESTSELLER" ? "default" : "secondary"}
                          className={
                            item.badge === "BESTSELLER"
                              ? "bg-green-600 text-white border-green-700 font-bold shadow-md"
                              : item.badge === "HOT"
                              ? "bg-red-500 text-white border-red-600 font-bold shadow-md"
                              : "bg-blue-600 text-white border-blue-700 font-bold shadow-md"
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{item.instructor[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground dark:text-white font-medium">{item.instructor}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground dark:text-white font-medium">
                        {item.type === "course" ? `${item.students} students` : `${item.subscribers} subscribers`}
                      </span>
                    </div>
                    
                    {item.type === "course" && item.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white font-medium">
                        <Play className="h-3 w-3" />
                        {item.duration}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-2xl font-bold text-foreground dark:text-primary">
                        ${item.price}
                        {item.period && <span className="text-sm text-muted-foreground dark:text-white font-medium">/{item.period}</span>}
                      </div>
                      <Button size="sm">
                        {item.type === "course" ? "Enroll Now" : "Subscribe"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Tab */}
          <TabsContent value="featured" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Featured This Week</h2>
              <p className="text-muted-foreground dark:text-white font-medium">Hand-picked content from our top-rated educators</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trendingContent.slice(0, 2).map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-foreground dark:text-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Badge
                          variant="secondary"
                          className={
                            item.badge === "BESTSELLER"
                              ? "bg-green-600 text-white border-green-700 font-bold shadow-md mb-2"
                              : item.badge === "HOT"
                              ? "bg-red-500 text-white border-red-600 font-bold shadow-md mb-2"
                              : "bg-blue-600 text-white border-blue-700 font-bold shadow-md mb-2"
                          }
                        >
                          {item.badge}
                        </Badge>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground dark:text-white font-medium">by {item.instructor}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{item.rating}</span>
                          </div>
                          <span className="text-lg font-bold text-foreground dark:text-primary">${item.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">🔥 Trending Now</h2>
              <p className="text-muted-foreground dark:text-white font-medium">Most popular content based on community engagement</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingContent.map((item, index) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow relative">
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground dark:text-white font-medium mb-4">by {item.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+{Math.floor(Math.random() * 50 + 10)}%</span>
                      </div>
                      <span className="text-lg font-bold text-foreground dark:text-primary">${item.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Creators Tab */}
          <TabsContent value="creators" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">👥 Top Creators</h2>
              <p className="text-muted-foreground dark:text-white font-medium">Verified traders with the highest credibility scores</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTraders.map((trader) => (
                <Card key={trader.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={trader.avatar} />
                      <AvatarFallback className="text-lg">{trader.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-semibold mb-2">{trader.name}</h3>
                    <p className="text-muted-foreground dark:text-white font-medium mb-3">{trader.expertise}</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge
                        variant={trader.credibilityScore >= 90 ? "default" : "secondary"}
                        className={
                          trader.credibilityScore >= 90
                            ? "bg-green-600 text-white border-green-700 font-bold shadow-md"
                            : trader.credibilityScore >= 80
                            ? "bg-blue-600 text-white border-blue-700 font-bold shadow-md"
                            : trader.credibilityScore >= 70
                            ? "bg-yellow-600 text-white border-yellow-700 font-bold shadow-md"
                            : "bg-gray-600 text-white border-gray-700 font-bold shadow-md"
                        }
                      >
                        <Trophy className="h-3 w-3 mr-1" />
                        {trader.credibilityScore}/100
                      </Badge>
                      {trader.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-indigo-600 text-white border-indigo-700 font-bold shadow-md"
                        >
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <div className="font-semibold text-green-500">{trader.monthlyReturn}</div>
                        <div className="text-muted-foreground dark:text-white font-medium">Monthly Return</div>
                      </div>
                      <div>
                        <div className="font-semibold">{trader.followers.toLocaleString()}</div>
                        <div className="text-muted-foreground dark:text-white font-medium">Followers</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <div className="font-semibold">{trader.courses}</div>
                        <div className="text-muted-foreground dark:text-white font-medium">Courses</div>
                      </div>
                      <div>
                        <div className="font-semibold">{trader.subscribers.toLocaleString()}</div>
                        <div className="text-muted-foreground dark:text-white font-medium">Subscribers</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button size="sm" className="flex-1">
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action for Creators */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground dark:text-white">Ready to Monetize Your Trading Expertise?</h2>
              <p className="text-muted-foreground dark:text-white font-medium mb-6 max-w-2xl mx-auto">
                Join our community of verified traders and start earning from your knowledge.
                Share courses, offer subscriptions, and build your following.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="min-w-48">
                  Apply to Become a Creator
                </Button>
                <Button size="lg" variant="outline" className="min-w-48">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
