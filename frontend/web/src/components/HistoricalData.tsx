import { useState } from "react";
import { Calendar as CalendarIcon, Search, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const HistoricalData = () => {
  const [date, setDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  const historicalEvents = [
    {
      date: "2025-01-10",
      score: 71,
      event: "Tech Innovation Summit",
      impact: "Major breakthrough in AI technology announced",
      sources: { news: 69, social: 73, forums: 70, stocks: 72 }
    },
    {
      date: "2025-01-08",
      score: 65,
      event: "Market Volatility",
      impact: "Cryptocurrency market fluctuations caused uncertainty",
      sources: { news: 62, social: 68, forums: 66, stocks: 64 }
    },
    {
      date: "2025-01-05",
      score: 78,
      event: "Positive Economic Data",
      impact: "Strong employment numbers boosted market confidence",
      sources: { news: 76, social: 80, forums: 77, stocks: 79 }
    },
    {
      date: "2025-01-03",
      score: 69,
      event: "Policy Announcement",
      impact: "New environmental regulations sparked mixed reactions",
      sources: { news: 67, social: 71, forums: 68, stocks: 70 }
    },
    {
      date: "2024-12-31",
      score: 82,
      event: "Year-End Optimism",
      impact: "Positive outlook for the new year dominated discussions",
      sources: { news: 80, social: 84, forums: 81, stocks: 83 }
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-positive";
    if (score >= 50) return "text-neutral";
    return "text-negative";
  };

  const filteredEvents = historicalEvents.filter(event =>
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.impact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Historical Sentiment Data</h1>
        <p className="text-xl text-muted-foreground">
          Explore past mood scores and their correlation with significant events
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Historical Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events or impacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Events & Sentiment Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredEvents.map((event, index) => (
              <div key={index} className="relative pl-8 pb-6 last:pb-0">
                {/* Timeline line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-2 top-8 bottom-0 w-px bg-border" />
                )}
                
                {/* Timeline dot */}
                <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 ${
                  event.score >= 70 ? 'bg-positive border-positive' :
                  event.score >= 50 ? 'bg-neutral border-neutral' :
                  'bg-negative border-negative'
                }`} />
                
                <div className="bg-card/50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{event.event}</h3>
                        <Badge variant="outline">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{event.impact}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(event.score)}`}>
                        {event.score}
                      </div>
                      <div className="text-sm text-muted-foreground">Mood Score</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-chart-secondary">News</div>
                      <div>{event.sources.news}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-chart-tertiary">Social</div>
                      <div>{event.sources.social}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-chart-quaternary">Forums</div>
                      <div>{event.sources.forums}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-primary">Stocks</div>
                      <div>{event.sources.stocks}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-positive mb-2">82</div>
            <div className="text-sm text-muted-foreground">
              December 31, 2024 - Year-End Optimism
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-negative mb-2">65</div>
            <div className="text-sm text-muted-foreground">
              January 8, 2025 - Market Volatility
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral mb-2">73</div>
            <div className="text-sm text-muted-foreground">
              Last 30 days average
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};