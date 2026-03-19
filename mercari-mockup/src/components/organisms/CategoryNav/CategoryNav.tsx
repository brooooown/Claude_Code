import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { breadcrumbVariants, breadcrumbItemVariants } from '../../../animations/navigationVariants';
import { categories, Category, Subcategory } from '../../../data/categories';

interface CategoryNavProps {
  currentCategoryId?: string;
  currentSubcategoryId?: string;
  showBreadcrumb?: boolean;
  showSubcategories?: boolean;
  onCategorySelect?: (categoryId: string) => void;
  onSubcategorySelect?: (categoryId: string, subcategoryId: string) => void;
  className?: string;
}

interface CategoryItemProps {
  category: Category;
  isActive?: boolean;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isActive = false,
  onClick
}) => {
  return (
    <motion.button
      className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-mercari-red text-white shadow-lg'
          : 'bg-white hover:bg-background-secondary border border-gray-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span className="text-2xl mb-2">{category.icon}</span>
      <span className={`text-sm font-medium text-center leading-tight ${
        isActive ? 'text-white' : 'text-text-primary'
      }`}>
        {category.name}
      </span>
      <span className={`text-xs mt-1 ${
        isActive ? 'text-white opacity-80' : 'text-text-secondary'
      }`}>
        {category.productCount.toLocaleString()}
      </span>
      {category.isPopular && (
        <Badge
          variant={isActive ? 'secondary' : 'primary'}
          size="sm"
          className="mt-1"
        >
          人気
        </Badge>
      )}
    </motion.button>
  );
};

interface SubcategoryItemProps {
  subcategory: Subcategory;
  isActive?: boolean;
  onClick: () => void;
}

const SubcategoryItem: React.FC<SubcategoryItemProps> = ({
  subcategory,
  isActive = false,
  onClick
}) => {
  return (
    <motion.button
      className={`flex items-center justify-between p-3 rounded-lg w-full text-left transition-all duration-200 ${
        isActive
          ? 'bg-mercari-red bg-opacity-10 border border-mercari-red'
          : 'hover:bg-background-secondary border border-gray-200'
      }`}
      variants={breadcrumbItemVariants}
      whileHover="hover"
      onClick={onClick}
    >
      <div className="flex-1">
        <span className={`font-medium ${
          isActive ? 'text-mercari-red' : 'text-text-primary'
        }`}>
          {subcategory.name}
        </span>
        <span className="text-sm text-text-secondary ml-2">
          ({subcategory.productCount.toLocaleString()})
        </span>
      </div>
      <Icon
        name="arrow-right"
        size="sm"
        className={isActive ? 'text-mercari-red' : 'text-text-secondary'}
      />
    </motion.button>
  );
};

const CategoryNav: React.FC<CategoryNavProps> = ({
  currentCategoryId,
  currentSubcategoryId,
  showBreadcrumb = true,
  showSubcategories = true,
  onCategorySelect,
  onSubcategorySelect,
  className = ''
}) => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const currentCategory = categories.find(cat => cat.id === currentCategoryId);

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    if (onSubcategorySelect) {
      onSubcategorySelect(categoryId, subcategoryId);
    } else {
      navigate(`/category/${categoryId}/${subcategoryId}`);
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={className}>
      {/* Breadcrumb */}
      {showBreadcrumb && (currentCategory || currentCategoryId) && (
        <motion.nav
          className="mb-6"
          variants={breadcrumbVariants}
          initial="hidden"
          animate="visible"
        >
          <ol className="flex items-center space-x-2 text-sm">
            <motion.li variants={breadcrumbItemVariants}>
              <button
                className="text-text-secondary hover:text-mercari-red transition-colors"
                onClick={() => handleBreadcrumbClick('/')}
              >
                ホーム
              </button>
            </motion.li>
            <Icon name="arrow-right" size="xs" className="text-gray-400" />

            {currentCategory && (
              <>
                <motion.li variants={breadcrumbItemVariants}>
                  <button
                    className="text-text-secondary hover:text-mercari-red transition-colors"
                    onClick={() => handleBreadcrumbClick(`/category/${currentCategory.id}`)}
                  >
                    {currentCategory.name}
                  </button>
                </motion.li>

                {currentSubcategoryId && (
                  <>
                    <Icon name="arrow-right" size="xs" className="text-gray-400" />
                    <motion.li variants={breadcrumbItemVariants}>
                      <span className="text-text-primary font-medium">
                        {currentCategory.subcategories.find(sub => sub.id === currentSubcategoryId)?.name}
                      </span>
                    </motion.li>
                  </>
                )}
              </>
            )}
          </ol>
        </motion.nav>
      )}

      {/* Main Categories Grid */}
      {!currentCategory && (
        <div>
          <h2 className="text-xl font-bold text-text-primary mb-6">カテゴリーから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                isActive={currentCategoryId === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>

          {/* Popular Categories Quick Access */}
          <div className="bg-background-secondary rounded-lg p-4">
            <h3 className="text-sm font-medium text-text-secondary mb-3">人気のカテゴリー</h3>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter(cat => cat.isPopular)
                .map((category) => (
                  <Button
                    key={`popular-${category.id}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="text-xs"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Subcategories */}
      {currentCategory && showSubcategories && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">
              {currentCategory.name}
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/search?category=${currentCategory.id}`)}
              icon={<Icon name="search" size="sm" />}
            >
              すべて見る
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCategory.subcategories.map((subcategory) => (
              <SubcategoryItem
                key={subcategory.id}
                subcategory={subcategory}
                isActive={currentSubcategoryId === subcategory.id}
                onClick={() => handleSubcategoryClick(currentCategory.id, subcategory.id)}
              />
            ))}
          </div>

          {/* Category Tags */}
          {currentCategory.subcategories.some(sub => sub.tags) && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-text-secondary mb-3">人気のタグ</h3>
              <div className="flex flex-wrap gap-2">
                {currentCategory.subcategories
                  .flatMap(sub => sub.tags || [])
                  .slice(0, 12)
                  .map((tag, index) => (
                    <Button
                      key={`tag-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryNav;