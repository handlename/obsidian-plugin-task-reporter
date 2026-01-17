import type { PluginSettings } from '../models/settings';
import type { Task } from '../models/task';
import {
	applyStrikethrough,
	convertTag,
	formatGitHubUrl,
	removeAnchors,
	removeInternalLinks,
} from '../utils/text-formatter';

/**
 * タスクの配列をフォーマットされた文字列に変換する (FR-004~FR-008統合)
 * @param tasks タスクの配列
 * @param settings プラグイン設定
 * @returns フォーマットされた文字列
 */
export function formatTasks(tasks: readonly Task[], settings: PluginSettings): string {
	const formattedLines = tasks.map((task) => formatTask(task, settings));
	return formattedLines.join('\n');
}

/**
 * 単一タスクをフォーマットする
 * @param task タスク
 * @param settings プラグイン設定
 * @returns フォーマットされた文字列
 */
function formatTask(task: Task, settings: PluginSettings): string {
	let content = formatTaskContent(task.content, settings);

	// FR-007: スケジュールタスクの絵文字付与（取り消し線の前に処理）
	const hasSchedulePrefix = task.content.startsWith(settings.schedulePrefix);
	if (hasSchedulePrefix && !content.startsWith(settings.schedulePrefix)) {
		content = `${settings.schedulePrefix} ${content}`;
	}

	// FR-007: キャンセルタスクの取り消し線処理
	if (task.checkChar === settings.canceledCheckChar) {
		content = applyStrikethrough(content);
	}

	// FR-008: インデント処理
	const indent = task.level === 0 ? '' : '    ';
	return `${indent}- ${content}`;
}

/**
 * タスク本文をフォーマットする
 * @param content タスク本文
 * @param settings プラグイン設定
 * @returns フォーマットされた本文
 */
export function formatTaskContent(content: string, settings: PluginSettings): string {
	let result = content;

	// FR-004: タグ変換
	result = convertTag(result, settings.targetTagPrefix);

	// FR-005: 内部リンク除去
	result = removeInternalLinks(result);

	// アンカー除去（設定で有効な場合）
	if (settings.removeAnchors) {
		result = removeAnchors(result);
	}

	// FR-006: GitHub URL整形
	result = formatGitHubUrl(result);

	return result;
}
