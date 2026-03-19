import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { resultItemVariants } from '../../../animations/searchAnimations';
import { Product } from '../../../data/mockProducts';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  showSeller?: boolean;
  onClick?: (product: Product) => void;
  onLike?: (productId: string) => void;
  className?: string;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  compact = false,
  showSeller = true,
  onClick,
  onLike,
  className = '',
  delay = 0
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getConditionLabel = (condition: string) => {
    const conditionMap = {
      new: '新品、未使用',
      like_new: '未使用に近い',
      good: '目立った傷や汚れなし',
      fair: 'やや傷や汚れあり',
      poor: '傷や汚れあり'
    };
    return conditionMap[condition as keyof typeof conditionMap] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colorMap = {
      new: 'success',
      like_new: 'primary',
      good: 'default',
      fair: 'warning',
      poor: 'danger'
    };
    return colorMap[condition as keyof typeof colorMap] || 'default';
  };

  return (
    <motion.div
      className={`product-card cursor-pointer ${className}`}
      variants={resultItemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      transition={{ delay }}
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gray-100 ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />

          {/* Like Button */}
          <motion.button
            className={`absolute top-2 right-2 p-2 rounded-full ${
              product.isLiked
                ? 'bg-mercari-red text-white'
                : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
            } transition-colors duration-200`}
            onClick={handleLikeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
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
              className="absolute top-2 left-2"
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

          {!compact && (
            <>
              {/* Condition */}
              <Badge
                variant={getConditionColor(product.condition) as any}
                size="sm"
              >
                {getConditionLabel(product.condition)}
              </Badge>

              {/* Seller Info */}
              {showSeller && (
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="user" size="xs" />
                    <span>{product.seller}</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="star" size="xs" className="text-yellow-500" />
                      <span>{product.sellerRating}</span>
                    </div>
                  </div>
                  <span>{product.location}</span>
                </div>
              )}

              {/* Shipping Info */}
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{product.shippingDays}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="heart" size="xs" />
                  <span>{product.likes}</span>
                </div>
              </div>
            </>
          )}

          {compact && showSeller && (
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span className="truncate">{product.seller}</span>
              <div className="flex items-center space-x-1">
                <Icon name="heart" size="xs" />
                <span>{product.likes}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Product Card Skeleton for loading states
export const ProductCardSkeleton: React.FC<{ compact?: boolean }> = ({
  compact = false
}) => {
  return (
    <div className="product-card animate-pulse">
      <div className={`bg-gray-200 rounded-lg ${compact ? 'aspect-square' : 'aspect-[4/3]'}`} />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        {!compact && (
          <>
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;