import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RecommendationSection,
  RecommendationResult,
  RecommendationType,
  UserFeedback,
  RecommendationSettings,
  DEFAULT_RECOMMENDATION_SETTINGS
} from '../data/recommendationTypes';
import { EnhancedProduct, enhancedMockProducts, mockUserHistory } from '../data/enhancedMockProducts';
import { RecommendationEngine } from '../data/recommendationEngine';

// Hook for managing item recommendations
export const useItemRecommendations = () => {
  const [sections, setSections] = useState<RecommendationSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<RecommendationSettings>(DEFAULT_RECOMMENDATION_SETTINGS);
  const [userHistory, setUserHistory] = useState<EnhancedProduct[]>(mockUserHistory);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);

  const engineRef = useRef<RecommendationEngine | null>(null);
  const cacheRef = useRef<Map<string, { data: RecommendationResult[], timestamp: number }>>(new Map());

  // Initialize recommendation engine
  useEffect(() => {
    engineRef.current = new RecommendationEngine(enhancedMockProducts);
    initializeRecommendations();
  }, [initializeRecommendations]);

  // Initialize recommendation sections
  const initializeRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const initialSections: RecommendationSection[] = [
        {
          id: 'for_you',
          title: 'あなたにおすすめ',
          subtitle: 'あなたの閲覧履歴に基づいたアイテム',
          algorithm: 'personalized',
          items: [],
          refreshable: true,
          loading: false
        },
        {
          id: 'similar_to_viewed',
          title: '最近見た商品に関連',
          subtitle: '閲覧した商品と似ているアイテム',
          algorithm: 'similar_items',
          items: [],
          refreshable: true,
          loading: false
        },
        {
          id: 'trending',
          title: 'いま注目のアイテム',
          subtitle: '人気急上昇中の商品',
          algorithm: 'trending',
          items: [],
          refreshable: true,
          loading: false
        }
      ];

      // Load recommendations for each section
      for (const section of initialSections) {
        const recommendations = await getRecommendationsForSection(section.algorithm);
        section.items = recommendations;
      }

      setSections(initialSections);
    } catch (err) {
      setError('推薦データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get recommendations for a specific algorithm
  const getRecommendationsForSection = useCallback(async (
    algorithm: RecommendationType,
    options = { maxResults: 6 }
  ): Promise<RecommendationResult[]> => {
    if (!engineRef.current) return [];

    const cacheKey = `${algorithm}_${JSON.stringify(options)}`;
    const cached = cacheRef.current.get(cacheKey);
    const now = Date.now();

    // Use cache if available and not expired (5 minutes)
    if (cached && (now - cached.timestamp) < 5 * 60 * 1000) {
      return cached.data;
    }

    let recommendations: RecommendationResult[] = [];

    // Apply user feedback to exclude items they're not interested in
    const excludeIds = userFeedback
      .filter(feedback => feedback.interaction === 'not_interested')
      .map(feedback => feedback.productId);

    const enhancedOptions = { ...options, excludeIds };

    switch (algorithm) {
      case 'personalized':
        recommendations = engineRef.current.getPersonalizedRecommendations(
          userHistory,
          enhancedOptions
        );
        break;

      case 'similar_items':
        if (userHistory.length > 0) {
          // Get similar items to the most recent viewed item
          const latestViewed = userHistory[userHistory.length - 1];
          recommendations = engineRef.current.getSimilarItems(latestViewed, enhancedOptions);
        } else {
          // Fallback to trending if no history
          recommendations = engineRef.current.getTrendingRecommendations(enhancedOptions);
        }
        break;

      case 'trending':
        recommendations = engineRef.current.getTrendingRecommendations(enhancedOptions);
        break;

      case 'hybrid':
        recommendations = engineRef.current.getHybridRecommendations(
          userHistory,
          enhancedOptions
        );
        break;

      default:
        recommendations = engineRef.current.getTrendingRecommendations(enhancedOptions);
    }

    // Cache the results
    cacheRef.current.set(cacheKey, {
      data: recommendations,
      timestamp: now
    });

    return recommendations;
  }, [userHistory, userFeedback]);

  // Refresh recommendations for a specific section
  const refreshSection = useCallback(async (sectionId: string) => {
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, loading: true, error: undefined }
        : section
    ));

    try {
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      // Clear cache for this algorithm
      const cacheKeys = Array.from(cacheRef.current.keys());
      cacheKeys.forEach(key => {
        if (key.startsWith(section.algorithm)) {
          cacheRef.current.delete(key);
        }
      });

      const recommendations = await getRecommendationsForSection(section.algorithm);

      setSections(prev => prev.map(s =>
        s.id === sectionId
          ? { ...s, items: recommendations, loading: false }
          : s
      ));
    } catch (err) {
      setSections(prev => prev.map(section =>
        section.id === sectionId
          ? { ...section, loading: false, error: '更新に失敗しました' }
          : section
      ));
    }
  }, [sections, getRecommendationsForSection]);

  // Add user feedback
  const addUserFeedback = useCallback((feedback: Omit<UserFeedback, 'timestamp'>) => {
    const newFeedback: UserFeedback = {
      ...feedback,
      timestamp: new Date().toISOString()
    };

    setUserFeedback(prev => [...prev, newFeedback]);

    // If user is not interested, remove the item from current recommendations
    if (feedback.interaction === 'not_interested') {
      setSections(prev => prev.map(section => ({
        ...section,
        items: section.items.filter(item => item.product.id !== feedback.productId)
      })));
    }

    // If user wants more like this, boost similar items
    if (feedback.interaction === 'want_more_like_this') {
      const product = enhancedMockProducts.find(p => p.id === feedback.productId);
      if (product) {
        refreshSimilarItems(product);
      }
    }
  }, []);

  // Add product to user history
  const addToUserHistory = useCallback((product: EnhancedProduct) => {
    setUserHistory(prev => {
      // Remove if already exists and add to end
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [...filtered, product];

      // Keep only last 20 items
      return updated.slice(-20);
    });
  }, []);

  // Refresh similar items when user shows interest
  const refreshSimilarItems = useCallback(async (targetProduct: EnhancedProduct) => {
    if (!engineRef.current) return;

    const similarSection = sections.find(s => s.algorithm === 'similar_items');
    if (!similarSection) return;

    const similarItems = engineRef.current.getSimilarItems(targetProduct, {
      maxResults: 6,
      diversityFactor: 0.2 // Less diversity for "more like this"
    });

    setSections(prev => prev.map(section =>
      section.algorithm === 'similar_items'
        ? { ...section, items: similarItems }
        : section
    ));
  }, [sections]);

  // Replace item with a new recommendation
  const replaceItem = useCallback(async (sectionId: string, productId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    // Get a new recommendation excluding current items
    const currentIds = section.items.map(item => item.product.id);
    const newRecommendations = await getRecommendationsForSection(
      section.algorithm,
      {
        maxResults: 1,
        excludeIds: currentIds
      }
    );

    if (newRecommendations.length > 0) {
      setSections(prev => prev.map(s =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map(item =>
                item.product.id === productId ? newRecommendations[0] : item
              )
            }
          : s
      ));
    } else {
      // If no replacement available, remove the item
      setSections(prev => prev.map(s =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.filter(item => item.product.id !== productId)
            }
          : s
      ));
    }
  }, [sections, getRecommendationsForSection]);

  // Update recommendation settings
  const updateSettings = useCallback((newSettings: Partial<RecommendationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Clear cache when settings change
    cacheRef.current.clear();

    // Refresh all sections
    setTimeout(() => {
      sections.forEach(section => {
        refreshSection(section.id);
      });
    }, 100);
  }, [sections, refreshSection]);

  // Clear all recommendations cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    sections,
    loading,
    error,
    settings,
    userHistory,
    userFeedback,
    refreshSection,
    addUserFeedback,
    addToUserHistory,
    replaceItem,
    updateSettings,
    clearCache,
    initializeRecommendations
  };
};