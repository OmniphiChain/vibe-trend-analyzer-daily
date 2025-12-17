import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface PollOption {
  ticker: string;
  votes: number;
  percentage: number;
  change?: number;
}

interface LivePollsWidgetProps {
  className?: string;
}

export const LivePollsWidget: React.FC<LivePollsWidgetProps> = ({
  className,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const pollData: PollOption[] = [
    { ticker: "NVDA", votes: 1247, percentage: 35, change: 2.45 },
    { ticker: "TSLA", votes: 892, percentage: 25, change: -1.23 },
    { ticker: "AAPL", votes: 743, percentage: 21, change: 0.89 },
    { ticker: "MSFT", votes: 678, percentage: 19, change: 1.56 },
  ];

  const totalVotes = pollData.reduce((sum, option) => sum + option.votes, 0);
  const timeRemaining = "2h 15m";

  const handleVote = (ticker: string) => {
    if (!hasVoted) {
      setSelectedOption(ticker);
      setHasVoted(true);
    }
  };

  return (
    <Card
      className={`bg-gradient-to-br from-violet-900/50 to-purple-900/50 border-violet-500/20 hover:border-violet-400/40 transition-all duration-300 overflow-hidden w-full max-w-full rounded-xl ${className || ""}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg font-bold">
          📊 Live Polls
        </CardTitle>
        <div className="flex items-center gap-2 text-violet-200">
          <Clock className="w-4 h-4" />
          <span className="text-sm">⏳ Expires in {timeRemaining}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-[200px] p-4">
        <div className="space-y-3">
                    <h4 className="text-white font-semibold text-base">
            <p>Next to moon? 🚀</p>
          </h4>

          <div className="space-y-3">
            {pollData.map((option) => (
              <div key={option.ticker} className="space-y-2 overflow-hidden">
                <div className="flex justify-between items-center text-sm overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-white font-medium whitespace-nowrap">
                      ${option.ticker}
                    </span>
                    {option.change && (
                      <span
                        className={`flex items-center gap-1 text-xs ${
                          option.change > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {option.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {option.change > 0 ? "+" : ""}
                        {option.change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                                    <div className="flex items-center gap-2 text-violet-200 overflow-hidden">
                    <span className="text-[10px] truncate">
                      ({option.votes.toLocaleString()})
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => handleVote(option.ticker)}
                    disabled={hasVoted}
                    className={`w-full text-left transition-all duration-200 ${
                      !hasVoted
                        ? "hover:scale-[1.02] cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
                  >
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          selectedOption === option.ticker
                            ? "bg-gradient-to-r from-violet-300 to-purple-300 shadow-lg shadow-violet-500/30"
                            : "bg-gradient-to-r from-violet-400 to-purple-400"
                        }`}
                        style={{ width: `${option.percentage}%` }}
                      >
                        {option.percentage > 15 && (
                          <div className="h-full bg-gradient-to-r from-white/20 to-transparent" />
                        )}
                      </div>
                    </div>
                  </button>

                  {selectedOption === option.ticker && (
                    <div className="absolute top-0 right-0">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!hasVoted && (
            <div className="text-center text-xs text-violet-300 mt-3">
              Click any bar to cast your vote
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-violet-500/20 flex items-center justify-between text-xs text-violet-200">
          <span className="flex items-center gap-1">
            📊 {totalVotes.toLocaleString()} total votes
          </span>
          <span className="flex items-center gap-1">
            👥 {Math.floor(totalVotes * 0.7).toLocaleString()} participants
          </span>
        </div>

        {hasVoted && (
          <div className="mt-3 p-2 bg-violet-600/20 rounded-lg border border-violet-500/30">
            <div className="text-center text-sm text-violet-100">
              ✅ Vote recorded for{" "}
              <span className="font-bold">${selectedOption}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
