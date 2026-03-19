import { EnhancedProduct } from './enhancedMockProducts';

// Recommendation section types
export interface RecommendationSection {
  id: string;
  title: string;
  subtitle?: string;
  algorithm: RecommendationType;
  items: RecommendationResult[];
  refreshable: boolean;
  loading: boolean;
  error?: string;
}

// Supported recommendation algorithms
export type RecommendationType =
  | 'similar_items'      // Item-to-item collaborative filtering
  | 'category_based'     // Category similarity
  | 'style_match'       // Style attribute matching
  | 'price_range'       // Similar price segment
  | 'brand_affinity'    // Same brand or brand compatibility
  | 'hybrid'            // Combined multiple algorithms
  | 'trending'          // Popularity-based
  | 'personalized';     // User history-based

// Result from recommendation engine
export interface RecommendationResult {
  product: EnhancedProduct;
  score: number;
  reason: string;
  algorithm: RecommendationType;
  confidence: number; // 0-1
}

// User interaction types
export type InteractionType =
  | 'view'
  | 'like'
  | 'unlike'
  | 'not_interested'
  | 'want_more_like_this'
  | 'save_for_later'
  | 'share'
  | 'click';

// User feedback for recommendation learning
export interface UserFeedback {
  productId: string;
  interaction: InteractionType;
  timestamp: string;
  sectionId: string;
  algorithm: RecommendationType;
  context?: Record<string, any>;
}

// Swipe action types
export type SwipeAction = 'not_interested' | 'more_like_this' | 'save_for_later';

// Long press menu options
export interface LongPressOption {
  id: string;
  label: string;
  action: InteractionType;
  icon: string;
  description?: string;
}

// A/B test variants for recommendations
export type RecommendationVariant = 'control' | 'treatment_basic' | 'treatment_advanced';

// A/B test configuration
export interface ABTestConfig {
  variant: RecommendationVariant;
  userId: string;
  testName: string;
  startDate: string;
  endDate?: string;
  metadata?: Record<string, any>;
}

// Analytics event for recommendation tracking
export interface RecommendationEvent {
  eventType: 'impression' | 'click' | 'interaction' | 'conversion';
  productId: string;
  sectionId: string;
  algorithm: RecommendationType;
  position: number; // Position in the recommendation list
  timestamp: string;
  variant?: RecommendationVariant;
  userId?: string;
  metadata?: Record<string, any>;
}

// Recommendation settings/preferences
export interface RecommendationSettings {
  enablePersonalization: boolean;
  diversityLevel: 'low' | 'medium' | 'high';
  freshnessPreference: 'latest' | 'balanced' | 'evergreen';
  categoryPreferences: string[];
  priceRangePreference?: {
    min: number;
    max: number;
  };
  excludedBrands: string[];
  maxItemsPerSection: number;
  enableSwipeActions: boolean;
  enableLongPressMenu: boolean;
}

// Pull-to-refresh configuration
export interface RefreshConfig {
  threshold: number; // pixels
  maxPull: number;
  snapBackDuration: number; // ms
  triggerDuration: number; // ms
}

// Animation states for recommendations
export type AnimationState =
  | 'entering'
  | 'visible'
  | 'refreshing'
  | 'swiping_left'
  | 'swiping_right'
  | 'long_pressing'
  | 'removing'
  | 'replacing';

// Recommendation card states
export interface RecommendationCardState {
  isVisible: boolean;
  animationState: AnimationState;
  swipeOffset: number;
  isLongPressed: boolean;
  showMenu: boolean;
  isRemoving: boolean;
}

// Section refresh states
export interface SectionRefreshState {
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
  lastRefreshTime?: string;
  refreshCount: number;
}

// Error types for recommendation system
export type RecommendationError =
  | 'network_error'
  | 'insufficient_data'
  | 'algorithm_error'
  | 'rate_limit_exceeded'
  | 'user_blocked'
  | 'content_filtered';

// Error details
export interface RecommendationErrorDetails {
  type: RecommendationError;
  message: string;
  code?: string;
  timestamp: string;
  sectionId?: string;
  algorithm?: RecommendationType;
  retryable: boolean;
  retryAfter?: number; // seconds
}

// Performance metrics for recommendations
export interface RecommendationMetrics {
  loadTime: number; // ms
  algorithmTime: number; // ms
  renderTime: number; // ms
  cacheHitRate?: number;
  errorRate?: number;
  userEngagementRate?: number;
}

// Recommendation cache entry
export interface RecommendationCacheEntry {
  key: string;
  data: RecommendationResult[];
  timestamp: string;
  ttl: number; // seconds
  algorithm: RecommendationType;
  userContext?: string;
}

// Default long press menu options
export const DEFAULT_LONG_PRESS_OPTIONS: LongPressOption[] = [
  {
    id: 'why_recommended',
    label: 'なぜおすすめ？',
    action: 'view',
    icon: 'info',
    description: '推薦理由を表示'
  },
  {
    id: 'not_interested',
    label: '興味なし',
    action: 'not_interested',
    icon: 'x',
    description: 'この商品に興味がない'
  },
  {
    id: 'save_for_later',
    label: '後で見る',
    action: 'save_for_later',
    icon: 'bookmark',
    description: 'お気に入りに保存'
  },
  {
    id: 'more_like_this',
    label: '似た商品を見る',
    action: 'want_more_like_this',
    icon: 'heart',
    description: '類似商品を表示'
  }
];

// Default refresh configuration
export const DEFAULT_REFRESH_CONFIG: RefreshConfig = {
  threshold: 60,
  maxPull: 120,
  snapBackDuration: 300,
  triggerDuration: 200
};

// Default recommendation settings
export const DEFAULT_RECOMMENDATION_SETTINGS: RecommendationSettings = {
  enablePersonalization: true,
  diversityLevel: 'medium',
  freshnessPreference: 'balanced',
  categoryPreferences: [],
  excludedBrands: [],
  maxItemsPerSection: 6,
  enableSwipeActions: true,
  enableLongPressMenu: true
};