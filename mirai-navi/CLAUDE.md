# prototype

## このプロジェクトについて
iOSアプリのWebプロトタイプ。単一HTMLファイルで全画面を管理。

## 編集ルール
- `index.html` がメインファイル
- CSS・JSはすべて `index.html` 内にインラインで記述
- デザインシステムは `/ds-prototype` スキルを参照し、定義されたCSS変数・トークン・コンポーネントルールに従うこと

## アイコンルール
- アイコンは `assets/icons/` フォルダのSVGファイルを使用すること
- `assets/icons/fill/{IconName}.svg` と `assets/icons/outline/{IconName}.svg` の2スタイルがある
- 使用時は Read ツールでSVGファイルを読み込み、中身をインラインで貼り付ける
- 例: Like アイコン → `assets/icons/fill/Like.svg`（塗りつぶし）/ `assets/icons/outline/Like.svg`（アウトライン）

## 画像ルール
- このリポジトリに追加・更新する画像は1MB以下にすること
- 1MBを超える画像は `sips -s format jpeg -s formatOptions 75 -Z 1200` で圧縮してから使用すること
- 商品画像は `assets/items/` フォルダの実商品画像（`m{id}_1.{ext}` 形式）を使用する
- UI素材・背景画像は `assets/images/` に置く

## Lottieアニメーション

- lottie-web をCDN経由で使用（`<head>` 内 `<script src="https://cdnjs.cloudflare.com/.../lottie.min.js">`）
- JSONファイルは `assets/images/` に配置
- 初回表示時に `lottie.loadAnimation()` で初期化し、2回目以降は `goToAndPlay(0, true)` で再生
- 現在使用: `assets/images/mike-THX.json`（購入完了ダイアログ `#purchase-lottie`）

## バージョン管理
- `index.html` 冒頭の `var VERSION = 'v1.0'` を変更してバージョンを更新する
- `document.title` は JS で `prototype（v1.0）` のように組み立てられるため、VERSION を変えるだけで自動反映される

## コミット・プッシュ
- すべての変更後に commit & push すること

## 実装済み挙動仕様

### Pull to Refresh
- ホーム・オークション・出品・おさいふタブのスクロール最上部で下に引くとリロードされる
- 引いた量に応じてコンテンツが押し下げられ、隙間にスピナーが表示される（sqrt抵抗で自然な減衰）
- スピナーは引いた量に応じて回転し、閾値（60px）を超えて離すとスピン状態で44pxキープ → 700ms後に `location.reload()`
- 閾値未満で離した場合はスムーズに元の位置に戻る（`ease-strong-out` 300ms）

### タブ別ナビゲーション状態の保持
- タブを切り替える際、現在のナビゲーションスタック（`_navStack`）と商品詳細（IDP）の状態を `_tabStates` に保存する
- 元のタブに戻ったとき、保存されていた状態を復元してIDPを再表示する
- ホームタブをダブルタップ（同じタブを再タップ）すると、保存状態をクリアしてホーム画面のルートに戻る
- サーチタブは別途 `_idpStackBeforeSearch` で管理するため、この仕組みの対象外

### IDP（商品詳細）の状態変数
- `_currentItemId` — 現在表示中の商品ID
- `_currentItemIsAuction` — オークションIDPかどうか（出品タブからの遷移時 `true`）
- `_currentItemIsListing` — 出品画面からの遷移かどうか（出品タブのリスト画面からの遷移時 `true`）

### 出品画面からの商品詳細
- 出品画面（`screen-list`）から商品詳細を開いた場合、`_currentItemIsListing = true` となる
- このとき購入ボタンのラベルは「商品を編集する」に変わり、ボタンスタイルは secondary（白背景・赤テキスト・赤ボーダー1px）になる

### コメント欄のユーザー表示
- IDPのコメント欄に表示されるユーザーは、商品ID（数値）をシードとした疑似乱数で決定する
- アバター画像は `assets/images/profile-icon.png` 〜 `profile-icon-9.png` の10種からランダム選択
- ユーザー名は `_USER_NAMES` 配列（15種の日本語名）からランダム選択
- 同じ商品IDなら常に同じユーザーが表示される（再現性あり）

### プロフィール画像
- マイページ（自分）以外のユーザーアバターはすべて `assets/images/profile-icon*.png` を使用する

### チェックアウトシートのレイヤー・状態管理
- `closeCheckout()` は `checkout-confirm` の open 状態も同時にリセットする（再オープン時に確認画面が残るバグを防ぐ）
- IDPを閉じる全てのパス（`closeItemDetail`、`switchTab`、`hashchange`）で `closeCheckout()` を呼ぶこと
- `.checkout-overlay` / `.checkout-sheet`: デフォルトで `visibility: hidden; pointer-events: none`、`.open` 時のみ `visibility: visible; pointer-events: auto`（iOS Safari の visual viewport パン時に画面外の要素が露出するのを防ぐ）
- `.checkout-sheet-header` / `.checkout-confirm-header` は `position: absolute` でスクロールbodyに重なり、グラデーション（`to bottom`）でコンテンツのフェードを実現する
- z-index 構造: `checkout-sheet-header`（2）← `checkout-confirm`（3）で確認画面がヘッダーを覆う

### 検索画面

**URL ハッシュ**
- 検索画面にはユニークなURLハッシュを付けない（`#search` は使わない）
- ハッシュを付けるとリロード時にキーボードが自動起動してレイアウトが崩れるため

**iOS Safari visual viewport パン防止（重要）**
- iOS Safari ではキーボードを閉じた後に入力欄をタップすると、visual viewport が上方向にパンして画面が飛ぶ
- この問題は `.search-input-wrap` 全体に `mousedown` イベントリスナーを付け、`e.preventDefault()` でブラウザのネイティブ focus + scroll-into-view を阻止し、`input.focus({ preventScroll: true })` で手動フォーカスすることで解決する
- **`document.activeElement` チェックで early return してはいけない** — iOS Safari では「完了」ボタンでキーボードを閉じても `activeElement` が input のまま残ることがあり、early return すると `preventDefault` が効かない
- ハンドラは input 要素だけでなく `.search-input-wrap` 全体に付けること（パディングやアイコン部分のタップもカバーするため）
- `goToSearch()` 内の初回フォーカスも `focus({ preventScroll: true })` を使用する
- iOS Safari の visual viewport パン時に画面下部に空白が露出する対策として、`.device` の前に `position: fixed; inset: 0; z-index: -1` の背景 div を配置している

**フロートバー（検索フォーム）のキーボード追従**
- `.search-float-bar` は `position: absolute; bottom: 0` で検索画面下部に配置
- `visualViewport.resize` イベントで `updateFloatBar()` を呼び、`bottom: keyboardH + 'px'` でキーボード上に追従
- `keyboardH = Math.max(0, FULL_HEIGHT - visualViewport.height)` で計算（`FULL_HEIGHT` はページ読み込み時の `window.innerHeight`）
- 検索画面を開いた直後（`searchJustOpened` フラグ）は `transition: none` でアニメーションなしに即座配置

**テキストクリアボタン**
- 検索入力欄の右端に `fill/Delete.svg` アイコンのクリアボタンを配置
- `input` イベントで文字の有無に応じて `.visible` クラスをトグル（空なら非表示）
- タップでテキストクリア + `focus({ preventScroll: true })` でフォーカス維持
- WebKit デフォルトの `::-webkit-search-cancel-button` は非表示化

**検索入力アイコン**
- テキスト未入力時: マイクアイコン（`outline/Microphone.svg`、primaryカラー）を表示
- テキスト入力時: マイクが消えてクリアアイコン（`fill/Delete.svg`）に切り替わる
- CSS兄弟セレクタ `.search-input-clear.visible ~ .search-input-mic { display: none }` で制御

**検索履歴カード**
- 全カードの左側は商品写真（`history-card-thumb`）で統一
- 右側にハートアイコン（`assets/icons/` の Like.svg）を配置、タップで outline→fill 赤に切り替え（`toggleHeart` で SVG path の `d` 属性を動的に切り替え）
- タップでイベントデリゲーション（`.history-cards` に `click`）により `showSearchResults()` を呼び検索結果画面を表示

**検索結果画面**
- `.search-results-view` が右からスライドイン（`translateX(100%)` → `translateX(0)`、0.35s）
- ナビ（戻る・画像検索・並び替え・絞り込み）は `position: absolute` で透過背景、`pointer-events: none`（ボタンだけ `auto`）
- フィルターバー: 「販売中のみ」ボタン（固定・横スクロールなし）+ カテゴリチップ（`.filter-categories-wrap` 内で横スクロール、左端にグラデーションマスクでフェードアウト）
- 「販売中のみ」ON → SOLD バッジ付きタイルを非表示、OFF → 再表示
- カテゴリチップタップ → 現在のキーワードにカテゴリを追加して新しい結果画面をスライドイン（スタック方式）
- 商品グリッド: 3カラム、60件、SOLD/NEW バッジ付き、表示するたびにシャッフル
- 画面下部に「この検索条件を保存する」赤ボタン（`idp-bottom-bar` / `idp-btn-buy` スタイル）
- 戻るボタン（`idp-overlay-btn` スタイル）で1つずつスライドアウト（`popSearchResults()`）

**検索結果のスタック管理**
- `_searchResultsStack` 配列で複数の結果ビューを管理
- `showSearchResults(keyword)`: テンプレートを `cloneNode` して新しいビューを上に重ねてスライドイン（z-index をスタック数に応じて増加）
- `popSearchResults()`: 最上位のビューをスライドアウト → 350ms後にDOM削除、検索フォームのキーワードを前のスタックに合わせる
- `hideAllSearchResults()`: 全スタックを一括クリア（`exitSearch` / `switchTab` で使用）

**検索結果から商品詳細（IDP）**
- 検索結果のタイルタップで `openItemDetail()` → IDP が開く
- IDP 表示中は `body.idp-open` により検索画面でもタブバーを再表示
- タブバーで別タブに遷移すると検索画面の状態をデフォルトにリセット（全結果スタッククリア・入力クリア・フロートバー初期化）

### オーバースクロール・ジェスチャーの封じ込め

画面を引っ張ったときに別の画面が露出しないよう、多層で対策している。

**CSS レイヤー**
- `html, body` / `.device`: `overscroll-behavior: none` — ビューポートレベルのネイティブバウンス（iOS/Chrome）を封じる
- `.screen`: `overflow: hidden` — 変形アニメーション中にコンテンツが画面外にはみ出すのを防ぐ
- `.home-scroll` / `.auc-scroll` / `.list-scroll` / `.wal-scroll`: `overscroll-behavior-y: contain` — 上端引っ張りで画面下の checkout sheet が露出するのを防ぐ（PTR の JS 制御は別途維持）
- `.panel-scroll`（お知らせ・カート・やること）: `overscroll-behavior-y: contain` — 同上
- `#screen-search`: `overscroll-behavior-x: none`
- `.search-content-scroll`: `overscroll-behavior-y: contain; overscroll-behavior-x: none` — 縦方向はiOSネイティブバウンス感触を維持、横方向はブロック
- `.filter-chip-bar`: `overscroll-behavior-x: contain` — チップバーの横スクロール超過が親に伝播しないよう封じる

**JS レイヤー（検索画面）**
- `#screen-search` に `touchmove` リスナーを追加し、水平ジェスチャーを `e.preventDefault()` で直接ブロックする
- これは CSS の `overscroll-behavior` が効かないケース（キーボード表示中の Chrome mobile における visual viewport パン）に対応するため
- `.filter-chip-bar` / `.filter-categories` 内のタッチは `e.target.closest()` で除外し、横スクロールを維持する

### マイページ エッジスワイプの発火条件
- 左端から右へのスワイプでマイページを開くが、以下の場合は発火しない：
  - 検索画面が表示中（`screen-search.active`）
  - パネル（お知らせ・カート・やること）が表示中（`.panel-overlay.open` が存在）
- マイページが開いている状態での左スワイプは常に発火（閉じる方向）

### 検索画面からタブに戻ったときのインジケーター
- `exitSearch()` で元タブに戻る際、タブインジケーター（細いグレーのハイライト）のアニメーションを無効化する
- `updateTabIndicator(el, instant: true)` で `transition: none` を一時適用してから復元する（検索→タブ復帰のたびにインジケーターが横にアニメーションするのを防ぐ）
