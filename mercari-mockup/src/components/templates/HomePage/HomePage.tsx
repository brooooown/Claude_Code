import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { TabNavigation } from '../../molecules/TabNavigation';
import { SearchBar } from '../../molecules/SearchBar';
import { ProductCard } from '../../molecules/ProductCard';
import { CategoryNav } from '../../organisms/CategoryNav';
import { ItemRecommendations } from '../../organisms/ItemRecommendations';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { pageVariants } from '../../../animations/pageTransitions';
import { resultsGridVariants } from '../../../animations/searchAnimations';
import { mockProducts, popularCategories, Product } from '../../../data/mockProducts';
import { EnhancedProduct } from '../../../data/enhancedMockProducts';
import { useExistingABTest } from '../../../hooks/useExistingABTest';

interface HomePageProps {
  onSearch?: (query: string) => void;
  onProductClick?: (product: Product) => void;
  onProductLike?: (productId: string) => void;
  onCategoryClick?: (categoryId: string) => void;
  onProductView?: (product: EnhancedProduct) => void;
  onViewMoreSection?: (sectionId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onProductClick,
  onProductLike,
  onCategoryClick,
  onProductView,
  onViewMoreSection
}) => {
  const navigate = useNavigate();

  // A/B test integration for recommendations
  const { shouldShowRecommendations, variant, trackEvent } = useExistingABTest('item_recommendation_home');

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryId);
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  // Handle recommendation product clicks
  const handleRecommendationClick = (productId: string) => {
    // Track recommendation click
    trackEvent({
      eventType: 'click',
      productId,
      sectionId: 'recommendations',
      algorithm: 'hybrid',
      position: 0
    });

    navigate(`/product/${productId}`);
  };

  // Handle product view for recommendation learning
  const handleProductView = (product: EnhancedProduct) => {
    onProductView?.(product);
  };

  // Handle view more section
  const handleViewMoreSection = (sectionId: string) => {
    trackEvent({
      eventType: 'interaction',
      productId: '',
      sectionId,
      algorithm: 'hybrid',
      position: 0,
      metadata: { action: 'view_more' }
    });

    if (onViewMoreSection) {
      onViewMoreSection(sectionId);
    } else {
      navigate(`/recommendations/${sectionId}`);
    }
  };

  const recentProducts = mockProducts.slice(0, 8);
  const trendingProducts = mockProducts.slice(2, 6);

  return (
    <motion.div
      className="page-container min-h-screen pb-20"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <Header onSearch={handleSearch} />

      <main className="container-mercari pt-6">
        {/* Hero Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-mercari-red to-mercari-red-light rounded-xl p-6 text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">かんたん、安心、おトクに売買</h1>
            <p className="text-mercari-red-light mb-4">
              いらないものをかんたんに出品、欲しいものをサクッと購入
            </p>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/sell')}
                icon={<Icon name="camera" size="sm" />}
              >
                出品する
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/search')}
                icon={<Icon name="search" size="sm" />}
                className="border-white text-white hover:bg-white hover:text-mercari-red"
              >
                さがす
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="何をお探しですか？"
              onSearch={handleSearch}
            />
          </div>
        </motion.section>

        {/* Quick Categories */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">カテゴリーから探す</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/categories')}
              icon={<Icon name="arrow-right" size="sm" />}
              iconPosition="right"
            >
              すべて見る
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <motion.button
                key={category.name}
                className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-mercari-red hover:shadow-md transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-xs text-center font-medium text-text-primary leading-tight">
                  {category.name}
                </span>
                <span className="text-xs text-text-secondary mt-1">
                  {(category.count / 10000).toFixed(0)}万点
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Products */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">最近出品された商品</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/search?sort=newest')}
              icon={<Icon name="arrow-right" size="sm" />}
              iconPosition="right"
            >
              もっと見る
            </Button>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={resultsGridVariants}
            initial="hidden"
            animate="visible"
          >
            {recentProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onClick={handleProductClick}
                onLike={onProductLike}
                delay={index * 0.05}
              />
            ))}
          </motion.div>
        </motion.section>

        {/* Item Recommendations Section - A/B Test */}
        {shouldShowRecommendations && (
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <ItemRecommendations
              onProductClick={handleRecommendationClick}
              onProductView={handleProductView}
              onViewMoreSection={handleViewMoreSection}
            />
          </motion.section>
        )}

        {/* Trending Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-background-secondary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-text-primary">今、注目の商品</h2>
                <Badge variant="primary" size="sm" className="ml-2">
                  HOT
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/search?sort=trending')}
                icon={<Icon name="arrow-right" size="sm" />}
                iconPosition="right"
              >
                もっと見る
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingProducts.map((product, index) => (
                <ProductCard
                  key={`trending-${product.id}`}
                  product={product}
                  compact
                  showSeller={false}
                  onClick={handleProductClick}
                  onLike={onProductLike}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">メルカリの特長</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-mercari-red mb-3">
                <Icon name="shield" size="lg" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">安心・安全</h3>
              <p className="text-sm text-text-secondary">
                独自の取引システムで、商品代金はメルカリが一時お預かり。商品が届いてから出品者に支払われます。
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-mercari-red mb-3">
                <Icon name="camera" size="lg" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">かんたん出品</h3>
              <p className="text-sm text-text-secondary">
                スマホでサクッと写真を撮って、商品情報を入力するだけ。3分で出品完了！
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-mercari-red mb-3">
                <Icon name="shopping-cart" size="lg" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">豊富な商品</h3>
              <p className="text-sm text-text-secondary">
                ファッション、家電、エンタメなど、2億点以上の商品から欲しいものが見つかる。
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <TabNavigation />
    </motion.div>
  );
};

export default HomePage;