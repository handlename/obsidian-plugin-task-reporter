# タスク定義: Obsidian Task Report Plugin

## フェーズ0: プロジェクト環境構築

- [x] 開発環境のセットアップ
  - 目的: 開発に必要なツールと設定を整備する
  - 詳細:
    - Node.js v24のインストール確認
    - package.jsonの更新(依存関係追加)
    - Biome設定ファイル(biome.json)の作成
    - Jest設定ファイル(jest.config.js)の作成
    - tsconfig.jsonの更新(src/ディレクトリ対応)
  - 完了条件:
    - `npm install`が正常に完了すること
    - `npm run lint`が実行できること
    - `npm run test`が実行できること(テストファイルがなくてもエラーなし)

- [ ] ディレクトリ構造の作成
  - 目的: 設計書に従ったディレクトリ構造を作成する
  - 詳細:
    - src/ディレクトリ作成
    - src/models/ディレクトリ作成
    - src/services/ディレクトリ作成
    - src/ui/ディレクトリ作成
    - src/utils/ディレクトリ作成
    - tests/ディレクトリ作成
    - scripts/ディレクトリ作成
  - 完了条件:
    - すべてのディレクトリが存在すること
    - .gitkeepまたは初期ファイルが配置されていること

- [ ] esbuild設定の更新
  - 目的: src/main.tsをエントリーポイントとするビルド設定
  - 詳細:
    - esbuild.config.mjsをsrc/main.tsに対応させる
    - ビルド出力先をmain.jsに設定
  - 完了条件:
    - `npm run build`が正常に完了すること
    - main.jsが生成されること

---

## フェーズ1: データモデル定義

- [ ] Taskモデルの定義
  - 目的: タスクのデータ構造を定義する
  - 詳細:
    - src/models/task.tsを作成
    - Task interfaceを定義(content, level, checkChar, tags, lineNumber)
    - readonly修飾子を使用してimmutableにする
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと

- [ ] PluginSettingsモデルの定義
  - 目的: プラグイン設定のデータ構造を定義する
  - 詳細:
    - src/models/settings.tsを作成
    - PluginSettings interfaceを定義(REQUIREMENTS.mdのFR-011に対応)
    - DEFAULT_SETTINGSを定義
    - readonly修飾子を使用
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - デフォルト値が適切に設定されていること

---

## フェーズ2: ユーティリティ実装

- [ ] MarkdownParserの実装
  - 目的: Markdown構造を解析するユーティリティを実装する
  - 詳細:
    - src/utils/markdown-parser.tsを作成
    - findHeading関数を実装(見出しの検索、FR-001)
    - parseTaskList関数を実装(タスクリストの解析)
    - extractTags関数を実装(タグの抽出)
    - すべて純粋関数として実装
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - 基本的な動作確認(コンソール出力等)

- [ ] TextFormatterの実装
  - 目的: テキスト変換処理を実装する
  - 詳細:
    - src/utils/text-formatter.tsを作成
    - convertTag関数を実装(FR-004: タグ変換)
    - removeInternalLinks関数を実装(FR-005: 内部リンク除去)
    - formatGitHubUrl関数を実装(FR-006: GitHub URL整形)
    - applyStrikethrough関数を実装(FR-007: 取り消し線)
    - すべて純粋関数として実装
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - 基本的な動作確認

---

## フェーズ3: サービス層実装(コア機能)

- [ ] TaskExtractorの実装
  - 目的: ノートからタスクを抽出する機能を実装する
  - 詳細:
    - src/services/task-extractor.tsを作成
    - extractTasksFromHeading関数を実装(FR-001対応)
    - MarkdownParserを利用
    - 見出し配下のタスク抽出ロジック
    - 階層構造の解析(level 0/1の判定)
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - 見出し配下のタスクが正しく抽出されること

- [ ] TaskFilterの実装
  - 目的: タスクのフィルタリング機能を実装する
  - 詳細:
    - src/services/task-filter.tsを作成
    - filterByTag関数を実装(FR-002: タグフィルタリング)
    - filterSubItems関数を実装(FR-003: サブアイテムフィルタリング)
    - 除外タグのパターンマッチング
    - すべて純粋関数として実装
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - 対象タグのタスクのみが抽出されること
    - 除外タグが正しく動作すること

- [ ] TaskFormatterの基本実装
  - 目的: タスクのフォーマット機能を実装する
  - 詳細:
    - src/services/task-formatter.tsを作成
    - formatTasks関数を実装(FR-004~FR-008統合)
    - formatTaskContent関数を実装
    - TextFormatterを利用
    - インデント処理(FR-008)の実装
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - タスクが適切にフォーマットされること
    - 階層構造が保持されること

---

## フェーズ4: サービス層実装(フォーマット機能拡張)

- [ ] タグ変換機能の統合
  - 目的: FR-004のタグ変換機能をTaskFormatterに統合する
  - 詳細:
    - TextFormatter.convertTagをTaskFormatter内で呼び出し
    - 設定値(targetTagPrefix)に基づく変換
    - `#work/xxx` → `*xxx*`の変換
  - 完了条件:
    - タグが正しく変換されること
    - プレフィックスに一致しないタグが保持されること

- [ ] 内部リンク除去機能の統合
  - 目的: FR-005の内部リンク除去機能をTaskFormatterに統合する
  - 詳細:
    - TextFormatter.removeInternalLinksをTaskFormatter内で呼び出し
    - Markdown形式リンクの処理
    - WikiLink形式の処理
    - エイリアス付きWikiLinkの処理
  - 完了条件:
    - Markdown形式の内部リンクがテキストのみになること
    - WikiLink形式が正しく変換されること
    - 外部リンクが保持されること

- [ ] GitHub URL整形機能の統合
  - 目的: FR-006のGitHub URL整形機能をTaskFormatterに統合する
  - 詳細:
    - TextFormatter.formatGitHubUrlをTaskFormatter内で呼び出し
    - Issue/PR URLの検出と変換
    - `[repo#1234](URL)`形式への変換
  - 完了条件:
    - GitHub URLが正しく整形されること
    - 他のURLが影響を受けないこと

- [ ] ステータス装飾機能の統合
  - 目的: FR-007のステータス装飾機能をTaskFormatterに統合する
  - 詳細:
    - キャンセルタスクの取り消し線処理
    - スケジュールタスクの絵文字付与
    - 設定値(canceledCheckChar, schedulePrefix)の利用
  - 完了条件:
    - キャンセルタスクが取り消し線で表示されること
    - スケジュールタスクに絵文字が付くこと

---

## フェーズ5: クリップボードサービス実装

- [ ] ClipboardServiceの実装
  - 目的: FR-009のクリップボードコピー機能を実装する
  - 詳細:
    - src/services/clipboard-service.tsを作成
    - copyToClipboard関数を実装
    - navigator.clipboard.writeText()を使用
    - エラーハンドリング
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - クリップボードにコピーできること

---

## フェーズ6: UI層実装

- [ ] メインプラグインクラスの実装
  - 目的: Obsidian Pluginのエントリーポイントを実装する
  - 詳細:
    - src/main.tsを作成
    - TaskReporterPluginクラスを定義
    - onload/onunloadメソッドの実装
    - 設定の読み込み/保存機能
    - サービス層の呼び出し統合
  - 完了条件:
    - TypeScriptの型チェックが通ること
    - Lintエラーがないこと
    - プラグインが読み込まれること

- [ ] コマンド登録の実装
  - 目的: FR-009のコマンドパレット機能を実装する
  - 詳細:
    - addCommandでタスクフォーマットコマンドを登録
    - 現在のノート取得(MarkdownView)
    - サービス層の呼び出しフロー実装
    - Noticeでの結果通知
  - 完了条件:
    - コマンドパレットからコマンドが実行できること
    - タスクがフォーマットされクリップボードにコピーされること
    - 成功通知が表示されること

- [ ] 設定画面の実装
  - 目的: FR-011のプラグイン設定画面を実装する
  - 詳細:
    - src/ui/settings-tab.tsを作成
    - TaskReporterSettingTabクラスを定義
    - 各設定項目のUI要素を実装
    - 設定値の読み書き処理
  - 完了条件:
    - 設定画面が表示されること
    - すべての設定項目が変更可能であること
    - 設定がdata.jsonに永続化されること

- [ ] エラーハンドリングの実装
  - 目的: FR-010のエラーハンドリング機能を実装する
  - 詳細:
    - 見出しが見つからない場合のアラート
    - タスクが0件の場合のアラート
    - その他のエラーハンドリング
    - エラーメッセージの適切な表示
  - 完了条件:
    - 見出しが存在しない場合に適切なアラートが表示されること
    - フォーマット対象タスクがゼロの場合にアラートが表示されること
    - エラーメッセージが具体的でわかりやすいこと

---

## フェーズ7: テスト実装

- [ ] ユーティリティのユニットテスト
  - 目的: ユーティリティ関数のテストを実装する
  - 詳細:
    - tests/utils/markdown-parser.test.tsを作成
    - tests/utils/text-formatter.test.tsを作成
    - 各関数のテストケースを網羅
    - エッジケースのテスト
  - 完了条件:
    - すべてのテストが通過すること
    - カバレッジが90%以上であること

- [ ] サービス層のユニットテスト
  - 目的: サービス層のテストを実装する
  - 詳細:
    - tests/services/task-extractor.test.tsを作成
    - tests/services/task-filter.test.tsを作成
    - tests/services/task-formatter.test.tsを作成
    - 各機能要件(FR-001~FR-008)に対応するテストケース
    - 統合テストの実装
  - 完了条件:
    - すべてのテストが通過すること
    - カバレッジが80%以上であること
    - 機能要件がすべてテストでカバーされていること

---

## フェーズ8: ビルドとリリース準備

- [ ] リリース準備スクリプトの作成
  - 目的: BRAT対応のリリース準備を自動化する
  - 詳細:
    - scripts/prepare-release.mjsを作成
    - releaseディレクトリへのファイルコピー
    - manifest.json, main.js, styles.cssの準備
  - 完了条件:
    - `npm run release`が正常に実行されること
    - releaseディレクトリに必要ファイルが揃っていること

- [ ] manifest.jsonの更新
  - 目的: プラグインメタデータを正しく設定する
  - 詳細:
    - idの変更(task-reporter等)
    - nameの変更(Task Reporter等)
    - 説明文の記載
    - 作者情報の設定
    - バージョン情報の確認
  - 完了条件:
    - manifest.jsonが正しく設定されていること
    - BRATでインストール可能な状態であること

- [ ] README.mdの更新
  - 目的: プラグインの使い方を文書化する
  - 詳細:
    - プラグインの概要説明
    - インストール方法(BRAT対応)
    - 使い方の説明
    - 設定項目の説明
    - ライセンス情報
  - 完了条件:
    - README.mdが充実していること
    - ユーザーがプラグインを使い始められること

---

## フェーズ9: 統合テストと検証

- [ ] 手動テストの実施
  - 目的: Obsidian上での動作を確認する
  - 詳細:
    - テスト用Vaultでの動作確認
    - 各機能要件(FR-001~FR-011)の動作確認
    - エラーケースの確認
    - パフォーマンス検証(NFR-001: 1000行/3秒以内)
  - 完了条件:
    - すべての機能要件が満たされていること
    - エラーハンドリングが適切に動作すること
    - パフォーマンス要件を満たしていること

- [ ] テストカバレッジの確認
  - 目的: NFR-003の80%カバレッジを達成する
  - 詳細:
    - `npm run test:coverage`の実行
    - カバレッジレポートの確認
    - 不足箇所のテスト追加
  - 完了条件:
    - 全体のカバレッジが80%以上であること
    - カバレッジレポートにエラーがないこと

- [ ] Lintエラーのゼロ化
  - 目的: NFR-003のコード品質要件を満たす
  - 詳細:
    - `npm run lint`の実行
    - Lintエラーの修正
    - コードフォーマットの統一
  - 完了条件:
    - Lintエラーがゼロであること
    - すべてのコードがBiomeフォーマットに従っていること

---

## フェーズ10: 初回リリース

- [ ] 初回リリースの実行
  - 目的: GitHubでv0.1.0としてリリースする
  - 詳細:
    - バージョン番号の確認(manifest.json, package.json)
    - `npm run release`の実行
    - GitHubリリースの作成(v0.1.0)
    - リリースアセットのアップロード
    - プリリリースとしてマーク
  - 完了条件:
    - GitHubリリースが作成されていること
    - リリースアセットが正しくアップロードされていること
    - BRATでインストール可能であること

- [ ] リリース後の動作確認
  - 目的: BRATからのインストールを確認する
  - 詳細:
    - 別のObsidian環境でBRATからインストール
    - 基本機能の動作確認
    - 設定の永続化確認
  - 完了条件:
    - BRATからインストールできること
    - プラグインが正常に動作すること
    - 自動更新が機能すること

---

## 依存関係

### フェーズ間の依存関係
```
Phase 0 (環境構築)
  ↓
Phase 1 (データモデル)
  ↓
Phase 2 (ユーティリティ) ← Phase 1に依存
  ↓
Phase 3 (サービス層コア) ← Phase 1, 2に依存
  ↓
Phase 4 (フォーマット機能) ← Phase 3に依存
  ↓
Phase 5 (クリップボード)
  ↓
Phase 6 (UI層) ← Phase 3, 4, 5に依存
  ↓
Phase 7 (テスト) ← Phase 2, 3, 4に依存(並行可能)
  ↓
Phase 8 (リリース準備) ← Phase 6に依存
  ↓
Phase 9 (統合テスト) ← Phase 6, 7に依存
  ↓
Phase 10 (リリース) ← すべてのフェーズに依存
```

### 並行実行可能なタスク
- Phase 7のテスト実装は、対応する実装完了後すぐに開始可能
- Phase 2のユーティリティ内の各関数は並行実装可能
- Phase 4のフォーマット機能は各機能ごとに並行実装可能

---

## 補足事項

### コミット戦略
- フェーズ単位または機能単位でコミット
- Conventional Commitsルールに従う
- テスト実装は対応する機能と同じコミットに含めることを推奨

### 品質チェックポイント
- 各フェーズ完了時に`npm run lint`を実行
- Phase 7以降は`npm run test`も実行
- Phase 9で最終的な品質確認

### パフォーマンス検証
- Phase 9で1000行のテストノートを作成して性能測定
- 1秒以内で処理が完了することを確認
