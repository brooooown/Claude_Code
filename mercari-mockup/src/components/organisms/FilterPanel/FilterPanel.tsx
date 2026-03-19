import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { QuickFilters } from '../../molecules/FilterTags';
import { modalVariants, backdropVariants } from '../../../animations/pageTransitions';
import { filterOptions } from '../../../data/mockProducts';

interface FilterPanelProps {
  isOpen?: boolean;
  filters?: Record<string, any>;
  onClose?: () => void;
  onFiltersChange?: (filters: Record<string, any>) => void;
  onApply?: (filters: Record<string, any>) => void;
  className?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full py-2 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
        <Icon
          name="arrow-down"
          size="sm"
          className={`transform transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CheckboxOptionProps {
  label: string;
  value: string;
  checked?: boolean;
  count?: number;
  onChange?: (value: string, checked: boolean) => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  label,
  value,
  checked = false,
  count,
  onChange
}) => {
  return (
    <motion.label
      className="flex items-center p-2 hover:bg-background-secondary rounded-md cursor-pointer transition-colors"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(value, e.target.checked)}
        className="sr-only"
      />
      <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
        checked
          ? 'bg-mercari-red border-mercari-red'
          : 'border-gray-300 hover:border-mercari-red'
      }`}>
        {checked && (
          <Icon name="check" size="xs" className="text-white" />
        )}
      </div>
      <span className="flex-1 text-sm text-text-primary">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-text-secondary">({count.toLocaleString()})</span>
      )}
    </motion.label>
  );
};

interface PriceRangeProps {
  minPrice?: number;
  maxPrice?: number;
  onChange?: (min: number, max: number) => void;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice = 0,
  maxPrice = 100000,
  onChange
}) => {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handleMinChange = (value: number) => {
    setLocalMin(value);
    onChange?.(value, localMax);
  };

  const handleMaxChange = (value: number) => {
    setLocalMax(value);
    onChange?.(localMin, value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">最小価格</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-mercari-red focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">最大価格</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-mercari-red focus:border-transparent"
            placeholder="100000"
          />
        </div>
      </div>

      {/* Quick Price Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '～1,000円', min: 0, max: 1000 },
          { label: '1,000～5,000円', min: 1000, max: 5000 },
          { label: '5,000～10,000円', min: 5000, max: 10000 },
          { label: '10,000円～', min: 10000, max: 999999 }
        ].map((range) => (
          <Button
            key={`${range.min}-${range.max}`}
            variant="outline"
            size="sm"
            onClick={() => {
              setLocalMin(range.min);
              setLocalMax(range.max);
              onChange?.(range.min, range.max);
            }}
            className="text-xs"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen = false,
  filters = {},
  onClose,
  onFiltersChange,
  onApply,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(localFilters);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleClear = () => {
    setLocalFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(value => value !== undefined && value !== '').length;
  };

  // Mobile Modal Version
  const MobileFilterModal = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg z-50 max-h-[80vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <FilterContent />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Desktop Sidebar Version
  const DesktopFilterSidebar = () => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <FilterContent />
    </div>
  );

  const FilterContent = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-lg font-bold text-text-primary">フィルター</h2>
          {getActiveFilterCount() > 0 && (
            <Badge variant="primary" size="sm" className="ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              クリア
            </Button>
          )}
          {isOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<Icon name="close" />}
            />
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Filters */}
        <QuickFilters
          filters={[
            { id: 'free_shipping', label: '送料込み', active: localFilters.shipping === 'free' },
            { id: 'new_condition', label: '新品・未使用', active: localFilters.condition === 'new' },
            { id: 'fast_shipping', label: '1~2日で発送', active: localFilters.shippingDays === '1-2' }
          ]}
          onFilterToggle={(id) => {
            if (id === 'free_shipping') {
              handleFilterChange('shipping', localFilters.shipping === 'free' ? '' : 'free');
            } else if (id === 'new_condition') {
              handleFilterChange('condition', localFilters.condition === 'new' ? '' : 'new');
            } else if (id === 'fast_shipping') {
              handleFilterChange('shippingDays', localFilters.shippingDays === '1-2' ? '' : '1-2');
            }
          }}
          className="mb-6"
        />

        {/* Price Range */}
        <FilterSection title="価格" defaultExpanded={!!localFilters.priceMin || !!localFilters.priceMax}>
          <PriceRange
            minPrice={localFilters.priceMin}
            maxPrice={localFilters.priceMax}
            onChange={(min, max) => {
              handleFilterChange('priceMin', min);
              handleFilterChange('priceMax', max);
            }}
          />
        </FilterSection>

        {/* Condition */}
        <FilterSection title="商品の状態" defaultExpanded={!!localFilters.condition}>
          <div className="space-y-2">
            {filterOptions.condition.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                value={option.value}
                checked={localFilters.condition === option.value}
                onChange={(value, checked) => {
                  handleFilterChange('condition', checked ? value : '');
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Shipping */}
        <FilterSection title="配送料の負担" defaultExpanded={!!localFilters.shipping}>
          <div className="space-y-2">
            {filterOptions.shipping.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                value={option.value}
                checked={localFilters.shipping === option.value}
                onChange={(value, checked) => {
                  handleFilterChange('shipping', checked ? value : '');
                }}
              />
            ))}
          </div>
        </FilterSection>

        {/* Shipping Days */}
        <FilterSection title="発送までの日数" defaultExpanded={!!localFilters.shippingDays}>
          <div className="space-y-2">
            {filterOptions.shippingDays.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                value={option.value}
                checked={localFilters.shippingDays === option.value}
                onChange={(value, checked) => {
                  handleFilterChange('shippingDays', checked ? value : '');
                }}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-background-secondary">
          <Button
            variant="primary"
            size="lg"
            onClick={handleApply}
            fullWidth
            disabled={getActiveFilterCount() === 0}
          >
            フィルターを適用
            {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()})`}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Modal */}
      <div className="md:hidden">
        <MobileFilterModal />
      </div>

      {/* Desktop: Sidebar */}
      <div className="hidden md:block">
        <DesktopFilterSidebar />
      </div>
    </>
  );
};

export default FilterPanel;