import { performance } from 'perf_hooks';

// ============================================================================
// MONITORING & METRICS SERVICE - PHASE 3
// ============================================================================

export interface SystemMetrics {
  timestamp: string;
  uptime: number;
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
    heap: {
      used: number;
      total: number;
    };
  };
  database: {
    connections: number;
    activeQueries: number;
    avgResponseTime: number;
    errorRate: number;
  };
  api: {
    requestsPerMinute: number;
    avgResponseTime: number;
    errorRate: number;
    activeConnections: number;
  };
  websocket: {
    connections: number;
    messagesPerMinute: number;
  };
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  resolved?: boolean;
  resolvedAt?: Date;
}

export class MonitoringService {
  private metrics: PerformanceMetric[] = [];
  private alerts: Alert[] = [];
  private thresholds: Record<string, { warning: number; critical: number }> = {
    cpu_usage: { warning: 70, critical: 90 },
    memory_usage: { warning: 80, critical: 95 },
    response_time: { warning: 1000, critical: 5000 },
    error_rate: { warning: 0.05, critical: 0.1 },
    database_connections: { warning: 80, critical: 95 },
  };

  // Get current system metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const memUsage = process.memoryUsage();
      
      return {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        cpu: {
          usage: Math.random() * 100, // Mock CPU usage
          loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2],
        },
        memory: {
          used: memUsage.rss,
          total: memUsage.rss * 4, // Mock total memory
          percentage: (memUsage.rss / (memUsage.rss * 4)) * 100,
          heap: {
            used: memUsage.heapUsed,
            total: memUsage.heapTotal,
          },
        },
        database: {
          connections: Math.floor(Math.random() * 50) + 10,
          activeQueries: Math.floor(Math.random() * 20) + 1,
          avgResponseTime: Math.random() * 100 + 10,
          errorRate: Math.random() * 0.02,
        },
        api: {
          requestsPerMinute: Math.floor(Math.random() * 1000) + 100,
          avgResponseTime: Math.random() * 500 + 50,
          errorRate: Math.random() * 0.05,
          activeConnections: Math.floor(Math.random() * 200) + 50,
        },
        websocket: {
          connections: Math.floor(Math.random() * 100) + 20,
          messagesPerMinute: Math.floor(Math.random() * 500) + 50,
        },
      };
    } catch (error) {
      console.error("System metrics error:", error);
      throw new Error("Failed to get system metrics");
    }
  }

  // Record performance metric
  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check for alerts
    this.checkThresholds(metric);

    console.log(`📊 Metric recorded: ${name} = ${value} ${unit}`, tags);
  }

  // Check metric thresholds and create alerts
  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds[metric.name];
    if (!threshold) return;

    let alertType: 'warning' | 'critical' | null = null;
    let thresholdValue = 0;

    if (metric.value >= threshold.critical) {
      alertType = 'critical';
      thresholdValue = threshold.critical;
    } else if (metric.value >= threshold.warning) {
      alertType = 'warning';
      thresholdValue = threshold.warning;
    }

    if (alertType) {
      this.createAlert(alertType, `${metric.name} is ${alertType}`, metric.name, thresholdValue, metric.value);
    }
  }

  // Create alert
  createAlert(type: 'warning' | 'error' | 'critical', message: string, metric: string, threshold: number, currentValue: number) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      metric,
      threshold,
      currentValue,
      timestamp: new Date(),
    };

    this.alerts.push(alert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    console.log(`🚨 Alert created: ${type.toUpperCase()} - ${message}`);

    // In production, send to alerting system (PagerDuty, Slack, etc.)
    this.sendAlertNotification(alert);
  }

  // Send alert notification
  private async sendAlertNotification(alert: Alert) {
    try {
      // Mock alert notification - integrate with Slack, PagerDuty, etc.
      console.log(`📢 Alert notification sent: ${alert.type} - ${alert.message}`);
      
      // Example webhook payload
      const payload = {
        text: `🚨 ${alert.type.toUpperCase()}: ${alert.message}`,
        attachments: [
          {
            color: alert.type === 'critical' ? 'danger' : 'warning',
            fields: [
              { title: 'Metric', value: alert.metric, short: true },
              { title: 'Current Value', value: alert.currentValue.toString(), short: true },
              { title: 'Threshold', value: alert.threshold.toString(), short: true },
              { title: 'Time', value: alert.timestamp.toISOString(), short: true },
            ],
          },
        ],
      };

      // In production: await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(payload) });
    } catch (error) {
      console.error("Alert notification error:", error);
    }
  }

  // Get metrics by name and time range
  getMetrics(name?: string, startTime?: Date, endTime?: Date): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter(m => m.name === name);
    }

    if (startTime) {
      filtered = filtered.filter(m => m.timestamp >= startTime);
    }

    if (endTime) {
      filtered = filtered.filter(m => m.timestamp <= endTime);
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get active alerts
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Resolve alert
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      console.log(`✅ Alert resolved: ${alertId}`);
      return true;
    }
    return false;
  }

  // Performance timing decorator
  async measurePerformance<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(`${name}_duration`, duration, 'ms', tags);
      this.recordMetric(`${name}_success`, 1, 'count', tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_duration`, duration, 'ms', tags);
      this.recordMetric(`${name}_error`, 1, 'count', tags);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; checks: Record<string, boolean> }> {
    const checks: Record<string, boolean> = {};

    try {
      // Database check
      checks.database = true; // Mock - in production, test actual DB connection

      // Memory check
      const memUsage = process.memoryUsage();
      checks.memory = (memUsage.heapUsed / memUsage.heapTotal) < 0.9;

      // API response time check
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, 1)); // Mock API call
      const responseTime = performance.now() - start;
      checks.api_response = responseTime < 1000;

      // External services check
      checks.external_apis = Math.random() > 0.1; // Mock 90% uptime

      const healthyChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyChecks === totalChecks) {
        status = 'healthy';
      } else if (healthyChecks >= totalChecks * 0.7) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return { status, checks };
    } catch (error) {
      console.error("Health check error:", error);
      return { status: 'unhealthy', checks };
    }
  }

  // Get performance summary
  getPerformanceSummary(hours = 24): {
    avgResponseTime: number;
    errorRate: number;
    requestCount: number;
    uptime: number;
    alerts: number;
  } {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentMetrics = this.getMetrics(undefined, since);

    const responseTimeMetrics = recentMetrics.filter(m => m.name.includes('response_time'));
    const errorMetrics = recentMetrics.filter(m => m.name.includes('error'));
    const requestMetrics = recentMetrics.filter(m => m.name.includes('request'));

    return {
      avgResponseTime: responseTimeMetrics.length > 0 
        ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length 
        : 0,
      errorRate: errorMetrics.length > 0 
        ? errorMetrics.reduce((sum, m) => sum + m.value, 0) / errorMetrics.length 
        : 0,
      requestCount: requestMetrics.reduce((sum, m) => sum + m.value, 0),
      uptime: process.uptime(),
      alerts: this.alerts.filter(a => a.timestamp >= since).length,
    };
  }

  // Start monitoring (call this on server startup)
  startMonitoring() {
    console.log("🔍 Starting monitoring service...");

    // Collect system metrics every 30 seconds
    setInterval(async () => {
      try {
        const metrics = await this.getSystemMetrics();
        
        this.recordMetric('cpu_usage', metrics.cpu.usage, '%');
        this.recordMetric('memory_usage', metrics.memory.percentage, '%');
        this.recordMetric('database_connections', metrics.database.connections, 'count');
        this.recordMetric('api_requests_per_minute', metrics.api.requestsPerMinute, 'count');
        this.recordMetric('websocket_connections', metrics.websocket.connections, 'count');
      } catch (error) {
        console.error("Monitoring collection error:", error);
      }
    }, 30000);

    // Clean up old metrics every hour
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      this.metrics = this.metrics.filter(m => m.timestamp >= oneHourAgo);
      console.log(`🧹 Cleaned up old metrics, keeping ${this.metrics.length} recent metrics`);
    }, 60 * 60 * 1000);
  }
}

export const monitoringService = new MonitoringService();