import { useState } from "react";
import { ArrowLeft, Play, Star, Users, Clock, BookOpen, Download, Share2, Flag, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CourseDetailProps {
  courseId: string;
  onNavigate?: (section: string) => void;
  onBack?: () => void;
}

export const CourseDetail = ({ courseId, onNavigate, onBack }: CourseDetailProps) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Mock course data
  const course = {
    id: courseId,
    title: "Advanced Options Strategies for Bull Markets",
    description: "Master the art of options trading in bull markets with strategies used by professional traders at top investment firms. This comprehensive course covers everything from basic concepts to advanced techniques.",
    longDescription: "In this comprehensive course, you'll learn the exact strategies I've used to generate consistent profits trading options in bull markets. Drawing from my 8+ years of experience as a professional trader, I'll teach you how to identify the best opportunities, manage risk effectively, and maximize your returns.",
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    totalRatings: 234,
    students: 1200,
    duration: "8h 30m",
    totalLessons: 24,
    level: "Advanced",
    language: "English",
    lastUpdated: "2 weeks ago",
    certificate: true,
    downloadable: true,
    lifetime: true,
    badge: "BESTSELLER",
    
    instructor: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      title: "Professional Options Trader",
      credibilityScore: 95,
      students: 3420,
      courses: 8,
      rating: 4.9
    },

    preview: {
      videoUrl: "/placeholder-video.mp4",
      duration: "3:45"
    },

    whatYouLearn: [
      "Master advanced options strategies for bull markets",
      "Understand Greeks and how to use them in trading decisions", 
      "Learn professional risk management techniques",
      "Identify high-probability trading opportunities",
      "Build a systematic approach to options trading",
      "Avoid common mistakes that destroy trader accounts"
    ],

    requirements: [
      "Basic understanding of stock market fundamentals",
      "Familiarity with options terminology",
      "Access to a brokerage account with options approval",
      "Willingness to practice with paper trading first"
    ],

    curriculum: [
      {
        section: "Introduction & Fundamentals",
        duration: "1h 15m",
        lessons: [
          { id: 1, title: "Course Overview & Expectations", duration: "8:30", preview: true },
          { id: 2, title: "Bull Market Characteristics", duration: "12:45", preview: false },
          { id: 3, title: "Options Greeks Deep Dive", duration: "18:20", preview: false },
          { id: 4, title: "Risk Management Fundamentals", duration: "15:30", preview: true },
          { id: 5, title: "Platform Setup & Tools", duration: "20:15", preview: false }
        ]
      },
      {
        section: "Core Strategies",
        duration: "3h 45m", 
        lessons: [
          { id: 6, title: "Covered Calls in Bull Markets", duration: "22:30", preview: false },
          { id: 7, title: "Cash-Secured Puts Strategy", duration: "25:15", preview: false },
          { id: 8, title: "Bull Call Spreads", duration: "28:45", preview: false },
          { id: 9, title: "Bull Put Spreads", duration: "26:30", preview: false },
          { id: 10, title: "Calendar Spreads", duration: "31:20", preview: false },
          { id: 11, title: "Diagonal Spreads", duration: "33:15", preview: false },
          { id: 12, title: "Iron Condors in Trending Markets", duration: "29:45", preview: false }
        ]
      },
      {
        section: "Advanced Techniques",
        duration: "2h 30m",
        lessons: [
          { id: 13, title: "Volatility Trading", duration: "35:20", preview: false },
          { id: 14, title: "Earnings Play Strategies", duration: "28:15", preview: false },
          { id: 15, title: "Managing Winning Trades", duration: "24:30", preview: false },
          { id: 16, title: "Handling Losing Positions", duration: "26:45", preview: false },
          { id: 17, title: "Position Sizing & Portfolio Management", duration: "22:30", preview: false }
        ]
      },
      {
        section: "Real-World Application",
        duration: "1h 00m",
        lessons: [
          { id: 18, title: "Live Trade Examples", duration: "18:30", preview: false },
          { id: 19, title: "Market Analysis Framework", duration: "15:45", preview: false },
          { id: 20, title: "Building Your Trading Plan", duration: "12:30", preview: false },
          { id: 21, title: "Common Mistakes to Avoid", duration: "13:15", preview: false },
          { id: 22, title: "Psychology of Options Trading", duration: "16:30", preview: false },
          { id: 23, title: "Tax Considerations", duration: "11:45", preview: false },
          { id: 24, title: "Next Steps & Resources", duration: "8:15", preview: false }
        ]
      }
    ]
  };

  const reviews = [
    {
      id: 1,
      user: "Mike Thompson",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "1 week ago",
      comment: "Outstanding course! Sarah's explanations are crystal clear and the strategies actually work. I've already made back the course fee and more.",
      helpful: 23
    },
    {
      id: 2,
      user: "Jennifer Walsh", 
      avatar: "/placeholder.svg",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best options course I've taken. The risk management section alone is worth the price. Highly recommend!",
      helpful: 18
    },
    {
      id: 3,
      user: "David Kim",
      avatar: "/placeholder.svg", 
      rating: 4,
      date: "3 weeks ago",
      comment: "Great content and well structured. Would love to see more live examples in future updates.",
      helpful: 12
    }
  ];

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  const toggleLessonComplete = (lessonId: number) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const getProgress = () => {
    const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
    return (completedLessons.length / totalLessons) * 100;
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
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {course.badge && (
                  <Badge variant="default" className="mb-2">
                    {course.badge}
                  </Badge>
                )}
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="space-y-6">
                {isEnrolled && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Your Progress</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {completedLessons.length} of {course.totalLessons} lessons completed
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={getProgress()} className="mb-2" />
                      <p className="text-sm text-muted-foreground">{Math.round(getProgress())}% complete</p>
                    </CardContent>
                  </Card>
                )}

                <Accordion type="multiple" className="space-y-4">
                  {course.curriculum.map((section, sectionIndex) => (
                    <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <h3 className="font-semibold text-left">{section.section}</h3>
                          <div className="text-sm text-muted-foreground">
                            {section.lessons.length} lessons • {section.duration}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 pt-4">
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-md border ${
                              isEnrolled ? 'cursor-pointer hover:bg-muted/50' : ''
                            }`}
                            onClick={() => isEnrolled && toggleLessonComplete(lesson.id)}
                          >
                            <div className="flex items-center gap-3">
                              {isEnrolled ? (
                                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  completedLessons.includes(lesson.id) 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-muted-foreground'
                                }`}>
                                  {completedLessons.includes(lesson.id) && (
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  )}
                                </div>
                              ) : lesson.preview ? (
                                <Play className="h-4 w-4 text-primary" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                              
                              <div>
                                <p className="font-medium text-sm">{lesson.title}</p>
                                {lesson.preview && !isEnrolled && (
                                  <Badge variant="outline" className="text-xs mt-1">Preview</Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={course.instructor.avatar} />
                        <AvatarFallback className="text-lg">{course.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{course.instructor.name}</h3>
                        <p className="text-muted-foreground mb-3">{course.instructor.title}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-semibold">{course.instructor.credibilityScore}/100</div>
                            <div className="text-muted-foreground">Credibility</div>
                          </div>
                          <div>
                            <div className="font-semibold">{course.instructor.rating}</div>
                            <div className="text-muted-foreground">Rating</div>
                          </div>
                          <div>
                            <div className="font-semibold">{course.instructor.students.toLocaleString()}</div>
                            <div className="text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="font-semibold">{course.instructor.courses}</div>
                            <div className="text-muted-foreground">Courses</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Student Reviews</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.totalRatings} reviews • {course.rating} average rating
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{course.rating}</span>
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
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{review.helpful} people found this helpful</span>
                              <Button variant="ghost" size="sm">Helpful</Button>
                            </div>
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
            {/* Preview Card */}
            <Card>
              <CardContent className="p-0">
                {/* Video Preview */}
                <div className="aspect-video bg-black rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full h-16 w-16">
                      <Play className="h-6 w-6 ml-1" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {course.preview.duration}
                  </div>
                </div>
                
                {/* Price and Actions */}
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      ${course.price}
                    </div>
                    {course.originalPrice && (
                      <div className="text-lg text-muted-foreground line-through">
                        ${course.originalPrice}
                      </div>
                    )}
                  </div>
                  
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Progress value={getProgress()} className="mb-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        {Math.round(getProgress())}% complete
                      </p>
                    </div>
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>This course includes:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                {course.downloadable && (
                  <div className="flex items-center gap-2 text-sm">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>Downloadable resources</span>
                  </div>
                )}
                {course.lifetime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Full lifetime access</span>
                  </div>
                )}
                {course.certificate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="h-4 w-4 text-muted-foreground" />
                    <span>Certificate of completion</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span>{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span>{course.lastUpdated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students:</span>
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
