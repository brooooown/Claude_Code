# iOS App Prototype

iOSアプリのWebプロトタイプです。単一の `index.html` で全画面を管理しています

## 起動方法

### A. ブラウザで閲覧する

GitHub Pages の URL にアクセスするだけで動作します。インストール不要です。

```
https://mhigashino.github.io/prototype/
```

パスワードは<a href="https://www.notion.so/Passwrod-2707fa9ffaef81b8a781cdcbfadd2a8f" target="_blank">こちら</a>

### B. Claude Code で追加開発する

リポジトリをクローンし、Claude Code で開発します。

```bash
git clone https://github.com/mhigashino/prototype.git /users/your-directory  # ← クローン先は自分の環境に合わせて変更
```

プロジェクトルートで `claude` を起動するだけで、`.claude/skills/ds-prototype/` のスキルが自動的に読み込まれます。ブラウザで確認する場合はサーバー不要で `index.html` を直接開くだけで動作します。

### パスワード認証

ページを開くとパスワード入力が求められます。初期パスワードは<a href="https://www.notion.so/Passwrod-2707fa9ffaef81b8a781cdcbfadd2a8f" target="_blank">こちら</a>です。

各自の環境では自分のパスワードに変更することを推奨します。

- Claude Code に「パスワードを〇〇に変更して」と伝えるだけで変更できます
- `index.html` 冒頭の `PASS` 変数を直接編集することもできます

```js
var PASS = 'PASS'; // ← ここを変更
```

## バージョン管理

### バージョン番号

`index.html` 冒頭の `VERSION` 変数でバージョンを管理しています

```js
var VERSION = 'v1.0'; // ← ここを変更
```

変更すると、以下に自動で反映されます：

- パスワードプロンプトのタイトル → `prototype（v1.0）`
- マイページのバージョン表示 → `prototype（v1.0）`


## 環境・表示について

### リロード

以下のタイミングで自動的にリロードされ、GitHub Pages の最新版が反映されます

- **Pull to Refresh** — ホーム・オークション・出品・おさいふタブでスクロール最上部から下に引く（閾値まで引いて離すとリロード）
- **タブ復帰時** — 別タブやアプリから戻ったとき（`visibilitychange`）

### 画面ジェスチャーについて

各画面・パネルは `overscroll-behavior` と `overflow: hidden` の多層構成で、引っ張り操作による意図しない画面露出を防いでいます。

- **Pull to Refresh** は ホーム・オークション・出品・おさいふ の4タブのみ対応（検索画面はリロードされません）
- 検索画面では横スワイプをブロックしています（フィルターチップバーの横スクロールは除く）
- マイページは左端からの右スワイプで開きますが、検索画面・各パネル表示中は無効になります

### Safari PWA（推奨）

iPhoneのSafariで開き、「ホーム画面に追加」するとPWAとして起動できます。OSのアドレスバーやタブバーが非表示になり、よりネイティブアプリに近い見た目で確認できます

1. SafariでGitHub PagesのURLを開く
2. 共有ボタン → 「ホーム画面に追加」
3. ホーム画面のアイコンから起動

## Claude Code スキル

このリポジトリには `.claude/skills/ds-prototype/` にプロジェクト固有のスキルが含まれています

- `ds-prototype` — Mercari DS4 のデザイントークン・コンポーネントルールをまとめたスキルです
- リポジトリをcloneすると `SKILL.md` も一緒にコピーされます
- プロジェクトローカルのスキルはグローバルに設定されたスキルより優先して適用されるため、このリポジトリ内では `ds-prototype` が自動的に参照されます

## ファイル構成

```
index.html               # メインファイル（全画面・CSS・JSを含む）
assets/
  items/                 # 商品画像（Google Driveから取得した実商品画像）
  images/                # その他画像（UI素材・背景等）
  icons/
    fill/                # Fill スタイルSVGアイコン（119個）
    outline/             # Outline スタイルSVGアイコン（185個）
CLAUDE.md                # Claude Code向け開発ルール
.claude/
  skills/
    ds-prototype/
      SKILL.md           # DS4デザインシステムスキル定義
```

### アイコンについて

`assets/icons/` には [kouzoh/merui-web](https://github.com/kouzoh/merui-web) の `@kouzoh/merui-icons` パッケージからコピーしたSVGアイコンが格納されています。

- `assets/icons/fill/` — Fill スタイル（119個）
- `assets/icons/outline/` — Outline スタイル（185個）

使用する際はSVGファイルをインラインで展開し、`color` CSSプロパティで色を制御してください。

## Lottieアニメーション

アニメーションには [lottie-web](https://github.com/airbnb/lottie-web) を使用しています。

- CDN経由で読み込み（`<head>` 内の `<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js">`）
- JSONファイルは `assets/images/` に配置
- `lottie.loadAnimation()` で初期化し、2回目以降は `goToAndPlay(0, true)` で再生

現在使用中のアニメーション：
- `assets/images/mike-THX.json` — 購入完了ダイアログ（`#purchase-lottie`）

## 開発ルール

- CSS・JSはすべて `index.html` 内にインラインで記述
- デザインシステムは Mercari DS4 のトークン・コンポーネント仕様に準拠（`ds-prototype` スキル参照）
- 追加・更新する画像は 1MB以下 にすること（超える場合は `sips -s format jpeg -s formatOptions 75 -Z 1200` で圧縮）
- 変更後は必ず commit & push する

## 注意事項

### 商品画像について

商品画像は `assets/items/` フォルダのものを使用しています。

画像は過去施策で収集した実際のメルカリ商品画像を使用しており、[Google Drive](https://drive.google.com/drive/folders/1m04yIziHoVsNBr1ELR3zh2EDIA8TaihV?usp=drive_link) で管理されています。画像選定基準は [How to Choose Item Images (Notion)](https://www.notion.so/How-to-Choose-Item-Images-2767fa9ffaef80efaf3beb3efa8cca31) を参照してください。

- 社内でのプロトタイプ確認・検討目的での利用は問題ありません
- 社外への公開・共有は基本NGです（GitHub Pages のURLの取り扱いにご注意ください）

### このプロトタイプについて

- あくまでデザイン検討用のプロトタイプとして擬似的に構築されたサイトです
- メルカリアプリ・メルカリWebのソースコードは使用していません
- UIのインタラクション（画面遷移・アニメーション等）はすべて Claude Code で生成したものです
