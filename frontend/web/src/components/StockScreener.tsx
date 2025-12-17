import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodTheme } from "@/contexts/MoodThemeContext";
import BasicScreener from "./BasicScreener";
import AdvancedStockScreener from "./AdvancedStockScreener";
import StrategyProfiler from "./StrategyProfiler";

interface StockScreenerProps {
  className?: string;
}

export const StockScreener: React.FC<StockScreenerProps> = ({ className }) => {
  const { themeMode } = useMoodTheme();
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className={cn(
      "min-h-screen",
      themeMode === 'light'
        ? 'bg-[#F5F7FA]'
        : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      className
    )}>
      {/* Ambient Background Effects - Only in Dark Mode */}
      {themeMode !== 'light' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Strategy Profiler Banner */}
        <StrategyProfiler placement="screener" className="mb-8" />
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className={cn(
              "text-5xl font-bold",
              themeMode === 'light'
                ? 'text-[#1E1E1E]'
                : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent'
            )}>
              Stock Screener
            </h1>
          </div>
          <p className={cn(
            "text-xl max-w-3xl mx-auto mb-8",
            themeMode === 'light' ? 'text-[#666]' : 'text-slate-300'
          )}>
            Discover investment opportunities with AI-powered screening tools
          </p>
          
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-4">
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8F5E9] text-[#4CAF50] border-[#4CAF50]/30 rounded-full px-3 py-1'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }>
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Market Data
            </Badge>
            <Badge className={themeMode === 'light'
              ? 'bg-[#E8EAF6] text-[#3F51B5] border-[#3F51B5]/30 rounded-full px-3 py-1'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            }>
              <Filter className="w-3 h-3 mr-1" />
              Smart Filters
            </Badge>
          </div>
        </div>

        {/* Stock Screener Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            style={{ display: 'grid' }}
            className={cn(
              "relative w-full grid grid-cols-2 h-12 p-1 mb-8 rounded-2xl overflow-hidden",
              themeMode === 'light'
                ? 'bg-white border border-gray-200'
                : 'bg-slate-800/50 backdrop-blur-sm border-slate-700/50'
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute rounded-xl transition-transform duration-300 ease-out",
                themeMode === 'light'
                  ? 'bg-[#3F51B5]/90 shadow-[0_0_30px_rgba(63,81,181,0.35)]'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.45)]'
              )}
              style={{
                left: 4,
                top: 4,
                width: 'calc(50% - 8px)',
                height: 'calc(100% - 8px)',
                transform: activeTab === 'advanced' ? 'translateX(100%)' : 'translateX(0%)',
              }}
            />
            <TabsTrigger
              value="basic"
              className={cn(
                "relative z-10 h-10 px-6 font-medium w-full text-sm leading-none transition-colors",
                themeMode === 'light' ? 'text-[#666] data-[state=active]:text-white' : 'text-slate-400 data-[state=active]:text-white',
                'py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              )}
            >
              Basic Screener
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className={cn(
                "relative z-10 h-10 px-6 font-medium w-full text-sm leading-none transition-colors",
                themeMode === 'light' ? 'text-[#666] data-[state=active]:text-white' : 'text-slate-400 data-[state=active]:text-white',
                'py-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none'
              )}
            >
              Advanced Screener
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <BasicScreener />
          </TabsContent>

          <TabsContent value="advanced" className="mt-6">
            <AdvancedStockScreener />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockScreener;
