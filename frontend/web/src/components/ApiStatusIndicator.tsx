import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stockDataFallback } from "@/services/stockDataFallback";

export const ApiStatusIndicator = () => {
  const [status, setStatus] = useState(stockDataFallback.getStatus());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(stockDataFallback.getStatus());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleEnableApi = () => {
    stockDataFallback.enableApi();
    setStatus(stockDataFallback.getStatus());
  };

  const handleClearCache = () => {
    stockDataFallback.clearCache();
  };

  if (!status.apiDisabled) {
    return (
      <div className="fixed top-20 right-4 z-40">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          Live Data
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm">
      <Alert
        variant="destructive"
        className="border-orange-200 bg-orange-50 text-orange-800"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              <span className="font-medium">API Disabled</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>

          <p className="text-xs">Using mock data due to rate limits</p>

          {showDetails && (
            <div className="space-y-2 pt-2 border-t border-orange-200">
              <div className="text-xs space-y-1">
                <p>
                  <strong>Status:</strong> {status.message}
                </p>
                {status.apiDisabledUntil && (
                  <p>
                    <strong>Retry at:</strong>{" "}
                    {status.apiDisabledUntil.toLocaleTimeString()}
                  </p>
                )}
                <p>
                  <strong>Cache:</strong> {status.cacheSize} items
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnableApi}
                  className="text-xs h-6"
                >
                  Force Enable
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  className="text-xs h-6"
                >
                  Clear Cache
                </Button>
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

// Compact version for the navigation bar
export const ApiStatusBadge = () => {
  const [status, setStatus] = useState(stockDataFallback.getStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(stockDataFallback.getStatus());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!status.apiDisabled) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3 text-green-600" />
        <span className="text-green-600">Live</span>
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      Mock Data
    </Badge>
  );
};
