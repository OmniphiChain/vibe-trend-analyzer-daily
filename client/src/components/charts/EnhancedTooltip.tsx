/**
 * EnhancedTooltip Component
 * Rich, TradingView-style tooltip showing OHLC, sentiment, momentum, and emotion data
 */

import React, { useEffect, useRef } from 'react';
import { ChartPoint } from './chartTypes';

export interface TooltipData {
  point: ChartPoint;
  x: number;
  y: number;
}

export interface EnhancedTooltipProps {
  data: TooltipData | null;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({ data }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !tooltipRef.current) return;

    // Position tooltip with slight offset
    const offset = 10;
    tooltipRef.current.style.left = `${data.x + offset}px`;
    tooltipRef.current.style.top = `${data.y + offset}px`;
  }, [data]);

  if (!data) return null;

  const { point } = data;
  const time = new Date(point.time * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const sentimentPercent = ((point.sentiment + 1) * 50).toFixed(1); // Convert -1...1 to 0...100
  const sentimentLabel =
    point.sentiment > 0.3
      ? 'Very Bullish'
      : point.sentiment > 0
        ? 'Bullish'
        : point.sentiment < -0.3
          ? 'Very Bearish'
          : point.sentiment < 0
            ? 'Bearish'
            : 'Neutral';

  return (
    <div
      ref={tooltipRef}
      className="fixed z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-br from-gray-950/95 to-gray-900/95 rounded-xl border border-gray-700/80 shadow-2xl backdrop-blur-sm p-4 min-w-[280px]">
        {/* Header with time */}
        <div className="mb-3 pb-3 border-b border-gray-700/50">
          <div className="text-xs text-gray-400 font-medium">TIME</div>
          <div className="text-sm font-semibold text-white mt-1">{time}</div>
        </div>

        {/* Price Section (OHLC) */}
        <div className="mb-3 pb-3 border-b border-gray-700/50">
          <div className="text-xs text-gray-400 font-medium mb-2">PRICE</div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <div className="text-xs text-gray-500">O</div>
              <div className="text-sm font-semibold text-white">
                ${point.open.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">H</div>
              <div className="text-sm font-semibold text-green-400">
                ${point.high.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">L</div>
              <div className="text-sm font-semibold text-red-400">
                ${point.low.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">C</div>
              <div className={cn(
                'text-sm font-semibold',
                point.close >= point.open ? 'text-green-400' : 'text-red-400'
              )}>
                ${point.close.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Section */}
        <div className="mb-3 pb-3 border-b border-gray-700/50">
          <div className="text-xs text-gray-400 font-medium mb-2">SENTIMENT</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{sentimentLabel}</span>
              <span className={cn(
                'text-sm font-semibold',
                point.sentiment > 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {(point.sentiment * 100).toFixed(1)}%
              </span>
            </div>

            {/* Sentiment bar */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all',
                  point.sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                )}
                style={{
                  width: `${Math.abs(point.sentiment) * 100}%`,
                  marginLeft: point.sentiment < 0 ? '50%' : '50%',
                }}
              />
            </div>

            {/* Confidence */}
            {point.confidence !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Confidence</span>
                <span className="text-cyan-400 font-semibold">
                  {(point.confidence * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Momentum Section */}
        {point.momentum !== undefined && (
          <div className="mb-3 pb-3 border-b border-gray-700/50">
            <div className="text-xs text-gray-400 font-medium mb-2">MOMENTUM</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {point.momentum > 0 ? 'Positive' : point.momentum < 0 ? 'Negative' : 'Neutral'}
              </span>
              <span className={cn(
                'text-sm font-semibold',
                point.momentum > 0 ? 'text-purple-400' : 'text-orange-400'
              )}>
                {point.momentum.toFixed(3)}
              </span>
            </div>
          </div>
        )}

        {/* Volume Section */}
        {point.volume !== undefined && (
          <div className="mb-3 pb-3 border-b border-gray-700/50">
            <div className="text-xs text-gray-400 font-medium mb-2">VOLUME</div>
            <div className="text-sm font-semibold text-gray-300">
              {formatVolume(point.volume)}
            </div>
          </div>
        )}

        {/* Emotion Breakdown */}
        {point.emotion && (
          <div>
            <div className="text-xs text-gray-400 font-medium mb-2">EMOTION</div>
            <div className="space-y-1">
              {point.emotion.optimism !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Optimism</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(point.emotion.optimism * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 w-8 text-right">
                    {(point.emotion.optimism * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {point.emotion.fear !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Fear</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.min(point.emotion.fear * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 w-8 text-right">
                    {(point.emotion.fear * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {point.emotion.anger !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Anger</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${Math.min(point.emotion.anger * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 w-8 text-right">
                    {(point.emotion.anger * 100).toFixed(0)}%
                  </span>
                </div>
              )}
              {point.emotion.neutral !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Neutral</span>
                  <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-400"
                      style={{ width: `${Math.min(point.emotion.neutral * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-gray-300 w-8 text-right">
                    {(point.emotion.neutral * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M';
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K';
  }
  return volume.toFixed(0);
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default EnhancedTooltip;
