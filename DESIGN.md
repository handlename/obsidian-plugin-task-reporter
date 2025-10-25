# 技術設計書: Obsidian Task Report Plugin

## 1. 技術スタック

### 1.1 コア技術

| 技術 | バージョン | 採用理由 |
|------|-----------|----------|
| TypeScript | 4.7.4 | 型安全性による品質向上、Obsidian APIの型定義活用、NFR-003(保守性要件)への対応 |
| Obsidian API | latest | プラグインの基盤となる必須API、NFR-002(互換性要件)対応 |
| esbuild | 0.17.3 | Obsidianプラグインの標準ビルドツール、高速なバンドル処理 |
| Node.js | v24 | 開発環境の基盤、最新LTS版(v24)によるセキュリティと安定性 |

### 1.2 開発ツール

| 技術 | バージョン | 採用理由 |
|------|-----------|----------|
| Jest | latest | TypeScript対応のテストフレームワーク、NFR-003(80%カバレッジ)達成のため |
| ts-jest | latest | JestでTypeScriptを実行するために必要 |
| Biome | latest | 高速な次世代リンター・フォーマッター、ESLintとPrettierの代替、Rust製で高性能 |

### 1.3 不採用技術とその理由

| 技術 | 不採用理由 |
|------|-----------|
| ESLint + Prettier | Biomeに統一することでツールチェーンを簡素化、設定ファイルの削減、実行速度の向上 |
| Webpack | esbuildがObsidianプラグインの標準であり、ビルド速度で優位 |
| Rollup | 同上 |
| Mocha/Chai | Jestの方がTypeScriptサポートが充実し、設定が簡潔 |
| Vitest | Jestで十分、移行コストに見合う利点なし |

---

## 2. アーキテクチャ設計

### 2.1 全体構造

```
┌─────────────────────────────────────────────┐
│         Obsidian Plugin Interface           │
│  (main.ts - Plugin, Settings, Commands)     │
└────────────┬────────────────────────────────┘
             │
             ├─→ UI Layer
             │    ├─ PluginSettingTab (設定画面)
             │    └─ Notice (通知)
             │
             ├─→ Service Layer
             │    ├─ TaskExtractor (タスク抽出)
             │    ├─ TaskFilter (フィルタリング)
             │    ├─ TaskFormatter (フォーマット)
             │    └─ ClipboardService (コピー)
             │
             └─→ Model Layer
                  ├─ Task (タスクモデル)
                  ├─ PluginSettings (設定モデル)
                  └─ FormatRule (フォーマットルール)
```

### 2.2 レイヤー責務

#### UI Layer
- Obsidian APIとのインターフェース
- ユーザー入力の受付
- 設定画面の表示
- エラー通知の表示

#### Service Layer
- ビジネスロジックの実装
- 純粋関数による処理
- 副作用の分離

#### Model Layer
- データ構造の定義
- 型定義
- immutableな設計

---

## 3. ディレクトリ構造

```
obsidian-plugin-task-reporter/
├── src/
│   ├── main.ts                    # プラグインエントリーポイント
│   ├── models/
│   │   ├── task.ts                # タスクモデル
│   │   ├── settings.ts            # 設定モデル
│   │   └── format-rule.ts         # フォーマットルール
│   ├── services/
│   │   ├── task-extractor.ts      # タスク抽出サービス
│   │   ├── task-filter.ts         # タスクフィルタリングサービス
│   │   ├── task-formatter.ts      # タスクフォーマットサービス
│   │   └── clipboard-service.ts   # クリップボードサービス
│   ├── ui/
│   │   └── settings-tab.ts        # 設定画面
│   └── utils/
│       ├── markdown-parser.ts     # Markdown解析ユーティリティ
│       └── text-formatter.ts      # テキスト整形ユーティリティ
├── tests/
│   ├── services/
│   │   ├── task-extractor.test.ts
│   │   ├── task-filter.test.ts
│   │   └── task-formatter.test.ts
│   └── utils/
│       ├── markdown-parser.test.ts
│       └── text-formatter.test.ts
├── scripts/
│   └── prepare-release.mjs        # リリース準備スクリプト(BRAT対応)
├── main.ts                        # ビルド後の出力先(git管理外)
├── styles.css                     # プラグインスタイル
├── manifest.json                  # プラグインマニフェスト
├── package.json                   # npm設定
├── tsconfig.json                  # TypeScript設定
├── jest.config.js                 # Jest設定
├── biome.json                     # Biome設定
├── esbuild.config.mjs             # esbuild設定
└── README.md                      # ドキュメント
```

---

## 4. モジュール設計

### 4.1 データモデル

#### Task (models/task.ts)
```typescript
interface Task {
  readonly content: string;        // タスク本文
  readonly level: number;          // 階層レベル(0=親, 1=子)
  readonly checkChar: string;      // チェック文字(' ', 'x', '*', '-'など)
  readonly tags: readonly string[]; // タグ一覧
  readonly lineNumber: number;     // 元の行番号
}
```

#### PluginSettings (models/settings.ts)
```typescript
interface PluginSettings {
  readonly targetHeading: string;              // 対象見出し
  readonly targetTagPrefix: string;            // 対象タグプレフィックス
  readonly excludeTagPatterns: readonly string[]; // 除外タグパターン
  readonly targetSubItemCheckChar: string;     // 対象サブアイテムのチェック文字
  readonly canceledCheckChar: string;          // キャンセルタスクのチェック文字
  readonly schedulePrefix: string;             // スケジュールタスクのプレフィックス
}
```

### 4.2 サービス層

#### TaskExtractor (services/task-extractor.ts)
**責務**: ノートからタスクを抽出

**主要関数**:
```typescript
function extractTasksFromHeading(
  content: string,
  heading: string
): readonly Task[]
```

**処理フロー**:
1. 見出しの検索
2. 見出し配下のタスクリスト抽出
3. Taskオブジェクトへの変換

#### TaskFilter (services/task-filter.ts)
**責務**: タスクのフィルタリング

**主要関数**:
```typescript
function filterByTag(
  tasks: readonly Task[],
  tagPrefix: string,
  excludePatterns: readonly string[]
): readonly Task[]

function filterSubItems(
  tasks: readonly Task[],
  targetCheckChar: string
): readonly Task[]
```

#### TaskFormatter (services/task-formatter.ts)
**責務**: タスクのフォーマット

**主要関数**:
```typescript
function formatTasks(
  tasks: readonly Task[],
  settings: PluginSettings
): string

function formatTaskContent(
  content: string,
  settings: PluginSettings
): string
```

**フォーマット処理**:
1. タグの変換 (`#work/sre` → `*sre*`)
2. 内部リンク除去 (`[[link]]` → `link`)
3. GitHub URL整形
4. ステータス装飾(取り消し線、絵文字)
5. インデント付与

#### ClipboardService (services/clipboard-service.ts)
**責務**: クリップボードへのコピー

**主要関数**:
```typescript
async function copyToClipboard(text: string): Promise<void>
```

**実装**:
- `navigator.clipboard.writeText()` を使用
- エラーハンドリング

### 4.3 ユーティリティ

#### MarkdownParser (utils/markdown-parser.ts)
**責務**: Markdown構造の解析

**主要関数**:
```typescript
function findHeading(content: string, heading: string): number | null
function parseTaskList(lines: readonly string[]): readonly Task[]
function extractTags(text: string): readonly string[]
```

#### TextFormatter (utils/text-formatter.ts)
**責務**: テキスト変換処理

**主要関数**:
```typescript
function convertTag(tag: string, prefix: string): string
function removeInternalLinks(text: string): string
function formatGitHubUrl(url: string): string
function applyStrikethrough(text: string): string
```

---

## 5. データフロー

### 5.1 メイン処理フロー

```
1. ユーザーがコマンド実行
   ↓
2. 現在のノート取得 (Obsidian API)
   ↓
3. TaskExtractor.extractTasksFromHeading()
   ├─ MarkdownParser.findHeading()
   └─ MarkdownParser.parseTaskList()
   ↓
4. TaskFilter.filterByTag()
   ↓
5. TaskFilter.filterSubItems()
   ↓
6. TaskFormatter.formatTasks()
   ├─ TextFormatter.convertTag()
   ├─ TextFormatter.removeInternalLinks()
   ├─ TextFormatter.formatGitHubUrl()
   └─ TextFormatter.applyStrikethrough()
   ↓
7. ClipboardService.copyToClipboard()
   ↓
8. Notice表示(成功/失敗)
```

### 5.2 エラーハンドリングフロー

```
各処理で発生しうるエラー:
├─ 見出しが見つからない → Notice表示、処理中断
├─ タスクが0件 → Notice表示、処理中断
├─ クリップボードコピー失敗 → Notice表示、エラー詳細表示
└─ その他 → Notice表示、エラーログ出力
```

---

## 6. Obsidian API使用箇所

### 6.1 Plugin クラス (main.ts)
```typescript
import { Plugin, Notice, MarkdownView } from 'obsidian';

export default class TaskReporterPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'format-tasks',
      name: 'Format tasks to clipboard',
      callback: () => this.formatTasks()
    });

    this.addSettingTab(new TaskReporterSettingTab(this.app, this));
  }

  async formatTasks() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      new Notice('No active markdown view');
      return;
    }
    
    const content = activeView.editor.getValue();
    // 処理...
  }
}
```

### 6.2 Settings Tab (ui/settings-tab.ts)
```typescript
import { App, PluginSettingTab, Setting } from 'obsidian';

export class TaskReporterSettingTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('対象見出し')
      .addText(text => text
        .setValue(this.plugin.settings.targetHeading)
        .onChange(async (value) => {
          this.plugin.settings.targetHeading = value;
          await this.plugin.saveSettings();
        }));
  }
}
```

---

## 7. テスト戦略

### 7.1 テストピラミッド

```
        ┌─────────┐
        │ E2E (0) │  → 手動テスト(Obsidian環境)
        ├─────────┤
        │Int (20%)│  → サービス層統合テスト
        ├─────────┤
        │Unit(80%)│  → ユーティリティ、個別関数
        └─────────┘
```

### 7.2 テスト対象と優先度

| レイヤー | テスト種類 | カバレッジ目標 |
|---------|-----------|---------------|
| Utils | Unit | 90%以上 |
| Services | Unit + Integration | 80%以上 |
| Models | Unit | 100% (型定義のみ) |
| UI | Manual | - |

### 7.3 主要テストケース

#### TaskExtractor
- 見出し配下のタスク抽出
- 階層構造の解析
- タグの抽出
- エッジケース(見出しなし、タスクなし)

#### TaskFilter
- タグプレフィックスによるフィルタリング
- 除外パターンマッチング
- サブアイテムのチェック文字フィルタリング

#### TaskFormatter
- タグ変換 (`#work/xxx` → `*xxx*`)
- 内部リンク除去(Markdown形式、WikiLink形式)
- GitHub URL整形
- ステータス装飾(取り消し線、絵文字)
- インデント生成

#### TextFormatter
- 正規表現パターンマッチング
- エスケープ処理
- エッジケース(空文字、特殊文字)

### 7.4 Jest設定 (jest.config.js)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/ui/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## 8. ビルドとデプロイ

### 8.1 ビルドプロセス

```
1. TypeScript型チェック (tsc -noEmit -skipLibCheck)
   ↓
2. esbuildによるバンドル
   ├─ src/**/*.ts → main.js (単一ファイル)
   ├─ 依存関係の解決
   └─ コード最小化(production mode)
   ↓
3. 出力ファイル
   ├─ main.js (実行ファイル)
   ├─ manifest.json (コピー)
   └─ styles.css (コピー)
```

### 8.2 npm scripts

```json
{
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "biome check src tests",
    "lint:fix": "biome check --write src tests",
    "format": "biome format --write src tests",
    "version": "node version-bump.mjs && git add manifest.json versions.json",
    "release": "npm run build && node scripts/prepare-release.mjs"
  }
}
```

### 8.3 esbuild設定 (esbuild.config.mjs)

```javascript
import esbuild from 'esbuild';

const production = process.argv[2] === 'production';

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: ['obsidian'],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: production ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  minify: production,
}).catch(() => process.exit(1));
```

### 8.4 Biome設定 (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", "main.js", "*.test.ts"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExtraBooleanCast": "error",
        "noMultipleSpacesInRegularExpressionLiterals": "error",
        "noUselessCatch": "error",
        "noUselessTypeConstraint": "error"
      },
      "correctness": {
        "noUnusedVariables": "error",
        "useExhaustiveDependencies": "warn"
      },
      "suspicious": {
        "noExplicitAny": "warn",
        "noDoubleEquals": "error"
      },
      "style": {
        "noNonNullAssertion": "warn",
        "useConst": "error"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

**Biome採用の利点**:
- ESLint + Prettierの代替として単一ツールで完結
- Rust製で高速(従来比10-100倍)
- 設定ファイルがシンプル
- フォーマットとリントを同時実行可能
- VSCode拡張でエディタ統合が容易

### 8.5 BRAT対応

#### 8.5.1 BRATとは
BRAT (Beta Reviewers Auto-update Tool) は、開発中のObsidianプラグインをGitHubリポジトリから直接インストール・自動更新できるツール。公式コミュニティプラグインストアに登録する前のベータ版配布に最適。

#### 8.5.2 BRAT対応要件

**必須ファイル**:
- `manifest.json` - プラグインメタデータ
- `main.js` - ビルド済みプラグイン本体
- `styles.css` - スタイルシート

**リリースプロセス**:
1. セマンティックバージョニングに従ったバージョン番号設定
2. GitHubリリースの作成(タグ、リリース名、manifest.jsonの版番号を統一)
3. 上記3ファイルをリリースアセットに添付
4. プリリリースとしてマークすることも可能

**注意事項**:
- `manifest-beta.json` は不要(BRAT v1.1.0以降は無視される)
- リリースタグ、リリース名、manifest.json内のバージョンは一致させる(例: すべて `1.0.1`)
- デフォルトブランチへのコミット前にプリリリース版で十分テストする

#### 8.5.3 リリース準備スクリプト (scripts/prepare-release.mjs)

```javascript
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const RELEASE_DIR = 'release';
const FILES_TO_COPY = ['main.js', 'manifest.json', 'styles.css'];

// リリースディレクトリ作成
mkdirSync(RELEASE_DIR, { recursive: true });

// ファイルコピー
for (const file of FILES_TO_COPY) {
  const src = join(process.cwd(), file);
  const dest = join(RELEASE_DIR, file);
  copyFileSync(src, dest);
  console.log(`Copied: ${file} -> ${RELEASE_DIR}/`);
}

console.log('\nRelease files prepared successfully!');
console.log(`\nNext steps:`);
console.log(`1. Create a GitHub release with tag matching manifest.json version`);
console.log(`2. Upload files from ${RELEASE_DIR}/ as release assets`);
console.log(`3. Users can install via BRAT using: <username>/<repo-name>`);
```

#### 8.5.4 ユーザーのインストール方法

1. ObsidianにBRATプラグインをインストール
2. BRATの設定から「Add Beta plugin」を選択
3. GitHubリポジトリパス(`handlename/obsidian-plugin-task-reporter`)を入力
4. 自動的にインストール・更新が行われる

---

## 9. セキュリティ考慮事項

### 9.1 データ処理
- すべての処理はローカルで完結(NFR-004)
- 外部通信なし
- ノート内容の外部送信なし

### 9.2 入力検証
- 正規表現のReDoS対策
  - タイムアウト設定
  - 複雑度制限
- ユーザー入力のサニタイゼーション
  - 設定値のバリデーション

### 9.3 依存関係
- 外部ライブラリは最小限
- Obsidian公式APIのみ依存
- セキュリティアップデート監視(Dependabot推奨)

---

## 10. パフォーマンス最適化

### 10.1 処理効率化
- 正規表現の事前コンパイル
- 不要なループの削減
- immutableデータ構造による安全な共有

### 10.2 メモリ管理
- 大きな文字列の分割処理
- ストリーム処理は不要(ノートサイズ制限内)

### 10.3 パフォーマンス目標
- 1000行のノートで3秒以内(NFR-001)
- 実測値で検証

---

## 11. 実装優先順位

### Phase 1: コア機能実装
1. データモデル定義
2. TaskExtractor実装
3. TaskFilter実装
4. 基本的なTaskFormatter実装

### Phase 2: フォーマット機能拡張
1. タグ変換
2. 内部リンク除去
3. GitHub URL整形
4. ステータス装飾

### Phase 3: UI実装
1. 設定画面
2. コマンド登録
3. エラー通知

### Phase 4: テストとドキュメント
1. ユニットテスト作成
2. カバレッジ80%達成
3. README更新

---

## 12. 開発環境セットアップ

### 12.1 必要なツール
- Node.js v24 (最新LTS版)
- npm v10以降
- Obsidian (テスト用)
- VSCode (推奨) + Biome拡張

### 12.2 初期セットアップ
```bash
# 依存関係インストール
npm install

# コードフォーマット
npm run format

# Lint実行
npm run lint

# 開発モード起動(ファイル監視)
npm run dev

# テスト実行
npm test

# テストカバレッジ確認
npm run test:coverage

# プロダクションビルド
npm run build

# リリース準備
npm run release
```

### 12.3 Obsidianでのテスト
1. テスト用Vaultを作成
2. `.obsidian/plugins/task-reporter/` にビルド成果物をコピー
3. Obsidianでプラグインを有効化
4. 動作確認

---

## 13. 今後の拡張性

### 13.1 将来的な機能拡張候補
- 複数ノートからのタスク集約
- カスタムフォーマットテンプレート
- エクスポート形式の追加(JSON, CSV)
- タスクの日付範囲フィルタリング

### 13.2 拡張のための設計上の配慮
- サービス層の疎結合
- 純粋関数による実装
- インターフェース定義による抽象化
- プラガブルなフォーマッター設計

---

## 14. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-10-25 | 1.0 | 初版作成 |
| 2025-10-25 | 1.1 | Node.js v24への更新、BiomeへのLinter/Formatter変更、BRAT対応追加 |
