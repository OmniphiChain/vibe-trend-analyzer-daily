/**
 * HistogramSeries Module
 * Manages histogram rendering for volume or sentiment intensity
 */

import {
  IChartApi,
  HistogramSeries,
  HistogramData,
} from 'lightweight-charts';
import { ChartPoint } from './chartTypes';
import { NeomSenseChartTheme } from './chartTheme';

export class HistogramSeriesManager {
  private series: HistogramSeries | null = null;
  private chart: IChartApi;
  private visible: boolean = true;
  private mode: 'volume' | 'sentiment' = 'volume';

  constructor(chart: IChartApi) {
    this.chart = chart;
  }

  initialize(mode: 'volume' | 'sentiment' = 'volume'): HistogramSeries {
    if (this.series) return this.series;

    this.mode = mode;

    this.series = this.chart.addHistogramSeries({
      color: NeomSenseChartTheme.sentiment.bullish,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'histogram',
    });

    // Configure secondary price scale for histogram
    this.chart.priceScale('histogram').applyOptions({
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
    });

    return this.series;
  }

  setData(data: ChartPoint[]): void {
    if (!this.series) {
      this.initialize(this.mode);
    }

    if (this.mode === 'volume') {
      this.setVolumeData(data);
    } else {
      this.setSentimentIntensityData(data);
    }
  }

  /**
   * Render volume histogram
   */
  private setVolumeData(data: ChartPoint[]): void {
    if (!this.series) return;

    const histogramData: HistogramData[] = data
      .filter((point) => point.volume !== undefined && point.volume > 0)
      .map((point) => {
        // Color based on close vs open (up/down)
        const isUp = point.close >= point.open;
        return {
          time: point.time as any,
          value: point.volume!,
          color: isUp
            ? NeomSenseChartTheme.sentiment.bullish
            : NeomSenseChartTheme.sentiment.bearish,
        };
      });

    this.series.setData(histogramData);
  }

  /**
   * Render sentiment intensity histogram
   * Higher confidence = taller bar
   */
  private setSentimentIntensityData(data: ChartPoint[]): void {
    if (!this.series) return;

    const histogramData: HistogramData[] = data
      .filter((point) => point.confidence !== undefined && point.confidence > 0)
      .map((point) => {
        // Bar height = confidence * sentiment strength
        const intensityScore = (point.confidence || 0.5) * Math.abs(point.sentiment);
        const isBullish = point.sentiment >= 0;

        return {
          time: point.time as any,
          value: intensityScore,
          color: isBullish
            ? NeomSenseChartTheme.sentiment.bullish
            : NeomSenseChartTheme.sentiment.bearish,
        };
      });

    this.series.setData(histogramData);
  }

  /**
   * Switch between volume and sentiment intensity
   */
  switchMode(mode: 'volume' | 'sentiment'): void {
    this.mode = mode;
  }

  setVisible(visible: boolean): void {
    if (!this.series) return;
    this.visible = visible;
    this.series.applyOptions({ visible });
  }

  isVisible(): boolean {
    return this.visible;
  }

  getSeries(): HistogramSeries | null {
    return this.series;
  }

  clear(): void {
    if (this.series) {
      this.chart.removeSeries(this.series);
      this.series = null;
    }
  }

  destroy(): void {
    this.clear();
  }
}
