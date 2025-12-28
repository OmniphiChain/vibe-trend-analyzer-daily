/**
 * ChartToolbar Component
 * Professional TradingView-style toolbar with chart controls
 */

import React from 'react';
import {
  Crosshair,
  Maximize2,
  Settings,
  Eye,
  EyeOff,
  BarChart3,
  Layers,
  ZoomIn,
  ZoomOut,
  Copy,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';

export interface ChartToolbarProps {
  timeframe: '1h' | '6h' | '1d' | '7d';
  onTimeframeChange: (tf: '1h' | '6h' | '1d' | '7d') => void;
  showCrosshair: boolean;
  onCrosshairToggle: (show: boolean) => void;
  showSentiment: boolean;
  onSentimentToggle: (show: boolean) => void;
  showConfidence: boolean;
  onConfidenceToggle: (show: boolean) => void;
  showPatterns: boolean;
  onPatternsToggle: (show: boolean) => void;
  showHistogram: boolean;
  onHistogramToggle: (show: boolean) => void;
  showMomentum: boolean;
  onMomentumToggle: (show: boolean) => void;
  onAutoFit?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onCompare?: () => void;
  compareEnabled?: boolean;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  timeframe,
  onTimeframeChange,
  showCrosshair,
  onCrosshairToggle,
  showSentiment,
  onSentimentToggle,
  showConfidence,
  onConfidenceToggle,
  showPatterns,
  onPatternsToggle,
  showHistogram,
  onHistogramToggle,
  showMomentum,
  onMomentumToggle,
  onAutoFit,
  onZoomIn,
  onZoomOut,
  onCompare,
  compareEnabled = false,
}) => {
  const TIMEFRAMES = ['1h', '6h', '1d', '7d'] as const;

  return (
    <div className="w-full bg-gradient-to-r from-gray-900/50 to-gray-800/30 border-b border-gray-700/50 px-4 py-3 overflow-x-auto">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Timeframe Selector */}
        <ToggleGroup
          type="single"
          value={timeframe}
          onValueChange={(value) =>
            value && onTimeframeChange(value as '1h' | '6h' | '1d' | '7d')
          }
          className="bg-gray-900/50 rounded-lg p-1 gap-1"
        >
          {TIMEFRAMES.map((tf) => (
            <ToggleGroupItem
              key={tf}
              value={tf}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded transition-colors',
                'data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400',
                'data-[state=off]:text-gray-400 hover:text-gray-300'
              )}
            >
              {tf}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Separator orientation="vertical" className="h-6" />

        {/* Crosshair Toggle */}
        <Button
          variant={showCrosshair ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCrosshairToggle(!showCrosshair)}
          className="h-8 px-2"
          title="Toggle crosshair"
        >
          <Crosshair className="w-4 h-4" />
        </Button>

        {/* Zoom Controls */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="h-8 w-8 p-0"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="h-8 w-8 p-0"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoFit}
            className="h-8 px-2 gap-1"
            title="Auto-fit chart"
          >
            <Maximize2 className="w-4 h-4" />
            Fit
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Display Toggles */}
        <div className="flex gap-1">
          <Button
            variant={showSentiment ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSentimentToggle(!showSentiment)}
            className="h-8 px-2 gap-1 text-xs"
            title="Toggle sentiment overlay"
          >
            {showSentiment ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Sentiment
          </Button>

          <Button
            variant={showConfidence ? 'default' : 'outline'}
            size="sm"
            onClick={() => onConfidenceToggle(!showConfidence)}
            className="h-8 px-2 gap-1 text-xs"
            title="Toggle confidence band"
          >
            {showConfidence ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Confidence
          </Button>

          <Button
            variant={showPatterns ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPatternsToggle(!showPatterns)}
            className="h-8 px-2 gap-1 text-xs"
            title="Toggle AI patterns"
          >
            {showPatterns ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Patterns
          </Button>

          <Button
            variant={showHistogram ? 'default' : 'outline'}
            size="sm"
            onClick={() => onHistogramToggle(!showHistogram)}
            className="h-8 px-2 gap-1 text-xs"
            title="Toggle histogram"
          >
            {showHistogram ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Volume
          </Button>

          <Button
            variant={showMomentum ? 'default' : 'outline'}
            size="sm"
            onClick={() => onMomentumToggle(!showMomentum)}
            className="h-8 px-2 gap-1 text-xs"
            title="Toggle momentum panel"
          >
            {showMomentum ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Momentum
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Advanced Features */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onCompare}
            disabled={!compareEnabled}
            className="h-8 px-2 gap-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="Compare assets (coming soon)"
          >
            <Copy className="w-3.5 h-3.5" />
            Compare
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            title="Chart settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-2 text-xs text-gray-400 px-1">
        <span className="opacity-70">
          Professional trading interface with AI-powered sentiment analysis
        </span>
      </div>
    </div>
  );
};

export default ChartToolbar;
