import { Plugin } from 'obsidian';

export default class TaskReporterPlugin extends Plugin {
	async onload() {
		console.log('Loading Task Reporter Plugin');
	}

	async onunload() {
		console.log('Unloading Task Reporter Plugin');
	}
}
