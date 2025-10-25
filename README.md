# Task Reporter - Obsidian Plugin

Obsidianで管理しているタスクリストを日報などの報告用フォーマットに整形し、クリップボードにコピーするプラグインです。

## 機能

- 指定した見出し配下のタスクリストを抽出
- タグによるフィルタリング
- サブタスクのフィルタリング
- タスク本文の自動整形
  - タグの変換 (`#work/dev` → `*dev*`)
  - 内部リンクの除去
  - GitHub URL の整形
  - キャンセルタスクの取り消し線表示
  - スケジュールタスクへの絵文字付与
- クリップボードへのコピー

## インストール方法

### BRAT経由でのインストール (推奨)

1. [BRAT (Beta Reviewers Auto-update Tool)](https://github.com/TfTHacker/obsidian42-brat) をObsidianにインストール
2. BRATの設定を開く
3. "Add Beta plugin" をクリック
4. `handlename/obsidian-plugin-task-reporter` を入力
5. プラグインが自動的にインストールされます

### 手動インストール

1. [最新リリース](https://github.com/handlename/obsidian-plugin-task-reporter/releases)から `main.js`, `manifest.json`, `styles.css` をダウンロード
2. Obsidian Vaultの `.obsidian/plugins/task-reporter/` ディレクトリに配置
3. Obsidianを再起動
4. 設定 → コミュニティプラグインからTask Reporterを有効化

## 使い方

### 基本的な使い方

1. タスクリストを含むノートを開く
2. コマンドパレット (`Cmd/Ctrl + P`) を開く
3. "Format tasks and copy to clipboard" を実行
4. フォーマットされたタスクがクリップボードにコピーされます

### ノートの例

```markdown
## 今日やったこと

- [x] プロジェクトAの設計書作成 #work/dev
    - [k] 要件定義の確認
    - [k] 技術スタックの選定
- [x] [[ミーティング資料]]のレビュー #work/review
- [x] https://github.com/org/repo/issues/123 の対応 #work/bugfix
- [-] 定例MTG #work/routine
- [ ] 📅 明日のタスク準備 #work/planning
```

### 出力例

```
- プロジェクトAの設計書作成 *dev*
    - 要件定義の確認
    - 技術スタックの選定
- ミーティング資料のレビュー *review*
- [repo#123](https://github.com/org/repo/issues/123) の対応 *bugfix*
```

## 設定項目

設定画面(設定 → Task Reporter)で以下のパラメータをカスタマイズできます:

- **対象見出し**: タスクを抽出する見出し (デフォルト: `## 今日やったこと`)
- **対象タグプレフィックス**: フォーマット対象とするタグのプレフィックス (デフォルト: `#work/`)
- **除外タグパターン**: 除外するタグ (デフォルト: `#work/routine`)
- **対象サブアイテムのチェック文字**: サブタスクとして含めるチェック文字 (デフォルト: `k`)
- **キャンセルタスクのチェック文字**: 取り消し線を適用するチェック文字 (デフォルト: `-`)
- **スケジュールタスクのプレフィックス**: スケジュールタスクの絵文字 (デフォルト: `📅`)

## 開発

### 環境要件

- Node.js v24
- npm v10以降

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発モード (ファイル監視)
npm run dev

# プロダクションビルド
npm run build

# テスト実行
npm test

# Lint & フォーマット
npm run lint
npm run format
```

### テスト

```bash
# テスト実行
npm test

# カバレッジ確認
npm run test:coverage
```

## ライセンス

MIT License

## 作者

[handlename](https://github.com/handlename)
