import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { TabNavigation } from '../../molecules/TabNavigation';
import { SearchResults } from '../../organisms/SearchResults';
import { FilterPanel } from '../../organisms/FilterPanel';
import { SearchBar } from '../../molecules/SearchBar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { pageVariants } from '../../../animations/pageTransitions';
import { mockProducts, Product, searchSuggestions } from '../../../data/mockProducts';

interface SearchPageProps {
  onProductClick?: (product: Product) => void;
  onProductLike?: (productId: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  onProductClick,
  onProductLike
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlCategory = searchParams.get('category');
    const urlCondition = searchParams.get('condition');
    const urlPriceMin = searchParams.get('priceMin');
    const urlPriceMax = searchParams.get('priceMax');
    const urlShipping = searchParams.get('shipping');
    const urlSort = searchParams.get('sort');

    setQuery(urlQuery);

    const initialFilters: Record<string, any> = {};
    if (urlCategory) initialFilters.category = urlCategory;
    if (urlCondition) initialFilters.condition = urlCondition;
    if (urlPriceMin) initialFilters.priceMin = Number(urlPriceMin);
    if (urlPriceMax) initialFilters.priceMax = Number(urlPriceMax);
    if (urlShipping) initialFilters.shipping = urlShipping;
    if (urlSort) initialFilters.sort = urlSort;

    setFilters(initialFilters);

    // Simulate search on mount
    performSearch(urlQuery, initialFilters);
  }, [searchParams]);

  const performSearch = async (searchQuery: string, searchFilters: Record<string, any> = {}) => {
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock filtering logic
    let filteredResults = mockProducts;

    // Filter by query
    if (searchQuery) {
      filteredResults = filteredResults.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by condition
    if (searchFilters.condition) {
      filteredResults = filteredResults.filter(product => product.condition === searchFilters.condition);
    }

    // Filter by price range
    if (searchFilters.priceMin !== undefined) {
      filteredResults = filteredResults.filter(product => product.price >= searchFilters.priceMin);
    }
    if (searchFilters.priceMax !== undefined) {
      filteredResults = filteredResults.filter(product => product.price <= searchFilters.priceMax);
    }

    // Filter by shipping
    if (searchFilters.shipping) {
      filteredResults = filteredResults.filter(product => product.shippingFee === searchFilters.shipping);
    }

    // Sort results
    if (searchFilters.sort === 'price_low') {
      filteredResults.sort((a, b) => a.price - b.price);
    } else if (searchFilters.sort === 'price_high') {
      filteredResults.sort((a, b) => b.price - a.price);
    } else if (searchFilters.sort === 'likes') {
      filteredResults.sort((a, b) => b.likes - a.likes);
    } else if (searchFilters.sort === 'newest') {
      filteredResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setResults(filteredResults);
    setTotalCount(filteredResults.length);
    setLoading(false);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    updateUrlParams(searchQuery, filters);
    performSearch(searchQuery, filters);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    updateUrlParams(query, newFilters);
    performSearch(query, newFilters);
  };

  const updateUrlParams = (searchQuery: string, searchFilters: Record<string, any>) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('q', searchQuery);
    }

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleLoadMore = () => {
    // Simulate loading more results
    setLoading(true);
    setTimeout(() => {
      const additionalResults = mockProducts.slice(results.length, results.length + 8);
      setResults([...results, ...additionalResults]);
      setLoading(false);
    }, 500);
  };

  const noQuery = !query && Object.keys(filters).length === 0;

  return (
    <motion.div
      className="page-container min-h-screen pb-20"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <Header
        showSearch={false}
        showCategories={false}
      />

      <main className="container-mercari pt-6">
        {/* Search Header */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchBar
            value={query}
            placeholder="何をお探しですか？"
            onSearch={handleSearch}
            autoFocus={noQuery}
            className="mb-4"
          />

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-text-primary">
              {query ? `"${query}"の検索結果` : '商品を検索'}
            </h1>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilterPanel(true)}
              icon={<Icon name="filter" size="sm" />}
              className="md:hidden"
            >
              フィルター
            </Button>
          </div>
        </motion.section>

        {noQuery ? (
          /* Search Suggestions */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">人気のキーワード</h2>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.slice(0, 15).map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(suggestion)}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-background-secondary rounded-lg p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">おすすめカテゴリー</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'iPhone', icon: '📱', query: 'iPhone' },
                  { name: 'スニーカー', icon: '👟', query: 'スニーカー' },
                  { name: 'ブランドバッグ', icon: '👜', query: 'ブランドバッグ' },
                  { name: 'ゲーム', icon: '🎮', query: 'ゲーム' }
                ].map((category) => (
                  <motion.button
                    key={category.name}
                    className="flex flex-col items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(category.query)}
                  >
                    <span className="text-2xl mb-2">{category.icon}</span>
                    <span className="text-sm font-medium text-text-primary">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        ) : (
          /* Search Results */
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <SearchResults
                query={query}
                filters={filters}
                loading={loading}
                results={results}
                totalCount={totalCount}
                onFilterChange={handleFilterChange}
                onLoadMore={results.length < totalCount ? handleLoadMore : undefined}
                onProductClick={handleProductClick}
                onProductLike={onProductLike}
              />
            </div>
          </motion.div>
        )}

        {/* Mobile Filter Panel */}
        <FilterPanel
          isOpen={showFilterPanel}
          filters={filters}
          onClose={() => setShowFilterPanel(false)}
          onFiltersChange={handleFilterChange}
          onApply={(appliedFilters) => {
            handleFilterChange(appliedFilters);
            setShowFilterPanel(false);
          }}
        />
      </main>

      <TabNavigation />
    </motion.div>
  );
};

export default SearchPage;