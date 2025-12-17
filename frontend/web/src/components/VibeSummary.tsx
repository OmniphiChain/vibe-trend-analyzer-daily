import { Lightbulb, Hash, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VibePhrase } from "@/data/mockData";

interface VibeSummaryProps {
  phrases: VibePhrase[];
}

export const VibeSummary = ({ phrases }: VibeSummaryProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-positive/10 text-positive border-positive/20';
      case 'negative':
        return 'bg-negative/10 text-negative border-negative/20';
      default:
        return 'bg-neutral/10 text-neutral border-neutral/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '⚖️';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Today's Vibe Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Key phrases driving today's sentiment analysis
        </div>
        
        {phrases.map((phrase, index) => (
          <div key={index} className="group p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xl">{getSentimentIcon(phrase.sentiment)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getSentimentColor(phrase.sentiment)}>
                      {phrase.sentiment}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {phrase.source}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    "{phrase.text}"
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{phrase.influence.toFixed(1)}%</span>
                </div>
                <div className="text-xs text-muted-foreground">influence</div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Hash className="h-4 w-4" />
            Trending Topics
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">#innovation</Badge>
            <Badge variant="secondary">#markets</Badge>
            <Badge variant="secondary">#technology</Badge>
            <Badge variant="secondary">#community</Badge>
            <Badge variant="secondary">#growth</Badge>
          </div>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          Analysis updated every 15 minutes using advanced NLP algorithms
        </div>
      </CardContent>
    </Card>
  );
};