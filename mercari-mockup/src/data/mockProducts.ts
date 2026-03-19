export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  category: string;
  subcategory: string;
  seller: string;
  sellerRating: number;
  likes: number;
  isLiked: boolean;
  shippingFee: 'free' | 'buyer_pays';
  shippingDays: string;
  location: string;
  tags: string[];
  description: string;
  createdAt: string;
}

// Mock product data for search and browsing
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro 128GB スペースブラック',
    price: 98000,
    originalPrice: 159800,
    imageUrl: '/api/placeholder/300/300',
    condition: 'like_new',
    category: '家電・スマホ・カメラ',
    subcategory: 'スマートフォン本体',
    seller: 'tech_seller_123',
    sellerRating: 4.8,
    likes: 24,
    isLiked: false,
    shippingFee: 'free',
    shippingDays: '1~2日で発送',
    location: '東京都',
    tags: ['iPhone', 'Apple', 'スマートフォン', '128GB'],
    description: '使用期間3ヶ月の美品です。ケースと保護フィルムを使用していたため傷はありません。',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'ナイキ エアマックス90 26.5cm',
    price: 12800,
    originalPrice: 16500,
    imageUrl: '/api/placeholder/300/300',
    condition: 'good',
    category: 'メンズ',
    subcategory: '靴',
    seller: 'sneaker_fan_45',
    sellerRating: 4.6,
    likes: 15,
    isLiked: true,
    shippingFee: 'buyer_pays',
    shippingDays: '2~3日で発送',
    location: '大阪府',
    tags: ['ナイキ', 'エアマックス', 'スニーカー', '26.5cm'],
    description: '数回履いた程度の美品です。箱はありませんが、シューズバッグに入れて発送します。',
    createdAt: '2024-03-09T15:30:00Z'
  },
  {
    id: '3',
    title: 'ルイヴィトン モノグラム ポシェット・アクセソワール',
    price: 45000,
    originalPrice: 68200,
    imageUrl: '/api/placeholder/300/300',
    condition: 'good',
    category: 'レディース',
    subcategory: 'バッグ',
    seller: 'luxury_items_tokyo',
    sellerRating: 4.9,
    likes: 89,
    isLiked: false,
    shippingFee: 'free',
    shippingDays: '1~2日で発送',
    location: '東京都',
    tags: ['ルイヴィトン', 'モノグラム', 'ポーチ', 'ブランド'],
    description: '正規店購入品です。多少の使用感はありますが、まだまだお使いいただけます。',
    createdAt: '2024-03-08T20:15:00Z'
  },
  {
    id: '4',
    title: 'ポケモンカード 25th Anniversary Collection',
    price: 8500,
    imageUrl: '/api/placeholder/300/300',
    condition: 'new',
    category: 'おもちゃ・ホビー・グッズ',
    subcategory: 'トレーディングカード',
    seller: 'pokemon_collector',
    sellerRating: 4.7,
    likes: 32,
    isLiked: false,
    shippingFee: 'free',
    shippingDays: '1~2日で発送',
    location: '神奈川県',
    tags: ['ポケモンカード', '25周年', 'コレクション', '未開封'],
    description: '未開封品です。コレクション整理のため出品します。',
    createdAt: '2024-03-07T12:45:00Z'
  },
  {
    id: '5',
    title: 'UNIQLO ヒートテックウルトラウォームクルーネックT',
    price: 800,
    originalPrice: 1290,
    imageUrl: '/api/placeholder/300/300',
    condition: 'like_new',
    category: 'レディース',
    subcategory: 'トップス',
    seller: 'closet_clearance',
    sellerRating: 4.5,
    likes: 7,
    isLiked: false,
    shippingFee: 'buyer_pays',
    shippingDays: '4~7日で発送',
    location: '愛知県',
    tags: ['ユニクロ', 'ヒートテック', 'Mサイズ', '黒'],
    description: '1回着用のみの美品です。サイズが合わないため出品します。',
    createdAt: '2024-03-06T08:20:00Z'
  },
  {
    id: '6',
    title: 'MacBook Air M2 13インチ 256GB',
    price: 135000,
    originalPrice: 164800,
    imageUrl: '/api/placeholder/300/300',
    condition: 'like_new',
    category: '家電・スマホ・カメラ',
    subcategory: 'PC/タブレット',
    seller: 'apple_products_pro',
    sellerRating: 5.0,
    likes: 156,
    isLiked: true,
    shippingFee: 'free',
    shippingDays: '1~2日で発送',
    location: '東京都',
    tags: ['MacBook', 'Apple', 'M2チップ', '13インチ'],
    description: '購入後3ヶ月使用。動作良好、外観も綺麗です。充電器、外箱付き。',
    createdAt: '2024-03-05T16:10:00Z'
  },
  {
    id: '7',
    title: 'アディダス スタンスミス ホワイト 25cm',
    price: 6800,
    originalPrice: 11000,
    imageUrl: '/api/placeholder/300/300',
    condition: 'good',
    category: 'レディース',
    subcategory: '靴',
    seller: 'shoes_collection_jp',
    sellerRating: 4.4,
    likes: 23,
    isLiked: false,
    shippingFee: 'buyer_pays',
    shippingDays: '2~3日で発送',
    location: '福岡県',
    tags: ['アディダス', 'スタンスミス', 'スニーカー', '25cm'],
    description: '数回使用しました。ソールに多少の汚れがありますが、全体的に良好です。',
    createdAt: '2024-03-04T11:55:00Z'
  },
  {
    id: '8',
    title: 'Nintendo Switch 有機ELモデル ホワイト',
    price: 32000,
    originalPrice: 37980,
    imageUrl: '/api/placeholder/300/300',
    condition: 'like_new',
    category: 'おもちゃ・ホビー・グッズ',
    subcategory: '家庭用ゲーム機本体',
    seller: 'gaming_gear_seller',
    sellerRating: 4.8,
    likes: 67,
    isLiked: false,
    shippingFee: 'free',
    shippingDays: '1~2日で発送',
    location: '千葉県',
    tags: ['Nintendo Switch', '有機EL', 'ゲーム機', 'ホワイト'],
    description: '購入後あまり使用せず、ほぼ新品状態です。付属品完備。',
    createdAt: '2024-03-03T14:30:00Z'
  }
];

// Search suggestions based on popular searches
export const searchSuggestions = [
  'iPhone',
  'MacBook',
  'ナイキ スニーカー',
  'ルイヴィトン バッグ',
  'ポケモンカード',
  'Nintendo Switch',
  'アディダス',
  'UNIQLO',
  'iPad',
  'Apple Watch',
  'エアマックス',
  'モノグラム',
  'ヒートテック',
  'ゲーミングチェア',
  '化粧品'
];

// Recent searches (mock user data)
export const recentSearches = [
  'iPhone 15',
  'ナイキ スニーカー',
  'MacBook Air',
  'ポケモンカード'
];

// Popular categories for quick access
export const popularCategories = [
  { name: '家電・スマホ・カメラ', icon: '📱', count: 1250000 },
  { name: 'レディース', icon: '👗', count: 2100000 },
  { name: 'メンズ', icon: '👕', count: 1800000 },
  { name: 'おもちゃ・ホビー・グッズ', icon: '🎮', count: 950000 },
  { name: 'コスメ・香水・美容', icon: '💄', count: 680000 },
  { name: 'スポーツ・レジャー', icon: '⚽', count: 580000 }
];

// Filter options
export const filterOptions = {
  condition: [
    { label: '新品、未使用', value: 'new' },
    { label: '未使用に近い', value: 'like_new' },
    { label: '目立った傷や汚れなし', value: 'good' },
    { label: 'やや傷や汚れあり', value: 'fair' },
    { label: '傷や汚れあり', value: 'poor' }
  ],
  priceRange: [
    { label: '～1,000円', value: '0-1000' },
    { label: '1,000円～5,000円', value: '1000-5000' },
    { label: '5,000円～10,000円', value: '5000-10000' },
    { label: '10,000円～50,000円', value: '10000-50000' },
    { label: '50,000円～', value: '50000-999999' }
  ],
  shipping: [
    { label: '送料込み', value: 'free' },
    { label: '着払い', value: 'buyer_pays' }
  ],
  shippingDays: [
    { label: '1~2日で発送', value: '1-2' },
    { label: '2~3日で発送', value: '2-3' },
    { label: '4~7日で発送', value: '4-7' }
  ]
};