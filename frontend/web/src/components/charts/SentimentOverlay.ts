/**
 * SentimentOverlay Module
 * Handles sentiment line series rendering with dynamic coloring
 */

import {
  IChartApi,
  LineSeries,
  LineData,
  SeriesMarker,
} from 'lightweight-charts';
import { ChartPoint } from './chartTypes';
import { getSentimentLineSeriesOptions, getSentimentColor } from './chartTheme';

export class SentimentOverlayManager {
  private series: LineSeries | null = null;
  private chart: IChartApi;
  private visible: boolean = true;

  constructor(chart: IChartApi) {
    this.chart = chart;
  }

  initialize(): LineSeries {
    if (this.series) return this.series;

    this.series = this.chart.addLineSeries(getSentimentLineSeriesOptions());
    return this.series;
  }

  setData(data: ChartPoint[]): void {
    if (!this.series) {
      this.initialize();
    }

    const sentimentData: LineData[] = data
      .filter((point) => point.sentiment !== undefined)
      .map((point) => ({
        time: point.time as any,
        value: point.sentiment,
      }));

    this.series!.setData(sentimentData);

    // Update line color dynamically based on sentiment
    this.updateLineColor(data);
  }

  private updateLineColor(data: ChartPoint[]): void {
    if (!this.series) return;

    // Get the last sentiment value for color determination
    const lastPoint = data[data.length - 1];
    if (lastPoint && lastPoint.sentiment !== undefined) {
      const color = getSentimentColor(lastPoint.sentiment);
      this.series.applyOptions({
        color,
        crosshairMarkerBackgroundColor: color,
      });
    }
  }

  setMarkers(markers: SeriesMarker[]): void {
    if (!this.series) return;
    this.series.setMarkers(markers);
  }

  setVisible(visible: boolean): void {
    if (!this.series) return;
    this.visible = visible;
    this.series.applyOptions({ visible });
  }

  isVisible(): boolean {
    return this.visible;
  }

  getSeries(): LineSeries | null {
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
