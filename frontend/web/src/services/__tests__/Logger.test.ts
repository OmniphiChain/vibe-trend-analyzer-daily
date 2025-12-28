/**
 * Unit Tests for Logger
 * Comprehensive test coverage following industry standards
 * @author NeomSense Development Team
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Logger, LogLevel } from '../logging/Logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: any;

  beforeEach(() => {
    logger = Logger.getInstance();
    logger.clearBuffer();
    
    // Spy on console methods
    consoleSpy = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    // Restore console methods
    Object.values(consoleSpy).forEach((spy: any) => spy.mockRestore());
  });

  describe('Singleton Pattern', () => {
    test('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Log Levels', () => {
    test('should respect minimum log level', () => {
      logger.setLevel(LogLevel.WARN);
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message'),
        undefined
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Error message'),
        undefined
      );
    });

    test('should log all levels when set to DEBUG', () => {
      logger.setLevel(LogLevel.DEBUG);
      
      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('Structured Logging', () => {
    test('should include component in log message', () => {
      logger.info('Test message', undefined, 'TestComponent');
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        undefined
      );
    });

    test('should include metadata in logs', () => {
      const metadata = { userId: '123', action: 'login' };
      logger.info('User action', metadata);
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('User action'),
        metadata
      );
    });

    test('should handle error objects', () => {
      const error = new Error('Test error');
      logger.error('Operation failed', error);
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('Operation failed'),
        error
      );
    });
  });

  describe('Special Log Types', () => {
    test('should log security events with proper formatting', () => {
      logger.security('Unauthorized access attempt', { ip: '192.168.1.1' });
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[SECURITY]'),
        expect.objectContaining({ category: 'security' })
      );
    });

    test('should log performance metrics', () => {
      logger.performance('database_query', 150.5, { query: 'SELECT * FROM users' });
      
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('[PERFORMANCE] database_query'),
        expect.objectContaining({ 
          duration_ms: 150.5,
          category: 'performance'
        })
      );
    });
  });

  describe('Log Buffer', () => {
    test('should maintain log buffer', () => {
      logger.info('Test message 1');
      logger.info('Test message 2');
      
      const recentLogs = logger.getRecentLogs(2);
      
      expect(recentLogs).toHaveLength(2);
      expect(recentLogs[0].message).toBe('Test message 1');
      expect(recentLogs[1].message).toBe('Test message 2');
    });

    test('should limit buffer size', () => {
      // Add more logs than buffer size
      for (let i = 0; i < 1100; i++) {
        logger.info(`Message ${i}`);
      }
      
      const allLogs = logger.getRecentLogs(2000);
      expect(allLogs.length).toBeLessThanOrEqual(1000);
    });

    test('should clear buffer', () => {
      logger.info('Test message');
      logger.clearBuffer();
      
      const logs = logger.getRecentLogs(10);
      expect(logs).toHaveLength(0);
    });
  });

  describe('Log Entry Format', () => {
    test('should create properly formatted log entries', () => {
      logger.info('Test message', { key: 'value' }, 'TestComponent');
      
      const recentLogs = logger.getRecentLogs(1);
      const logEntry = recentLogs[0];
      
      expect(logEntry).toEqual({
        timestamp: expect.any(String),
        level: LogLevel.INFO,
        message: 'Test message',
        component: 'TestComponent',
        metadata: { key: 'value' },
        error: undefined,
        stackTrace: undefined
      });
    });

    test('should include stack trace for errors', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      
      const recentLogs = logger.getRecentLogs(1);
      const logEntry = recentLogs[0];
      
      expect(logEntry.error).toBe(error);
      expect(logEntry.stackTrace).toBe(error.stack);
    });
  });
});