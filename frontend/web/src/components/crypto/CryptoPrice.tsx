import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
  Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCryptoQuotes } from "@/hooks/useCoinMarketCap";
import { cn } from "@/lib/utils";

interface CryptoPriceProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  showRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

export const CryptoPrice = ({
  symbol,
  size = "md",
  showRefresh = false,
  refreshInterval = 60000,
  className,
}: CryptoPriceProps) => {
  const { tickers, loading, error, refetch } = useCryptoQuotes([symbol], {
    refreshInterval: 300000, // 5 minutes to reduce API calls
    enabled: true,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const ticker = tickers[0];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 10) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? "+" : ""}${change.toFixed(2)}`,
      changePercent: `${isPositive ? "+" : ""}${changePercent.toFixed(2)}%`,
      isPositive,
    };
  };

  const sizeClasses = {
    sm: {
      container: "text-xs",
      price: "text-sm font-semibold",
      change: "text-xs",
      icon: "h-3 w-3",
    },
    md: {
      container: "text-sm",
      price: "text-lg font-bold",
      change: "text-sm",
      icon: "h-4 w-4",
    },
    lg: {
      container: "text-base",
      price: "text-2xl font-bold",
      change: "text-base",
      icon: "h-5 w-5",
    },
  };

  const classes = sizeClasses[size];

  if (loading && !ticker) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <Loader2 className={cn("animate-spin", classes.icon)} />
        <span className="text-muted-foreground">Loading {symbol}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
        <span className="text-muted-foreground">{symbol}</span>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw
              className={cn("h-3 w-3", isRefreshing && "animate-spin")}
            />
          </Button>
        )}
      </div>
    );
  }

  if (!ticker) {
    return (
      <div
        className={cn("flex items-center gap-2", classes.container, className)}
      >
        <span className="text-muted-foreground">{symbol} - Not found</span>
      </div>
    );
  }

  const { change, changePercent, isPositive } = formatChange(
    ticker.change,
    ticker.changePercent,
  );
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn("flex items-center gap-2", classes.container, className)}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium flex items-center gap-1">
            <Coins className={classes.icon} />
            {symbol}
          </span>
          <span className={classes.price}>{formatPrice(ticker.price)}</span>
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw
                className={cn(
                  "h-3 w-3",
                  (isRefreshing || loading) && "animate-spin",
                )}
              />
            </Button>
          )}
        </div>
        <div
          className={cn("flex items-center gap-1", changeColor, classes.change)}
        >
          <TrendIcon className={classes.icon} />
          <span>{change}</span>
          <span>({changePercent})</span>
        </div>
      </div>
    </div>
  );
};

// Compact version for inline use in posts
export const InlineCryptoPrice = ({
  symbol,
  className,
}: {
  symbol: string;
  className?: string;
}) => {
  const { tickers, loading, error } = useCryptoQuotes([symbol], {
    refreshInterval: 300000, // 5 minutes to reduce API calls
    enabled: true,
  });

  const ticker = tickers[0];

  if (loading || error || !ticker) {
    return <span className={cn("font-medium", className)}>{symbol}</span>;
  }

  const isPositive = ticker.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 10) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="font-medium flex items-center gap-1">
        <Coins className="h-3 w-3" />
        {symbol}
      </span>
      <span className="font-semibold">{formatPrice(ticker.price)}</span>
      <span className={cn("text-xs", changeColor)}>
        ({isPositive ? "+" : ""}
        {ticker.changePercent.toFixed(2)}%)
      </span>
    </span>
  );
};

// Grid component for displaying multiple cryptocurrencies
interface CryptoGridProps {
  symbols: string[];
  className?: string;
}

export const CryptoGrid = ({ symbols, className }: CryptoGridProps) => {
  // Use a single API call for all symbols to reduce excessive requests
  const { tickers, loading, error } = useCryptoQuotes(symbols, {
    refreshInterval: 300000, // 5 minutes to reduce API calls
    enabled: true,
  });

  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {symbols.map((symbol) => (
          <div key={symbol} className="p-4 border rounded-lg">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Unable to load cryptocurrency data</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {symbols.map((symbol) => {
        const ticker = tickers.find(t => t.symbol === symbol);
        if (!ticker) return null;
        
        const isPositive = ticker.change >= 0;
        const changeColor = isPositive ? "text-green-600" : "text-red-600";
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        const formatPrice = (price: number) => {
          if (price < 1) return `$${price.toFixed(6)}`;
          if (price < 10) return `$${price.toFixed(4)}`;
          return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        };

        return (
          <div key={symbol} className="p-4 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2">
                  <span className="font-medium flex items-center gap-1">
                    <Coins className="h-4 w-4" />
                    {symbol}
                  </span>
                  <span className="text-lg font-bold">{formatPrice(ticker.price)}</span>
                </div>
                <div className={cn("flex items-center gap-1", changeColor, "text-sm")}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{isPositive ? "+" : ""}{ticker.change.toFixed(2)}</span>
                  <span>({isPositive ? "+" : ""}{ticker.changePercent.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Market overview component
export const CryptoMarketOverview = () => {
  const { tickers, loading, error } = useCryptoQuotes(
    ["BTC", "ETH", "BNB", "XRP"],
    {
      refreshInterval: 300000, // 5 minutes to reduce API calls
      enabled: true,
    },
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || tickers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <p>Unable to load cryptocurrency data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {tickers.map((ticker) => (
        <div key={ticker.symbol} className="p-4 border rounded-lg">
          <CryptoPrice symbol={ticker.symbol} size="sm" className="w-full" />
        </div>
      ))}
    </div>
  );
};
