import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMoodTheme } from '@/contexts/MoodThemeContext';
import { Plugin } from '@/types/plugins';
import { cn } from '@/lib/utils';

interface FeaturedPluginsCarouselProps {
  plugins: Plugin[];
  className?: string;
  onPurchase?: (plugin: Plugin) => void;
  onLearnMore?: (plugin: Plugin) => void;
}

export const FeaturedPluginsCarousel = ({ plugins, className, onPurchase, onLearnMore }: FeaturedPluginsCarouselProps) => {
  const { themeMode } = useMoodTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % plugins.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + plugins.length) % plugins.length);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [plugins.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
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

  if (plugins.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {plugins.map((plugin, index) => (
            <div key={plugin.id} className="w-full flex-shrink-0">
              <Card className={cn(
                "border-0 h-64",
                themeMode === 'light'
                  ? "bg-gradient-to-r from-[#F8FAFB] to-[#F4F6FA] border border-[#E0E0E0]/50"
                  : "bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl"
              )}>
                <CardContent className="p-8 h-full flex items-center">
                  <div className="flex items-center gap-8 w-full">
                    {/* Plugin Icon and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-6xl">{plugin.icon}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={cn(
                            "text-2xl font-bold",
                            themeMode === 'light' ? 'text-[#0F172A]' : 'text-white'
                          )}>
                            {plugin.name}
                          </h3>
                          <Badge 
                            className={cn(
                              "text-sm font-semibold transition-colors",
                              plugin.price === 0 
                                ? "bg-[#E0F2F1] text-[#004D40] border-[#004D40]/20 hover:bg-[#B2DFDB]"
                                : "bg-[#E3F2FD] text-[#0D47A1] border-[#0D47A1]/20 hover:bg-[#BBDEFB]"
                            )}
                          >
                            {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                          </Badge>
                          {plugin.status === 'beta' && (
                            <Badge className="text-sm bg-[#FFF3E0] text-[#E65100] border-[#E65100]/20 hover:bg-[#FFE0B2] font-semibold transition-colors">
                              Beta
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "text-lg mb-3 font-semibold",
                          themeMode === 'light' ? 'text-[#1F2937]' : 'text-gray-300'
                        )}>
                          {plugin.shortDescription}
                        </p>
                        <div className={cn(
                          "text-sm mb-3 font-semibold",
                          themeMode === 'light' ? 'text-[#7C2D12]' : 'text-gray-400'
                        )}>
                          by <span className="font-bold text-[#9F1239]">{plugin.author}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {renderStars(plugin.rating)}
                            </div>
                            <span className={cn(
                              "text-sm font-bold",
                              themeMode === 'light' ? 'text-[#059669]' : 'text-gray-300'
                            )}>
                              {plugin.rating} ({plugin.reviewCount} reviews)
                            </span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-sm font-bold",
                            themeMode === 'light' ? 'text-[#991B1B]' : 'text-gray-400'
                          )}>
                            <Download className="w-4 h-4 text-[#991B1B]" />
                            {formatDownloads(plugin.downloadCount)} downloads
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <Button
                        size="lg"
                        className={cn(
                          "min-w-32 font-bold transition-all shadow-lg hover:shadow-xl",
                          themeMode === 'light'
                            ? "bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:from-[#B91C1C] hover:to-[#991B1B] text-white border-2 border-[#DC2626] hover:border-[#B91C1C]"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        )}
                        onClick={() => onPurchase?.(plugin)}
                      >
                        {plugin.price === 0 ? 'Install Now' : 'Purchase'}
                      </Button>
                      <Button variant="outline" size="lg" className="min-w-32 border-2 border-[#059669] text-[#059669] hover:bg-[#059669] hover:text-white font-semibold transition-all" onClick={() => onLearnMore?.(plugin)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {plugins.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full",
              themeMode === 'light'
                ? "bg-white/80 hover:bg-white border-gray-300"
                : "bg-black/50 hover:bg-black/70 border-gray-600"
            )}
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-4 top-1/2 transform -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full",
              themeMode === 'light'
                ? "bg-white/80 hover:bg-white border-gray-300"
                : "bg-black/50 hover:bg-black/70 border-gray-600"
            )}
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {plugins.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {plugins.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentIndex
                  ? themeMode === 'light'
                    ? "bg-[#0D47A1]"
                    : "bg-purple-400"
                  : themeMode === 'light'
                    ? "bg-[#BDBDBD] hover:bg-[#9E9E9E]"
                    : "bg-gray-600 hover:bg-gray-500"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
