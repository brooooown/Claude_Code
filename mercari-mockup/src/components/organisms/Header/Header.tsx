import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../../molecules/SearchBar';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { useNavigation, useDrawerNavigation } from '../../../hooks/useNavigation';
import { headerVariants, drawerVariants, drawerItemVariants } from '../../../animations/navigationVariants';
import { quickCategories, categories } from '../../../data/categories';

interface HeaderProps {
  showSearch?: boolean;
  showCategories?: boolean;
  showProfile?: boolean;
  transparent?: boolean;
  fixed?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    onClose();
  };

  const menuItems = [
    { label: 'ホーム', path: '/', icon: 'home' as const },
    { label: '検索', path: '/search', icon: 'search' as const },
    { label: 'お気に入り', path: '/favorites', icon: 'heart' as const, badge: 3 },
    { label: 'マイページ', path: '/profile', icon: 'user' as const, badge: 1 },
    { label: '設定', path: '/settings', icon: 'settings' as const }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary">メニュー</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<Icon name="close" />}
                />
              </div>
            </div>

            {/* Main Menu Items */}
            <div className="py-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.path}
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  variants={drawerItemVariants}
                  whileHover="hover"
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                >
                  <Icon name={item.icon} size="md" className="mr-3 text-gray-600" />
                  <span className="flex-1 font-medium text-text-primary">{item.label}</span>
                  {item.badge && (
                    <Badge variant="danger" size="sm" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="border-t border-gray-200">
              <div className="p-4">
                <h3 className="text-sm font-medium text-text-secondary mb-3">カテゴリー</h3>
                <div className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <motion.button
                      key={category.id}
                      className="w-full flex items-center p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                      variants={drawerItemVariants}
                      whileHover="hover"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      <span className="text-sm text-text-primary">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  showCategories = true,
  showProfile = true,
  transparent = false,
  fixed = true,
  onSearch,
  className = ''
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { headerControls, isHeaderVisible } = useNavigation();
  const { isOpen: isMenuOpen, toggleDrawer } = useDrawerNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  const isSearchPage = location.pathname.startsWith('/search');

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      navigate('/search');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  const headerClasses = [
    'w-full',
    transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200',
    fixed ? 'fixed top-0 left-0 right-0 z-30' : 'relative',
    'safe-area-top',
    className
  ].join(' ');

  return (
    <>
      <motion.header
        className={headerClasses}
        variants={headerVariants}
        animate={headerControls}
        initial="visible"
      >
        <div className="container-mercari">
          {/* Main Header Content */}
          <div className="flex items-center h-16 px-4">
            {/* Menu Button (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDrawer}
              icon={<Icon name="menu" size="md" />}
              className="mr-3 lg:hidden"
            />

            {/* Logo */}
            <div className="flex items-center mr-4">
              <h1
                className="text-xl font-bold text-mercari-red cursor-pointer"
                onClick={() => navigate('/')}
              >
                mercari
              </h1>
            </div>

            {/* Desktop Search Bar */}
            {showSearch && !showMobileSearch && (
              <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                <SearchBar
                  placeholder="何をお探しですか？"
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
            )}

            {/* Mobile Search Toggle */}
            {showSearch && !isSearchPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                icon={<Icon name="search" size="md" />}
                className="md:hidden mr-2"
              />
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 ml-auto">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                icon={
                  <Badge variant="danger" size="sm" dot className="absolute -top-1 -right-1">
                    <Icon name="bell" size="md" />
                  </Badge>
                }
                className="relative hidden sm:flex"
              />

              {/* Profile */}
              {showProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  icon={<Icon name="user" size="md" />}
                  className="hidden sm:flex"
                />
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                className="px-4 pb-4 md:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SearchBar
                  placeholder="何をお探しですか？"
                  onSearch={(query) => {
                    handleSearch(query);
                    setShowMobileSearch(false);
                  }}
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Categories */}
          {showCategories && !showMobileSearch && !transparent && (
            <div className="hidden md:block border-t border-gray-100">
              <div className="flex items-center px-4 py-2 space-x-1 overflow-x-auto">
                {quickCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="whitespace-nowrap text-sm"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={toggleDrawer} />

      {/* Header Spacer (when fixed) */}
      {fixed && !transparent && (
        <div className={`${showCategories ? 'h-24' : 'h-16'} md:h-16`} />
      )}
    </>
  );
};

export default Header;