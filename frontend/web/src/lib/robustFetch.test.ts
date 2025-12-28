// Quick test to verify robustFetch AbortError fixes
import { robustFetch, FetchError } from './robustFetch';

// Mock fetch for testing
global.fetch = jest.fn();

describe('robustFetch AbortError handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should handle timeout gracefully', async () => {
    // Mock fetch to never resolve
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    );

    const fetchPromise = robustFetch('https://example.com', {
      retry: { timeout: 1000, maxRetries: 0 }
    });

    // Fast-forward time to trigger timeout
    jest.advanceTimersByTime(1000);

    await expect(fetchPromise).rejects.toThrow('Request timeout');
  });

  test('should handle AbortError without reason', async () => {
    // Mock fetch to throw AbortError
    const abortError = new Error('signal is aborted without reason');
    abortError.name = 'AbortError';
    
    (global.fetch as jest.Mock).mockRejectedValue(abortError);

    await expect(
      robustFetch('https://example.com', {
        retry: { maxRetries: 0 }
      })
    ).rejects.toThrow('Request timeout');
  });

  test('should handle external abort signal', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      robustFetch('https://example.com', {
        signal: controller.signal,
        retry: { maxRetries: 0 }
      })
    ).rejects.toThrow('Request was aborted externally');
  });

  test('should handle network errors', async () => {
    const networkError = new Error('Failed to fetch');
    networkError.name = 'TypeError';
    
    (global.fetch as jest.Mock).mockRejectedValue(networkError);

    await expect(
      robustFetch('https://example.com', {
        retry: { maxRetries: 0 }
      })
    ).rejects.toThrow('Network error - please check your connection');
  });
});
