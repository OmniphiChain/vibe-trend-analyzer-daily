import { useState } from "react";
import { ArrowLeft, Bell, Star, Users, Calendar, Check, X, Crown, Zap, Shield, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SubscriptionPlanProps {
  planId: string;
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

export const SubscriptionPlan = ({ planId, onNavigate, onBack }: SubscriptionPlanProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Mock subscription data
  const subscription = {
    id: planId,
    title: "Premium Trading Signals",
    description: "Get real-time trade alerts and market analysis from verified professional traders",
    
    instructor: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      title: "Professional Options Trader",
      credibilityScore: 95,
      followers: 12500,
      experience: "8+ years"
    },

    pricing: {
      monthly: { price: 79, originalPrice: 99 },
      yearly: { price: 790, originalPrice: 1188, savings: 398 }
    },

    stats: {
      subscribers: 2340,
      rating: 4.8,
      totalRatings: 156,
      signalsPerWeek: "15-20",
      avgReturn: "+18.7%",
      winRate: "78%"
    },

    features: {
      included: [
        "Real-time trade alerts via SMS/Email/App",
        "Detailed entry and exit strategies", 
        "Risk management guidelines for each trade",
        "Weekly market outlook and analysis",
        "Access to private Discord community",
        "Live Q&A sessions (2x per month)",
        "Historical performance tracking",
        "Mobile app with push notifications"
      ],
      premium: [
        "Video explanations for complex setups",
        "One-on-one monthly coaching call",
        "Early access to new strategies",
        "Custom watchlist recommendations",
        "Priority support and faster responses"
      ]
    },

    testimonials: [
      {
        id: 1,
        user: "Mike Rodriguez",
        avatar: "/placeholder.svg",
        rating: 5,
        comment: "Sarah's signals have transformed my trading. Clear instructions and excellent risk management. Worth every penny!",
        return: "+24.3%",
        timeframe: "3 months"
      },
      {
        id: 2,
        user: "Emily Chen",
        avatar: "/placeholder.svg", 
        rating: 5,
        comment: "The Discord community is incredibly valuable. Being able to discuss trades with other members is a huge plus.",
        return: "+31.8%",
        timeframe: "6 months"
      },
      {
        id: 3,
        user: "James Wilson",
        avatar: "/placeholder.svg",
        rating: 4,
        comment: "Great signals and analysis. The weekly outlook helps me understand the bigger picture.",
        return: "+19.2%", 
        timeframe: "4 months"
      }
    ],

    recentSignals: [
      {
        id: 1,
        symbol: "AAPL",
        strategy: "Bull Call Spread",
        signalTime: "2 hours ago",
        entry: "$175-176",
        target: "$182-185",
        stopLoss: "$172",
        status: "active",
        confidence: "High"
      },
      {
        id: 2,
        symbol: "MSFT", 
        strategy: "Covered Call",
        signalTime: "1 day ago",
        entry: "$420",
        target: "$430",
        stopLoss: "$410",
        status: "closed",
        result: "+12.4%",
        confidence: "Medium"
      },
      {
        id: 3,
        symbol: "TSLA",
        strategy: "Cash-Secured Put",
        signalTime: "3 days ago", 
        entry: "$240",
        target: "$255",
        stopLoss: "$230",
        status: "active",
        confidence: "High"
      }
    ]
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const getCurrentPrice = () => {
    return subscription.pricing[billingCycle].price;
  };

  const getOriginalPrice = () => {
    return subscription.pricing[billingCycle].originalPrice;
  };

  const getSavings = () => {
    return billingCycle === "yearly" ? subscription.pricing.yearly.savings : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to TradeHub
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="default">
                  <Bell className="h-3 w-3 mr-1" />
                  SUBSCRIPTION
                </Badge>
                <Badge variant="secondary">Premium</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{subscription.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{subscription.description}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{subscription.stats.rating}</span>
                  <span className="text-muted-foreground">({subscription.stats.totalRatings} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{subscription.stats.subscribers.toLocaleString()} subscribers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span>{subscription.stats.signalsPerWeek} signals/week</span>
                </div>
                <div className="text-green-500 font-medium">
                  {subscription.stats.avgReturn} avg return
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={subscription.instructor.avatar} />
                    <AvatarFallback className="text-lg">{subscription.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{subscription.instructor.name}</h3>
                    <p className="text-muted-foreground mb-2">{subscription.instructor.title}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">
                        <Trophy className="h-3 w-3 mr-1" />
                        {subscription.instructor.credibilityScore}/100
                      </Badge>
                      <span className="text-muted-foreground">{subscription.instructor.followers.toLocaleString()} followers</span>
                      <span className="text-muted-foreground">{subscription.instructor.experience} experience</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="signals">Recent Signals</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subscription.features.included.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-500" />
                      Premium Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subscription.features.premium.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      Premium features available with yearly subscription
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{subscription.stats.avgReturn}</div>
                        <div className="text-sm text-muted-foreground">Average Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{subscription.stats.winRate}</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{subscription.stats.signalsPerWeek}</div>
                        <div className="text-sm text-muted-foreground">Signals/Week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Signals Tab */}
              <TabsContent value="signals" className="space-y-6">
                <div className="space-y-4">
                  {subscription.recentSignals.map((signal) => (
                    <Card key={signal.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{signal.symbol}</h3>
                              <Badge variant={signal.status === 'active' ? 'default' : 'secondary'}>
                                {signal.status.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={
                                signal.confidence === 'High' ? 'text-green-600' : 'text-yellow-600'
                              }>
                                {signal.confidence} Confidence
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{signal.strategy}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">{signal.signalTime}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Entry</div>
                            <div className="font-medium">{signal.entry}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Target</div>
                            <div className="font-medium text-green-600">{signal.target}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Stop Loss</div>
                            <div className="font-medium text-red-600">{signal.stopLoss}</div>
                          </div>
                          {signal.result && (
                            <div>
                              <div className="text-muted-foreground">Result</div>
                              <div className="font-medium text-green-600">{signal.result}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {!isSubscribed && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Subscribe to Access All Signals</h3>
                      <p className="text-muted-foreground mb-4">
                        Get real-time alerts and detailed analysis for all trading opportunities
                      </p>
                      <Button onClick={handleSubscribe}>Subscribe Now</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Private Discord Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Join our exclusive Discord server with over 2,000 active traders. Share insights, 
                        discuss strategies, and learn from fellow subscribers.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">📈 Trading Discussions</h4>
                          <p className="text-sm text-muted-foreground">
                            Real-time market discussions and trade analysis
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold">🎓 Educational Content</h4>
                          <p className="text-sm text-muted-foreground">
                            Exclusive tutorials and strategy breakdowns
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold">💡 Q&A Sessions</h4>
                          <p className="text-sm text-muted-foreground">
                            Live sessions with Sarah twice per month
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold">📊 Performance Tracking</h4>
                          <p className="text-sm text-muted-foreground">
                            Share and compare your trading results
                          </p>
                        </div>
                      </div>
                      
                      {isSubscribed ? (
                        <Button className="w-full md:w-auto">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Join Discord Server
                        </Button>
                      ) : (
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            🔒 Discord access is available to subscribers only
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Subscriber Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription.stats.totalRatings} reviews • {subscription.stats.rating} average rating
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{subscription.stats.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {subscription.testimonials.map((review) => (
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
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{review.return} return</span>
                                  <span>•</span>
                                  <span>{review.timeframe} subscriber</span>
                                </div>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                  <span className={billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}>
                    Monthly
                  </span>
                  <Switch
                    checked={billingCycle === "yearly"}
                    onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                  />
                  <span className={billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}>
                    Yearly
                  </span>
                  {billingCycle === "yearly" && (
                    <Badge variant="secondary" className="text-green-600">
                      Save 33%
                    </Badge>
                  )}
                </div>
                
                {/* Price Display */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    ${getCurrentPrice()}
                    <span className="text-lg text-muted-foreground">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  {getOriginalPrice() && (
                    <div className="text-lg text-muted-foreground line-through">
                      ${getOriginalPrice()}/{billingCycle === "monthly" ? "month" : "year"}
                    </div>
                  )}
                  {getSavings() && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${getSavings()} per year
                    </div>
                  )}
                </div>
                
                {/* Subscribe Button */}
                {isSubscribed ? (
                  <div className="space-y-2">
                    <Button variant="secondary" className="w-full" size="lg">
                      <Check className="h-4 w-4 mr-2" />
                      Subscribed
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleSubscribe}>
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleSubscribe}>
                    Subscribe Now
                  </Button>
                )}
                
                {/* Features Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Real-time trade alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Private Discord access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Weekly market analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-center">Why Choose This Service?</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-sm">95/100 Credibility Score</div>
                      <div className="text-xs text-muted-foreground">Verified professional trader</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-sm">4.8/5 Rating</div>
                      <div className="text-xs text-muted-foreground">From 156 verified reviews</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm">2,340 Active Subscribers</div>
                      <div className="text-xs text-muted-foreground">Growing community</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Money Back Guarantee */}
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">30-Day Money Back Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
