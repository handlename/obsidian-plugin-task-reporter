import { MarkdownView, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, type PluginSettings } from './models/settings';
import { copyToClipboard } from './services/clipboard-service';
import { extractTasksFromHeading } from './services/task-extractor';
import { filterByTag, filterSubItems } from './services/task-filter';
import { formatTasks } from './services/task-formatter';

export default class TaskReporterPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		// コマンド登録
		this.addCommand({
			id: 'format-tasks-to-clipboard',
			name: 'Format tasks and copy to clipboard',
			callback: () => this.formatAndCopyTasks(),
		});
	}

	async onunload() {
		// クリーンアップ処理(必要に応じて)
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async formatAndCopyTasks() {
		try {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				new Notice('No active markdown view');
				return;
			}

			const content = activeView.editor.getValue();

			// タスク抽出
			const tasks = extractTasksFromHeading(content, this.settings.targetHeading);

			if (tasks.length === 0) {
				new Notice(`指定された見出し『${this.settings.targetHeading}』が見つかりませんでした`);
				return;
			}

			// タグでフィルタリング
			const tagFiltered = filterByTag(
				tasks,
				this.settings.targetTagPrefix,
				this.settings.excludeTagPatterns
			);

			// サブアイテムをフィルタリング
			const filtered = filterSubItems(tagFiltered, this.settings.targetSubItemCheckChar);

			if (filtered.length === 0) {
				new Notice('フォーマット対象のタスクが見つかりませんでした');
				return;
			}

			// フォーマット
			const formatted = formatTasks(filtered, this.settings);

			// クリップボードにコピー
			await copyToClipboard(formatted);

			new Notice(`${filtered.length}件のタスクをクリップボードにコピーしました`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			new Notice(`エラーが発生しました: ${message}`);
			console.error('TaskReporter error:', error);
		}
	}
}
