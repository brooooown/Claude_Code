import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './components/templates/HomePage';
import { SearchPage } from './components/templates/SearchPage';
import { CategoryPage } from './components/templates/CategoryPage';
import { ProductPage } from './components/templates/ProductPage';
import { DemoPage } from './components/templates/DemoPage';
import { SearchResultsPage } from './components/organisms/SearchResults';
import { Product } from './data/mockProducts';

// Placeholder pages for complete navigation
const FavoritesPage: React.FC = () => (
  <div className="page-container min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text-primary mb-4">お気に入り</h1>
      <p className="text-text-secondary">いいねした商品が表示されます</p>
    </div>
  </div>
);

const ProfilePage: React.FC = () => (
  <div className="page-container min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text-primary mb-4">マイページ</h1>
      <p className="text-text-secondary">プロフィール情報と取引履歴</p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Global event handlers
  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.title);
  };

  const handleProductLike = (productId: string) => {
    console.log('Product liked:', productId);
  };

  const handleSearch = (query: string) => {
    console.log('Search performed:', query);
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId);
  };

  return (
    <Router>
      <div className="App no-scroll-x">
        <AnimatePresence mode="wait" initial={false}>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <HomePage
                  onProductClick={handleProductClick}
                  onProductLike={handleProductLike}
                  onSearch={handleSearch}
                  onCategoryClick={handleCategoryClick}
                />
              }
            />

            {/* Search Page */}
            <Route
              path="/search"
              element={
                <SearchPage
                  onProductClick={handleProductClick}
                  onProductLike={handleProductLike}
                />
              }
            />

            {/* Demo Page */}
            <Route path="/demo" element={<DemoPage />} />

            {/* Search Results Page (Figma Design) */}
            <Route
              path="/search/results"
              element={<SearchResultsPage />}
            />

            {/* Category Pages */}
            <Route
              path="/category/:categoryId/:subcategoryId?"
              element={
                <CategoryPage
                  onProductClick={handleProductClick}
                  onProductLike={handleProductLike}
                />
              }
            />

            {/* Product Detail Page */}
            <Route
              path="/product/:productId"
              element={
                <ProductPage
                  onProductLike={handleProductLike}
                  onSimilarProductClick={handleProductClick}
                />
              }
            />

            {/* Favorites Page */}
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Profile Page */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App;