import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard, ProductCardSkeleton } from '../../molecules/ProductCard';
import { FilterTags } from '../../molecules/FilterTags';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { resultsGridVariants } from '../../../animations/searchAnimations';
import { Product, mockProducts, filterOptions } from '../../../data/mockProducts';

interface SearchResultsProps {
  query?: string;
  categoryId?: string;
  filters?: Record<string, any>;
  loading?: boolean;
  results?: Product[];
  totalCount?: number;
  onFilterChange?: (filters: Record<string, any>) => void;
  onLoadMore?: () => void;
  onProductClick?: (product: Product) => void;
  onProductLike?: (productId: string) => void;
  className?: string;
}

interface SortOption {
  id: string;
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { id: 'relevance', label: '関連度順', value: 'relevance' },
  { id: 'newest', label: '新着順', value: 'newest' },
  { id: 'price_low', label: '価格の安い順', value: 'price_low' },
  { id: 'price_high', label: '価格の高い順', value: 'price_high' },
  { id: 'likes', label: 'いいね数順', value: 'likes' }
];

const SearchResults: React.FC<SearchResultsProps> = ({
  query = '',
  categoryId,
  filters = {},
  loading = false,
  results,
  totalCount = 0,
  onFilterChange,
  onLoadMore,
  onProductClick,
  onProductLike,
  className = ''
}) => {
  const [currentSort, setCurrentSort] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any[]>([]);

  // Use mock data if no results provided
  const displayResults = results || mockProducts.slice(0, 8);
  const displayCount = totalCount || displayResults.length;

  // Convert filters to filter tags
  useEffect(() => {
    const filterTags = [];

    if (filters.condition) {
      const conditionOption = filterOptions.condition.find(opt => opt.value === filters.condition);
      if (conditionOption) {
        filterTags.push({
          id: 'condition',
          label: conditionOption.label,
          value: filters.condition,
          isActive: true
        });
      }
    }

    if (filters.priceRange) {
      const priceOption = filterOptions.priceRange.find(opt => opt.value === filters.priceRange);
      if (priceOption) {
        filterTags.push({
          id: 'priceRange',
          label: priceOption.label,
          value: filters.priceRange,
          isActive: true
        });
      }
    }

    if (filters.shipping) {
      const shippingOption = filterOptions.shipping.find(opt => opt.value === filters.shipping);
      if (shippingOption) {
        filterTags.push({
          id: 'shipping',
          label: shippingOption.label,
          value: filters.shipping,
          isActive: true
        });
      }
    }

    setAppliedFilters(filterTags);
  }, [filters]);

  const handleSortChange = (sortId: string) => {
    setCurrentSort(sortId);
    // Here you would typically trigger a re-fetch with new sort order
  };

  const handleFilterRemove = (filterId: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterId];

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleClearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const currentSortOption = sortOptions.find(opt => opt.id === currentSort);

  return (
    <div className={className}>
      {/* Results Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {query ? `"${query}"の検索結果` : 'すべての商品'}
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              {loading ? '検索中...' : `${displayCount.toLocaleString()}件`}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 10.02h3V6.98h-3v3.04zm0 7h3v-3.04h-3V17zm-4-7h3V6.98H6v3.04zm0 7h3v-3.04H6V17zm-4-7h3V6.98H2v3.04zm0 7h3v-3.04H2V17zm16-10v3.04h3V7h-3zm0 7v3.04h3V14h-3z"/>
              </svg>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
              </svg>
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center flex-wrap gap-2 mb-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon={<Icon name="arrow-down" size="sm" />}
              iconPosition="right"
            >
              {currentSortOption?.label}
            </Button>
          </div>

          {/* Filter Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Icon name="filter" size="sm" />}
          >
            フィルター
          </Button>
        </div>

        {/* Applied Filters */}
        {appliedFilters.length > 0 && (
          <FilterTags
            filters={appliedFilters}
            onFilterRemove={handleFilterRemove}
            onClearAll={handleClearAllFilters}
            className="mb-4"
          />
        )}
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-4'
            }
            variants={resultsGridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {displayResults.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                compact={viewMode === 'grid'}
                onClick={onProductClick}
                onLike={onProductLike}
                delay={index * 0.05}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && displayResults.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Icon name="search" size="xl" className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            商品が見つかりませんでした
          </h3>
          <p className="text-text-secondary mb-6">
            検索条件を変更してお試しください
          </p>
          <Button
            variant="primary"
            onClick={handleClearAllFilters}
            icon={<Icon name="close" size="sm" />}
          >
            フィルターをクリア
          </Button>
        </motion.div>
      )}

      {/* Load More Button */}
      {!loading && displayResults.length > 0 && onLoadMore && (
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={onLoadMore}
            fullWidth
            className="md:w-auto"
          >
            もっと見る
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchResults;