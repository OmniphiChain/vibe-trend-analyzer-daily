import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  getCoinMarketCapCircuitBreakerStatus,
  resetCoinMarketCapCircuitBreaker,
  coinMarketCapApi,
} from "../services/coinMarketCapApi";

export const CoinMarketCapStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    timeRemaining?: number;
  } | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = () => {
    const currentStatus = getCoinMarketCapCircuitBreakerStatus();
    setStatus(currentStatus);
    setLastChecked(new Date());
  };

  const handleReset = () => {
    resetCoinMarketCapCircuitBreaker();
    checkStatus();
  };

  const handleClearCache = () => {
    coinMarketCapApi.clearCache();
    checkStatus();
  };

  useEffect(() => {
    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (!status) return <AlertCircle className="h-5 w-5 text-gray-400" />;

    if (status.isOpen) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (!status) return "Checking...";

    if (status.isOpen) {
      const minutes = status.timeRemaining
        ? Math.ceil(status.timeRemaining / 1000 / 60)
        : 0;
      return `Circuit Breaker Open (${minutes}m remaining)`;
    }
    return "API Available";
  };

  const getStatusColor = () => {
    if (!status) return "text-gray-600";
    return status.isOpen ? "text-red-600" : "text-green-600";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          {getStatusIcon()}
          <span className={getStatusColor()}>CoinMarketCap API</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkStatus}
            className="ml-auto h-6 w-6 p-0"
            title="Refresh status"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="text-sm">
          <div className={`font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {lastChecked && (
            <div className="text-xs text-gray-500 mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>

        {status?.isOpen && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              The API is temporarily blocked due to rate limiting. The
              application will automatically retry after the cooldown period.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex-1 text-xs"
            title="Reset circuit breaker (use carefully)"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="flex-1 text-xs"
            title="Clear cached data"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Cache
          </Button>
        </div>

        <div className="text-xs text-gray-600">
          <p>
            <strong>Status Indicators:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>
              <span className="text-green-600">API Available</span> - Normal
              operation
            </li>
            <li>
              <span className="text-red-600">Circuit Breaker Open</span> - Rate
              limited, using cached data
            </li>
          </ul>
        </div>

        {status?.isOpen && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
            <strong>Note:</strong> Manually resetting during rate limits may
            cause the circuit breaker to immediately reopen. It's usually better
            to wait for the automatic recovery.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinMarketCapStatus;
