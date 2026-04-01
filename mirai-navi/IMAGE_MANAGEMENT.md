# 画像管理ガイド - Image Management Guide

## 概要
このプロジェクトの画像リンク切れ対策と管理方針について説明します。

## 現在の状況 ✅
- **すべての画像がローカルアセット**: `assets/` フォルダ内に保存
- **外部画像URL使用なし**: リンク切れリスクなし
- **CDN依存**: lottie-web のみ（安定したCDN使用）

## ディレクトリ構造
```
assets/
├── icons/          # SVGアイコン
├── images/         # UI画像・背景画像
└── items/          # 商品画像（m{id}_{number}.{ext} 形式）
```

## 画像追加時のルール

### 1. 必ずローカルアセットを使用
```html
<!-- ✅ 良い例 -->
<img src="assets/images/new-image.png" alt="説明">

<!-- ❌ 避ける -->
<img src="https://example.com/image.png" alt="説明">
```

### 2. 商品画像の命名規則
```
assets/items/m{商品ID}_{番号}.{拡張子}
例: m12345678901_1.jpg
```

### 3. UI画像の配置
```
assets/images/{機能名}-{説明}.{拡張子}
例: search-event.png, mercari-mobile-4gb.svg
```

## 画像最適化

### サイズ制限
- **1MB以下**: プロジェクトルールに従う
- **1MB超過時**: 以下のコマンドで圧縮
```bash
sips -s format jpeg -s formatOptions 75 -Z 1200 [画像ファイル]
```

### 推奨フォーマット
- **写真**: JPG（圧縮効率）
- **アイコン・ロゴ**: SVG（スケーラブル）
- **透明背景**: PNG

## エラーハンドリング

### 画像読み込み失敗時の対策
```javascript
// 今後実装可能なフォールバック
function handleImageError(img) {
  img.src = 'assets/images/placeholder.png';
  img.alt = '画像を読み込めませんでした';
}
```

## メンテナンス

### 定期チェック項目
1. **未使用画像の削除**: ディスク容量節約
2. **画像サイズチェック**: 1MB制限遵守確認
3. **パス整合性**: HTML内参照と実ファイルの一致確認

### チェックコマンド例
```bash
# 使用されていない画像を見つける
grep -r "assets/" index.html | grep -o "assets/[^\"]*" | sort -u > used_images.txt
find assets/ -type f | sort > all_images.txt
diff used_images.txt all_images.txt
```

## Git管理

### コミット時の注意
- 大きな画像ファイルは事前に最適化
- `.DS_Store` 等の不要ファイルは除外
- 画像変更時は説明的なコミットメッセージを使用

### .gitignore 推奨設定
```
# システムファイル
.DS_Store
Thumbs.db

# 一時ファイル
*.tmp
*.temp
```

---

## 現在の対策状況: 🟢 安全
- リンク切れリスク: **なし**
- 外部依存: **最小限**（lottie-web CDNのみ）
- ローカルアセット: **100%**