import { useState } from "react";
import { RefreshCw, Building, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { usePolygonTickers, usePolygonDividends, usePolygonQuotes } from "@/hooks/usePolygon";

export const PolygonDemo = () => {
  const [selectedTicker, setSelectedTicker] = useState<string>("AAPL");
  
  // Get top 20 stock tickers with 5-minute refresh
  // TODO: Implement usePolygonTickers hook
  const tickersData = null;
  const tickersLoading = false;
  const tickersError = null;
  const refetchTickers = () => {};

  // Get dividend data for selected ticker
  // TODO: Implement usePolygonDividends hook
  const dividendsData = null;
  const dividendsLoading = false;
  const dividendsError = null;
  const refetchDividends = () => {};

  // Get real-time quotes for selected ticker (requires premium subscription)
  // TODO: Implement usePolygonQuotes hook
  const quotesData = null;
  const quotesLoading = false;
  const quotesError = null;
  const refetchQuotes = () => {};

  const handleRefresh = () => {
    refetchTickers();
    refetchDividends();
    refetchQuotes();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8" />
            Polygon.io Stock Data
          </h1>
          <p className="text-muted-foreground">
            Real-time stock ticker and dividend data from Polygon.io API
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={tickersLoading || dividendsLoading || quotesLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${tickersLoading || dividendsLoading || quotesLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Stock Tickers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Stock Tickers
            </CardTitle>
            <CardDescription>
              Top 20 active stock tickers from Polygon.io
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickersLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading stock tickers...</span>
              </div>
            ) : tickersError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {tickersError}</p>
                <Button variant="outline" onClick={refetchTickers} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : false ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[].map((ticker: any) => (
                  <div
                    key={ticker.ticker}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTicker === ticker.ticker
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTicker((ticker as any).ticker)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{ticker.ticker}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {ticker.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{ticker.market}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {ticker.primary_exchange}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No stock data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Dividend Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Dividend Data for {selectedTicker}
            </CardTitle>
            <CardDescription>
              Recent dividend information from Polygon.io
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dividendsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mr-2" />
                <span>Loading dividend data...</span>
              </div>
            ) : dividendsError ? (
              <div className="text-center py-8 text-red-600">
                <p>Error: {dividendsError}</p>
                <Button variant="outline" onClick={refetchDividends} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : false ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {[].map((dividend: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Cash Amount</div>
                        <div className="font-semibold text-lg">
                          {formatCurrency(dividend.cash_amount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Type</div>
                        <div className="font-medium">{dividend.dividend_type}</div>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Ex-Dividend Date</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dividend.ex_dividend_date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pay Date</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dividend.pay_date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Record Date</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dividend.record_date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Declaration Date</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(dividend.declaration_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No dividend data available for {selectedTicker}</p>
                <p className="text-sm">Try selecting a different stock ticker</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              API Coverage & Limitations
            </CardTitle>
            <CardDescription>
              Available endpoints and subscription requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-green-50">
                <div className="font-semibold text-green-800 mb-2">✓ Available (Free Tier)</div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Stock Tickers (Active/Inactive)</li>
                  <li>• Dividend Information</li>
                  <li>• Basic Company Data</li>
                </ul>
              </div>
              
              <div className="p-3 border rounded-lg bg-orange-50">
                <div className="font-semibold text-orange-800 mb-2">⚠ Premium Required</div>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Real-time Stock Quotes</li>
                  <li>• Market Data Streams</li>
                  <li>• Historical Price Data</li>
                </ul>
                <div className="mt-3 text-xs text-orange-600">
                  Current API key has basic access only. Upgrade at polygon.io/pricing for real-time data.
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="font-semibold mb-2">Current Status</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">API Key</div>
                    <div className="font-mono text-xs">ABe...zaX</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Subscription</div>
                    <div>Basic (Free)</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
          <CardDescription>
            Current status of Polygon.io API integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                0
              </div>
              <div className="text-sm text-muted-foreground">Stock Tickers Loaded</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                0
              </div>
              <div className="text-sm text-muted-foreground">Dividends for {selectedTicker}</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                Basic
              </div>
              <div className="text-sm text-muted-foreground">API Subscription</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5min</div>
              <div className="text-sm text-muted-foreground">Refresh Interval</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
