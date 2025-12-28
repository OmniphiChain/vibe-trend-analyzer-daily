/**
 * ConfidenceBand Module
 * Handles sentiment confidence band rendering (upper/lower bounds)
 */

import {
  IChartApi,
  LineSeries,
  LineData,
} from 'lightweight-charts';
import { ChartPoint } from './chartTypes';
import { getConfidenceBandSeriesOptions } from './chartTheme';

export class ConfidenceBandManager {
  private upperSeries: LineSeries | null = null;
  private lowerSeries: LineSeries | null = null;
  private chart: IChartApi;
  private visible: boolean = true;

  constructor(chart: IChartApi) {
    this.chart = chart;
  }

  initialize(): { upper: LineSeries; lower: LineSeries } {
    if (this.upperSeries && this.lowerSeries) {
      return { upper: this.upperSeries, lower: this.lowerSeries };
    }

    const options = getConfidenceBandSeriesOptions();

    this.upperSeries = this.chart.addLineSeries({
      ...options,
      color: 'rgba(6, 182, 212, 0.5)',
    });

    this.lowerSeries = this.chart.addLineSeries({
      ...options,
      color: 'rgba(6, 182, 212, 0.3)',
    });

    return { upper: this.upperSeries, lower: this.lowerSeries };
  }

  setData(data: ChartPoint[]): void {
    if (!this.upperSeries || !this.lowerSeries) {
      this.initialize();
    }

    // Filter points that have confidence bands
    const pointsWithBands = data.filter(
      (point) =>
        point.sentimentUpper !== undefined && point.sentimentLower !== undefined
    );

    const upperData: LineData[] = pointsWithBands.map((point) => ({
      time: point.time as any,
      value: point.sentimentUpper!,
    }));

    const lowerData: LineData[] = pointsWithBands.map((point) => ({
      time: point.time as any,
      value: point.sentimentLower!,
    }));

    this.upperSeries!.setData(upperData);
    this.lowerSeries!.setData(lowerData);
  }

  setVisible(visible: boolean): void {
    if (!this.upperSeries || !this.lowerSeries) return;
    this.visible = visible;
    this.upperSeries.applyOptions({ visible });
    this.lowerSeries.applyOptions({ visible });
  }

  isVisible(): boolean {
    return this.visible;
  }

  getSeries(): { upper: LineSeries | null; lower: LineSeries | null } {
    return {
      upper: this.upperSeries,
      lower: this.lowerSeries,
    };
  }

  clear(): void {
    if (this.upperSeries) {
      this.chart.removeSeries(this.upperSeries);
      this.upperSeries = null;
    }
    if (this.lowerSeries) {
      this.chart.removeSeries(this.lowerSeries);
      this.lowerSeries = null;
    }
  }

  destroy(): void {
    this.clear();
  }
}
