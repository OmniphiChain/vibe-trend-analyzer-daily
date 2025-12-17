import { useMutation, useQuery } from "@tanstack/react-query";

export interface SpacyAnalysisResult {
  status: "success" | "error";
  model: string;
  analysis: {
    sentiment_score: number;
    sentiment_label: "positive" | "negative" | "neutral";
    confidence: number;
    entities: {
      organizations: string[];
      persons: string[];
      money: string[];
      dates: string[];
      locations: string[];
      financial_instruments: string[];
    };
    financial_context: {
      financial_entities_count: number;
      market_direction_indicators: Array<[string, string]>;
      risk_indicators: string[];
      performance_indicators: string[];
      temporal_indicators: string[];
    };
    linguistic_features: {
      sentence_count: number;
      avg_sentence_length: number;
      question_count: number;
      exclamation_count: number;
      capitalized_words: number;
      pos_distribution: Record<string, number>;
      dependency_features: Record<string, any>;
    };
    sentiment_features: {
      positive_count: number;
      negative_count: number;
      neutral_count: number;
      positive_words: string[];
      negative_words: string[];
      intensity_modifiers: number;
      negations: number;
      confidence: number;
    };
  };
  metadata: {
    text_length: number;
    processed_tokens: number;
    timestamp: string;
    model_version: string;
    note?: string;
  };
}

export interface SpacyBatchResult {
  status: "success" | "error";
  model: string;
  results: SpacyAnalysisResult[];
  count: number;
  timestamp: string;
}

/**
 * Hook for single text analysis using spaCy NLP
 */
export function useSpacyAnalysis() {
  return useMutation({
    mutationFn: async (text: string): Promise<SpacyAnalysisResult> => {
      const response = await fetch("/api/nlp/spacy/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`spaCy analysis failed: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

/**
 * Hook for batch text analysis using spaCy NLP
 */
export function useSpacyBatchAnalysis() {
  return useMutation({
    mutationFn: async (texts: string[]): Promise<SpacyBatchResult> => {
      const response = await fetch("/api/nlp/spacy/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts }),
      });

      if (!response.ok) {
        throw new Error(`spaCy batch analysis failed: ${response.statusText}`);
      }

      return response.json();
    },
  });
}

/**
 * Hook for analyzing news headlines with spaCy
 */
export function useNewsHeadlineAnalysis(headlines: string[], enabled = true) {
  return useQuery({
    queryKey: ["spacy-news-analysis", headlines],
    queryFn: async (): Promise<SpacyBatchResult> => {
      const response = await fetch("/api/nlp/spacy/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts: headlines }),
      });

      if (!response.ok) {
        throw new Error(`News analysis failed: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: enabled && headlines.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Utility functions for spaCy analysis results
 */
export const spacyUtils = {
  getSentimentColor: (score: number): string => {
    if (score >= 65) return "text-green-600 dark:text-green-400";
    if (score <= 35) return "text-red-600 dark:text-red-400";
    return "text-yellow-600 dark:text-yellow-400";
  },

  getSentimentBadgeVariant: (score: number): "default" | "destructive" | "secondary" => {
    if (score >= 65) return "default";
    if (score <= 35) return "destructive";
    return "secondary";
  },

  getConfidenceLevel: (confidence: number): string => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.5) return "Medium";
    return "Low";
  },

  formatEntities: (entities: SpacyAnalysisResult["analysis"]["entities"]): string[] => {
    const allEntities: string[] = [];
    Object.entries(entities).forEach(([type, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        allEntities.push(...values.map(v => `${v} (${type})`));
      }
    });
    return allEntities;
  },

  getMarketSentiment: (results: SpacyAnalysisResult[]): {
    averageScore: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    totalEntities: number;
  } => {
    const scores = results.map(r => r.analysis.sentiment_score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    const positiveCount = scores.filter(s => s >= 65).length;
    const negativeCount = scores.filter(s => s <= 35).length;
    const neutralCount = scores.length - positiveCount - negativeCount;
    
    const totalEntities = results.reduce((sum, r) => 
      sum + r.analysis.financial_context.financial_entities_count, 0
    );

    return {
      averageScore: Math.round(averageScore * 100) / 100,
      positiveCount,
      negativeCount,
      neutralCount,
      totalEntities,
    };
  },
};