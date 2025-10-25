import type { Task } from '../models/task';
import { findHeading, parseTaskList } from '../utils/markdown-parser';

/**
 * 指定された見出し配下のタスクを抽出する (FR-001)
 * @param content ノート全体の内容
 * @param heading 対象見出し (例: "## 今日やったこと")
 * @returns 抽出されたTaskの配列
 */
export function extractTasksFromHeading(content: string, heading: string): readonly Task[] {
	const headingLineNumber = findHeading(content, heading);

	if (headingLineNumber === null) {
		return [];
	}

	const lines = content.split('\n');
	const tasksLines: string[] = [];

	// 見出しの次の行から次の見出しまたは末尾までを取得
	for (let i = headingLineNumber + 1; i < lines.length; i++) {
		const line = lines[i];

		// 次の見出し(#で始まる行)が見つかったら終了
		if (line.trim().startsWith('#')) {
			break;
		}

		tasksLines.push(line);
	}

	return parseTaskList(tasksLines);
}
