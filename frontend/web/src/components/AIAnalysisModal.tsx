import React from 'react';
import { X, ExternalLink, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    id: string;
    title: string;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    source: string;
    timestamp: string;
    category: string;
    url?: string;
  };
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, onClose, article }) => {
  if (!isOpen) return null;

  const getAIAnalysis = (sentiment: string, category: string) => {
    switch (sentiment) {
      case 'positive':
        if (category === 'Tech') {
          return "Strong positive sentiment driven by AI revenue growth across major tech companies. Market confidence is high based on analyst upgrades and increased institutional buying.";
        }
        return "Market sentiment shows strong bullish indicators with positive analyst coverage and institutional interest driving momentum.";
      case 'negative':
        return "Bearish sentiment reflects market concerns over earnings shortfall and supply chain disruptions. Institutional selling pressure may continue in the near term.";
      default:
        return "Mixed sentiment with balanced market positioning. Investors adopting wait-and-see approach pending further economic data and policy decisions.";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg shadow-2xl border border-purple-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              AI Analysis
              <Badge className="text-xs bg-blue-500/30 text-blue-200 border-blue-400/30">
                Powered by GPT
              </Badge>
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Title */}
          <h3 className="text-lg font-medium text-white mb-4 leading-tight">
            {article.title}
          </h3>

          {/* AI Analysis */}
          <div className="bg-black/20 rounded-lg p-4 mb-6 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Market Sentiment Analysis</span>
            </div>
            <p className="text-white/90 leading-relaxed">
              {getAIAnalysis(article.sentiment, article.category)}
            </p>
          </div>

          {/* Sentiment Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">Sentiment:</span>
              <Badge className={`text-xs capitalize ${getSentimentColor(article.sentiment)} bg-current/20 border-current/30`}>
                {article.sentiment}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">Category:</span>
              <Badge className="text-xs text-white/60 bg-white/10 border-white/20">
                {article.category}
              </Badge>
            </div>
          </div>

          {/* Source Info */}
          <div className="flex items-center justify-between text-sm text-white/60 mb-6">
            <span>Source: {article.source}</span>
            <span>{article.timestamp}</span>
          </div>

          {/* Read Full Article Button */}
          <Button
            onClick={() => {
              if (article.url) {
                window.open(article.url, '_blank');
              } else {
                // Fallback URL - in a real app this would be the actual article URL
                window.open(`https://example.com/article/${article.id}`, '_blank');
              }
            }}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Read Full Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
