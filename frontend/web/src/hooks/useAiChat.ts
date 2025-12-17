import { useState } from "react";

export interface AiResponse {
  content: string;
  suggestions?: string[];
  links?: { label: string; action: () => void }[];
}

export const useAiChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string): Promise<AiResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("AI Chat Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = async (ticker: string): Promise<AiResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze sentiment");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Sentiment Analysis Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const summarizePosts = async (
    ticker?: string,
    limit?: number,
  ): Promise<AiResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, limit }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize posts");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Post Summarization Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getWatchlistRecommendations = async (): Promise<AiResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Recommendations Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    analyzeSentiment,
    summarizePosts,
    getWatchlistRecommendations,
    isLoading,
  };
};
