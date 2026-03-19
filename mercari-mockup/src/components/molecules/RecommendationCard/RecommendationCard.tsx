import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { RecommendationResult, LongPressOption } from '../../../data/recommendationTypes';
import { useRecommendationInteractions } from '../../../hooks/useRecommendationInteractions';
import { useRecommendationTracking } from '../../../hooks/useExistingABTest';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
  position: number;
  sectionId: string;
  compact?: boolean;
  showReason?: boolean;
  onClick?: (productId: string) => void;
  onSwipeAction?: (productId: string, action: 'not_interested' | 'more_like_this') => void;
  onLongPressAction?: (productId: string, action: string) => void;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  position,
  sectionId,
  compact = false,
  showReason = true,
  onClick,
  onSwipeAction,
  onLongPressAction,
  className = ''
}) => {
  const { product, score, reason, algorithm } = recommendation;
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  const { trackImpression, trackClick, trackInteraction } = useRecommendationTracking();

  const {
    cardStates,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleLongPressMenuAction,
    closeLongPressMenu,
    longPressOptions
  } = useRecommendationInteractions({
    onSwipeAction: (productId, action) => {
      trackInteraction(productId, sectionId, algorithm, position, `swipe_${action}`);
      onSwipeAction?.(productId, action);
    },
    onLongPressAction: (productId, action) => {
      trackInteraction(productId, sectionId, algorithm, position, `longpress_${action}`);
      onLongPressAction?.(productId, action);
    },
    onProductClick: (productId) => {
      trackClick(productId, sectionId, algorithm, position);
      onClick?.(productId);
    }
  });

  const cardState = cardStates.get(product.id) || {
    isVisible: true,
    animationState: 'visible' as const,
    swipeOffset: 0,
    isLongPressed: false,
    showMenu: false,
    isRemoving: false
  };

  // Track impression when card becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenViewed) {
          setHasBeenViewed(true);
          trackImpression(product.id, sectionId, algorithm, position);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [product.id, sectionId, algorithm, position, hasBeenViewed, trackImpression]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getReasonBadgeColor = (algo: string) => {
    const colorMap = {
      personalized: 'primary',
      similar_items: 'success',
      trending: 'warning',
      category_based: 'default',
      hybrid: 'primary'
    };
    return colorMap[algo as keyof typeof colorMap] || 'default';
  };

  const getSwipeHint = () => {
    const offset = cardState.swipeOffset;
    if (Math.abs(offset) < 40) return null;

    return offset < 0 ? '興味なし' : 'もっと見る';
  };

  // Animation variants
  const cardVariants = {
    visible: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    swiping: {
      x: cardState.swipeOffset,
      scale: 0.95,
      rotate: cardState.swipeOffset * 0.1,
      transition: { duration: 0.1 }
    },
    removing: {
      x: cardState.swipeOffset > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    },
    longPress: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  if (!cardState.isVisible) return null;

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      variants={cardVariants}
      animate={
        cardState.animationState === 'removing' ? 'removing' :
        cardState.isLongPressed ? 'longPress' :
        Math.abs(cardState.swipeOffset) > 10 ? 'swiping' : 'visible'
      }
      onTouchStart={(e) => handleTouchStart(e, product.id)}
      onTouchMove={(e) => handleTouchMove(e, product.id)}
      onTouchEnd={(e) => handleTouchEnd(e, product.id)}
      onMouseDown={(e) => handleTouchStart(e, product.id)}
      onMouseMove={(e) => handleTouchMove(e, product.id)}
      onMouseUp={(e) => handleTouchEnd(e, product.id)}
      style={{ touchAction: 'none' }}
    >
      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gray-100 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Recommendation Reason Badge */}
          {showReason && reason && (
            <Badge
              variant={getReasonBadgeColor(algorithm) as any}
              size="xs"
              className="absolute top-2 left-2 text-xs"
            >
              {reason}
            </Badge>
          )}

          {/* Confidence Score (for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
              {Math.round(score * 100)}%
            </div>
          )}

          {/* Like Button */}
          <motion.button
            className={`absolute bottom-2 right-2 p-2 rounded-full ${
              product.isLiked
                ? 'bg-mercari-red text-white'
                : 'bg-white bg-opacity-80 text-gray-600'
            } transition-colors duration-200`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              trackInteraction(product.id, sectionId, algorithm, position, 'like');
            }}
          >
            <Icon
              name="heart"
              size="sm"
              className={product.isLiked ? 'text-white' : undefined}
            />
          </motion.button>

          {/* Shipping Fee Badge */}
          {product.shippingFee === 'free' && (
            <Badge
              variant="primary"
              size="sm"
              className="absolute bottom-2 left-2"
            >
              送料込み
            </Badge>
          )}

          {/* Discount Badge */}
          {product.originalPrice && (
            <Badge
              variant="danger"
              size="sm"
              className="absolute top-2 right-2"
            >
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
          {/* Title */}
          <h3 className={`font-medium text-text-primary line-clamp-2 ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className={`font-bold text-mercari-red ${
              compact ? 'text-lg' : 'text-xl'
            }`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Compact Info */}
          {compact && (
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="truncate">{product.location}</span>
              <div className="flex items-center space-x-1">
                <Icon name="heart" size="xs" />
                <span>{product.likes}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Swipe Hint Overlay */}
      <AnimatePresence>
        {getSwipeHint() && (
          <motion.div
            className={`absolute inset-0 flex items-center justify-center rounded-lg ${
              cardState.swipeOffset < 0
                ? 'bg-red-500 bg-opacity-80'
                : 'bg-green-500 bg-opacity-80'
            }`}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center space-x-2 text-white font-bold">
              <Icon
                name={cardState.swipeOffset < 0 ? 'x' : 'heart'}
                size="lg"
              />
              <span>{getSwipeHint()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Long Press Menu */}
      <AnimatePresence>
        {cardState.showMenu && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => closeLongPressMenu(product.id)}
          >
            <div
              className="bg-white rounded-xl p-4 m-4 max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-center mb-4">{product.title}</h3>
              <div className="space-y-2">
                {longPressOptions.map((option) => (
                  <button
                    key={option.id}
                    className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => handleLongPressMenuAction(product.id, option)}
                  >
                    <Icon name={option.icon as any} size="sm" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-gray-500">{option.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecommendationCard;