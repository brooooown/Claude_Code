// Demo testing utilities for the recommendation system

import { EnhancedProduct, enhancedMockProducts } from '../data/enhancedMockProducts';
import { RecommendationEngine, calculateProductSimilarity } from '../data/recommendationEngine';
import { debugABTest, getABTestAnalytics } from '../hooks/useExistingABTest';
import { performanceMonitor } from './performanceMonitor';
import { errorHandler } from './errorHandler';

export class DemoTester {
  private engine: RecommendationEngine;

  constructor() {
    this.engine = new RecommendationEngine(enhancedMockProducts);
  }

  // Test similarity calculations
  testSimilarity(): void {
    console.group('🧮 Similarity Calculation Tests');

    const iphone = enhancedMockProducts[0]; // iPhone 15 Pro
    const macbook = enhancedMockProducts[5]; // MacBook Air M2

    const similarity = calculateProductSimilarity(iphone, macbook);
    console.log(`📱 iPhone vs 💻 MacBook similarity: ${(similarity * 100).toFixed(1)}%`);

    const nike = enhancedMockProducts[1]; // Nike Air Max
    const adidas = enhancedMockProducts[6]; // Adidas Stan Smith

    const shoeSimilarity = calculateProductSimilarity(nike, adidas);
    console.log(`👟 Nike vs 👟 Adidas similarity: ${(shoeSimilarity * 100).toFixed(1)}%`);

    console.groupEnd();
  }

  // Test recommendation algorithms
  testRecommendations(): void {
    console.group('🎯 Recommendation Algorithm Tests');

    const trackingId = performanceMonitor.startTracking('DemoTester', 'recommendations');

    // Test personalized recommendations
    const userHistory = enhancedMockProducts.slice(0, 3);
    const personalized = this.engine.getPersonalizedRecommendations(userHistory, {
      maxResults: 4
    });

    console.log('👤 Personalized Recommendations:');
    personalized.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.product.title} (Score: ${(rec.score * 100).toFixed(1)}% - ${rec.reason})`);
    });

    // Test similar items
    const targetProduct = enhancedMockProducts[0];
    const similar = this.engine.getSimilarItems(targetProduct, { maxResults: 4 });

    console.log(`\n🔗 Similar to "${targetProduct.title}":`);
    similar.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.product.title} (Score: ${(rec.score * 100).toFixed(1)}% - ${rec.reason})`);
    });

    // Test trending
    const trending = this.engine.getTrendingRecommendations({ maxResults: 4 });

    console.log('\n🔥 Trending Recommendations:');
    trending.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.product.title} (Score: ${(rec.score * 100).toFixed(1)}%)`);
    });

    performanceMonitor.endTracking(trackingId);
    console.groupEnd();
  }

  // Test A/B testing
  testABTesting(): void {
    console.group('🧪 A/B Testing Status');

    const debugInfo = debugABTest();
    console.log('Current A/B Test Config:', debugInfo.config);
    console.log('Variant Assignment:', debugInfo.config?.variant || 'Not assigned');
    console.log('Total Events:', debugInfo.events.length);

    const analytics = getABTestAnalytics();
    console.log('Analytics Summary:', analytics);

    console.groupEnd();
  }

  // Test performance monitoring
  testPerformance(): void {
    console.group('⚡ Performance Monitoring');

    const report = performanceMonitor.generateReport();
    console.log('Performance Report:', report);

    const avgDuration = performanceMonitor.getAverageDuration();
    console.log(`Average Operation Duration: ${avgDuration.toFixed(2)}ms`);

    console.groupEnd();
  }

  // Test error handling
  testErrorHandling(): void {
    console.group('🐛 Error Handling Tests');

    // Simulate a few test errors
    try {
      throw new Error('Test network error');
    } catch (error) {
      errorHandler.logError(error as Error, 'DemoTester', {
        isTest: true,
        operation: 'network_request'
      });
    }

    try {
      throw new Error('Test recommendation engine failure');
    } catch (error) {
      errorHandler.logError(error as Error, 'RecommendationEngine', {
        isTest: true,
        isUserFacing: true
      });
    }

    const stats = errorHandler.getErrorStats();
    console.log('Error Statistics:', stats);

    const recentErrors = errorHandler.getErrors({
      since: new Date(Date.now() - 60 * 60 * 1000) // Last hour
    });
    console.log(`Recent Errors (${recentErrors.length}):`, recentErrors);

    console.groupEnd();
  }

  // Test data quality
  testDataQuality(): void {
    console.group('📊 Data Quality Tests');

    const products = enhancedMockProducts;
    console.log(`Total Products: ${products.length}`);

    // Check for required fields
    const missingFields = products.filter(p =>
      !p.styleAttributes ||
      !p.brandAffinity ||
      !p.categoryPath ||
      p.similarityVector.length === 0
    );
    console.log(`Products with missing fields: ${missingFields.length}`);

    // Category distribution
    const categoryDist = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('Category Distribution:', categoryDist);

    // Price segment distribution
    const priceSegmentDist = products.reduce((acc, p) => {
      acc[p.priceSegment] = (acc[p.priceSegment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('Price Segment Distribution:', priceSegmentDist);

    // Brand distribution
    const brandDist = products.reduce((acc, p) => {
      acc[p.brandAffinity] = (acc[p.brandAffinity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('Brand Distribution:', brandDist);

    console.groupEnd();
  }

  // Run all tests
  runAllTests(): void {
    console.log('🚀 Starting Recommendation System Demo Tests\n');

    this.testDataQuality();
    this.testSimilarity();
    this.testRecommendations();
    this.testABTesting();
    this.testPerformance();
    this.testErrorHandling();

    console.log('\n✅ All tests completed! Check the output above for results.');
    console.log('\n💡 Tips:');
    console.log('- Refresh the page to see different A/B test assignments');
    console.log('- Interact with recommendations to generate analytics events');
    console.log('- Open Network tab to see simulated API calls');
    console.log('- Try different user actions to test error boundaries');
  }

  // Interactive demo mode
  startInteractiveDemo(): void {
    console.log('🎮 Interactive Demo Mode Started!');
    console.log('Available commands:');
    console.log('- window.demoTester.testSimilarity()');
    console.log('- window.demoTester.testRecommendations()');
    console.log('- window.demoTester.testABTesting()');
    console.log('- window.demoTester.testPerformance()');
    console.log('- window.demoTester.testErrorHandling()');
    console.log('- window.demoTester.runAllTests()');

    // Make available globally for interactive testing
    (window as any).demoTester = this;
    (window as any).recommendationEngine = this.engine;
    (window as any).performanceMonitor = performanceMonitor;
    (window as any).errorHandler = errorHandler;

    console.log('\nℹ️ All testing utilities are now available on window object!');
  }
}

// Create and export global demo tester
export const demoTester = new DemoTester();

// Auto-start demo in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Wait for page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      demoTester.startInteractiveDemo();
    }, 1000);
  });
}