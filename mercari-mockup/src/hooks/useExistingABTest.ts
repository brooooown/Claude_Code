import { useState, useEffect, useCallback } from 'react';
import {
  ABTestConfig,
  RecommendationVariant,
  RecommendationEvent
} from '../data/recommendationTypes';

interface ABTestResult {
  variant: RecommendationVariant;
  isLoading: boolean;
  config: ABTestConfig | null;
  trackEvent: (event: Omit<RecommendationEvent, 'timestamp' | 'variant' | 'userId'>) => void;
  isInTreatment: boolean;
  shouldShowRecommendations: boolean;
}

// Mock user ID for demo purposes
const getMockUserId = (): string => {
  let userId = localStorage.getItem('mercari_mock_user_id');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('mercari_mock_user_id', userId);
  }
  return userId;
};

// Simulate A/B test assignment based on user ID
const assignVariant = (userId: string, testName: string): RecommendationVariant => {
  // Use deterministic hash to ensure consistent assignment
  const hash = userId + testName;
  const hashValue = hash.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const percentage = hashValue % 100;

  // Split: 33% control, 67% treatment
  if (percentage < 33) {
    return 'control';
  } else if (percentage < 83) {
    return 'treatment_basic';
  } else {
    return 'treatment_advanced';
  }
};

// Hook for A/B test integration
export const useExistingABTest = (testName: string = 'item_recommendation_home'): ABTestResult => {
  const [config, setConfig] = useState<ABTestConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = getMockUserId();

  // Initialize A/B test configuration
  useEffect(() => {
    const initializeABTest = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 200));

        const variant = assignVariant(userId, testName);

        const testConfig: ABTestConfig = {
          variant,
          userId,
          testName,
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-04-30T23:59:59Z',
          metadata: {
            version: '1.0',
            description: 'Item-based recommendation system test',
            targetMetrics: ['unique_engaged_items', 'recommendation_ctr', 'session_duration']
          }
        };

        setConfig(testConfig);

        // Store test assignment in localStorage for consistency
        localStorage.setItem(`ab_test_${testName}`, JSON.stringify(testConfig));

      } catch (error) {
        console.error('Failed to initialize A/B test:', error);
        // Fallback to control
        const fallbackConfig: ABTestConfig = {
          variant: 'control',
          userId,
          testName,
          startDate: new Date().toISOString(),
          metadata: { fallback: true }
        };
        setConfig(fallbackConfig);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if test assignment already exists
    const existingConfig = localStorage.getItem(`ab_test_${testName}`);
    if (existingConfig) {
      try {
        const parsed = JSON.parse(existingConfig);
        setConfig(parsed);
        setIsLoading(false);
      } catch {
        initializeABTest();
      }
    } else {
      initializeABTest();
    }
  }, [testName, userId]);

  // Track events for analytics
  const trackEvent = useCallback((
    event: Omit<RecommendationEvent, 'timestamp' | 'variant' | 'userId'>
  ) => {
    if (!config) return;

    const fullEvent: RecommendationEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      variant: config.variant,
      userId: config.userId
    };

    // Store events locally for demo purposes
    const existingEvents = JSON.parse(
      localStorage.getItem('recommendation_events') || '[]'
    );
    existingEvents.push(fullEvent);

    // Keep only last 1000 events
    const recentEvents = existingEvents.slice(-1000);
    localStorage.setItem('recommendation_events', JSON.stringify(recentEvents));

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('A/B Test Event:', fullEvent);
    }

    // In real implementation, this would send to analytics service
    // Example: analytics.track('recommendation_event', fullEvent);
  }, [config]);

  // Check if user is in treatment group
  const isInTreatment = config?.variant === 'treatment_basic' || config?.variant === 'treatment_advanced';

  // Whether to show recommendations (only for treatment groups)
  const shouldShowRecommendations = isInTreatment;

  return {
    variant: config?.variant || 'control',
    isLoading,
    config,
    trackEvent,
    isInTreatment,
    shouldShowRecommendations
  };
};

// Helper hook for tracking recommendation impressions
export const useRecommendationTracking = () => {
  const { trackEvent } = useExistingABTest();

  const trackImpression = useCallback((
    productId: string,
    sectionId: string,
    algorithm: string,
    position: number
  ) => {
    trackEvent({
      eventType: 'impression',
      productId,
      sectionId,
      algorithm: algorithm as any,
      position
    });
  }, [trackEvent]);

  const trackClick = useCallback((
    productId: string,
    sectionId: string,
    algorithm: string,
    position: number
  ) => {
    trackEvent({
      eventType: 'click',
      productId,
      sectionId,
      algorithm: algorithm as any,
      position
    });
  }, [trackEvent]);

  const trackInteraction = useCallback((
    productId: string,
    sectionId: string,
    algorithm: string,
    position: number,
    interactionType: string
  ) => {
    trackEvent({
      eventType: 'interaction',
      productId,
      sectionId,
      algorithm: algorithm as any,
      position,
      metadata: { interactionType }
    });
  }, [trackEvent]);

  const trackConversion = useCallback((
    productId: string,
    sectionId: string,
    algorithm: string,
    position: number
  ) => {
    trackEvent({
      eventType: 'conversion',
      productId,
      sectionId,
      algorithm: algorithm as any,
      position
    });
  }, [trackEvent]);

  return {
    trackImpression,
    trackClick,
    trackInteraction,
    trackConversion
  };
};

// Analytics utilities
export const getABTestAnalytics = () => {
  const events = JSON.parse(localStorage.getItem('recommendation_events') || '[]');

  const analytics = {
    totalEvents: events.length,
    eventsByType: {} as Record<string, number>,
    eventsByVariant: {} as Record<string, number>,
    eventsByAlgorithm: {} as Record<string, number>,
    clickThroughRates: {} as Record<string, number>
  };

  events.forEach((event: RecommendationEvent) => {
    // Count by type
    analytics.eventsByType[event.eventType] = (analytics.eventsByType[event.eventType] || 0) + 1;

    // Count by variant
    analytics.eventsByVariant[event.variant] = (analytics.eventsByVariant[event.variant] || 0) + 1;

    // Count by algorithm
    analytics.eventsByAlgorithm[event.algorithm] = (analytics.eventsByAlgorithm[event.algorithm] || 0) + 1;
  });

  // Calculate CTRs
  const impressions = analytics.eventsByType['impression'] || 0;
  const clicks = analytics.eventsByType['click'] || 0;
  analytics.clickThroughRates['overall'] = impressions > 0 ? (clicks / impressions) * 100 : 0;

  return analytics;
};

// Debug utilities for development
export const debugABTest = () => {
  const config = localStorage.getItem('ab_test_item_recommendation_home');
  const events = localStorage.getItem('recommendation_events');

  return {
    config: config ? JSON.parse(config) : null,
    events: events ? JSON.parse(events) : [],
    analytics: getABTestAnalytics()
  };
};