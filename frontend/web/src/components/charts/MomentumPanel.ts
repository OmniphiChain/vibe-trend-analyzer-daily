/**
 * MomentumPanel Module
 * Handles momentum/oscillator rendering in a secondary panel
 */

import {
  IChartApi,
  LineSeries,
  LineData,
  SeriesMarker,
} from 'lightweight-charts';
import { ChartPoint } from './chartTypes';
import { getMomentumSeriesOptions, NeomSenseChartTheme } from './chartTheme';

export class MomentumPanelManager {
  private series: LineSeries | null = null;
  private chart: IChartApi;
  private visible: boolean = true;

  constructor(chart: IChartApi) {
    this.chart = chart;
  }

  initialize(): LineSeries {
    if (this.series) return this.series;

    this.series = this.chart.addLineSeries(getMomentumSeriesOptions());

    // Add zero-line reference
    this.addZeroLine();

    return this.series;
  }

  private addZeroLine(): void {
    if (!this.series) return;

    // This is a visual reference; momentum data will be overlaid on top
    this.series.applyOptions({
      lastValueVisible: false,
    });
  }

  setData(data: ChartPoint[]): void {
    if (!this.series) {
      this.initialize();
    }

    const momentumData: LineData[] = data
      .filter((point) => point.momentum !== undefined)
      .map((point) => ({
        time: point.time as any,
        value: point.momentum!,
      }));

    this.series!.setData(momentumData);
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

  /**
   * Get momentum statistics for a given data set
   */
  static getMomentumStats(
    data: ChartPoint[]
  ): { min: number; max: number; avg: number } {
    const momentumValues = data
      .filter((p) => p.momentum !== undefined)
      .map((p) => p.momentum!);

    if (momentumValues.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }

    return {
      min: Math.min(...momentumValues),
      max: Math.max(...momentumValues),
      avg: momentumValues.reduce((a, b) => a + b, 0) / momentumValues.length,
    };
  }
}
