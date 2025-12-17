import { useState } from 'react';
import { X, Star, Download, ExternalLink, Shield, Calendar, Users, Code, FileText, Image, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Plugin } from '@/types/plugins';
import { cn } from '@/lib/utils';

interface PluginDetailModalProps {
  plugin: Plugin | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (plugin: Plugin) => void;
}

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'TradingExpert_2024',
    rating: 5,
    comment: 'Absolutely fantastic plugin! The RSI signals are incredibly accurate and have improved my trading significantly.',
    date: '2024-11-28',
    helpful: 12
  },
  {
    id: '2',
    author: 'CryptoTrader99',
    rating: 4,
    comment: 'Great tool overall. Would love to see more customization options for the alerts.',
    date: '2024-11-25',
    helpful: 8
  },
  {
    id: '3',
    author: 'StockAnalyst',
    rating: 5,
    comment: 'This plugin has transformed how I approach technical analysis. Highly recommended!',
    date: '2024-11-20',
    helpful: 15
  }
];

export const PluginDetailModal = ({ plugin, isOpen, onClose, onInstall }: PluginDetailModalProps) => {
  const { themeMode } = useMoodTheme();
  const [activeTab, setActiveTab] = useState('overview');

  if (!plugin) return null;

  const renderStars = (rating: number, size = 'sm') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          size === 'sm' ? "w-4 h-4" : "w-5 h-5",
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        )}
      />
    ));
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getRatingBreakdown = () => {
    const breakdown = [
      { stars: 5, count: 180, percentage: 77 },
      { stars: 4, count: 35, percentage: 15 },
      { stars: 3, count: 12, percentage: 5 },
      { stars: 2, count: 5, percentage: 2 },
      { stars: 1, count: 2, percentage: 1 }
    ];
    return breakdown;
  };

  const permissions = [
    'Read market sentiment data',
    'Access user watchlist',
    'Display notifications',
    'Store user preferences'
  ];

  const techSpecs = [
    { label: 'Version', value: plugin.version },
    { label: 'Size', value: plugin.size },
    { label: 'Compatibility', value: plugin.compatibility.join(', ') },
    { label: 'Last Updated', value: new Date(plugin.lastUpdated).toLocaleDateString() },
    { label: 'Category', value: plugin.category },
    { label: 'Status', value: plugin.status }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh] overflow-hidden p-0",
        themeMode === 'light'
          ? "bg-white border-gray-200"
          : "bg-black/95 border-purple-500/20 backdrop-blur-xl"
      )}>
        <DialogHeader className={cn(
          "p-6 border-b",
          themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{plugin.icon}</div>
              <div>
                <DialogTitle className={cn(
                  "text-2xl font-bold",
                  themeMode === 'light' ? 'text-gray-900' : 'text-white'
                )}>
                  {plugin.name}
                </DialogTitle>
                <div className={cn(
                  "text-sm mt-1",
                  themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                )}>
                  by {plugin.author}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    {renderStars(plugin.rating)}
                    <span className={cn(
                      "text-sm font-medium ml-1",
                      themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                    )}>
                      {plugin.rating} ({plugin.reviewCount} reviews)
                    </span>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                  )}>
                    <Download className="w-4 h-4" />
                    {formatDownloads(plugin.downloadCount)} downloads
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={plugin.price === 0 ? "secondary" : "default"} className="text-sm">
                {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
              </Badge>
              {plugin.status === 'beta' && (
                <Badge variant="destructive">Beta</Badge>
              )}
              <Button
                size="sm"
                className={cn(
                  themeMode === 'light'
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                )}
                onClick={() => onInstall(plugin)}
              >
                {plugin.price === 0 ? 'Install' : 'Purchase'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className={cn(
              "grid w-full grid-cols-4 mx-6 mt-4",
              themeMode === 'light' ? 'bg-gray-100' : 'bg-gray-800/50'
            )}>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="screenshots" className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Screenshots
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Tech Details
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold mb-3",
                      themeMode === 'light' ? 'text-gray-900' : 'text-white'
                    )}>
                      Description
                    </h3>
                    <p className={cn(
                      "text-base leading-relaxed",
                      themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                    )}>
                      {plugin.description}
                    </p>
                  </div>

                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold mb-3",
                      themeMode === 'light' ? 'text-gray-900' : 'text-white'
                    )}>
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {plugin.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={cn(
                            themeMode === 'light'
                              ? "border-gray-300 text-gray-700"
                              : "border-gray-600 text-gray-300"
                          )}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={cn(
                      "text-lg font-semibold mb-3",
                      themeMode === 'light' ? 'text-gray-900' : 'text-white'
                    )}>
                      Permissions
                    </h3>
                    <div className="space-y-2">
                      {permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Shield className={cn(
                            "w-4 h-4",
                            themeMode === 'light' ? 'text-blue-600' : 'text-purple-400'
                          )} />
                          <span className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                          )}>
                            {permission}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="screenshots" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className={cn(
                      "overflow-hidden",
                      themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
                    )}>
                      <div className={cn(
                        "aspect-video flex items-center justify-center text-6xl",
                        themeMode === 'light' ? 'bg-gray-100' : 'bg-gray-800/50'
                      )}>
                        {plugin.icon}
                      </div>
                      <CardContent className="p-3">
                        <p className={cn(
                          "text-sm",
                          themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                        )}>
                          Screenshot {i} - Plugin Interface
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <Card className={cn(
                    themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
                  )}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className={cn(
                            "text-4xl font-bold mb-2",
                            themeMode === 'light' ? 'text-gray-900' : 'text-white'
                          )}>
                            {plugin.rating}
                          </div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {renderStars(plugin.rating, 'lg')}
                          </div>
                          <p className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                          )}>
                            Based on {plugin.reviewCount} reviews
                          </p>
                        </div>
                        <div className="space-y-2">
                          {getRatingBreakdown().map((rating) => (
                            <div key={rating.stars} className="flex items-center gap-3">
                              <span className={cn(
                                "text-sm w-6",
                                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                              )}>
                                {rating.stars}★
                              </span>
                              <Progress value={rating.percentage} className="flex-1" />
                              <span className={cn(
                                "text-sm w-8",
                                themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                              )}>
                                {rating.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Reviews */}
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <Card key={review.id} className={cn(
                        themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.avatar} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {review.author.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={cn(
                                  "font-medium",
                                  themeMode === 'light' ? 'text-gray-900' : 'text-white'
                                )}>
                                  {review.author}
                                </span>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className={cn(
                                  "text-sm",
                                  themeMode === 'light' ? 'text-gray-500' : 'text-gray-500'
                                )}>
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className={cn(
                                "text-sm mb-2",
                                themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                              )}>
                                {review.comment}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  👍 Helpful ({review.helpful})
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tech" className="mt-0">
                <div className="space-y-6">
                  <Card className={cn(
                    themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
                  )}>
                    <CardHeader>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        themeMode === 'light' ? 'text-gray-900' : 'text-white'
                      )}>
                        <Code className="w-5 h-5" />
                        Technical Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {techSpecs.map((spec, index) => (
                          <div key={index} className="flex justify-between items-center py-2">
                            <span className={cn(
                              "font-medium",
                              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
                            )}>
                              {spec.label}:
                            </span>
                            <span className={cn(
                              themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                            )}>
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    themeMode === 'light' ? 'border-gray-200' : 'border-purple-500/20'
                  )}>
                    <CardHeader>
                      <CardTitle className={cn(
                        "flex items-center gap-2",
                        themeMode === 'light' ? 'text-gray-900' : 'text-white'
                      )}>
                        <Calendar className="w-5 h-5" />
                        Version History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className={cn(
                          "p-3 rounded-lg border",
                          themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'
                        )}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{plugin.version}</span>
                            <span className={cn(
                              "text-sm",
                              themeMode === 'light' ? 'text-gray-500' : 'text-gray-500'
                            )}>
                              Latest
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm",
                            themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'
                          )}>
                            {new Date(plugin.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
