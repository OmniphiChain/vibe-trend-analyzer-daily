import { useState } from "react";
import { Hash, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type TrendingKeyword } from "@/data/mockData";

interface TrendingKeywordsProps {
  keywords: TrendingKeyword[];
}

export const TrendingKeywords = ({ keywords }: TrendingKeywordsProps) => {
  const [selectedKeyword, setSelectedKeyword] =
    useState<TrendingKeyword | null>(null);
  const [sortBy, setSortBy] = useState<"frequency" | "change">("frequency");

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (sortBy === "frequency") {
      return b.frequency - a.frequency;
    }
    return Math.abs(b.change) - Math.abs(a.change);
  });

  const getKeywordVariant = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "default";
      case "negative":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getTagSize = (frequency: number, maxFrequency: number) => {
    const ratio = frequency / maxFrequency;
    if (ratio > 0.8) return "text-lg px-4 py-2";
    if (ratio > 0.6) return "text-base px-3 py-2";
    if (ratio > 0.4) return "text-sm px-3 py-1";
    return "text-xs px-2 py-1";
  };

  const maxFrequency = Math.max(...keywords.map((k) => k.frequency));

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Trending Keywords
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "frequency" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("frequency")}
              >
                Frequency
              </Button>
              <Button
                variant={sortBy === "change" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("change")}
              >
                Trending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tag Cloud View */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-center items-center min-h-[200px]">
              {sortedKeywords.map((keyword, index) => (
                <Badge
                  key={keyword.text}
                  variant={getKeywordVariant(keyword.sentiment)}
                  className={`
                    ${getTagSize(keyword.frequency, maxFrequency)}
                    cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md
                    relative group
                  `}
                  onClick={() => setSelectedKeyword(keyword)}
                >
                  <span className="flex items-center gap-1">
                    {keyword.text}
                    <span
                      className={`text-xs ${getChangeColor(keyword.change)}`}
                    >
                      {keyword.change > 0 ? "+" : ""}
                      {keyword.change.toFixed(1)}%
                    </span>
                  </span>
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background border rounded-full p-1">
                      <Eye className="h-3 w-3" />
                    </div>
                  </div>
                </Badge>
              ))}
            </div>

            {/* Detailed List View */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Keyword Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedKeywords.slice(0, 6).map((keyword) => (
                  <div
                    key={keyword.text}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors cursor-pointer"
                    onClick={() => setSelectedKeyword(keyword)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getKeywordVariant(keyword.sentiment)}
                        className="text-xs"
                      >
                        {keyword.text}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {keyword.frequency.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${getChangeColor(keyword.change)}`}
                    >
                      {getChangeIcon(keyword.change)}
                      {keyword.change > 0 ? "+" : ""}
                      {keyword.change.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyword Detail Modal */}
      <Dialog
        open={!!selectedKeyword}
        onOpenChange={() => setSelectedKeyword(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              {selectedKeyword?.text}
              <Badge
                variant={getKeywordVariant(
                  selectedKeyword?.sentiment || "neutral",
                )}
              >
                {selectedKeyword?.sentiment}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedKeyword && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-2xl font-bold">
                    {selectedKeyword.frequency.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Mentions</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div
                    className={`text-2xl font-bold flex items-center justify-center gap-1 ${getChangeColor(selectedKeyword.change)}`}
                  >
                    {getChangeIcon(selectedKeyword.change)}
                    {selectedKeyword.change > 0 ? "+" : ""}
                    {selectedKeyword.change.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    24h Change
                  </div>
                </div>
              </div>

              {/* Related Headlines */}
              <div className="space-y-3">
                <h4 className="font-semibold">Related Headlines</h4>
                <div className="space-y-2">
                  {selectedKeyword.relatedHeadlines.map((headline, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/50 rounded-lg border-l-4 border-l-primary"
                    >
                      <p className="text-sm">{headline}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentiment Impact */}
              <div className="p-4 bg-card rounded-lg border">
                <h4 className="font-semibold mb-2">Why This Matters</h4>
                <p className="text-sm text-muted-foreground">
                  This keyword represents a {selectedKeyword.sentiment}{" "}
                  sentiment driver with{" "}
                  {selectedKeyword.frequency.toLocaleString()} mentions across
                  all sources. The{" "}
                  {selectedKeyword.change > 0 ? "increased" : "decreased"}{" "}
                  discussion volume indicates{" "}
                  {selectedKeyword.change > 0 ? "growing" : "declining"}{" "}
                  interest in this topic, contributing to overall market
                  sentiment.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
