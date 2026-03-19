// Error handling and logging utilities for recommendation system

export interface ErrorDetails {
  id: string;
  timestamp: string;
  component: string;
  operation?: string;
  error: Error;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

class ErrorHandler {
  private errors: Map<string, ErrorDetails> = new Map();
  private listeners: ((error: ErrorDetails) => void)[] = [];
  private maxErrors = 100;

  // Log an error
  logError(
    error: Error,
    component: string,
    context?: Record<string, any>,
    operation?: string
  ): string {
    const id = this.generateErrorId();
    const severity = this.determineSeverity(error, context);
    const retryable = this.isRetryable(error);

    const errorDetails: ErrorDetails = {
      id,
      timestamp: new Date().toISOString(),
      component,
      operation,
      error,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userId: this.getCurrentUserId(),
      severity,
      retryable
    };

    this.errors.set(id, errorDetails);
    this.notifyListeners(errorDetails);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`[Error] ${component}${operation ? `.${operation}` : ''}`);
      console.error('Error:', error);
      if (context) console.log('Context:', context);
      console.log('Severity:', severity);
      console.log('Retryable:', retryable);
      console.groupEnd();
    }

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorReporting(errorDetails);
    }

    // Cleanup old errors
    this.cleanup();

    return id;
  }

  // Add error listener
  addListener(listener: (error: ErrorDetails) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get errors with filtering
  getErrors(filter?: {
    component?: string;
    severity?: string;
    since?: Date;
  }): ErrorDetails[] {
    const allErrors = Array.from(this.errors.values());

    if (!filter) return allErrors;

    return allErrors.filter(error => {
      if (filter.component && error.component !== filter.component) return false;
      if (filter.severity && error.severity !== filter.severity) return false;
      if (filter.since && new Date(error.timestamp) < filter.since) return false;
      return true;
    });
  }

  // Get error by ID
  getError(id: string): ErrorDetails | undefined {
    return this.errors.get(id);
  }

  // Check if operation should be retried
  shouldRetry(errorId: string, maxRetries = 3): boolean {
    const error = this.getError(errorId);
    if (!error || !error.retryable) return false;

    const retryCount = this.getRetryCount(error.component, error.operation);
    return retryCount < maxRetries;
  }

  // Generate error statistics
  getErrorStats(): Record<string, any> {
    const allErrors = Array.from(this.errors.values());
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentErrors = allErrors.filter(e => new Date(e.timestamp) > oneHourAgo);
    const dailyErrors = allErrors.filter(e => new Date(e.timestamp) > oneDayAgo);

    const byComponent = new Map<string, number>();
    const bySeverity = new Map<string, number>();

    for (const error of allErrors) {
      byComponent.set(error.component, (byComponent.get(error.component) || 0) + 1);
      bySeverity.set(error.severity, (bySeverity.get(error.severity) || 0) + 1);
    }

    return {
      total: allErrors.length,
      recent: recentErrors.length,
      daily: dailyErrors.length,
      byComponent: Object.fromEntries(byComponent),
      bySeverity: Object.fromEntries(bySeverity),
      retryableErrors: allErrors.filter(e => e.retryable).length,
      criticalErrors: allErrors.filter(e => e.severity === 'critical').length
    };
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(error: Error, context?: Record<string, any>): ErrorDetails['severity'] {
    const errorMessage = error.message.toLowerCase();

    // Critical errors
    if (
      errorMessage.includes('network error') ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('cors error')
    ) {
      return 'critical';
    }

    // High severity
    if (
      errorMessage.includes('recommendation engine') ||
      errorMessage.includes('algorithm error') ||
      context?.isUserFacing
    ) {
      return 'high';
    }

    // Medium severity
    if (
      errorMessage.includes('cache') ||
      errorMessage.includes('analytics') ||
      errorMessage.includes('tracking')
    ) {
      return 'medium';
    }

    // Default to low
    return 'low';
  }

  private isRetryable(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();

    // Network errors are usually retryable
    if (
      errorMessage.includes('network error') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('failed to fetch')
    ) {
      return true;
    }

    // Rate limiting is retryable
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return true;
    }

    // Server errors (5xx) are retryable
    if (errorMessage.includes('internal server error') || errorMessage.includes('500')) {
      return true;
    }

    // Client errors (4xx) are usually not retryable
    if (errorMessage.includes('400') || errorMessage.includes('401') || errorMessage.includes('403')) {
      return false;
    }

    // Default to retryable for unknown errors
    return true;
  }

  private getCurrentUserId(): string | undefined {
    if (typeof localStorage === 'undefined') return undefined;
    return localStorage.getItem('mercari_mock_user_id') || undefined;
  }

  private getRetryCount(component: string, operation?: string): number {
    const key = `retry_${component}${operation ? `_${operation}` : ''}`;
    const count = sessionStorage.getItem(key);
    return count ? parseInt(count, 10) : 0;
  }

  private incrementRetryCount(component: string, operation?: string): void {
    const key = `retry_${component}${operation ? `_${operation}` : ''}`;
    const count = this.getRetryCount(component, operation);
    sessionStorage.setItem(key, (count + 1).toString());
  }

  private notifyListeners(error: ErrorDetails): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  private async sendToErrorReporting(error: ErrorDetails): Promise<void> {
    try {
      // In a real implementation, this would send to your error reporting service
      // e.g., Sentry, LogRocket, Bugsnag, etc.

      // For demo purposes, just store locally
      const existingErrors = JSON.parse(
        localStorage.getItem('recommendation_errors') || '[]'
      );

      existingErrors.push({
        ...error,
        error: {
          name: error.error.name,
          message: error.error.message,
          stack: error.error.stack
        }
      });

      // Keep only last 50 errors
      const recentErrors = existingErrors.slice(-50);
      localStorage.setItem('recommendation_errors', JSON.stringify(recentErrors));
    } catch (e) {
      console.error('Failed to send error to reporting service:', e);
    }
  }

  private cleanup(): void {
    if (this.errors.size <= this.maxErrors) return;

    // Sort by timestamp and keep the most recent errors
    const sortedErrors = Array.from(this.errors.entries())
      .sort(([, a], [, b]) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const toKeep = sortedErrors.slice(0, this.maxErrors);
    this.errors = new Map(toKeep);
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Error boundary helper
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return React.forwardRef<any, P>((props, ref) => {
    const [state, setState] = React.useState<ErrorBoundaryState>({
      hasError: false,
      retryCount: 0
    });

    React.useEffect(() => {
      if (state.hasError && state.errorId && state.retryCount < 3) {
        const timeout = setTimeout(() => {
          setState(prev => ({
            hasError: false,
            error: undefined,
            errorId: undefined,
            retryCount: prev.retryCount + 1
          }));
        }, 2000 * Math.pow(2, state.retryCount)); // Exponential backoff

        return () => clearTimeout(timeout);
      }
    }, [state.hasError, state.errorId, state.retryCount]);

    if (state.hasError && state.error) {
      const FallbackComponent = fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={state.error}
          retry={() => setState({
            hasError: false,
            error: undefined,
            errorId: undefined,
            retryCount: state.retryCount + 1
          })}
        />
      );
    }

    try {
      return <Component {...props} ref={ref} />;
    } catch (error) {
      const errorId = errorHandler.logError(
        error as Error,
        Component.displayName || Component.name || 'Unknown',
        { props }
      );

      setState({
        hasError: true,
        error: error as Error,
        errorId,
        retryCount: state.retryCount
      });

      return null;
    }
  });
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({
  error,
  retry
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
    <h3 className="text-red-800 font-medium mb-2">エラーが発生しました</h3>
    <p className="text-red-600 text-sm mb-4">
      {error.message || '予期しないエラーが発生しました'}
    </p>
    <button
      onClick={retry}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      再試行
    </button>
  </div>
);

// Async error handler for promises
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  component: string,
  context?: Record<string, any>,
  operationName?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    errorHandler.logError(error as Error, component, context, operationName);
    return null;
  }
}

// Error boundary hook
export function useErrorHandler(component: string) {
  const logError = React.useCallback(
    (error: Error, context?: Record<string, any>, operation?: string) => {
      return errorHandler.logError(error, component, context, operation);
    },
    [component]
  );

  const handleAsyncOperation = React.useCallback(
    async <T>(
      operation: () => Promise<T>,
      context?: Record<string, any>,
      operationName?: string
    ): Promise<T | null> => {
      return handleAsyncError(operation, component, context, operationName);
    },
    [component]
  );

  return { logError, handleAsyncOperation, errorHandler };
}

// Global error event listener
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.logError(event.error, 'Global', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(
      new Error(event.reason),
      'Global',
      { type: 'unhandledPromiseRejection' }
    );
  });
}