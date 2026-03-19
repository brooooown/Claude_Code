# アイテムベース推薦システム - デモガイド

## 🚀 システム概要

メルカリのホーム画面に統合されたアイテムベース推薦システムです。従来のキーワードベース推薦から進化し、ユーザーの行動履歴と商品の類似度に基づいて個人化されたおすすめ商品を表示します。

## ✨ 主な機能

### 1. 推薦アルゴリズム
- **パーソナライズド推薦**: ユーザーの閲覧履歴に基づく個人化
- **類似商品推薦**: 商品間の類似度計算による関連商品表示
- **トレンディング推薦**: 人気度と新鮮度を考慮した注目商品
- **ハイブリッド推薦**: 複数アルゴリズムを組み合わせた最適化

### 2. インタラクティブ機能
- **スワイプアクション**:
  - 左スワイプ: 「興味なし」フィードバック
  - 右スワイプ: 「もっと似たもの」リクエスト
- **長押しメニュー**:
  - 推薦理由の表示
  - 興味なし/後で見る/似た商品を見る
- **プルトゥリフレッシュ**: セクション別の推薦内容更新

### 3. A/Bテスト統合
- **Control群 (33%)**: 従来のホーム画面
- **Treatment群 (67%)**: アイテムベース推薦付きホーム画面
- **リアルタイム分析**: ユーザーインタラクションの追跡

## 🎯 A/Bテストの確認方法

### 1. ユーザーID確認
ブラウザの開発者ツール（F12）を開き、Application > Local Storage で以下を確認：
- `mercari_mock_user_id`: 自動生成されたユーザーID
- `ab_test_item_recommendation_home`: A/Bテスト設定

### 2. バリアント確認
```javascript
// コンソールで実行
localStorage.getItem('ab_test_item_recommendation_home')
```

出力例：
```json
{
  "variant": "treatment_basic",
  "userId": "user_abc123def",
  "testName": "item_recommendation_home",
  "startDate": "2024-03-01T00:00:00Z"
}
```

### 3. バリアント別の体験

#### Control群 (`variant: "control"`)
- 従来の「今、注目の商品」セクションのみ表示
- 固定的な商品リスト
- インタラクション機能なし

#### Treatment群 (`variant: "treatment_basic"` または `"treatment_advanced"`)
- **あなたにおすすめ**: パーソナライズされた推薦
- **最近見た商品に関連**: 閲覧履歴ベースの類似商品
- **いま注目のアイテム**: トレンディング推薦
- 完全なインタラクション機能

## 📱 インタラクション機能のテスト

### スワイプアクション（モバイル/タッチデバイス）
1. 推薦商品カードを左にスワイプ → 「興味なし」
2. 推薦商品カードを右にスワイプ → 「もっと似たもの」
3. スワイプ中にヒントオーバーレイが表示される
4. 閾値（80px）を超えるとアクションが実行される

### 長押しメニュー（モバイル/デスクトップ）
1. 推薦商品カードを500ms長押し
2. インタラクションメニューが表示される：
   - 「なぜおすすめ？」: 推薦理由とスコア表示
   - 「興味なし」: ネガティブフィードバック
   - 「後で見る」: ウィッシュリスト追加
   - 「似た商品を見る」: 類似商品優先表示

### プルトゥリフレッシュ
1. 推薦セクション内を下向きに60px以上プル
2. 「プルして更新」→「離して更新」の表示変化
3. 新しい推薦アイテムに自動更新

## 🔍 開発者向けデバッグ機能

### 1. デバッグパネル
開発環境では右下にデバッグパネルが表示：
- セクション数
- 総アイテム数
- ローディング状態
- エラー状態

### 2. 信頼度スコア表示
各推薦カードの右上に信頼度スコア（0-100%）を表示

### 3. A/Bテスト分析
```javascript
// コンソールで実行
const analytics = JSON.parse(localStorage.getItem('recommendation_events') || '[]');
console.table(analytics);
```

### 4. 強制的なバリアント変更
```javascript
// Control群に変更
localStorage.setItem('ab_test_item_recommendation_home', JSON.stringify({
  variant: 'control',
  userId: 'test_user',
  testName: 'item_recommendation_home',
  startDate: new Date().toISOString()
}));

// Treatment群に変更
localStorage.setItem('ab_test_item_recommendation_home', JSON.stringify({
  variant: 'treatment_basic',
  userId: 'test_user',
  testName: 'item_recommendation_home',
  startDate: new Date().toISOString()
}));

// ページをリロード
location.reload();
```

## 📊 推薦アルゴリズムの詳細

### 類似度計算
```
総合スコア = カテゴリ類似度(0.4) + 価格類似度(0.3) + スタイル類似度(0.2) + ブランド類似度(0.1)
```

#### カテゴリ類似度
- 同一カテゴリ: 1.0
- 同一サブカテゴリ: 0.7
- カテゴリパス共通: 0.3
- 異なるカテゴリ: 0.0

#### 価格類似度
```
価格類似度 = min(価格1, 価格2) / max(価格1, 価格2)
```

#### スタイル類似度（Jaccard係数）
```
スタイル類似度 = 共通属性数 / 全属性数
```

### 多様性フィルタ
- 同一カテゴリ: 最大2/6アイテム
- 価格帯分散: 異なる価格セグメントからの選出
- ブランド分散: 連続表示の回避

### 新鮮度スコア
```
新鮮度 = exp(-経過日数 / 30日) + 人気度ブースト(最大0.2)
```

## 🎨 カスタマイズポイント

### 推薦設定の変更
```typescript
const settings = {
  enablePersonalization: true,
  diversityLevel: 'medium', // 'low' | 'medium' | 'high'
  freshnessPreference: 'balanced', // 'latest' | 'balanced' | 'evergreen'
  maxItemsPerSection: 6,
  enableSwipeActions: true,
  enableLongPressMenu: true
};
```

### アルゴリズムの重み調整
```typescript
const weights = {
  category: 0.4,  // カテゴリ重要度
  price: 0.3,     // 価格重要度
  style: 0.2,     // スタイル重要度
  brand: 0.1      // ブランド重要度
};
```

## 🚀 パフォーマンス最適化

### 実装済み
- **メモ化**: 推薦計算結果の5分間キャッシュ
- **レイジーローディング**: 商品画像の遅延読み込み
- **仮想スクロール**: 大量データの効率的表示
- **デバウンス**: インタラクション処理の最適化

### 監視メトリクス
- 推薦計算時間
- レンダリング時間
- キャッシュヒット率
- エラー率

## 📈 成功指標 (KPI)

### Primary Metrics
- **Unique Engaged Items**: セッション内でインタラクションしたユニークアイテム数
- **推薦CTR**: 推薦アイテムのクリック率
- **セッション時間**: ホーム画面滞在時間

### Guardrail Metrics
- **BCR Total**: ビジネスコンバージョン率
- **ATPU Total**: ユーザーあたり平均取引額
- **ページ表示速度**: 2秒以内の初期表示

## 🐛 トラブルシューティング

### よくある問題

#### 推薦が表示されない
1. A/Bテストでcontrol群に割り当てられている
2. ブラウザのJavaScriptが無効
3. ネットワークエラーまたはAPI障害

#### スワイプアクションが動作しない
1. タッチデバイスではない場合、マウスドラッグで代替
2. ブラウザのtouch-actionがブロックされている
3. framer-motionの競合

#### パフォーマンスが遅い
1. 開発者ツールのNetworkタブでリソース読み込み確認
2. Performanceタブでボトルネック特定
3. コンソールでエラーログ確認

### ログの確認
```javascript
// 推薦イベントログ
console.table(JSON.parse(localStorage.getItem('recommendation_events') || '[]'));

// A/Bテスト設定
console.log(JSON.parse(localStorage.getItem('ab_test_item_recommendation_home') || '{}'));

// ユーザー履歴
console.log(localStorage.getItem('mercari_user_history'));
```

## 🔮 今後の拡張計画

### Phase 2 (Week 4+)
- リアルタイム推薦API統合
- 機械学習モデルの導入
- より高度なパーソナライゼーション
- クロスデバイス同期

### Phase 3
- ソーシャル推薦機能
- 音声インタラクション
- AR/VR対応
- 予測的プリフェッチ

---

**開発チーム**: Claude Code Assistant
**最終更新**: 2026年3月16日
**バージョン**: v1.0.0-beta