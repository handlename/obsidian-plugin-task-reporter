export interface PluginSettings {
	targetHeading: string;
	targetTagPrefix: string;
	excludeTagPatterns: string[];
	targetSubItemCheckChar: string;
	canceledCheckChar: string;
	schedulePrefix: string;
	includeScheduleItems: boolean;
	includeSubHeadings: boolean;
	removeAnchors: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	targetHeading: '## Task',
	targetTagPrefix: '#work/',
	excludeTagPatterns: ['#work/routine'],
	targetSubItemCheckChar: 'k',
	canceledCheckChar: '-',
	schedulePrefix: '🗓️',
	includeScheduleItems: false,
	includeSubHeadings: false,
	removeAnchors: true,
};
