export interface PluginSettings {
	targetHeading: string;
	targetTagPrefix: string;
	excludeTagPatterns: string[];
	targetSubItemCheckChar: string;
	canceledCheckChar: string;
	schedulePrefix: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	targetHeading: '## 今日やったこと',
	targetTagPrefix: '#work/',
	excludeTagPatterns: ['#work/routine'],
	targetSubItemCheckChar: 'k',
	canceledCheckChar: '-',
	schedulePrefix: '📅',
};
