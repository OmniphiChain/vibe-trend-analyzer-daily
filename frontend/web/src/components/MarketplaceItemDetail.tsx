import React, { useState } from 'react';
import { ArrowLeft, Share2, Bookmark, BookOpen, Check, Users, Clock, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InstructorProfile } from '@/components/InstructorProfile';

interface MarketplaceItem {
  id: number;
  title: string;
  type: 'course' | 'subscription';
  price: number;
  rating: number;
  students?: number;
  subscribers?: number;
  instructor: string;
  duration?: string;
  period?: string;
  badge: string;
}

interface TraderProfile {
  id: number;
  name: string;
  avatar: string;
  credibilityScore: number;
  followers: number;
  expertise: string;
  monthlyReturn: string;
  isVerified: boolean;
  badge: string;
  courses: number;
  subscribers: number;
}

interface MarketplaceItemDetailProps {
  item: MarketplaceItem;
  trader: TraderProfile;
  onBack: () => void;
}

export const MarketplaceItemDetail: React.FC<MarketplaceItemDetailProps> = ({
  item,
  trader,
  onBack,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getCredibilityBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-600 text-white border-green-700';
    if (score >= 80) return 'bg-blue-600 text-white border-blue-700';
    if (score >= 70) return 'bg-yellow-600 text-white border-yellow-700';
    return 'bg-gray-600 text-white border-gray-700';
  };

  // Mock data for curriculum
  const curriculum = [
    { id: 1, title: 'Module 1: Introduction to Options Trading', lessons: 5, duration: '1h 30m' },
    { id: 2, title: 'Module 2: Bull Call Spreads', lessons: 6, duration: '2h 15m' },
    { id: 3, title: 'Module 3: Advanced Strategies', lessons: 8, duration: '3h 45m' },
  ];

  // Mock data for reviews
  const reviews = [
    { id: 1, author: 'John Doe', rating: 5, comment: 'Excellent course! Very comprehensive and well-structured.', date: '2 days ago' },
    { id: 2, author: 'Jane Smith', rating: 4.5, comment: 'Great insights and practical examples. Would recommend!', date: '1 week ago' },
    { id: 3, author: 'Mike Johnson', rating: 5, comment: 'This course helped me understand options trading much better.', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={isWishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
            >
              <Bookmark className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    {item.badge && (
                      <Badge
                        className={
                          item.badge === 'BESTSELLER'
                            ? 'bg-green-600 text-white border-green-700 font-bold'
                            : item.badge === 'HOT'
                            ? 'bg-red-500 text-white border-red-600 font-bold'
                            : 'bg-blue-600 text-white border-blue-700 font-bold'
                        }
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h1>
                </div>
              </div>

              {/* Hero Image/Icon */}
              <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="h-24 w-24 text-white opacity-80" />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.type === 'course' ? item.students?.toLocaleString() : item.subscribers?.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.type === 'course' ? 'Students' : 'Subscribers'}
                    </p>
                  </CardContent>
                </Card>
                {item.type === 'course' && item.duration && (
                  <Card className="bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-green-500" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 dark:text-white">
                <TabsTrigger value="overview" className="dark:text-white data-[state=active]:dark:text-white">Overview</TabsTrigger>
                <TabsTrigger value="curriculum" className="dark:text-white data-[state=active]:dark:text-white">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews" className="dark:text-white data-[state=active]:dark:text-white">Reviews</TabsTrigger>
                <TabsTrigger value="qa" className="dark:text-white data-[state=active]:dark:text-white">Q&A</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        'Master advanced options strategies for bull markets',
                        'Understand risk management and position sizing',
                        'Learn to read market indicators and signals',
                        'Develop a profitable trading plan',
                        'Practice with real-world examples',
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This comprehensive course is designed for traders who want to master advanced options strategies specifically tailored for bull market conditions. With over 8 hours of content, you'll progress from foundational concepts to implementing sophisticated multi-leg strategies that can generate consistent profits.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                      Each module combines theory with practical trading exercises, and you'll have access to exclusive trading signals and market analysis shared directly by the instructor.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • Basic understanding of options trading concepts
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • Access to a brokerage account for paper trading
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      • Commitment to practice and implement strategies
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="space-y-4">
                {curriculum.map((module) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {module.lessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {module.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{review.author}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Q&A Tab */}
              <TabsContent value="qa" className="space-y-4">
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No questions yet</p>
                    <Button>Ask a Question</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <Card className="sticky top-24 mb-6">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    ${item.price}
                  </div>
                  {item.period && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      per {item.period}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-base font-semibold">
                    {item.type === 'course' ? 'Enroll Now' : 'Subscribe Now'}
                  </Button>
                  <Button variant="outline" className="w-full h-10">
                    {item.type === 'course' ? 'Add to Cart' : 'View Details'}
                  </Button>
                </div>

                <div className="pt-4 border-t space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card className="sticky top-96">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About the Instructor</h3>

                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarImage src={trader.avatar} />
                    <AvatarFallback className="text-lg">{trader.name[0]}</AvatarFallback>
                  </Avatar>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{trader.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{trader.expertise}</p>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Credibility Score</span>
                    <span className={`font-semibold ${getCredibilityColor(trader.credibilityScore)}`}>
                      {trader.credibilityScore}/100
                    </span>
                  </div>
                  {trader.isVerified && (
                    <Badge className="w-full justify-center bg-indigo-600 text-white border-indigo-700 font-bold">
                      ✓ Verified Instructor
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold text-gray-900 dark:text-white">{trader.followers.toLocaleString()}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Followers</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold text-green-500">{trader.monthlyReturn}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Monthly Return</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold text-gray-900 dark:text-white">{trader.courses}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Courses</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold text-gray-900 dark:text-white">{trader.subscribers.toLocaleString()}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">Subscribers</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    Follow
                  </Button>
                  <Button className="flex-1" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">More from {trader.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    Related Course {i}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-900 dark:text-white">4.8</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-primary">$99</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
