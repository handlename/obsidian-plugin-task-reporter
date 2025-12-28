import { type App, PluginSettingTab, Setting } from 'obsidian';
import type TaskReporterPlugin from '../main';

export class TaskReporterSettingTab extends PluginSettingTab {
	plugin: TaskReporterPlugin;

	constructor(app: App, plugin: TaskReporterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Task Reporter Settings' });

		// 対象見出し
		new Setting(containerEl)
			.setName('対象見出し')
			.setDesc('タスクを抽出する見出し (例: ## 今日やったこと)')
			.addText((text) =>
				text.setValue(this.plugin.settings.targetHeading).onChange(async (value) => {
					this.plugin.settings.targetHeading = value;
					await this.plugin.saveSettings();
				})
			);

		// 対象タグプレフィックス
		new Setting(containerEl)
			.setName('対象タグプレフィックス')
			.setDesc('フォーマット対象とするタグのプレフィックス (例: #work/)')
			.addText((text) =>
				text.setValue(this.plugin.settings.targetTagPrefix).onChange(async (value) => {
					this.plugin.settings.targetTagPrefix = value;
					await this.plugin.saveSettings();
				})
			);

		// 除外タグパターン
		new Setting(containerEl)
			.setName('除外タグパターン')
			.setDesc('除外するタグ (カンマ区切り、例: #work/routine,#work/meeting)')
			.addText((text) =>
				text.setValue(this.plugin.settings.excludeTagPatterns.join(',')).onChange(async (value) => {
					this.plugin.settings.excludeTagPatterns = value
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					await this.plugin.saveSettings();
				})
			);

		// 対象サブアイテムのチェック文字
		new Setting(containerEl)
			.setName('対象サブアイテムのチェック文字')
			.setDesc('サブアイテムとして含めるチェック文字 (例: k)')
			.addText((text) =>
				text.setValue(this.plugin.settings.targetSubItemCheckChar).onChange(async (value) => {
					this.plugin.settings.targetSubItemCheckChar = value;
					await this.plugin.saveSettings();
				})
			);

		// キャンセルタスクのチェック文字
		new Setting(containerEl)
			.setName('キャンセルタスクのチェック文字')
			.setDesc('取り消し線を適用するチェック文字 (例: -)')
			.addText((text) =>
				text.setValue(this.plugin.settings.canceledCheckChar).onChange(async (value) => {
					this.plugin.settings.canceledCheckChar = value;
					await this.plugin.saveSettings();
				})
			);

		// スケジュールタスクのプレフィックス
		new Setting(containerEl)
			.setName('スケジュールタスクのプレフィックス')
			.setDesc('スケジュールタスクの先頭に付ける絵文字 (例: 🗓️)')
			.addText((text) =>
				text.setValue(this.plugin.settings.schedulePrefix).onChange(async (value) => {
					this.plugin.settings.schedulePrefix = value;
					await this.plugin.saveSettings();
				})
			);

		// スケジュールアイテムを含める
		new Setting(containerEl)
			.setName('スケジュールアイテムを含める')
			.setDesc('スケジュールプレフィックスがついたアイテムをタグに関係なくレポートに含める')
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.includeScheduleItems).onChange(async (value) => {
					this.plugin.settings.includeScheduleItems = value;
					await this.plugin.saveSettings();
				})
			);

		// 孫要素も含める
		new Setting(containerEl)
			.setName('孫要素も含める')
			.setDesc('対象見出し配下の子見出し内のタスクもレポートに含める')
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.includeSubHeadings).onChange(async (value) => {
					this.plugin.settings.includeSubHeadings = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
