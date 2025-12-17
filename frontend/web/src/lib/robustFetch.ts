interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  backoffMultiplier?: number;
}

interface RobustFetchOptions extends RequestInit {
  retry?: RetryOptions;
}

// Simple timeout tracking to prevent excessive retries
const timeoutTracker = {
  attempts: new Map<string, { count: number, lastAttempt: number }>(),

  shouldSkipRequest(url: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(url);

    if (!record) return false;

    // Reset counter if more than 5 minutes have passed
    if (now - record.lastAttempt > 300000) {
      this.attempts.delete(url);
      return false;
    }

    // Skip if more than 3 timeouts in the last 5 minutes
    return record.count >= 3;
  },

  recordTimeout(url: string) {
    const now = Date.now();
    const record = this.attempts.get(url) || { count: 0, lastAttempt: 0 };

    // Reset if more than 5 minutes
    if (now - record.lastAttempt > 300000) {
      record.count = 1;
    } else {
      record.count++;
    }

    record.lastAttempt = now;
    this.attempts.set(url, record);
  }
};

export class FetchError extends Error {
  public readonly status?: number;
  public readonly response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.response = response;
  }
}

/**
 * Safe abort wrapper to prevent uncaught abort errors
 */
function safeAbort(controller: AbortController, reason?: Error | string) {
  try {
    if (!controller.signal.aborted) {
      if (reason) {
        // Ensure timeout errors have user-friendly messages
        if (reason instanceof Error && reason.message.includes("Request timeout after")) {
          const timeoutError = new Error("Network request timed out. Please check your connection and try again.");
          controller.abort(timeoutError);
        } else {
          controller.abort(reason);
        }
      } else {
        controller.abort(new Error("Request was cancelled"));
      }
    }
  } catch (error) {
    // Silently handle abort errors that occur during cleanup
    console.debug('Safe abort completed:', error instanceof Error ? error.message : error);
  }
}

/**
 * Creates a timeout-aware AbortController with proper cleanup
 */
function createTimeoutController(timeoutMs: number, externalSignal?: AbortSignal): {
  controller: AbortController;
  cleanup: () => void;
} {
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | null = null;
  let isCleanedUp = false;

  // Handle external signal if provided
  if (externalSignal) {
    if (externalSignal.aborted) {
      safeAbort(controller, new Error("External request was cancelled"));
      return {
        controller,
        cleanup: () => { isCleanedUp = true; }
      };
    }

    // Forward external abort to our controller
    const onExternalAbort = () => {
      if (!isCleanedUp) {
        safeAbort(controller, new Error("External request was cancelled"));
      }
    };

    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  // Set up timeout with safeguards
  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      if (!isCleanedUp) {
        safeAbort(controller, new Error(`Request timeout after ${timeoutMs}ms`));
      }
    }, timeoutMs);
  }

  return {
    controller,
    cleanup: () => {
      isCleanedUp = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };
}

/**
 * A robust fetch function with retry logic and better error handling
 */
export async function robustFetch(
  url: string,
  options: RobustFetchOptions = {},
): Promise<Response> {
  // Check if we should skip this request due to recent timeouts
  if (timeoutTracker.shouldSkipRequest(url)) {
    throw new Error("Request temporarily unavailable due to recent timeouts. Please try again later.");
  }

  const { retry = {}, ...fetchOptions } = options;

  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 10000,
    backoffMultiplier = 2,
  } = retry;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const { controller, cleanup } = createTimeoutController(timeout, fetchOptions.signal);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      // Clear timeout immediately on success
      cleanup();

      // If response is not ok, throw error but don't retry for 4xx errors
      if (!response.ok) {
        const error = new FetchError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
        );

        // Don't retry for client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw error;
        }

        // For server errors (5xx), we'll retry
        throw error;
      }

      return response;
    } catch (error) {
      // Ensure timeout is cleared in case of error
      cleanup();

      // Safely handle error conversion
      lastError = error instanceof Error ? error : new Error(String(error || 'Unknown error'));

      // Handle different types of abort errors more specifically
      const errorMessage = lastError.message || '';
      const errorName = lastError.name || '';

      if (errorName === "AbortError" || errorMessage.includes("aborted")) {
        // Check if it was our timeout or an external abort
        try {
          if (controller.signal.aborted) {
            // Extract reason from AbortSignal
            const reason = (controller.signal as any)?.reason;

            if (reason) {
              if (reason instanceof Error) {
                // Check if it's a timeout error
                if (reason.message.includes("timeout")) {
                  lastError = new Error("Network request timed out. Please check your connection and try again.");
                } else {
                  lastError = reason;
                }
              } else if (typeof reason === 'string') {
                if (reason.includes("timeout")) {
                  lastError = new Error("Network request timed out. Please check your connection and try again.");
                } else {
                  lastError = new Error(reason);
                }
              } else {
                lastError = new Error("Request was cancelled");
              }
            } else {
              // No reason provided, check if it's likely a timeout based on context
              if (errorMessage.includes("timeout") || errorMessage.includes("signal is aborted without reason")) {
                lastError = new Error("Network request timed out. Please check your connection and try again.");
              } else {
                lastError = new Error("Request was cancelled");
              }
            }
          } else {
            // External abort or unknown abort
            lastError = new Error("Request was cancelled by user");
          }
        } catch (signalError) {
          // If we can't access the signal safely, assume timeout if the original error suggests it
          if (errorMessage.includes("timeout") || errorMessage.includes("signal is aborted without reason")) {
            lastError = new Error("Network request timed out. Please check your connection and try again.");
          } else {
            lastError = new Error("Request was cancelled");
          }
        }
      }

      // Catch any remaining timeout-related errors
      if (errorMessage.includes("timeout") || errorMessage.includes("signal is aborted without reason")) {
        lastError = new Error("Network request timed out. Please check your connection and try again.");
      }

      // Handle other common fetch errors
      if (errorMessage.includes("Failed to fetch")) {
        lastError = new Error("Network error - please check your connection");
      }

      if (errorMessage.includes("NetworkError")) {
        lastError = new Error("Network error - unable to reach server");
      }

      // Handle TypeError which often indicates network issues
      if (errorName === "TypeError" && !errorMessage.includes("aborted")) {
        lastError = new Error("Network connection error");
      }

      // Enhanced logging for timeout issues
      if (lastError.message.includes("timeout") || lastError.message.includes("timed out")) {
        console.warn(
          `🕐 Timeout on attempt ${attempt + 1} for ${url} (${timeout}ms timeout):`,
          lastError.message,
        );
      } else {
        console.warn(
          `Fetch attempt ${attempt + 1} failed for ${url}:`,
          lastError.message,
        );
      }

      // Don't retry on certain errors, but allow retry for timeout on first few attempts
      const isTimeoutError = lastError.message.includes("timeout") || lastError.message.includes("timed out");
      const isAbortError = lastError.message.includes("aborted") || lastError.message.includes("cancelled");
      const is4xxError = error instanceof FetchError && error.status && error.status >= 400 && error.status < 500;

      // Allow retry for timeouts on first 2 attempts, but not on the last attempt
      if (isTimeoutError && attempt < Math.min(2, maxRetries)) {
        console.warn(`Timeout on attempt ${attempt + 1}, retrying...`);
        // Continue to retry logic below
      } else if (isAbortError && !isTimeoutError) {
        // Don't retry on user-initiated aborts
        break;
      } else if (is4xxError) {
        // Don't retry on client errors
        break;
      } else if (isTimeoutError && attempt >= Math.min(2, maxRetries)) {
        // Stop retrying timeouts after 2 attempts and record the timeout
        console.error(`Request timed out after ${attempt + 1} attempts`);
        timeoutTracker.recordTimeout(url);
        break;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        console.error(
          `All ${maxRetries + 1} fetch attempts failed for ${url}:`,
          lastError.message,
        );
        break;
      }

      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt);
      console.warn(`Retrying fetch for ${url} in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Ensure we always throw a user-friendly error
  if (lastError) {
    // Convert technical timeout errors to user-friendly messages
    if (lastError.message.includes("Request timeout after") || lastError.message.includes("fetch")) {
      throw new Error("Network request failed. Please check your connection and try again.");
    }
    throw lastError;
  }

  throw new Error("Network request failed for unknown reason. Please try again.");
}

/**
 * A robust fetch function that returns JSON with better error handling
 */
export async function robustFetchJson<T = any>(
  url: string,
  options: RobustFetchOptions = {},
): Promise<T> {
  try {
    const response = await robustFetch(url, options);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new FetchError("Response is not JSON", response.status, response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    throw new FetchError(
      `Failed to fetch JSON from ${url}: ${error}`,
      undefined,
      undefined,
    );
  }
}

/**
 * Utility function to check if an error is a network error that might be worth retrying
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof FetchError) {
    // Retry on 5xx server errors
    return error.status ? error.status >= 500 : true;
  }

  if (error instanceof Error) {
    // Retry on network errors
    return (
      error.name === "TypeError" && error.message.includes("Failed to fetch")
    );
  }

  return false;
}
