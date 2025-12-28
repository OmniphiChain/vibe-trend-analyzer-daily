import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Plus, TrendingUp, DollarSign, Clock, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WatchlistAsset } from "@/types/watchlist";

interface AddTickerModalProps {
  onAddAsset: (asset: WatchlistAsset) => void;
  existingTickers: string[];
  children?: React.ReactNode;
}

// Mock search results
const mockSearchResults = [
  {
    id: "msft",
    ticker: "$MSFT",
    name: "Microsoft Corporation",
    type: "stock" as const,
    currentPrice: 378.85,
    dailyChange: 5.42,
    dailyChangePercent: 1.45,
    sentimentScore: 82,
    category: "Technology",
    logo: "🪟"
  },
  {
    id: "amzn",
    ticker: "$AMZN", 
    name: "Amazon.com Inc",
    type: "stock" as const,
    currentPrice: 156.78,
    dailyChange: -2.34,
    dailyChangePercent: -1.47,
    sentimentScore: 68,
    category: "E-commerce",
    logo: "📦"
  },
  {
    id: "sol",
    ticker: "$SOL",
    name: "Solana",
    type: "crypto" as const,
    currentPrice: 98.45,
    dailyChange: 4.67,
    dailyChangePercent: 4.99,
    sentimentScore: 76,
    category: "Blockchain",
    logo: "◉"
  },
  {
    id: "ada",
    ticker: "$ADA",
    name: "Cardano",
    type: "crypto" as const,
    currentPrice: 0.634,
    dailyChange: 0.023,
    dailyChangePercent: 3.76,
    sentimentScore: 59,
    category: "Blockchain",
    logo: "♠"
  }
];

const trendingAssets = [
  { ticker: "$NVDA", name: "NVIDIA Corp", change: "+5.2%", sentiment: 89 },
  { ticker: "$TSLA", name: "Tesla Inc", change: "-2.1%", sentiment: 45 },
  { ticker: "$BTC", name: "Bitcoin", change: "+3.8%", sentiment: 85 },
  { ticker: "$ETH", name: "Ethereum", change: "+2.1%", sentiment: 72 }
];

export const AddTickerModal = ({ onAddAsset, existingTickers, children }: AddTickerModalProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [activeTab, setActiveTab] = useState("search");

  // Filter search results based on query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(mockSearchResults);
      return;
    }

    const filtered = mockSearchResults.filter(asset =>
      asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleAddAsset = (result: typeof mockSearchResults[0]) => {
    if (existingTickers.includes(result.ticker)) {
      return; // Already in watchlist
    }

    const newAsset: WatchlistAsset = {
      ...result,
      sentimentTrend: result.dailyChange > 0 ? "rising" : "falling",
      aiInsight: `Added to watchlist. Current sentiment: ${result.sentimentScore}%. Market showing ${result.dailyChange > 0 ? 'positive' : 'negative'} momentum.`,
      lastUpdated: new Date(),
      volume: Math.floor(Math.random() * 100000000),
      marketCap: Math.floor(Math.random() * 1000000000000)
    };

    onAddAsset(newAsset);
    setOpen(false);
    setSearchQuery("");
  };

  const SearchResultCard = ({ result }: { result: typeof mockSearchResults[0] }) => {
    const isAdded = existingTickers.includes(result.ticker);
    const isPositive = result.dailyChange > 0;

    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-colors group">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center text-lg">
            {result.logo}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{result.ticker}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  result.type === 'crypto' ? 
                    "text-orange-400 border-orange-400/30" :
                    "text-blue-400 border-blue-400/30"
                )}
              >
                {result.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-400">{result.name}</p>
            <p className="text-xs text-gray-500">{result.category}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-semibold text-white">
            ${result.currentPrice.toFixed(2)}
          </div>
          <div className={cn(
            "text-xs font-medium",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? '+' : ''}{result.dailyChangePercent.toFixed(2)}%
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className={cn(
              "w-2 h-2 rounded-full",
              result.sentimentScore >= 70 ? "bg-emerald-400" :
              result.sentimentScore >= 50 ? "bg-yellow-400" : "bg-red-400"
            )} />
            <span className="text-xs text-gray-400">{result.sentimentScore}%</span>
          </div>
        </div>

        <Button
          size="sm"
          variant={isAdded ? "secondary" : "default"}
          disabled={isAdded}
          onClick={() => handleAddAsset(result)}
          className="ml-3"
        >
          {isAdded ? (
            <>
              <Star className="w-3 h-3 mr-1" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Add to Watchlist
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#1F2937] to-[#3730A3] dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Add to Watchlist
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="search" className="data-[state=active]:bg-purple-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stocks, crypto, or tickers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 focus:border-purple-500"
              />
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
                
                {searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No assets found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trending" className="mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Assets
              </h3>
              
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {trendingAssets.map((asset, index) => (
                    <div key={asset.ticker} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700/30">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-purple-400">#{index + 1}</span>
                        <div>
                          <span className="font-semibold text-white">{asset.ticker}</span>
                          <p className="text-sm text-gray-400">{asset.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-sm font-medium",
                          asset.change.startsWith('+') ? "text-emerald-400" : "text-red-400"
                        )}>
                          {asset.change}
                        </div>
                        <div className="text-xs text-gray-400">
                          Sentiment: {asset.sentiment}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {['Technology', 'Finance', 'Healthcare', 'Energy', 'DeFi', 'Gaming'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="h-16 flex-col gap-1 bg-gray-800/50 border-gray-700 hover:border-purple-500"
                >
                  <span className="font-medium">{category}</span>
                  <span className="text-xs text-gray-400">View assets</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
