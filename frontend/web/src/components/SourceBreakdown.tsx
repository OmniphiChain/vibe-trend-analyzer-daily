import { useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentSource } from "@/data/mockData";
import { SourceNewsModal } from "./SourceNewsModal";

interface SourceBreakdownProps {
  sources: SentimentSource[];
}

export const SourceBreakdown = ({ sources }: SourceBreakdownProps) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSourceClick = (sourceName: string) => {
    setSelectedSource(sourceName);
    setIsModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "border-l-positive bg-positive/5";
    if (score >= 50) return "border-l-neutral bg-neutral/5";
    return "border-l-negative bg-negative/5";
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-positive";
    if (change < 0) return "text-negative";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Sentiment by Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.map((source, index) => (
          <div 
            key={index} 
            onClick={() => handleSourceClick(source.name)}
            className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/50 ${getScoreColor(source.score)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {source.samples.toLocaleString()} samples
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{source.score}</div>
                <div className={`flex items-center gap-1 text-sm ${getChangeColor(source.change)}`}>
                  {source.change > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : source.change < 0 ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : null}
                  {source.change > 0 ? '+' : ''}{source.change.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className={`h-full rounded-full ${
                  source.score >= 70 ? 'bg-positive' :
                  source.score >= 50 ? 'bg-neutral' :
                  'bg-negative'
                }`}
                style={{ width: `${source.score}%` }}
              />
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Click to view detailed analysis
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data Sources Active</span>
            <Badge variant="secondary">{sources.length} Active</Badge>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Real-time analysis • AI-powered sentiment detection
          </div>
        </div>
      </CardContent>
      
      <SourceNewsModal
        sourceName={selectedSource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};