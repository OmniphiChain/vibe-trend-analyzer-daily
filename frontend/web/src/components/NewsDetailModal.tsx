import { useState } from "react";
import { X, ExternalLink, Share, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NewsArticle } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface NewsDetailModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsDetailModal = ({ article, isOpen, onClose }: NewsDetailModalProps) => {
  const { toast } = useToast();

  if (!article) return null;

  const getSentimentColor = (score: number) => {
    if (score >= 70) return "text-positive border-positive bg-positive/10";
    if (score >= 40) return "text-neutral border-neutral bg-neutral/10";
    return "text-negative border-negative bg-negative/10";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Positive";
    if (score >= 40) return "Neutral";
    return "Negative";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    const shareText = `Check out this sentiment insight: "${article.headline}" - ${getSentimentLabel(article.sentimentScore)} sentiment (${article.sentimentScore}/100) on MoodMeter`;
    
    if (navigator.share) {
      navigator.share({
        title: article.headline,
        text: shareText,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Share text has been copied to your clipboard",
      });
    }
  };

  const openOriginal = () => {
    window.open(article.originalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold leading-tight pr-8">
            {article.headline}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{article.summary}</p>
          </div>

          <Separator />

          {/* Sentiment Score */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${getSentimentColor(article.sentimentScore)}`}>
                {article.sentimentScore >= 50 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-semibold">
                  {getSentimentLabel(article.sentimentScore)}: {article.sentimentScore}/100
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Phrases */}
          <div>
            <h3 className="font-semibold mb-3">Key Emotional Phrases</h3>
            <div className="flex flex-wrap gap-2">
              {article.keyPhrases.map((phrase, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {phrase}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Source Information */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Source</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{article.source.name}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(article.source.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Related Trends */}
          {article.relatedTrends && article.relatedTrends.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Related Trends</h3>
                <div className="flex flex-wrap gap-2">
                  {article.relatedTrends.map((trend, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Why It Matters */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-primary">Why It Matters</h3>
            <p className="text-sm leading-relaxed">{article.whyItMatters}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={openOriginal} className="flex-1" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Original Article
            </Button>
            <Button onClick={handleShare} variant="default">
              <Share className="h-4 w-4 mr-2" />
              Share Insight
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};