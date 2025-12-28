/**
 * PatternOverlay Module
 * Manages HTML-based AI pattern overlays positioned on the chart
 * Patterns are rendered as translucent boxes with labels, not as chart series
 */

import { IChartApi, Time } from 'lightweight-charts';
import { AIPattern } from './chartTypes';
import { NeomSenseChartTheme } from './chartTheme';

export interface PatternBoxElement {
  id: string;
  element: HTMLDivElement;
  pattern: AIPattern;
}

export class PatternOverlayManager {
  private container: HTMLDivElement | null = null;
  private patterns: Map<string, PatternBoxElement> = new Map();
  private chart: IChartApi;
  private visible: boolean = true;

  constructor(chart: IChartApi, container?: HTMLDivElement) {
    this.chart = chart;
    if (container) {
      this.setContainer(container);
    }
  }

  /**
   * Set the container where pattern overlays will be rendered
   */
  setContainer(container: HTMLDivElement): void {
    this.container = container;
  }

  /**
   * Set patterns and render them
   */
  setPatterns(patterns: AIPattern[]): void {
    // Clear existing patterns
    this.clearAll();

    // Create new pattern boxes
    patterns.forEach((pattern) => {
      this.addPattern(pattern);
    });
  }

  /**
   * Add a single pattern
   */
  private addPattern(pattern: AIPattern): void {
    if (!this.container || !this.visible) return;

    const element = this.createPatternElement(pattern);
    this.patterns.set(pattern.id, {
      id: pattern.id,
      element,
      pattern,
    });

    this.container.appendChild(element);
    this.updatePatternPosition(pattern.id);
  }

  /**
   * Create the HTML element for a pattern
   */
  private createPatternElement(pattern: AIPattern): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'neom-pattern-overlay';
    element.id = `pattern-${pattern.id}`;
    element.dataset.patternId = pattern.id;

    // Determine colors based on bias and strength
    const bgColor = this.getPatternBgColor(pattern.bias, pattern.strength);
    const borderColor = this.getPatternBorderColor(pattern.bias, pattern.strength);
    const textColor = this.getPatternTextColor(pattern.bias);

    // Calculate opacity based on confidence
    const opacity = Math.min(1, pattern.confidence / 100 + 0.2);

    element.innerHTML = `
      <div class="pattern-content">
        <div class="pattern-label">${pattern.label}</div>
        <div class="pattern-confidence">${pattern.confidence}%</div>
        ${pattern.description ? `<div class="pattern-description">${pattern.description}</div>` : ''}
      </div>
    `;

    // Apply styles
    Object.assign(element.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '200px',
      padding: '8px 12px',
      borderRadius: '8px',
      backgroundColor: bgColor,
      borderLeft: `3px solid ${borderColor}`,
      color: textColor,
      fontSize: '12px',
      fontWeight: '600',
      zIndex: '10',
      pointerEvents: 'none',
      opacity: opacity.toString(),
      transition: 'opacity 0.2s ease',
      backdropFilter: 'blur(4px)',
      boxShadow: `0 0 16px ${borderColor}33`,
    });

    // Inner content styling
    const content = element.querySelector('.pattern-content') as HTMLElement;
    if (content) {
      Object.assign(content.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      });
    }

    const label = element.querySelector('.pattern-label') as HTMLElement;
    if (label) {
      Object.assign(label.style, {
        fontWeight: '700',
        fontSize: '12px',
        lineHeight: '1.2',
      });
    }

    const confidence = element.querySelector('.pattern-confidence') as HTMLElement;
    if (confidence) {
      Object.assign(confidence.style, {
        fontSize: '11px',
        opacity: '0.8',
        fontWeight: '600',
      });
    }

    const description = element.querySelector('.pattern-description') as HTMLElement;
    if (description) {
      Object.assign(description.style, {
        fontSize: '10px',
        opacity: '0.7',
        marginTop: '4px',
        maxWidth: '180px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      });
    }

    // Add hover effect
    element.addEventListener('mouseenter', () => {
      element.style.opacity = '1';
      element.style.boxShadow = `0 0 24px ${borderColor}66`;
    });

    element.addEventListener('mouseleave', () => {
      const resetOpacity = Math.min(1, pattern.confidence / 100 + 0.2);
      element.style.opacity = resetOpacity.toString();
      element.style.boxShadow = `0 0 16px ${borderColor}33`;
    });

    return element;
  }

  /**
   * Get background color based on bias and strength
   */
  private getPatternBgColor(bias: string, strength?: string): string {
    const alpha = strength === 'strong' ? '0.25' : strength === 'moderate' ? '0.15' : '0.08';

    if (bias === 'bullish') {
      return `rgba(16, 185, 129, ${alpha})`; // Green
    } else if (bias === 'bearish') {
      return `rgba(239, 68, 68, ${alpha})`; // Red
    } else {
      return `rgba(107, 114, 128, ${alpha})`; // Gray
    }
  }

  /**
   * Get border color based on bias
   */
  private getPatternBorderColor(bias: string, strength?: string): string {
    const isStrong = strength === 'strong';

    if (bias === 'bullish') {
      return isStrong ? '#10b981' : '#059669'; // Emerald
    } else if (bias === 'bearish') {
      return isStrong ? '#ef4444' : '#dc2626'; // Red
    } else {
      return isStrong ? '#9ca3af' : '#6b7280'; // Gray
    }
  }

  /**
   * Get text color based on bias
   */
  private getPatternTextColor(bias: string): string {
    if (bias === 'bullish') {
      return '#d1fae5'; // Light green
    } else if (bias === 'bearish') {
      return '#fee2e2'; // Light red
    } else {
      return '#e5e7eb'; // Light gray
    }
  }

  /**
   * Update position of a pattern box (called after chart operations)
   * Note: Position calculation happens in AdvancedSentimentChart
   */
  updatePatternPosition(patternId: string, left?: number, top?: number): void {
    const entry = this.patterns.get(patternId);
    if (!entry) return;

    if (typeof left !== 'undefined' && typeof top !== 'undefined') {
      Object.assign(entry.element.style, {
        left: `${left}px`,
        top: `${top}px`,
      });
    }
  }

  /**
   * Update all pattern positions (called on zoom/pan)
   */
  updateAllPositions(
    positionMap: Map<string, { left: number; top: number }>
  ): void {
    positionMap.forEach((pos, patternId) => {
      this.updatePatternPosition(patternId, pos.left, pos.top);
    });
  }

  /**
   * Set visibility of all patterns
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
    this.patterns.forEach((entry) => {
      entry.element.style.display = visible ? 'block' : 'none';
    });
  }

  /**
   * Get visibility state
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Clear all patterns
   */
  clearAll(): void {
    this.patterns.forEach((entry) => {
      entry.element.remove();
    });
    this.patterns.clear();
  }

  /**
   * Get a specific pattern element
   */
  getPattern(patternId: string): PatternBoxElement | undefined {
    return this.patterns.get(patternId);
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): PatternBoxElement[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.clearAll();
    this.container = null;
  }
}
