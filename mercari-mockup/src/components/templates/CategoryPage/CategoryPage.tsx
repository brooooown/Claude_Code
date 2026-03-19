import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { TabNavigation } from '../../molecules/TabNavigation';
import { CategoryNav } from '../../organisms/CategoryNav';
import { SearchResults } from '../../organisms/SearchResults';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { pageVariants } from '../../../animations/pageTransitions';
import { categories, Category, Subcategory } from '../../../data/categories';
import { mockProducts, Product } from '../../../data/mockProducts';

interface CategoryPageProps {
  onProductClick?: (product: Product) => void;
  onProductLike?: (productId: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  onProductClick,
  onProductLike
}) => {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);

  useEffect(() => {
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      setCurrentCategory(category || null);

      if (subcategoryId && category) {
        const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
        setCurrentSubcategory(subcategory || null);
      } else {
        setCurrentSubcategory(null);
      }

      // Simulate loading products for this category
      loadCategoryProducts(categoryId, subcategoryId);
    }
  }, [categoryId, subcategoryId]);

  const loadCategoryProducts = async (catId: string, subCatId?: string) => {
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock filtering - in real app this would be an API call
    let filteredProducts = mockProducts.filter(product => {
      const category = categories.find(cat => cat.id === catId);
      if (!category) return false;

      // Simple category matching based on product category
      return product.category.includes(category.name.split('・')[0]);
    });

    // If subcategory is specified, further filter
    if (subCatId && currentCategory) {
      const subcategory = currentCategory.subcategories.find(sub => sub.id === subCatId);
      if (subcategory) {
        filteredProducts = filteredProducts.filter(product => {
          // Simple subcategory matching
          return product.subcategory?.includes(subcategory.name) ||
                 subcategory.tags?.some(tag =>
                   product.title.toLowerCase().includes(tag.toLowerCase()) ||
                   product.tags.some(productTag => productTag.toLowerCase().includes(tag.toLowerCase()))
                 );
        });
      }
    }

    setProducts(filteredProducts);
    setTotalCount(filteredProducts.length);
    setLoading(false);
  };

  const handleCategorySelect = (selectedCategoryId: string) => {
    navigate(`/category/${selectedCategoryId}`);
  };

  const handleSubcategorySelect = (selectedCategoryId: string, selectedSubcategoryId: string) => {
    navigate(`/category/${selectedCategoryId}/${selectedSubcategoryId}`);
  };

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleViewAllProducts = () => {
    if (currentCategory) {
      if (subcategoryId) {
        navigate(`/search?category=${categoryId}&subcategory=${subcategoryId}`);
      } else {
        navigate(`/search?category=${categoryId}`);
      }
    }
  };

  const getPageTitle = () => {
    if (currentSubcategory && currentCategory) {
      return `${currentCategory.name} - ${currentSubcategory.name}`;
    }
    if (currentCategory) {
      return currentCategory.name;
    }
    return 'カテゴリー';
  };

  const showProductGrid = currentCategory && products.length > 0;

  return (
    <motion.div
      className="page-container min-h-screen pb-20"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <Header />

      <main className="container-mercari pt-6">
        {/* Page Header */}
        <motion.section
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">
              {getPageTitle()}
            </h1>

            {currentCategory && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/categories')}
                icon={<Icon name="arrow-left" size="sm" />}
              >
                戻る
              </Button>
            )}
          </div>

          {/* Category Description */}
          {currentCategory && (
            <div className="bg-background-secondary rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{currentCategory.icon}</span>
                <div>
                  <h2 className="font-medium text-text-primary">{currentCategory.name}</h2>
                  <p className="text-sm text-text-secondary">
                    {currentCategory.productCount.toLocaleString()}点の商品
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.section>

        {/* Category Navigation */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CategoryNav
            currentCategoryId={categoryId}
            currentSubcategoryId={subcategoryId}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
          />
        </motion.section>

        {/* Products Section */}
        {showProductGrid && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">
                {currentSubcategory ? currentSubcategory.name : '人気の商品'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewAllProducts}
                icon={<Icon name="arrow-right" size="sm" />}
                iconPosition="right"
              >
                すべて見る
              </Button>
            </div>

            <SearchResults
              loading={loading}
              results={products.slice(0, 12)}
              totalCount={totalCount}
              onProductClick={handleProductClick}
              onProductLike={onProductLike}
              className="mb-8"
            />

            {/* Show More Button */}
            {products.length > 12 && (
              <div className="text-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleViewAllProducts}
                  fullWidth
                  className="md:w-auto"
                  icon={<Icon name="search" size="sm" />}
                >
                  もっと見る ({(totalCount - 12).toLocaleString()}件)
                </Button>
              </div>
            )}
          </motion.section>
        )}

        {/* Empty State - No Category Selected */}
        {!categoryId && (
          <motion.section
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <Icon name="search" size="xl" className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-lg font-bold text-text-primary mb-2">
                カテゴリーを選択してください
              </h2>
              <p className="text-text-secondary">
                興味のあるカテゴリーから商品を探してみましょう
              </p>
            </div>
          </motion.section>
        )}

        {/* Empty State - No Products */}
        {categoryId && currentCategory && products.length === 0 && !loading && (
          <motion.section
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-6">
              <span className="text-4xl mb-4 block">{currentCategory.icon}</span>
              <h2 className="text-lg font-bold text-text-primary mb-2">
                このカテゴリーに商品がありません
              </h2>
              <p className="text-text-secondary mb-6">
                他のカテゴリーもチェックしてみましょう
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/categories')}
                icon={<Icon name="arrow-left" size="sm" />}
              >
                カテゴリー一覧に戻る
              </Button>
            </div>
          </motion.section>
        )}
      </main>

      <TabNavigation />
    </motion.div>
  );
};

export default CategoryPage;