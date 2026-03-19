import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { TabNavigation } from '../../molecules/TabNavigation';
import { ProductCard } from '../../molecules/ProductCard';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { pageVariants } from '../../../animations/pageTransitions';
import { mockProducts, Product } from '../../../data/mockProducts';

interface ProductPageProps {
  onProductLike?: (productId: string) => void;
  onSimilarProductClick?: (product: Product) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({
  onProductLike,
  onSimilarProductClick
}) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      // Simulate loading product details
      setTimeout(() => {
        const foundProduct = mockProducts.find(p => p.id === productId);
        setProduct(foundProduct || null);
        setIsLiked(foundProduct?.isLiked || false);
        setLoading(false);
      }, 300);
    }
  }, [productId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (product && onProductLike) {
      onProductLike(product.id);
    }
  };

  const handleSimilarProductClick = (similarProduct: Product) => {
    if (onSimilarProductClick) {
      onSimilarProductClick(similarProduct);
    } else {
      navigate(`/product/${similarProduct.id}`);
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

  const similarProducts = mockProducts
    .filter(p => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  if (loading) {
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
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </main>
        <TabNavigation />
      </motion.div>
    );
  }

  if (!product) {
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
          <div className="text-center py-12">
            <Icon name="search" size="xl" className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-lg font-bold text-text-primary mb-2">
              商品が見つかりませんでした
            </h2>
            <p className="text-text-secondary mb-6">
              お探しの商品は削除されたか、URLが間違っている可能性があります
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              icon={<Icon name="home" size="sm" />}
            >
              ホームに戻る
            </Button>
          </div>
        </main>
        <TabNavigation />
      </motion.div>
    );
  }

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
        {/* Back Button */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={<Icon name="arrow-left" size="sm" />}
          >
            戻る
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Like Button */}
              <motion.button
                className={`absolute top-4 right-4 p-3 rounded-full ${
                  isLiked
                    ? 'bg-mercari-red text-white'
                    : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100'
                } transition-colors duration-200`}
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon name="heart" size="md" />
              </motion.button>

              {/* Shipping Badge */}
              {product.shippingFee === 'free' && (
                <Badge
                  variant="primary"
                  size="md"
                  className="absolute bottom-4 left-4"
                >
                  送料込み
                </Badge>
              )}

              {/* Discount Badge */}
              {product.originalPrice && (
                <Badge
                  variant="danger"
                  size="md"
                  className="absolute top-4 left-4"
                >
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Additional product images would go here */}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-text-primary mb-3">
                {product.title}
              </h1>

              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-2xl font-bold text-mercari-red">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Badge
                  variant={getConditionColor(product.condition) as any}
                  size="md"
                >
                  {getConditionLabel(product.condition)}
                </Badge>
                <div className="flex items-center space-x-1 text-text-secondary">
                  <Icon name="heart" size="sm" />
                  <span className="text-sm">{product.likes}</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">カテゴリー</span>
                  <div className="font-medium text-text-primary">{product.category}</div>
                </div>
                <div>
                  <span className="text-text-secondary">配送料</span>
                  <div className="font-medium text-text-primary">
                    {product.shippingFee === 'free' ? '送料込み' : '着払い'}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">発送元</span>
                  <div className="font-medium text-text-primary">{product.location}</div>
                </div>
                <div>
                  <span className="text-text-secondary">発送日数</span>
                  <div className="font-medium text-text-primary">{product.shippingDays}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary mb-3">商品の説明</h3>
              <p className="text-text-primary leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="mb-6 p-4 bg-background-secondary rounded-lg">
              <h3 className="text-sm font-medium text-text-secondary mb-2">出品者</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Icon name="user" size="sm" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{product.seller}</div>
                    <div className="flex items-center space-x-1">
                      <Icon name="star" size="xs" className="text-yellow-500" />
                      <span className="text-sm text-text-secondary">{product.sellerRating}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                >
                  出品者のページ
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<Icon name="shopping-cart" size="sm" />}
              >
                購入手続きへ
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={isLiked ? 'danger' : 'outline'}
                  size="md"
                  onClick={handleLike}
                  icon={<Icon name="heart" size="sm" />}
                >
                  {isLiked ? 'いいね解除' : 'いいね'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  icon={<Icon name="share" size="sm" />}
                >
                  シェア
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">
                この商品に似たアイテム
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)}
                icon={<Icon name="arrow-right" size="sm" />}
                iconPosition="right"
              >
                もっと見る
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  compact
                  onClick={handleSimilarProductClick}
                  onLike={onProductLike}
                />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <TabNavigation />
    </motion.div>
  );
};

export default ProductPage;