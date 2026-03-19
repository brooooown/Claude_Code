import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RecommendationSection } from '../RecommendationSection';
import { useItemRecommendations } from '../../../hooks/useItemRecommendations';
import { useRecommendationTracking } from '../../../hooks/useExistingABTest';
import { EnhancedProduct } from '../../../data/enhancedMockProducts';

interface ItemRecommendationsProps {
  onProductClick?: (productId: string) => void;
  onProductView?: (product: EnhancedProduct) => void;
  onViewMoreSection?: (sectionId: string) => void;
  className?: string;
}

const ItemRecommendations: React.FC<ItemRecommendationsProps> = ({
  onProductClick,
  onProductView,
  onViewMoreSection,
  className = ''
}) => {
  const {
    sections,
    loading: globalLoading,
    error: globalError,
    addUserFeedback,
    addToUserHistory,
    refreshSection,
    replaceItem
  } = useItemRecommendations();

  const { trackInteraction } = useRecommendationTracking();

  // Handle product click
  const handleProductClick = (productId: string) => {
    // Find the product and add to user history
    const product = sections
      .flatMap(section => section.items)
      .find(item => item.product.id === productId)?.product;

    if (product) {
      addToUserHistory(product);
      onProductView?.(product);
    }

    onProductClick?.(productId);
  };

  // Handle swipe actions
  const handleSwipeAction = (
    productId: string,
    action: 'not_interested' | 'more_like_this'
  ) => {
    // Find which section this product is in
    const sectionId = sections
      .find(section =>
        section.items.some(item => item.product.id === productId)
      )?.id;

    if (!sectionId) return;

    // Add user feedback
    addUserFeedback({
      productId,
      interaction: action === 'not_interested' ? 'not_interested' : 'want_more_like_this',
      sectionId,
      algorithm: sections.find(s => s.id === sectionId)?.algorithm || 'hybrid'
    });

    // Replace the item with a new recommendation
    replaceItem(sectionId, productId);
  };

  // Handle long press actions
  const handleLongPressAction = (productId: string, action: string) => {
    const sectionId = sections
      .find(section =>
        section.items.some(item => item.product.id === productId)
      )?.id;

    if (!sectionId) return;

    const algorithm = sections.find(s => s.id === sectionId)?.algorithm || 'hybrid';

    switch (action) {
      case 'not_interested':
        addUserFeedback({
          productId,
          interaction: 'not_interested',
          sectionId,
          algorithm
        });
        replaceItem(sectionId, productId);
        break;

      case 'want_more_like_this':
        addUserFeedback({
          productId,
          interaction: 'want_more_like_this',
          sectionId,
          algorithm
        });
        break;

      case 'save_for_later':
        addUserFeedback({
          productId,
          interaction: 'save_for_later',
          sectionId,
          algorithm
        });
        break;

      case 'view':
        // Show recommendation reason popup
        const recommendation = sections
          .flatMap(section => section.items)
          .find(item => item.product.id === productId);

        if (recommendation) {
          alert(`推薦理由: ${recommendation.reason}\n信頼度: ${Math.round(recommendation.confidence * 100)}%`);
        }
        break;
    }
  };

  // Handle section refresh
  const handleSectionRefresh = async (sectionId: string) => {
    await refreshSection(sectionId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // Global error handling
  if (globalError) {
    return (
      <motion.div
        className={`item-recommendations-error ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            おすすめの読み込みに失敗しました
          </h3>
          <p className="text-red-600 mb-4">{globalError}</p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </button>
        </div>
      </motion.div>
    );
  }

  // Loading state for initial load
  if (globalLoading && sections.length === 0) {
    return (
      <motion.div
        className={`item-recommendations-loading ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
              </div>

              {/* Items Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`item-recommendations ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            className="mb-12 last:mb-0"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RecommendationSection
              section={section}
              onRefresh={handleSectionRefresh}
              onProductClick={handleProductClick}
              onSwipeAction={handleSwipeAction}
              onLongPressAction={handleLongPressAction}
              onViewMore={onViewMoreSection}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <h4 className="font-bold mb-2">Recommendation Debug</h4>
          <div className="space-y-1">
            <div>Sections: {sections.length}</div>
            <div>Total Items: {sections.reduce((acc, s) => acc + s.items.length, 0)}</div>
            <div>Loading: {sections.filter(s => s.loading).length}</div>
            <div>Errors: {sections.filter(s => s.error).length}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ItemRecommendations;