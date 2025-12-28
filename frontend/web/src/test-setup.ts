/**
 * Test Setup
 * Global test configuration and mocks
 * @author NeomSense Development Team
 */

import { vi } from 'vitest';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    DEV: true,
    PROD: false,
    NODE_ENV: 'test',
  },
  writable: true,
});

// Mock performance API for older environments
global.performance = global.performance || {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock fetch API
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});