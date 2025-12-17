import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stockDataFallback } from "@/services/stockDataFallback";

export const ApiStatusOverview = () => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Simple timer to force re-renders
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Get status directly without storing in state
  const fallbackStatus = stockDataFallback.getStatus();

  const handleClearCache = () => {
    stockDataFallback.clearCache();
    setLastUpdate(Date.now()); // Force refresh
  };

  const handleEnableApi = () => {
    stockDataFallback.enableApi();
    setLastUpdate(Date.now()); // Force refresh
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          API Status Overview
        </CardTitle>
        <CardDescription>Current status of financial data APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">System Status</h4>
              <p className="text-sm text-muted-foreground">
                {fallbackStatus.apiDisabled
                  ? "Using mock data due to API limits"
                  : "All systems operational"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {fallbackStatus.apiDisabled ? (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <Badge
                variant={fallbackStatus.apiDisabled ? "destructive" : "default"}
              >
                {fallbackStatus.apiDisabled ? "Fallback Mode" : "Live Data"}
              </Badge>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alpha Vantage API (Stocks) */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Alpha Vantage API</h4>
              <Badge
                variant={fallbackStatus.apiDisabled ? "destructive" : "default"}
              >
                {fallbackStatus.apiDisabled ? "Disabled" : "Active"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Stock market data
            </p>
            <div className="text-xs space-y-1">
              <div>Rate Limit: 5 requests/minute</div>
              <div>Status: {fallbackStatus.message}</div>
            </div>
          </div>

          {/* CoinMarketCap API (Crypto) */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">CoinMarketCap API</h4>
              <Badge variant="destructive">Mock Data</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Cryptocurrency data
            </p>
            <div className="text-xs space-y-1">
              <div>
                Status: CORS restriction - requires server-side implementation
              </div>
              <div>Using mock data for demonstration</div>
            </div>
          </div>
        </div>

        {/* Cache Status */}
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Cache Status</h4>
            <Badge variant="outline">{fallbackStatus.cacheSize} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cached data helps reduce API calls and provides faster responses
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleClearCache}>
              Clear Cache
            </Button>
            {fallbackStatus.apiDisabled && (
              <Button variant="outline" size="sm" onClick={handleEnableApi}>
                Force Enable APIs
              </Button>
            )}
          </div>
        </div>

        {/* Recovery Information */}
        {fallbackStatus.apiDisabled && fallbackStatus.apiDisabledUntil && (
          <div className="p-4 border rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium">API Recovery</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              APIs will automatically re-enable at{" "}
              {fallbackStatus.apiDisabledUntil.toLocaleString()}
            </p>
          </div>
        )}

        {/* Last Update Time */}
        <div className="text-center text-xs text-muted-foreground">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};
