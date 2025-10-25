export interface PluginSettings {
	readonly targetHeading: string;
	readonly targetTagPrefix: string;
	readonly excludeTagPatterns: readonly string[];
	readonly targetSubItemCheckChar: string;
	readonly canceledCheckChar: string;
	readonly schedulePrefix: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	targetHeading: '## 今日やったこと',
	targetTagPrefix: '#work/',
	excludeTagPatterns: ['#work/routine'],
	targetSubItemCheckChar: 'k',
	canceledCheckChar: '-',
	schedulePrefix: '📅',
};
