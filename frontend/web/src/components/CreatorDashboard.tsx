import { useState } from "react";
import { ArrowLeft, Plus, Edit, Eye, BarChart3, DollarSign, Users, Star, TrendingUp, Calendar, Upload, Settings, Download, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface CreatorDashboardProps {
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

export const CreatorDashboard = ({ onNavigate, onBack }: CreatorDashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  // Mock creator data
  const creator = {
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    credibilityScore: 95,
    memberSince: "January 2019",
    totalEarnings: 125000,
    monthlyEarnings: 18500,
    totalStudents: 3420,
    totalSubscribers: 2340,
    coursesPublished: 8,
    avgRating: 4.9,
    completionRate: 87
  };

  // Mock earnings data
  const earningsData = [
    { month: "Jan", earnings: 12500, students: 234 },
    { month: "Feb", earnings: 14200, students: 267 },
    { month: "Mar", earnings: 16800, students: 289 },
    { month: "Apr", earnings: 15400, students: 312 },
    { month: "May", earnings: 17200, students: 345 },
    { month: "Jun", earnings: 18500, students: 378 }
  ];

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Advanced Options Strategies for Bull Markets",
      type: "course",
      status: "published",
      price: 199,
      students: 1200,
      rating: 4.9,
      earnings: 89400,
      lastUpdated: "2 weeks ago",
      completionRate: 89
    },
    {
      id: 2,
      title: "Weekly Options Alerts",
      type: "subscription",
      status: "published", 
      price: 79,
      subscribers: 456,
      rating: 4.8,
      earnings: 36024,
      lastUpdated: "3 days ago"
    },
    {
      id: 3,
      title: "Earnings Season Playbook",
      type: "course",
      status: "published",
      price: 149,
      students: 890,
      rating: 4.8,
      earnings: 45630,
      lastUpdated: "1 month ago",
      completionRate: 85
    },
    {
      id: 4,
      title: "Risk Management Masterclass",
      type: "course",
      status: "draft",
      price: 179,
      students: 0,
      rating: 0,
      earnings: 0,
      lastUpdated: "1 week ago",
      completionRate: 0
    }
  ];

  // Mock reviews data
  const recentReviews = [
    {
      id: 1,
      course: "Advanced Options Strategies",
      student: "Mike Thompson",
      rating: 5,
      comment: "Incredible course! Already implementing strategies with great success.",
      date: "2 days ago"
    },
    {
      id: 2,
      course: "Weekly Options Alerts",
      student: "Jennifer Walsh",
      rating: 5,
      comment: "The alerts are spot on. My portfolio has grown 15% since subscribing.",
      date: "4 days ago"
    },
    {
      id: 3,
      course: "Earnings Season Playbook",
      student: "David Kim",
      rating: 4,
      comment: "Great strategies for earnings plays. Well-structured content.",
      date: "1 week ago"
    }
  ];

  // Mock analytics data
  const analyticsData = [
    { date: "Mon", views: 245, enrollments: 12 },
    { date: "Tue", views: 289, enrollments: 15 },
    { date: "Wed", views: 312, enrollments: 18 },
    { date: "Thu", views: 267, enrollments: 14 },
    { date: "Fri", views: 334, enrollments: 21 },
    { date: "Sat", views: 198, enrollments: 9 },
    { date: "Sun", views: 156, enrollments: 7 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "text-green-600";
      case "draft": return "text-yellow-600";
      case "review": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to TradeHub
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Creator Dashboard</h1>
              <p className="text-muted-foreground">Manage your courses, track earnings, and grow your audience</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(creator.totalEarnings)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                +{formatCurrency(creator.monthlyEarnings)} this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{creator.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                +45 new this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{creator.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                From 432 reviews
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credibility Score</p>
                  <p className="text-2xl font-bold text-green-600">{creator.credibilityScore}/100</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={creator.credibilityScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Earnings"]} />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: "#10b981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">New enrollment</p>
                      <p className="text-xs text-muted-foreground">Mike Johnson enrolled in Advanced Options Strategies</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">New review</p>
                      <p className="text-xs text-muted-foreground">5-star review for Weekly Options Alerts</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2" />
                    <div>
                      <p className="text-sm font-medium">Course milestone</p>
                      <p className="text-xs text-muted-foreground">Earnings Season Playbook reached 1000+ students</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Plus className="h-6 w-6" />
                    <span>Create Course</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    <span>Upload Content</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Content</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{course.title}</h3>
                          <Badge variant={course.status === "published" ? "default" : "secondary"}>
                            {course.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {course.type === "course" ? "Course" : "Subscription"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <p className="font-medium">{formatCurrency(course.price)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {course.type === "course" ? "Students:" : "Subscribers:"}
                            </span>
                            <p className="font-medium">
                              {course.type === "course" ? course.students : course.subscribers}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating:</span>
                            <p className="font-medium">
                              {course.rating > 0 ? `${course.rating} ⭐` : "No ratings"}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Earnings:</span>
                            <p className="font-medium text-green-600">{formatCurrency(course.earnings)}</p>
                          </div>
                          {course.completionRate !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Completion:</span>
                              <p className="font-medium">{course.completionRate}%</p>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2">
                          Last updated: {course.lastUpdated}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views & Enrollments */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#3b82f6" name="Views" />
                      <Bar dataKey="enrollments" fill="#10b981" name="Enrollments" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.filter(c => c.status === "published").map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-muted-foreground">#{index + 1}</div>
                          <div>
                            <p className="font-medium text-sm">{course.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {course.type === "course" ? `${course.students} students` : `${course.subscribers} subscribers`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{formatCurrency(course.earnings)}</p>
                          <p className="text-xs text-muted-foreground">{course.rating} ⭐</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Earnings"]} />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Payout Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Next Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(18500)}</p>
                        <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                      </div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Request Payout
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Payouts are processed within 2-3 business days
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Earnings Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Course Sales</span>
                        <span className="font-medium">{formatCurrency(12400)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Subscriptions</span>
                        <span className="font-medium">{formatCurrency(6100)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-green-600">{formatCurrency(18500)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{creator.avgRating}</span>
                <span className="text-sm text-muted-foreground">(432 reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              {recentReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.student}</span>
                          <div className="flex items-center">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.course} • {review.date}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
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
