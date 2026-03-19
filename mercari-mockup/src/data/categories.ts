export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
  productCount: number;
  isPopular?: boolean;
}

export interface Subcategory {
  id: string;
  name: string;
  productCount: number;
  tags?: string[];
}

// Main categories structure for Mercari
export const categories: Category[] = [
  {
    id: 'electronics',
    name: '家電・スマホ・カメラ',
    icon: '📱',
    productCount: 1250000,
    isPopular: true,
    subcategories: [
      {
        id: 'smartphone',
        name: 'スマートフォン本体',
        productCount: 350000,
        tags: ['iPhone', 'Android', 'Galaxy', 'Pixel']
      },
      {
        id: 'pc-tablet',
        name: 'PC/タブレット',
        productCount: 280000,
        tags: ['MacBook', 'iPad', 'Surface', 'ノートPC']
      },
      {
        id: 'camera',
        name: 'カメラ',
        productCount: 180000,
        tags: ['一眼レフ', 'ミラーレス', 'デジタルカメラ', 'フィルムカメラ']
      },
      {
        id: 'audio',
        name: 'オーディオ機器',
        productCount: 120000,
        tags: ['イヤホン', 'ヘッドホン', 'スピーカー', 'アンプ']
      },
      {
        id: 'tv-video',
        name: 'テレビ/映像機器',
        productCount: 95000,
        tags: ['テレビ', 'プロジェクター', 'レコーダー', 'チューナー']
      },
      {
        id: 'appliances',
        name: '生活家電',
        productCount: 225000,
        tags: ['冷蔵庫', '洗濯機', '掃除機', 'エアコン']
      }
    ]
  },
  {
    id: 'women',
    name: 'レディース',
    icon: '👗',
    productCount: 2100000,
    isPopular: true,
    subcategories: [
      {
        id: 'tops',
        name: 'トップス',
        productCount: 650000,
        tags: ['Tシャツ', 'ブラウス', 'ニット', 'パーカー']
      },
      {
        id: 'bottoms',
        name: 'ボトムス',
        productCount: 480000,
        tags: ['スカート', 'パンツ', 'ジーンズ', 'レギンス']
      },
      {
        id: 'dresses',
        name: 'ワンピース',
        productCount: 320000,
        tags: ['ワンピース', 'ドレス', 'マキシ', 'ミニ']
      },
      {
        id: 'bags',
        name: 'バッグ',
        productCount: 380000,
        tags: ['ハンドバッグ', 'ショルダーバッグ', 'トートバッグ', 'リュック']
      },
      {
        id: 'shoes',
        name: '靴',
        productCount: 270000,
        tags: ['パンプス', 'スニーカー', 'ブーツ', 'サンダル']
      }
    ]
  },
  {
    id: 'men',
    name: 'メンズ',
    icon: '👕',
    productCount: 1800000,
    isPopular: true,
    subcategories: [
      {
        id: 'tops',
        name: 'トップス',
        productCount: 520000,
        tags: ['Tシャツ', 'シャツ', 'パーカー', 'ニット']
      },
      {
        id: 'bottoms',
        name: 'パンツ',
        productCount: 420000,
        tags: ['ジーンズ', 'スラックス', 'ショーツ', 'チノパン']
      },
      {
        id: 'shoes',
        name: '靴',
        productCount: 380000,
        tags: ['スニーカー', '革靴', 'ブーツ', 'サンダル']
      },
      {
        id: 'bags',
        name: 'バッグ',
        productCount: 180000,
        tags: ['リュック', 'ショルダーバッグ', 'ビジネスバッグ', 'ウエストポーチ']
      },
      {
        id: 'accessories',
        name: 'アクセサリー',
        productCount: 300000,
        tags: ['時計', 'ネックレス', 'リング', 'ブレスレット']
      }
    ]
  },
  {
    id: 'toys-hobbies',
    name: 'おもちゃ・ホビー・グッズ',
    icon: '🎮',
    productCount: 950000,
    isPopular: true,
    subcategories: [
      {
        id: 'games',
        name: '家庭用ゲーム機本体',
        productCount: 180000,
        tags: ['Nintendo Switch', 'PlayStation', 'Xbox', '3DS']
      },
      {
        id: 'game-software',
        name: 'ゲームソフト',
        productCount: 280000,
        tags: ['Switch', 'PS5', 'PS4', 'PC']
      },
      {
        id: 'trading-cards',
        name: 'トレーディングカード',
        productCount: 220000,
        tags: ['ポケモンカード', '遊戯王', 'ワンピースカード', 'MTG']
      },
      {
        id: 'figures',
        name: 'フィギュア',
        productCount: 150000,
        tags: ['アニメ', 'ゲーム', 'ねんどろいど', 'figma']
      },
      {
        id: 'toys',
        name: 'おもちゃ',
        productCount: 120000,
        tags: ['知育玩具', 'ラジコン', 'ぬいぐるみ', 'プラモデル']
      }
    ]
  },
  {
    id: 'beauty',
    name: 'コスメ・香水・美容',
    icon: '💄',
    productCount: 680000,
    subcategories: [
      {
        id: 'base-makeup',
        name: 'ベースメイク',
        productCount: 180000,
        tags: ['ファンデーション', '下地', 'コンシーラー', 'パウダー']
      },
      {
        id: 'point-makeup',
        name: 'ポイントメイク',
        productCount: 220000,
        tags: ['アイシャドウ', 'リップ', 'マスカラ', 'チーク']
      },
      {
        id: 'skincare',
        name: 'スキンケア',
        productCount: 150000,
        tags: ['化粧水', '乳液', '美容液', 'クレンジング']
      },
      {
        id: 'perfume',
        name: '香水',
        productCount: 80000,
        tags: ['レディース香水', 'メンズ香水', 'ユニセックス', '香水小分け']
      },
      {
        id: 'hair-care',
        name: 'ヘアケア',
        productCount: 50000,
        tags: ['シャンプー', 'トリートメント', 'ヘアオイル', 'スタイリング']
      }
    ]
  },
  {
    id: 'sports',
    name: 'スポーツ・レジャー',
    icon: '⚽',
    productCount: 580000,
    subcategories: [
      {
        id: 'training',
        name: 'トレーニング/エクササイズ',
        productCount: 120000,
        tags: ['ダンベル', 'ヨガマット', 'フィットネス', 'ランニング']
      },
      {
        id: 'golf',
        name: 'ゴルフ',
        productCount: 150000,
        tags: ['ゴルフクラブ', 'ゴルフボール', 'ゴルフウェア', 'キャディバッグ']
      },
      {
        id: 'outdoor',
        name: 'アウトドア',
        productCount: 180000,
        tags: ['テント', '寝袋', 'キャンプ用品', '登山用品']
      },
      {
        id: 'sports-wear',
        name: 'スポーツウェア',
        productCount: 130000,
        tags: ['ナイキ', 'アディダス', 'アンダーアーマー', 'ランニングウェア']
      }
    ]
  },
  {
    id: 'books',
    name: '本・音楽・ゲーム',
    icon: '📚',
    productCount: 420000,
    subcategories: [
      {
        id: 'books',
        name: '本',
        productCount: 250000,
        tags: ['小説', '漫画', 'ビジネス書', '参考書']
      },
      {
        id: 'music',
        name: 'CD',
        productCount: 80000,
        tags: ['J-POP', '洋楽', 'クラシック', 'アニソン']
      },
      {
        id: 'dvd',
        name: 'DVD/ブルーレイ',
        productCount: 90000,
        tags: ['映画', 'アニメ', 'ドラマ', 'ドキュメンタリー']
      }
    ]
  }
];

// Quick category navigation for header
export const quickCategories = [
  { name: 'すべて', id: 'all' },
  { name: '家電', id: 'electronics' },
  { name: 'レディース', id: 'women' },
  { name: 'メンズ', id: 'men' },
  { name: 'ゲーム', id: 'toys-hobbies' },
  { name: 'コスメ', id: 'beauty' },
  { name: 'スポーツ', id: 'sports' }
];

// Brand suggestions for search
export const popularBrands = [
  'Apple', 'ナイキ', 'アディダス', 'ルイヴィトン', 'シャネル', 'グッチ',
  'ユニクロ', 'ZARA', 'H&M', 'GU', '無印良品', 'ポケモン', 'Nintendo',
  'PlayStation', 'バンダイ', 'タカラトミー', 'コーセー', '資生堂',
  'SK-II', 'MAC', 'NARS', 'FENDI', 'PRADA', 'COACH'
];