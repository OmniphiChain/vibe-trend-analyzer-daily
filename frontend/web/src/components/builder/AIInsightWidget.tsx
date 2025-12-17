import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Brain, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useMoodTheme } from '../../contexts/MoodThemeContext';

interface AIInsightWidgetProps {
  title?: string;
  refreshInterval?: number;
  showConfidence?: boolean;
  apiEndpoint?: string;
}

interface AIInsight {
  content: string;
  confidence: number;
  keyDrivers: string[];
  marketDirection: 'bullish' | 'bearish' | 'neutral';
  lastUpdated: Date;
  sources: string[];
}

export const AIInsightWidget: React.FC<AIInsightWidgetProps> = ({
  title = "AI Market Insight",
  refreshInterval = 300000, // 5 minutes
  showConfidence = true,
  apiEndpoint = "/api/ai/insight"
}) => {
  const { themeMode, cardBackground, borderColor } = useMoodTheme();
  const [insight, setInsight] = useState<AIInsight>({
    content: "Today's sentiment surge is primarily driven by strong earnings momentum across tech giants, with AI-related stocks leading the rally. Federal Reserve's dovish commentary provides additional market support, while institutional buying suggests sustained optimism through Q4.",
    confidence: 87,
    keyDrivers: ['AI Earnings Beat', 'Fed Dovish Stance', 'Tech Rally', 'Institutional Buying'],
    marketDirection: 'bullish',
    lastUpdated: new Date(),
    sources: ['NYSE', 'NASDAQ', 'Reuters', 'Bloomberg']
  });
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      try {
        // Generate mock insight with realistic market scenarios
        const scenarios = [
          {
            content: "Market sentiment reflects growing optimism around AI adoption across sectors. Strong earnings from semiconductor companies, coupled with Fed signals of policy stability, creates a favorable environment for risk assets. Retail and institutional flow patterns suggest sustained momentum.",
            confidence: 85 + Math.random() * 10,
            keyDrivers: ['AI Adoption', 'Semiconductor Rally', 'Fed Stability', 'Strong Flows'],
            marketDirection: 'bullish' as const,
            sources: ['NASDAQ', 'Federal Reserve', 'Goldman Sachs', 'BlackRock']
          },
          {
            content: "Mixed signals emerge as inflation concerns weigh against corporate resilience. While earnings remain robust, geopolitical tensions and supply chain disruptions create headwinds. Markets show consolidation patterns with sector rotation favoring defensive plays.",
            confidence: 72 + Math.random() * 8,
            keyDrivers: ['Inflation Concerns', 'Geopolitical Risk', 'Supply Chain', 'Defensive Rotation'],
            marketDirection: 'neutral' as const,
            sources: ['BLS', 'World Bank', 'JPMorgan', 'Vanguard']
          },
          {
            content: "Risk-off sentiment dominates as economic indicators signal potential slowdown. Credit markets tighten while volatility indices spike. Institutional repositioning toward safe havens accelerates, with technology and growth stocks facing pressure.",
            confidence: 78 + Math.random() * 7,
            keyDrivers: ['Economic Slowdown', 'Credit Tightening', 'VIX Spike', 'Safe Haven Flow'],
            marketDirection: 'bearish' as const,
            sources: ['Federal Reserve', 'Treasury', 'S&P Global', 'Moody\'s']
          }
        ];

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        setInsight({
          ...randomScenario,
          lastUpdated: new Date()
        });
        setLastRefresh(new Date());
      } catch (error) {
        console.error("Failed to fetch AI insight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
    const interval = setInterval(fetchInsight, refreshInterval);
    return () => clearInterval(interval);
  }, [apiEndpoint, refreshInterval]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setInsight(prev => ({
        ...prev,
        confidence: Math.max(70, Math.min(95, prev.confidence + (Math.random() - 0.5) * 10)),
        lastUpdated: new Date()
      }));
      setLastRefresh(new Date());
      setLoading(false);
    }, 1000);
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'bearish': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'bullish': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'bearish': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-emerald-400';
    if (confidence >= 70) return 'text-cyan-400';
    return 'text-amber-400';
  };

  return (
    <Card className={themeMode === 'light' ? `${cardBackground} border ${borderColor} shadow-[0_2px_8px_rgba(0,0,0,0.06)]` : "finance-card border-0"}>
      <CardHeader className={themeMode === 'light' ? `border-b ${borderColor}` : "border-b border-slate-700/50"}>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1C1E21]' : 'text-white'}`}>
            <Brain className={`w-5 h-5 ${themeMode === 'light' ? 'text-[#3F51B5]' : 'text-cyan-400'}`} />
            {title}
            {loading && (
              <RefreshCw className={`w-4 h-4 animate-spin ${themeMode === 'light' ? 'text-[#3F51B5]' : 'text-cyan-400'}`} />
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getDirectionColor(insight.marketDirection)} text-xs`}>
              {getDirectionIcon(insight.marketDirection)}
              <span className="ml-1 capitalize">{insight.marketDirection}</span>
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-cyan-500/10"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Main Insight Content */}
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed text-sm">
            {insight.content}
          </p>
          
          {/* Confidence Score */}
          {showConfidence && (
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <span className="text-sm text-slate-400">AI Confidence Score</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-1000`}
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${getConfidenceColor(insight.confidence)}`}>
                  {Math.round(insight.confidence)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Key Drivers */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Key Market Drivers</h4>
          <div className="flex flex-wrap gap-2">
            {insight.keyDrivers.map((driver, index) => (
              <Badge
                key={index}
                className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
              >
                {driver}
              </Badge>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Data Sources</h4>
          <div className="flex flex-wrap gap-2">
            {insight.sources.map((source, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-slate-800/50 text-slate-400 border-slate-600 text-xs"
              >
                {source}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700/50">
          Last updated: {insight.lastUpdated.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
