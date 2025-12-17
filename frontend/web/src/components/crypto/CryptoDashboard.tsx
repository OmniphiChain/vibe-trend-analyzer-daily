import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Coins,
  BarChart3,
  Globe,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  useCryptoListings,
  useCryptoQuotes,
  useGlobalMetrics,
} from "@/hooks/useCoinMarketCap";
import { CryptoPrice, CryptoGrid } from "./CryptoPrice";
import CoinMarketCapStatus from "../CoinMarketCapStatus";

export const CryptoDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "1h" | "24h" | "7d" | "30d"
  >("24h");
  const [searchQuery, setSearchQuery] = useState("");

  // Get top 10 cryptocurrencies (this single call provides all crypto data)
  const {
    tickers: topCryptos,
    loading: cryptoLoading,
    error: cryptoError,
    refetch,
  } = useCryptoListings(10, { refreshInterval: 300000 }); // 5 minutes

  // Get global metrics with reduced refresh rate
  const { data: globalMetrics, loading: metricsLoading } = useGlobalMetrics({
    refreshInterval: 300000, // 5 minutes
  });

  // Filter cryptocurrencies based on search
  const filteredCryptos = topCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Coins className="h-8 w-8" />
            Cryptocurrency Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency data powered by CoinMarketCap API
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <CoinMarketCapStatus />
          <Button onClick={refetch} disabled={cryptoLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${cryptoLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Global Market Stats */}
      {globalMetrics && !metricsLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Global Cryptocurrency Market
            </CardTitle>
            <CardDescription>
              Real-time global market statistics and dominance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {globalMetrics.data.active_cryptocurrencies?.toLocaleString() ||
                    "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Cryptos
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {globalMetrics.data.btc_dominance?.toFixed(1) || "N/A"}%
                </div>
                <div className="text-sm text-muted-foreground">
                  BTC Dominance
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {globalMetrics.data.eth_dominance?.toFixed(1) || "N/A"}%
                </div>
                <div className="text-sm text-muted-foreground">
                  ETH Dominance
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {formatMarketCap(
                    globalMetrics.data.quote?.USD?.total_market_cap || 0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Market Cap
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-red-600">
                  {formatVolume(
                    globalMetrics.data.quote?.USD?.total_volume_24h || 0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">24h Volume</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-xl font-bold text-indigo-600">
                  {globalMetrics.data.active_exchanges?.toLocaleString() ||
                    "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Exchanges
                </div>
              </div>
            </div>

            {/* Dominance Progress Bars */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bitcoin Dominance</span>
                  <span>
                    {globalMetrics.data.btc_dominance?.toFixed(1) || "0"}%
                  </span>
                </div>
                <Progress
                  value={globalMetrics.data.btc_dominance || 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Ethereum Dominance</span>
                  <span>
                    {globalMetrics.data.eth_dominance?.toFixed(1) || "0"}%
                  </span>
                </div>
                <Progress
                  value={globalMetrics.data.eth_dominance || 0}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Cryptocurrencies */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Cryptocurrencies</CardTitle>
          <CardDescription>
            Real-time prices for the most popular cryptocurrencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cryptoError && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>API Notice:</strong> {cryptoError}
              </p>
              {cryptoError.includes("rate limit") && (
                <p className="text-xs text-yellow-700 mt-1">
                  The data shown below is cached. The API will automatically
                  recover.
                </p>
              )}
            </div>
          )}
          {cryptoLoading && topCryptos.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading popular cryptocurrencies...</p>
            </div>
          ) : (
            <CryptoGrid
              symbols={topCryptos.slice(0, 6).map((crypto) => crypto.symbol)}
            />
          )}
        </CardContent>
      </Card>

      {/* Top Cryptocurrencies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top Cryptocurrencies by Market Cap
          </CardTitle>
          <CardDescription>
            Complete ranking of cryptocurrencies with real-time data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Loading State */}
          {cryptoLoading && topCryptos.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading cryptocurrency data...</p>
            </div>
          ) : cryptoError ? (
            <div className="text-center py-8 text-red-600">
              <p>Error loading data: {cryptoError}</p>
              <Button variant="outline" onClick={refetch} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : (
            /* Top 10 Cryptocurrency List */
            <div className="space-y-2">
              {filteredCryptos.slice(0, 10).map((crypto, index) => {
                const isPositive = crypto.changePercent >= 0;
                const actualRank =
                  topCryptos.findIndex((c) => c.symbol === crypto.symbol) + 1;

                return (
                  <div
                    key={crypto.symbol}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <Badge variant="outline" className="w-10 text-center">
                        #{actualRank}
                      </Badge>

                      {/* Crypto Info */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-lg">
                            {crypto.symbol}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {crypto.type.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {crypto.name}
                        </span>
                      </div>
                    </div>

                    {/* Price and Stats */}
                    <div className="flex items-center gap-6">
                      {/* Price */}
                      <div className="text-right">
                        <div className="font-medium text-lg">
                          {crypto.price < 1
                            ? `$${crypto.price.toFixed(6)}`
                            : `$${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </div>
                        <div
                          className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                        >
                          {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {isPositive ? "+" : ""}
                          {crypto.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      {/* Market Cap */}
                      <div className="text-right min-w-[100px]">
                        <div className="font-medium">
                          {crypto.marketCap
                            ? formatMarketCap(crypto.marketCap)
                            : "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Market Cap
                        </div>
                      </div>

                      {/* Volume */}
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium">
                          {formatVolume(crypto.volume)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          24h Volume
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show more button if search is not active */}
          {!searchQuery && filteredCryptos.length > 50 && (
            <div className="text-center pt-4">
              <Button variant="outline">Load More Cryptocurrencies</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
