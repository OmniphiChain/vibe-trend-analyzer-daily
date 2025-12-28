/**
 * EventMarkers Module
 * Handles event marker rendering on the chart
 */

import {
  IChartApi,
  CandlestickSeries,
  SeriesMarker,
} from 'lightweight-charts';
import { ChartPoint, ChartEvent } from './chartTypes';
import { getEventMarkerColor } from './chartTheme';

export class EventMarkersManager {
  private markers: SeriesMarker[] = [];
  private chart: IChartApi;
  private priceSeries: CandlestickSeries | null = null;
  private visible: boolean = true;

  constructor(chart: IChartApi, priceSeries: CandlestickSeries) {
    this.chart = chart;
    this.priceSeries = priceSeries;
  }

  setData(data: ChartPoint[]): void {
    if (!this.priceSeries) return;

    this.markers = this.generateMarkers(data);
    this.updateMarkers();
  }

  private generateMarkers(data: ChartPoint[]): SeriesMarker[] {
    const markers: SeriesMarker[] = [];
    const eventMap = new Map<number, ChartEvent[]>();

    // Group events by time
    data.forEach((point) => {
      if (point.events && point.events.length > 0) {
        eventMap.set(point.time, point.events);
      }
    });

    // Create markers for events
    eventMap.forEach((events, time) => {
      events.forEach((event, index) => {
        const color = getEventMarkerColor(event.type);
        const position = index === 0 ? 'aboveBar' : ('belowBar' as const);

        markers.push({
          time: time as any,
          position,
          color,
          shape: this.getEventShape(event.type),
          text: event.label.substring(0, 2).toUpperCase(),
        });
      });
    });

    return markers;
  }

  private getEventShape(
    eventType: string
  ): 'circle' | 'square' | 'arrowUp' | 'arrowDown' {
    switch (eventType) {
      case 'earnings':
        return 'square';
      case 'news':
        return 'circle';
      case 'macro':
        return 'square';
      case 'product':
        return 'arrowUp';
      default:
        return 'circle';
    }
  }

  private updateMarkers(): void {
    if (!this.priceSeries) return;
    this.priceSeries.setMarkers(this.visible ? this.markers : []);
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.updateMarkers();
  }

  isVisible(): boolean {
    return this.visible;
  }

  getMarkers(): SeriesMarker[] {
    return this.markers;
  }

  destroy(): void {
    this.markers = [];
  }
}
