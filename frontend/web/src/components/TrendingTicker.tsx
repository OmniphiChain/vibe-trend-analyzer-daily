import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, TrendingUp, TrendingDown } from "lucide-react";

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name?: string;
  type?: "stock" | "etf" | "crypto";
}

interface TrendingTickerProps {
  className?: string;
}

export const TrendingTicker: React.FC<TrendingTickerProps> = ({
  className,
}) => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Major tickers to track
  const trackedSymbols = [
    "SPY",
    "QQQ",
    "DIA",
    "IWM", // ETFs
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "NVDA",
    "META",
    "NFLX", // Major stocks
    "BTC-USD",
    "ETH-USD", // Crypto
    "GLD",
    "SLV",
    "TLT",
    "VIX", // Other assets
  ];

  // Mock data for development (replace with real Yahoo Finance API)
  const generateMockData = (): TickerData[] => {
    return trackedSymbols.map((symbol) => {
      const basePrice = Math.random() * 200 + 50;
      const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
      const change = (basePrice * changePercent) / 100;

      return {
        symbol,
        price: basePrice,
        change,
        changePercent,
        name: symbol,
        type: symbol.includes("USD")
          ? "crypto"
          : symbol.length === 3
            ? "etf"
            : "stock",
      };
    });
  };

  // Fetch ticker data (mock implementation)
  const fetchTickerData = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would call Yahoo Finance API
      // For now, using mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      const mockData = generateMockData();
      setTickers(mockData);
    } catch (error) {
      console.error("Error fetching ticker data:", error);
      // Fallback to mock data
      setTickers(generateMockData());
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update every 30 seconds
  useEffect(() => {
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !isPlaying) return;

    const scroll = () => {
      if (
        scrollContainer.scrollLeft >=
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      ) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const scrollInterval = setInterval(scroll, 50);
    return () => clearInterval(scrollInterval);
  }, [isPlaying, tickers]);

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3" />;
    if (change < 0) return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const getAssetDot = (type?: string) => {
    switch (type) {
      case "crypto":
        return <div className="w-2 h-2 rounded-full bg-yellow-400"></div>;
      case "etf":
        return <div className="w-2 h-2 rounded-full bg-blue-400"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-green-400"></div>;
    }
  };

  const topMovers = tickers
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 3);

  return (
    <div
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 ${className}`}
    >
      <div className="flex items-center h-12 px-4">
        {/* Trending Label */}
        <div className="flex items-center gap-2 mr-4 flex-shrink-0">
          <span className="text-orange-400 font-bold text-sm uppercase tracking-wider">
            📈 TRENDING
          </span>
          <div className="w-px h-6 bg-gray-600"></div>
        </div>

        {/* Scrolling Ticker Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden whitespace-nowrap"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex items-center gap-6 animate-none">
            {isLoading ? (
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {tickers.map((ticker, index) => (
                  <div
                    key={`${ticker.symbol}-${index}`}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 ${
                      topMovers.includes(ticker)
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg border border-blue-500/30"
                        : "hover:bg-gray-800/50"
                    }`}
                  >
                    {getAssetDot(ticker.type)}
                    <span className="text-white font-medium text-sm">
                      {ticker.symbol}
                    </span>
                    <span className="text-gray-300 text-sm">
                      ${ticker.price.toFixed(2)}
                    </span>
                    <div
                      className={`flex items-center gap-1 ${getChangeColor(ticker.changePercent)}`}
                    >
                      {getChangeIcon(ticker.changePercent)}
                      <span className="text-xs font-medium">
                        {ticker.changePercent > 0 ? "+" : ""}
                        {ticker.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {tickers.map((ticker, index) => (
                  <div
                    key={`${ticker.symbol}-duplicate-${index}`}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 ${
                      topMovers.includes(ticker)
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg border border-blue-500/30"
                        : "hover:bg-gray-800/50"
                    }`}
                  >
                    {getAssetDot(ticker.type)}
                    <span className="text-white font-medium text-sm">
                      {ticker.symbol}
                    </span>
                    <span className="text-gray-300 text-sm">
                      ${ticker.price.toFixed(2)}
                    </span>
                    <div
                      className={`flex items-center gap-1 ${getChangeColor(ticker.changePercent)}`}
                    >
                      {getChangeIcon(ticker.changePercent)}
                      <span className="text-xs font-medium">
                        {ticker.changePercent > 0 ? "+" : ""}
                        {ticker.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <div className="w-px h-6 bg-gray-600"></div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-300" />
            ) : (
              <Play className="w-4 h-4 text-gray-300" />
            )}
          </button>
          <span className="text-xs text-gray-500">Updates every 30s</span>
        </div>
      </div>
    </div>
  );
};
