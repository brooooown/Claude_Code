// Performance monitoring utilities for recommendation system

export interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  component: string;
  operation: string;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private listeners: ((metrics: PerformanceMetrics) => void)[] = [];

  // Start tracking an operation
  startTracking(component: string, operation: string, metadata?: Record<string, any>): string {
    const id = `${component}_${operation}_${Date.now()}`;
    const metric: PerformanceMetrics = {
      startTime: performance.now(),
      component,
      operation,
      metadata
    };

    this.metrics.set(id, metric);
    return id;
  }

  // End tracking and calculate duration
  endTracking(id: string): PerformanceMetrics | null {
    const metric = this.metrics.get(id);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetrics = {
      ...metric,
      endTime,
      duration
    };

    this.metrics.set(id, completedMetric);

    // Notify listeners
    this.listeners.forEach(listener => listener(completedMetric));

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(
        `[Performance] Slow operation detected:`,
        `${metric.component}.${metric.operation} took ${duration.toFixed(2)}ms`
      );
    }

    return completedMetric;
  }

  // Add performance listener
  addListener(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get metrics for analysis
  getMetrics(filter?: { component?: string; operation?: string }): PerformanceMetrics[] {
    const allMetrics = Array.from(this.metrics.values()).filter(m => m.duration !== undefined);

    if (!filter) return allMetrics;

    return allMetrics.filter(metric => {
      if (filter.component && metric.component !== filter.component) return false;
      if (filter.operation && metric.operation !== filter.operation) return false;
      return true;
    });
  }

  // Get average duration for operations
  getAverageDuration(component?: string, operation?: string): number {
    const metrics = this.getMetrics({ component, operation });
    if (metrics.length === 0) return 0;

    const totalDuration = metrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalDuration / metrics.length;
  }

  // Clear old metrics (keep last 100 per component)
  cleanup(): void {
    const maxMetricsPerComponent = 100;
    const componentCounts = new Map<string, number>();

    // Sort by start time (newest first)
    const sortedEntries = Array.from(this.metrics.entries())
      .sort(([, a], [, b]) => b.startTime - a.startTime);

    const toKeep = new Map<string, PerformanceMetrics>();

    for (const [id, metric] of sortedEntries) {
      const count = componentCounts.get(metric.component) || 0;
      if (count < maxMetricsPerComponent) {
        toKeep.set(id, metric);
        componentCounts.set(metric.component, count + 1);
      }
    }

    this.metrics = toKeep;
  }

  // Generate performance report
  generateReport(): Record<string, any> {
    const allMetrics = this.getMetrics();
    const components = [...new Set(allMetrics.map(m => m.component))];

    const report: Record<string, any> = {
      overview: {
        totalOperations: allMetrics.length,
        averageDuration: this.getAverageDuration(),
        slowOperations: allMetrics.filter(m => (m.duration || 0) > 100).length
      },
      byComponent: {}
    };

    for (const component of components) {
      const componentMetrics = allMetrics.filter(m => m.component === component);
      const operations = [...new Set(componentMetrics.map(m => m.operation))];

      report.byComponent[component] = {
        totalOperations: componentMetrics.length,
        averageDuration: this.getAverageDuration(component),
        operations: {}
      };

      for (const operation of operations) {
        const operationMetrics = componentMetrics.filter(m => m.operation === operation);
        const durations = operationMetrics.map(m => m.duration || 0);

        report.byComponent[component].operations[operation] = {
          count: operationMetrics.length,
          averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
          minDuration: Math.min(...durations),
          maxDuration: Math.max(...durations)
        };
      }
    }

    return report;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance decorator for methods
export function trackPerformance(component: string, operation?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const opName = operation || propertyKey;

    descriptor.value = function (...args: any[]) {
      const trackingId = performanceMonitor.startTracking(component, opName, {
        args: args.length
      });

      try {
        const result = originalMethod.apply(this, args);

        if (result && typeof result.then === 'function') {
          // Handle async methods
          return result.finally(() => {
            performanceMonitor.endTracking(trackingId);
          });
        } else {
          // Handle sync methods
          performanceMonitor.endTracking(trackingId);
          return result;
        }
      } catch (error) {
        performanceMonitor.endTracking(trackingId);
        throw error;
      }
    };

    return descriptor;
  };
}

// React hook for performance tracking
export function usePerformanceTracking(component: string, operation: string) {
  const startTracking = () => performanceMonitor.startTracking(component, operation);
  const endTracking = (id: string) => performanceMonitor.endTracking(id);

  return { startTracking, endTracking };
}

// Utility to measure render performance
export function measureRenderTime(componentName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      componentDidMount() {
        const endTime = performance.now();
        const duration = endTime - (this as any).__renderStartTime;

        performanceMonitor.startTracking(componentName, 'render', { duration });

        if ((super as any).componentDidMount) {
          (super as any).componentDidMount.call(this);
        }
      }

      render() {
        (this as any).__renderStartTime = performance.now();
        return (super as any).render.call(this);
      }
    };
  };
}

// Auto cleanup - run every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    performanceMonitor.cleanup();
  }, 5 * 60 * 1000);
}