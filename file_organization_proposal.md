# ファイル整理提案

## 提案する新しい構造

```
/Users/y-nagakura/brown/Claude_Code/
├── Daily Notes/              ← 日次ログ（AIが自動記録）
├── Notes/
│   ├── Flow/                ← MTGメモ・議論ログ・調査結果
│   │   └── survey-analysis/ ← 既存の調査結果を移動
│   └── Stock/               ← ナレッジ・意思決定ログ
├── Tasks/
│   ├── Inbox.md            ← 未整理タスクの投入先
│   ├── Projects/           ← 1PJ = 1ファイルでタスク管理
│   └── Someday.md          ← いつかやるタスク
├── Projects/               ← 実際のプロジェクトファイル
│   ├── design-with-claude-code/
│   ├── mercari-mockup/
│   ├── my-prototype/
│   └── prototypes/         ← 個別HTMLファイルを整理
│       ├── index.html
│       └── mercari-splash.html
├── Config/                 ← 設定ファイルの整理
│   ├── tailwind.config.js
│   └── postcss.config.js
└── .claude/
    ├── rules/              ← AIへの行動ルール定義
    │   ├── slack-style.md        ← Slack文体ルール
    │   ├── task-management.md    ← タスク管理ルール
    │   ├── daily-note-logging.md ← ログ記録ルール
    │   └── lessons.md            ← 学習した教訓
    ├── skills/             ← 再利用可能なスキル定義
    └── settings.local.json ← 既存設定（保持）
```

## 移行手順

1. **新しいディレクトリ構造の作成**
2. **既存ファイルの分類と移動**
3. **初期テンプレートファイルの作成**
4. **.claudeルールファイルの設定**

## メリット

- **明確な分類**: Flow（一時的）とStock（恒久的）の情報分離
- **タスク管理**: GTDスタイルのタスク管理
- **プロジェクト整理**: 開発プロジェクトと設定の分離
- **AI協業**: Claudeとの協業ルール明文化

この構成で整理を開始しますか？