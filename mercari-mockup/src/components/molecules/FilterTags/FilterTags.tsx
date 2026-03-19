import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterTag } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { filterContainerVariants } from '../../../animations/searchAnimations';

export interface FilterItem {
  id: string;
  label: string;
  value: string;
  count?: number;
  isActive?: boolean;
}

interface FilterTagsProps {
  filters: FilterItem[];
  onFilterRemove?: (filterId: string) => void;
  onClearAll?: () => void;
  showClearAll?: boolean;
  maxVisible?: number;
  className?: string;
}

interface FilterTagsContainerProps {
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const FilterTagsContainer: React.FC<FilterTagsContainerProps> = ({
  title,
  children,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className="mb-4">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-text-primary">{title}</h3>
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              icon={
                <Icon
                  name="arrow-down"
                  size="sm"
                  className={`transform transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              }
              iconPosition="right"
            >
              {isExpanded ? '隠す' : '表示'}
            </Button>
          )}
        </div>
      )}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterTags: React.FC<FilterTagsProps> = ({
  filters,
  onFilterRemove,
  onClearAll,
  showClearAll = true,
  maxVisible = 10,
  className = ''
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const activeFilters = filters.filter(filter => filter.isActive !== false);
  const visibleFilters = showAll ? activeFilters : activeFilters.slice(0, maxVisible);
  const hasMoreFilters = activeFilters.length > maxVisible;

  const handleFilterRemove = (filterId: string) => {
    if (onFilterRemove) {
      onFilterRemove(filterId);
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <motion.div
        className="flex flex-wrap items-center gap-2"
        variants={filterContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <AnimatePresence mode="popLayout">
          {visibleFilters.map((filter) => (
            <FilterTag
              key={filter.id}
              label={`${filter.label}${filter.count ? ` (${filter.count})` : ''}`}
              onRemove={() => handleFilterRemove(filter.id)}
              isActive={filter.isActive !== false}
            />
          ))}
        </AnimatePresence>

        {/* Show More/Less Button */}
        {hasMoreFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              icon={
                <Icon
                  name={showAll ? 'minus' : 'plus'}
                  size="sm"
                />
              }
            >
              {showAll
                ? '表示を減らす'
                : `他 ${activeFilters.length - maxVisible}件`
              }
            </Button>
          </motion.div>
        )}

        {/* Clear All Button */}
        {showClearAll && activeFilters.length > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              icon={<Icon name="close" size="sm" />}
              className="text-text-secondary hover:text-red-500"
            >
              すべて削除
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filter Summary */}
      {activeFilters.length > 0 && (
        <motion.div
          className="mt-3 text-xs text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {activeFilters.length}個のフィルターが適用されています
        </motion.div>
      )}
    </div>
  );
};

// Quick Filter Buttons Component
interface QuickFilterButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface QuickFiltersProps {
  filters: QuickFilterButton[];
  onFilterToggle?: (filterId: string) => void;
  className?: string;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  onFilterToggle,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={filter.active ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onFilterToggle?.(filter.id)}
          icon={filter.icon}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export { FilterTagsContainer };
export default FilterTags;