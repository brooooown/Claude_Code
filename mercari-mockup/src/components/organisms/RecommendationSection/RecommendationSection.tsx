import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { RecommendationCard } from '../../molecules/RecommendationCard';
import { ProductCardSkeleton } from '../../molecules/ProductCard/ProductCard';
import {
  RecommendationSection as RecommendationSectionType,
  DEFAULT_REFRESH_CONFIG
} from '../../../data/recommendationTypes';
import { useRecommendationInteractions } from '../../../hooks/useRecommendationInteractions';

interface RecommendationSectionProps {
  section: RecommendationSectionType;
  onRefresh?: (sectionId: string) => Promise<void>;
  onProductClick?: (productId: string) => void;
  onSwipeAction?: (productId: string, action: 'not_interested' | 'more_like_this') => void;
  onLongPressAction?: (productId: string, action: string) => void;
  onViewMore?: (sectionId: string) => void;
  showHeader?: boolean;
  compact?: boolean;
  className?: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  section,
  onRefresh,
  onProductClick,
  onSwipeAction,
  onLongPressAction,
  onViewMore,
  showHeader = true,
  compact = false,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);

  const {
    sectionRefreshStates,
    handleSectionPullStart,
    handleSectionPullMove,
    handleSectionPullEnd
  } = useRecommendationInteractions({
    onSectionRefresh: onRefresh
  });

  const refreshState = sectionRefreshStates.get(section.id) || {
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false,
    refreshCount: 0
  };

  // Handle manual refresh button
  const handleRefreshClick = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh(section.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const getAlgorithmBadgeColor = () => {
    const colorMap = {
      personalized: 'primary',
      similar_items: 'success',
      trending: 'warning',
      category_based: 'default',
      hybrid: 'primary'
    };
    return colorMap[section.algorithm] || 'default';
  };

  const getAlgorithmIcon = () => {
    const iconMap = {
      personalized: 'user',
      similar_items: 'heart',
      trending: 'trending-up',
      category_based: 'grid',
      hybrid: 'star'
    };
    return iconMap[section.algorithm] || 'star';
  };

  return (
    <motion.section
      ref={sectionRef}
      className={`recommendation-section ${className}`}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      data-section-id={section.id}
    >
      {/* Section Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-text-primary">{section.title}</h2>

            {/* Algorithm Badge */}
            <Badge
              variant={getAlgorithmBadgeColor() as any}
              size="sm"
              className="flex items-center space-x-1"
            >
              <Icon name={getAlgorithmIcon() as any} size="xs" />
              <span className="text-xs capitalize">{section.algorithm}</span>
            </Badge>

            {/* Loading Indicator */}
            {(section.loading || isRefreshing) && (
              <motion.div
                className="text-mercari-red"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Icon name="refresh-ccw" size="sm" />
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Refresh Button */}
            {section.refreshable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshClick}
                disabled={isRefreshing || section.loading}
                icon={<Icon name="refresh-ccw" size="sm" />}
              >
                更新
              </Button>
            )}

            {/* View More Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewMore?.(section.id)}
              icon={<Icon name="arrow-right" size="sm" />}
              iconPosition="right"
            >
              もっと見る
            </Button>
          </div>
        </div>
      )}

      {/* Section Subtitle */}
      {section.subtitle && (
        <p className="text-sm text-text-secondary mb-4">{section.subtitle}</p>
      )}

      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {refreshState.pullDistance > 0 && (
          <motion.div
            className="flex justify-center py-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: Math.min(refreshState.pullDistance, DEFAULT_REFRESH_CONFIG.maxPull)
            }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={`flex items-center space-x-2 ${
              refreshState.canRefresh ? 'text-mercari-red' : 'text-gray-400'
            }`}>
              <motion.div
                animate={refreshState.canRefresh ? { rotate: 180 } : { rotate: 0 }}
              >
                <Icon name="arrow-down" size="sm" />
              </motion.div>
              <span className="text-sm">
                {refreshState.canRefresh ? '離して更新' : 'プルして更新'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {section.error && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center space-x-2">
            <Icon name="alert-circle" size="sm" className="text-red-500" />
            <span className="text-red-700">{section.error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshClick}
              className="ml-auto text-red-600"
            >
              再試行
            </Button>
          </div>
        </motion.div>
      )}

      {/* Recommendations Grid */}
      <motion.div
        className={`grid gap-4 ${
          compact
            ? 'grid-cols-3 md:grid-cols-6'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
        }`}
        variants={gridVariants}
        onTouchStart={(e) => {
          if (section.refreshable) {
            handleSectionPullStart(e, section.id);
          }
        }}
        onTouchMove={(e) => {
          if (section.refreshable) {
            handleSectionPullMove(e, section.id, sectionRef.current?.scrollTop || 0);
          }
        }}
        onTouchEnd={() => {
          if (section.refreshable) {
            handleSectionPullEnd(section.id);
          }
        }}
      >
        {/* Loading Skeletons */}
        {section.loading && section.items.length === 0 && (
          Array.from({ length: compact ? 6 : 4 }).map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              variants={itemVariants}
            >
              <ProductCardSkeleton compact={compact} />
            </motion.div>
          ))
        )}

        {/* Recommendation Items */}
        <AnimatePresence mode="popLayout">
          {section.items.map((recommendation, index) => (
            <motion.div
              key={`${recommendation.product.id}-${section.id}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              layout
            >
              <RecommendationCard
                recommendation={recommendation}
                position={index}
                sectionId={section.id}
                compact={compact}
                showReason={!compact}
                onClick={onProductClick}
                onSwipeAction={onSwipeAction}
                onLongPressAction={onLongPressAction}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {!section.loading && section.items.length === 0 && !section.error && (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Icon name="package" size="lg" className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              おすすめ商品がありません
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              他の商品を見てみると、おすすめが表示されるかもしれません
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewMore?.('trending')}
              icon={<Icon name="search" size="sm" />}
            >
              人気商品を見る
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Section Footer */}
      {section.items.length > 0 && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => onViewMore?.(section.id)}
            icon={<Icon name="arrow-right" size="sm" />}
            iconPosition="right"
          >
            {section.title}をもっと見る
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default RecommendationSection;