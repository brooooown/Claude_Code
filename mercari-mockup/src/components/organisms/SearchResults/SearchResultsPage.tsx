import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { FilterTag } from '../../atoms/Badge';

// Define the product interface
interface Product {
  id: string;
  image: string;
  price: number;
  isLiked: boolean;
  status?: 'SOLD' | null;
}

// Mock product data matching the Figma design
const searchResults: Product[] = [
  {
    id: '1',
    image: 'https://www.figma.com/api/mcp/asset/94524cc8-4252-434c-ba7b-4ebb87af69b6',
    price: 10000,
    isLiked: true
  },
  {
    id: '2',
    image: 'https://www.figma.com/api/mcp/asset/e1db2271-abc5-461d-a899-8174d1db0f5b',
    price: 5000,
    isLiked: true
  },
  {
    id: '3',
    image: 'https://www.figma.com/api/mcp/asset/31e3a7cd-9b57-4fb1-9098-fd9f21455d5a',
    price: 25000,
    isLiked: false
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Sneaker',
    price: 8000,
    isLiked: true,
    status: 'SOLD'
  },
  {
    id: '5',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Jordan',
    price: 120000,
    isLiked: false
  },
  {
    id: '6',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Air',
    price: 4000,
    isLiked: true
  },
  {
    id: '7',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Nike',
    price: 2580,
    isLiked: true,
    status: 'SOLD'
  },
  {
    id: '8',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Basketball',
    price: 4800,
    isLiked: true,
    status: 'SOLD'
  },
  {
    id: '9',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Retro',
    price: 9999,
    isLiked: true
  },
  {
    id: '10',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Chicago',
    price: 15800,
    isLiked: false
  },
  {
    id: '11',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Bred',
    price: 18500,
    isLiked: false
  },
  {
    id: '12',
    image: 'https://via.placeholder.com/124x124/f5f5f5/333333?text=Royal',
    price: 22000,
    isLiked: false
  }
];

interface ProductCardProps {
  product: Product;
  onLikeToggle: (id: string) => void;
  onProductClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onLikeToggle, onProductClick }) => {
  return (
    <motion.div
      className="relative bg-gray-100 overflow-hidden cursor-pointer"
      style={{
        width: '123.67px',
        height: '123.67px'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onProductClick(product.id)}
    >
      {/* Product Image */}
      <img
        src={product.image}
        alt={`Product ${product.id}`}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Heart Icon */}
      <button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle(product.id);
        }}
      >
        <Icon
          name={product.isLiked ? 'heart' : 'heart'}
          size="sm"
          className={product.isLiked ? 'text-red-500' : 'text-white'}
        />
      </button>

      {/* Price Tag */}
      <div className="absolute bottom-0 left-0">
        <div
          className="bg-black bg-opacity-40 text-white px-2 py-1 rounded-tr-3xl rounded-br-3xl"
          style={{
            paddingLeft: '4px',
            paddingRight: '8px',
            paddingTop: '2px',
            paddingBottom: '2px'
          }}
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-bold">¥</span>
            <span className="text-sm font-bold">{product.price.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sold Overlay */}
      {product.status === 'SOLD' && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            SOLD
          </div>
        </div>
      )}
    </motion.div>
  );
};

interface SearchHeaderProps {
  searchQuery: string;
  onBack: () => void;
  onFilterRemove: (filter: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ searchQuery, onBack, onFilterRemove }) => {
  return (
    <div className="bg-white px-4 py-3 space-y-3">
      {/* Status Bar Simulation */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <Icon name="wifi" size="sm" />
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-full h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          icon={<Icon name="arrow-left" size="md" />}
          onClick={onBack}
        >
        </Button>

        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <Icon name="search" size="sm" className="text-gray-500 mr-2" />
            <span className="flex-1 text-sm">{searchQuery}</span>
            <Button
              variant="ghost"
              size="sm"
              icon={<Icon name="close" size="sm" className="text-gray-500" />}
              onClick={() => onFilterRemove('search')}
            >
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
          <Icon name="star" size="xs" className="mr-1" />
          かんたん取り込み
        </div>

        <FilterTag label="新品、未使用" onRemove={() => onFilterRemove('condition')} />
        <FilterTag label="未使用に近い" onRemove={() => onFilterRemove('condition2')} />
      </div>

      {/* Filter Options */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            販売中のみ
          </label>
          <div className="flex items-center gap-2">
            <Icon name="sort" size="sm" />
            <span>おすすめ順</span>
            <Icon name="arrow-down" size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="filter" size="sm" />
          <span>絞り込み</span>
        </div>
      </div>
    </div>
  );
};

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(searchResults);

  const handleLikeToggle = (productId: string) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, isLiked: !product.isLiked }
          : product
      )
    );
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };


  const handleFilterRemove = (filter: string) => {
    // Handle filter removal
    console.log('Filter removed:', filter);
  };

  const handleSaveSearch = () => {
    // Handle save search
    console.log('Save search');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <SearchHeader
        searchQuery="Air Jordan"
        onBack={handleBack}
        onFilterRemove={handleFilterRemove}
      />

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="grid grid-cols-3 gap-0.5 p-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLikeToggle={handleLikeToggle}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      </div>

      {/* Save Search Button */}
      <div className="bg-white px-4 pt-4 pb-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSaveSearch}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3"
          icon={<Icon name="heart" size="sm" />}
        >
          この検索条件を保存する
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center">
            <Icon name="home" size="md" className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">ホーム</span>
          </button>
          <button className="flex flex-col items-center">
            <Icon name="heart" size="md" className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">いいね!</span>
          </button>
          <button className="flex flex-col items-center">
            <Icon name="camera" size="md" className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">出品</span>
          </button>
          <button className="flex flex-col items-center">
            <Icon name="auction" size="md" className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">オークション</span>
          </button>
          <button className="flex flex-col items-center">
            <Icon name="wallet" size="md" className="text-gray-600 mb-1" />
            <span className="text-xs text-gray-600">おさいふ</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center mt-2">
          <div
            className="bg-black rounded-full"
            style={{ width: '144px', height: '5px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;