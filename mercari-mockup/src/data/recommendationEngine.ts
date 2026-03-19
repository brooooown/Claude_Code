import { EnhancedProduct } from './enhancedMockProducts';

// Recommendation types for different algorithms
export type RecommendationType =
  | 'similar_items'      // Item-to-item collaborative filtering
  | 'category_based'     // Category similarity
  | 'style_match'       // Style attribute matching
  | 'price_range'       // Similar price segment
  | 'brand_affinity'    // Same brand or brand compatibility
  | 'hybrid'            // Combined multiple algorithms
  | 'trending'          // Popularity-based
  | 'personalized';     // User history-based

export interface RecommendationResult {
  product: EnhancedProduct;
  score: number;
  reason: string;
  algorithm: RecommendationType;
  confidence: number; // 0-1
}

export interface RecommendationOptions {
  maxResults?: number;
  diversityFactor?: number; // 0-1, higher means more diverse
  freshnessFactor?: number; // 0-1, higher prefers newer items
  excludeIds?: string[];
  categoryDiversity?: boolean;
  priceRangeDiversity?: boolean;
}

/**
 * Calculates similarity between two products using multiple factors
 */
export function calculateProductSimilarity(
  product1: EnhancedProduct,
  product2: EnhancedProduct,
  weights = {
    category: 0.4,
    price: 0.3,
    style: 0.2,
    brand: 0.1
  }
): number {
  // Category similarity
  let categorySimilarity = 0;
  if (product1.category === product2.category) {
    categorySimilarity = 1.0;
    if (product1.subcategory === product2.subcategory) {
      categorySimilarity = 1.0;
    } else {
      categorySimilarity = 0.7;
    }
  } else {
    // Check if they share any category path elements
    const commonPath = product1.categoryPath.filter(path =>
      product2.categoryPath.includes(path)
    );
    categorySimilarity = commonPath.length > 0 ? 0.3 : 0.0;
  }

  // Price similarity (normalized difference)
  const maxPrice = Math.max(product1.price, product2.price);
  const minPrice = Math.min(product1.price, product2.price);
  const priceSimilarity = maxPrice > 0 ? minPrice / maxPrice : 1.0;

  // Style attribute similarity (Jaccard index)
  const style1Set = new Set(product1.styleAttributes);
  const style2Set = new Set(product2.styleAttributes);
  const intersection = new Set([...style1Set].filter(x => style2Set.has(x)));
  const union = new Set([...style1Set, ...style2Set]);
  const styleSimilarity = union.size > 0 ? intersection.size / union.size : 0;

  // Brand similarity
  let brandSimilarity = 0;
  if (product1.brandAffinity === product2.brandAffinity) {
    brandSimilarity = 1.0;
  } else {
    // Some brands have affinity (e.g., Apple products work well together)
    const compatibleBrands = {
      'Apple': ['Apple', 'Beats'],
      'Nike': ['Nike', 'Jordan'],
      'Adidas': ['Adidas', 'Yeezy']
    };

    const brand1Compatible = compatibleBrands[product1.brandAffinity] || [];
    const brand2Compatible = compatibleBrands[product2.brandAffinity] || [];

    if (brand1Compatible.includes(product2.brandAffinity) ||
        brand2Compatible.includes(product1.brandAffinity)) {
      brandSimilarity = 0.6;
    }
  }

  // Weighted sum
  return (
    categorySimilarity * weights.category +
    priceSimilarity * weights.price +
    styleSimilarity * weights.style +
    brandSimilarity * weights.brand
  );
}

/**
 * Applies diversity filter to ensure varied recommendations
 */
export function applyDiversityFilter(
  recommendations: RecommendationResult[],
  options: RecommendationOptions = {}
): RecommendationResult[] {
  const {
    maxResults = 6,
    diversityFactor = 0.3,
    categoryDiversity = true,
    priceRangeDiversity = true
  } = options;

  if (!categoryDiversity && !priceRangeDiversity) {
    return recommendations.slice(0, maxResults);
  }

  const result: RecommendationResult[] = [];
  const usedCategories = new Set<string>();
  const usedPriceSegments = new Set<string>();
  const usedBrands = new Set<string>();

  // Sort by score first
  const sorted = [...recommendations].sort((a, b) => b.score - a.score);

  for (const rec of sorted) {
    if (result.length >= maxResults) break;

    const product = rec.product;

    // Check diversity constraints
    let diversityPenalty = 0;

    if (categoryDiversity && usedCategories.has(product.category)) {
      diversityPenalty += 0.2;
    }

    if (priceRangeDiversity && usedPriceSegments.has(product.priceSegment)) {
      diversityPenalty += 0.1;
    }

    if (usedBrands.has(product.brandAffinity)) {
      diversityPenalty += 0.1;
    }

    // Apply diversity penalty
    const adjustedScore = rec.score * (1 - diversityPenalty * diversityFactor);

    // Accept if score is still good or if we need more diversity
    const shouldAccept = adjustedScore > 0.3 || result.length < maxResults / 2;

    if (shouldAccept) {
      result.push({
        ...rec,
        score: adjustedScore
      });

      usedCategories.add(product.category);
      usedPriceSegments.add(product.priceSegment);
      usedBrands.add(product.brandAffinity);
    }
  }

  return result;
}

/**
 * Calculates freshness score based on creation date and view history
 */
export function calculateFreshnessScore(
  product: EnhancedProduct,
  baselineDate: Date = new Date()
): number {
  const createdAt = new Date(product.createdAt);
  const daysSinceCreated = Math.floor(
    (baselineDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Exponential decay - fresher items get higher scores
  const freshnessScore = Math.exp(-daysSinceCreated / 30); // 30-day half-life

  // Adjust based on view count (popular items stay "fresh" longer)
  const popularityBoost = Math.min(product.viewCount / 100, 1) * 0.2;

  return Math.min(freshnessScore + popularityBoost, 1);
}

/**
 * Main recommendation engine - returns personalized recommendations
 */
export class RecommendationEngine {
  private products: EnhancedProduct[];

  constructor(products: EnhancedProduct[]) {
    this.products = products;
  }

  /**
   * Get similar items based on a target product
   */
  getSimilarItems(
    targetProduct: EnhancedProduct,
    options: RecommendationOptions = {}
  ): RecommendationResult[] {
    const { excludeIds = [], freshnessFactor = 0.2 } = options;
    const excludeSet = new Set([...excludeIds, targetProduct.id]);

    const candidates = this.products.filter(p => !excludeSet.has(p.id));

    const recommendations = candidates.map(product => {
      const similarity = calculateProductSimilarity(targetProduct, product);
      const freshness = calculateFreshnessScore(product);

      // Combine similarity and freshness
      const score = similarity * (1 - freshnessFactor) + freshness * freshnessFactor;

      return {
        product,
        score,
        reason: this.generateSimilarityReason(targetProduct, product),
        algorithm: 'similar_items' as RecommendationType,
        confidence: similarity
      };
    });

    return applyDiversityFilter(recommendations, options);
  }

  /**
   * Get recommendations based on user's browsing history
   */
  getPersonalizedRecommendations(
    userHistory: EnhancedProduct[],
    options: RecommendationOptions = {}
  ): RecommendationResult[] {
    if (userHistory.length === 0) {
      return this.getTrendingRecommendations(options);
    }

    const { excludeIds = [] } = options;
    const historyIds = new Set(userHistory.map(p => p.id));
    const excludeSet = new Set([...excludeIds, ...historyIds]);

    // Analyze user preferences
    const userPreferences = this.analyzeUserPreferences(userHistory);
    const candidates = this.products.filter(p => !excludeSet.has(p.id));

    const recommendations = candidates.map(product => {
      const score = this.calculatePersonalizationScore(product, userPreferences);

      return {
        product,
        score,
        reason: this.generatePersonalizationReason(product, userPreferences),
        algorithm: 'personalized' as RecommendationType,
        confidence: score
      };
    });

    return applyDiversityFilter(recommendations, options);
  }

  /**
   * Get trending recommendations based on popularity
   */
  getTrendingRecommendations(
    options: RecommendationOptions = {}
  ): RecommendationResult[] {
    const { excludeIds = [] } = options;
    const excludeSet = new Set(excludeIds);

    const candidates = this.products.filter(p => !excludeSet.has(p.id));

    const recommendations = candidates.map(product => {
      // Trending score based on popularity, likes, and recent activity
      const popularityScore = Math.min(product.popularityScore, 1);
      const likeRatio = Math.min(product.likes / 100, 1);
      const viewScore = Math.min(product.viewCount / 200, 1);
      const freshness = calculateFreshnessScore(product);

      const score = (popularityScore * 0.4 + likeRatio * 0.3 + viewScore * 0.2 + freshness * 0.1);

      return {
        product,
        score,
        reason: '人気急上昇中のアイテムです',
        algorithm: 'trending' as RecommendationType,
        confidence: popularityScore
      };
    });

    return applyDiversityFilter(recommendations, options);
  }

  /**
   * Get category-based recommendations
   */
  getCategoryRecommendations(
    category: string,
    options: RecommendationOptions = {}
  ): RecommendationResult[] {
    const { excludeIds = [] } = options;
    const excludeSet = new Set(excludeIds);

    const candidates = this.products.filter(p =>
      !excludeSet.has(p.id) &&
      (p.category === category || p.categoryPath.includes(category))
    );

    const recommendations = candidates.map(product => {
      // Score based on popularity within category and freshness
      const categoryScore = product.category === category ? 1 : 0.7;
      const popularityScore = product.popularityScore;
      const freshness = calculateFreshnessScore(product);

      const score = categoryScore * 0.5 + popularityScore * 0.3 + freshness * 0.2;

      return {
        product,
        score,
        reason: `${category}で人気のアイテム`,
        algorithm: 'category_based' as RecommendationType,
        confidence: categoryScore
      };
    });

    return applyDiversityFilter(recommendations, options);
  }

  /**
   * Hybrid recommendation combining multiple algorithms
   */
  getHybridRecommendations(
    userHistory: EnhancedProduct[],
    options: RecommendationOptions = {}
  ): RecommendationResult[] {
    const { maxResults = 6 } = options;

    // Get recommendations from different algorithms
    const personalizedWeight = userHistory.length > 0 ? 0.4 : 0;
    const trendingWeight = 0.3;
    const similarWeight = userHistory.length > 0 ? 0.3 : 0.7;

    let allRecommendations: RecommendationResult[] = [];

    // Add personalized recommendations
    if (userHistory.length > 0) {
      const personalized = this.getPersonalizedRecommendations(userHistory, {
        ...options,
        maxResults: Math.ceil(maxResults * personalizedWeight / 0.1)
      });
      allRecommendations.push(...personalized.map(rec => ({
        ...rec,
        score: rec.score * personalizedWeight,
        algorithm: 'hybrid' as RecommendationType
      })));
    }

    // Add trending recommendations
    const trending = this.getTrendingRecommendations({
      ...options,
      maxResults: Math.ceil(maxResults * trendingWeight / 0.1)
    });
    allRecommendations.push(...trending.map(rec => ({
      ...rec,
      score: rec.score * trendingWeight,
      algorithm: 'hybrid' as RecommendationType
    })));

    // Add similar items if user has history
    if (userHistory.length > 0) {
      const latestViewed = userHistory[userHistory.length - 1];
      const similar = this.getSimilarItems(latestViewed, {
        ...options,
        maxResults: Math.ceil(maxResults * similarWeight / 0.1)
      });
      allRecommendations.push(...similar.map(rec => ({
        ...rec,
        score: rec.score * similarWeight,
        algorithm: 'hybrid' as RecommendationType
      })));
    }

    // Remove duplicates and apply diversity filter
    const uniqueRecommendations = this.removeDuplicates(allRecommendations);
    return applyDiversityFilter(uniqueRecommendations, options);
  }

  private analyzeUserPreferences(history: EnhancedProduct[]) {
    const preferences = {
      categories: new Map<string, number>(),
      priceSegments: new Map<string, number>(),
      brands: new Map<string, number>(),
      styleAttributes: new Map<string, number>()
    };

    history.forEach((product, index) => {
      const weight = 1 / (index + 1); // More recent items have higher weight

      // Categories
      preferences.categories.set(
        product.category,
        (preferences.categories.get(product.category) || 0) + weight
      );

      // Price segments
      preferences.priceSegments.set(
        product.priceSegment,
        (preferences.priceSegments.get(product.priceSegment) || 0) + weight
      );

      // Brands
      preferences.brands.set(
        product.brandAffinity,
        (preferences.brands.get(product.brandAffinity) || 0) + weight
      );

      // Style attributes
      product.styleAttributes.forEach(attr => {
        preferences.styleAttributes.set(
          attr,
          (preferences.styleAttributes.get(attr) || 0) + weight
        );
      });
    });

    return preferences;
  }

  private calculatePersonalizationScore(
    product: EnhancedProduct,
    preferences: ReturnType<typeof this.analyzeUserPreferences>
  ): number {
    let score = 0;

    // Category preference
    score += (preferences.categories.get(product.category) || 0) * 0.3;

    // Price segment preference
    score += (preferences.priceSegments.get(product.priceSegment) || 0) * 0.2;

    // Brand preference
    score += (preferences.brands.get(product.brandAffinity) || 0) * 0.2;

    // Style attribute preferences
    const styleScore = product.styleAttributes.reduce((acc, attr) => {
      return acc + (preferences.styleAttributes.get(attr) || 0);
    }, 0) / Math.max(product.styleAttributes.length, 1);
    score += styleScore * 0.3;

    return Math.min(score, 1);
  }

  private generateSimilarityReason(target: EnhancedProduct, similar: EnhancedProduct): string {
    if (target.category === similar.category) {
      if (target.brandAffinity === similar.brandAffinity) {
        return `${target.brandAffinity}の類似商品`;
      }
      return `${target.category}の類似商品`;
    }

    const commonStyles = target.styleAttributes.filter(attr =>
      similar.styleAttributes.includes(attr)
    );

    if (commonStyles.length > 0) {
      return `${commonStyles[0]}スタイルが似ています`;
    }

    return '似た商品';
  }

  private generatePersonalizationReason(
    product: EnhancedProduct,
    preferences: ReturnType<typeof this.analyzeUserPreferences>
  ): string {
    const topCategory = Array.from(preferences.categories.entries())
      .sort((a, b) => b[1] - a[1])[0];

    const topBrand = Array.from(preferences.brands.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory && product.category === topCategory[0]) {
      return `あなたがよく見る${topCategory[0]}`;
    }

    if (topBrand && product.brandAffinity === topBrand[0]) {
      return `${topBrand[0]}がお好みのようです`;
    }

    return 'あなたにおすすめ';
  }

  private removeDuplicates(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.product.id)) {
        return false;
      }
      seen.add(rec.product.id);
      return true;
    });
  }
}

// Export instance with enhanced products
export const recommendationEngine = new RecommendationEngine([]);