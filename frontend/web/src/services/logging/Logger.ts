/**
 * Centralized Logging Service
 * Implements structured logging with proper error handling and monitoring
 * @author NeomSense Development Team
 * @version 1.0.0
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  component?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  error?: Error;
  stackTrace?: string;
}

/**
 * Professional logging service with proper error handling and monitoring
 */
export class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel = LogLevel.INFO;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 1000;

  private constructor() {
    // Singleton pattern
    this.initializeLogger();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set the minimum log level
   */
  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  /**
   * Log debug message
   */
  public debug(message: string, metadata?: Record<string, unknown>, component?: string): void {
    this.log(LogLevel.DEBUG, message, metadata, component);
  }

  /**
   * Log info message
   */
  public info(message: string, metadata?: Record<string, unknown>, component?: string): void {
    this.log(LogLevel.INFO, message, metadata, component);
  }

  /**
   * Log warning message
   */
  public warn(message: string, metadata?: Record<string, unknown>, component?: string): void {
    this.log(LogLevel.WARN, message, metadata, component);
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error, metadata?: Record<string, unknown>, component?: string): void {
    this.log(LogLevel.ERROR, message, metadata, component, error);
  }

  /**
   * Log fatal error
   */
  public fatal(message: string, error?: Error, metadata?: Record<string, unknown>, component?: string): void {
    this.log(LogLevel.FATAL, message, metadata, component, error);
  }

  /**
   * Log security events
   */
  public security(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, `[SECURITY] ${message}`, { ...metadata, category: 'security' }, 'Security');
  }

  /**
   * Log performance metrics
   */
  public performance(operation: string, duration: number, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, `[PERFORMANCE] ${operation}`, { 
      ...metadata, 
      duration_ms: duration,
      category: 'performance' 
    }, 'Performance');
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>, component?: string, error?: Error): void {
    if (level < this.currentLevel) {
      return; // Skip if below current log level
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      component,
      metadata,
      error,
      stackTrace: error?.stack,
    };

    // Add to buffer
    this.addToBuffer(logEntry);

    // Output to console based on environment
    this.outputToConsole(logEntry);

    // Send to external logging service in production
    if (this.isProduction()) {
      this.sendToExternalService(logEntry);
    }
  }

  /**
   * Add log entry to buffer with rotation
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    if (this.logBuffer.length > this.maxBufferSize) {
      // Remove oldest entries
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  /**
   * Output to console with proper formatting
   */
  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${LogLevel[entry.level]}]${entry.component ? ` [${entry.component}]` : ''}`;
    const fullMessage = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, entry.metadata);
        break;
      case LogLevel.INFO:
        console.info(fullMessage, entry.metadata);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage, entry.metadata);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(fullMessage, entry.error || entry.metadata);
        if (entry.stackTrace) {
          console.error(entry.stackTrace);
        }
        break;
    }
  }

  /**
   * Send logs to external monitoring service
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    try {
      // In a real application, this would send to services like:
      // - Datadog, New Relic, Splunk, ELK Stack, etc.
      // For now, we'll simulate the call
      
      if (entry.level >= LogLevel.ERROR) {
        // Send critical errors immediately
        await this.sendCriticalAlert(entry);
      }
    } catch (error) {
      // Don't let logging errors break the application
      console.error('Failed to send log to external service:', error);
    }
  }

  /**
   * Send critical alerts for high-priority issues
   */
  private async sendCriticalAlert(entry: LogEntry): Promise<void> {
    // Simulate sending to alerting service (PagerDuty, Slack, etc.)
    console.warn('CRITICAL ALERT:', entry.message);
  }

  /**
   * Get recent logs for debugging
   */
  public getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  public clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Initialize logger with environment-specific settings
   */
  private initializeLogger(): void {
    if (this.isDevelopment()) {
      this.setLevel(LogLevel.DEBUG);
    } else {
      this.setLevel(LogLevel.INFO);
    }

    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.fatal('Unhandled Promise Rejection', new Error(event.reason));
      });
    }
  }

  /**
   * Check if running in development
   */
  private isDevelopment(): boolean {
    return import.meta.env.DEV || process.env.NODE_ENV === 'development';
  }

  /**
   * Check if running in production
   */
  private isProduction(): boolean {
    return import.meta.env.PROD || process.env.NODE_ENV === 'production';
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

/**
 * Performance monitoring decorator
 */
export function LogPerformance(component: string = 'Unknown') {
  return function (target: any, propertyName: string, descriptor?: PropertyDescriptor) {
    if (!descriptor) {
      // Handle case where descriptor is undefined
      descriptor = Object.getOwnPropertyDescriptor(target, propertyName) || {
        value: target[propertyName],
        writable: true,
        enumerable: false,
        configurable: true
      };
    }

    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const start = performance.now();
      try {
        const result = method.apply(this, args);
        const duration = performance.now() - start;
        
        // Handle both sync and async methods
        if (result && typeof result.then === 'function') {
          return result.then((res: any) => {
            const asyncDuration = performance.now() - start;
            logger.performance(`${component}.${propertyName}`, asyncDuration);
            return res;
          }).catch((error: Error) => {
            const asyncDuration = performance.now() - start;
            logger.error(`${component}.${propertyName} failed`, error, { duration_ms: asyncDuration });
            throw error;
          });
        } else {
          logger.performance(`${component}.${propertyName}`, duration);
          return result;
        }
      } catch (error) {
        const duration = performance.now() - start;
        logger.error(`${component}.${propertyName} failed`, error as Error, { duration_ms: duration });
        throw error;
      }
    };

    return descriptor;
  };
}