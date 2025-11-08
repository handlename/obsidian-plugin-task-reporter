export interface Task {
	readonly content: string;
	readonly level: number;
	readonly checkChar: string;
	readonly tags: readonly string[];
	readonly lineNumber: number;
	readonly isScheduleItem: boolean;
}
