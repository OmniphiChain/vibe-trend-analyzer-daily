import React, { useState } from 'react';
import { ArrowLeft, Star, Users, TrendingUp, BookOpen, MessageCircle, Share2, Award, CheckCircle, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface InstructorProfileProps {
  trader: TraderProfile;
  onBack: () => void;
}

interface Course {
  id: number;
  title: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  badge?: string;
}

interface StudentReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export const InstructorProfile: React.FC<InstructorProfileProps> = ({
  trader,
  onBack,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowToast, setShowFollowToast] = useState(false);

  // Mock courses
  const courses: Course[] = [
    {
      id: 1,
      title: 'Advanced Options Strategies for Bull Markets',
      price: 199,
      rating: 4.9,
      students: 1200,
      duration: '8h 30m',
      badge: 'BESTSELLER',
    },
    {
      id: 2,
      title: 'Day Trading Fundamentals',
      price: 149,
      rating: 4.8,
      students: 950,
      duration: '6h 15m',
      badge: 'HOT',
    },
    {
      id: 3,
      title: 'Risk Management Mastery',
      price: 179,
      rating: 4.7,
      students: 780,
      duration: '5h 45m',
    },
    {
      id: 4,
      title: 'Technical Analysis Deep Dive',
      price: 199,
      rating: 4.9,
      students: 1050,
      duration: '9h 20m',
    },
  ];

  // Mock reviews
  const reviews: StudentReview[] = [
    {
      id: 1,
      name: 'Michael Johnson',
      rating: 5,
      comment: 'Exceptional instructor with clear explanations. Transformed my trading approach and increased profitability.',
      date: '1 week ago',
    },
    {
      id: 2,
      name: 'Emily Rodriguez',
      rating: 5,
      comment: 'Best trading education I\'ve invested in. The curriculum is comprehensive and the support is outstanding.',
      date: '2 weeks ago',
    },
    {
      id: 3,
      name: 'David Park',
      rating: 4.5,
      comment: 'Very knowledgeable instructor. Courses are well-structured and easy to follow. Highly recommended!',
      date: '3 weeks ago',
    },
    {
      id: 4,
      name: 'Jessica Lee',
      rating: 5,
      comment: 'I\'ve taken multiple courses from this instructor. Each one has provided genuine value and actionable strategies.',
      date: '1 month ago',
    },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setShowFollowToast(true);
    setTimeout(() => setShowFollowToast(false), 3000);
  };

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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructor Header */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Avatar className="h-32 w-32 mx-auto mb-4">
                    <AvatarImage src={trader.avatar} />
                    <AvatarFallback className="text-3xl">{trader.name[0]}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {trader.name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {trader.expertise}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <Badge
                      className={`${getCredibilityBadgeColor(trader.credibilityScore)} font-bold shadow-md`}
                    >
                      <Award className="h-3 w-3 mr-1" />
                      Credibility: {trader.credibilityScore}/100
                    </Badge>
                    {trader.isVerified && (
                      <Badge className="bg-indigo-600 text-white border-indigo-700 font-bold shadow-md">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Instructor
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
                    Professional trading educator with {Math.floor(trader.credibilityScore / 10)}+ years of experience in the financial markets. 
                    Passionate about sharing proven trading strategies and helping students achieve their financial goals.
                  </p>

                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {trader.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Followers</div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {trader.courses}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Courses</div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {trader.subscribers.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Subscribers</div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <div className="text-2xl font-bold text-green-500">{trader.monthlyReturn}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Monthly Return</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="courses" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 dark:text-white">
                <TabsTrigger value="courses" className="dark:text-white data-[state=active]:dark:text-white">
                  📚 Courses
                </TabsTrigger>
                <TabsTrigger value="about" className="dark:text-white data-[state=active]:dark:text-white">
                  ℹ️ About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="dark:text-white data-[state=active]:dark:text-white">
                  ⭐ Reviews
                </TabsTrigger>
              </TabsList>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-t-lg" />
                      <CardContent className="p-4 space-y-3">
                        {course.badge && (
                          <Badge
                            className={
                              course.badge === 'BESTSELLER'
                                ? 'bg-green-600 text-white border-green-700'
                                : 'bg-red-500 text-white border-red-600'
                            }
                          >
                            {course.badge}
                          </Badge>
                        )}
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">
                          {course.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-gray-900 dark:text-white font-medium">{course.rating}</span>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-xs">
                            {course.students} students
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-lg font-bold text-gray-900 dark:text-primary">
                            ${course.price}
                          </span>
                          <Button size="sm">Enroll</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Teaching Philosophy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
                    <p>
                      I believe that successful trading is built on a foundation of education, discipline, and continuous learning. 
                      My courses are designed to demystify complex trading concepts and provide actionable strategies that students can apply immediately.
                    </p>
                    <p>
                      Every lesson is crafted with real market examples and practical exercises. I focus on teaching not just the "what" 
                      but the "why" behind each strategy, enabling students to adapt and evolve with changing market conditions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Experience & Credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        '10+ years of professional trading experience',
                        'Specialized in options strategies and technical analysis',
                        'Managed portfolios exceeding $5M+ in assets',
                        'Published trading education materials and guides',
                        'Active member of trading industry associations',
                        'Consistently profitable trading track record',
                      ].map((cred, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{cred}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Contact & Social</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">contact@example.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-500" />
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                          www.traderprofile.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on {reviews.length} student reviews
                  </p>
                </div>

                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(review.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Follow Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <Button
                  className={`w-full h-12 text-base font-semibold ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  onClick={handleFollow}
                >
                  {isFollowing ? '✓ Following' : 'Follow'}
                </Button>

                {isFollowing && (
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                )}

                {!isFollowing && (
                  <Button variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Get Notified
                  </Button>
                )}

                <div className="pt-4 border-t space-y-3 text-sm">
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    {isFollowing
                      ? 'You are following this instructor'
                      : 'Follow to get updates on new courses'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Student Satisfaction</span>
                    <span className="font-bold text-gray-900 dark:text-white">4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Course Quality</span>
                    <span className="font-bold text-gray-900 dark:text-white">9.2/10</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Response Time</span>
                    <span className="font-bold text-gray-900 dark:text-white">&lt;24h</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Join Date</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Mar 2021</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Total Reviews</span>
                  <span className="font-semibold text-gray-900 dark:text-white">450+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Completion Rate</span>
                  <span className="font-semibold text-gray-900 dark:text-white">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Follow Toast Notification */}
      {showFollowToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isFollowing ? '✓ Now following' : '✓ Unfollowed'} {trader.name}
        </div>
      )}
    </div>
  );
};
