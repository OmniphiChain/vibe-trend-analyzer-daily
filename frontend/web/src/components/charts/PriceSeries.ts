/**
 * PriceSeries Module
 * Handles OHLC candlestick rendering
 */

import {
  IChartApi,
  CandlestickSeries,
  OhlcData,
  SeriesMarker,
} from 'lightweight-charts';
import { ChartPoint } from './chartTypes';
import { getCandleSeriesOptions } from './chartTheme';

export class PriceSeriesManager {
  private series: CandlestickSeries | null = null;
  private chart: IChartApi;

  constructor(chart: IChartApi) {
    this.chart = chart;
  }

  initialize(): CandlestickSeries {
    if (this.series) return this.series;

    this.series = this.chart.addCandlestickSeries(getCandleSeriesOptions());
    return this.series;
  }

  setData(data: ChartPoint[]): void {
    if (!this.series) {
      this.initialize();
    }

    const ohlcData: OhlcData[] = data.map((point) => ({
      time: point.time as any,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }));

    this.series!.setData(ohlcData);
  }

  setMarkers(markers: SeriesMarker[]): void {
    if (!this.series) return;
    this.series.setMarkers(markers);
  }

  getSeries(): CandlestickSeries | null {
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
