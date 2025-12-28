import type { Task } from '../models/task';
import { findHeading, getHeadingLevel, parseTaskList } from '../utils/markdown-parser';

/**
 * 指定された見出し配下のタスクを抽出する (FR-001)
 * @param content ノート全体の内容
 * @param heading 対象見出し (例: "## 今日やったこと")
 * @param schedulePrefix スケジュールプレフィックス (例: "🗓️")
 * @param includeSubHeadings 子見出し配下のタスクも含めるか (FR-012〜FR-015)
 * @returns 抽出されたTaskの配列
 */
export function extractTasksFromHeading(
	content: string,
	heading: string,
	schedulePrefix: string,
	includeSubHeadings = false
): readonly Task[] {
	const headingLineNumber = findHeading(content, heading);

	if (headingLineNumber === null) {
		return [];
	}

	const lines = content.split('\n');
	const targetHeadingLevel = getHeadingLevel(heading);
	const tasksLines: string[] = [];

	// 見出しの次の行から次の見出しまたは末尾までを取得
	for (let i = headingLineNumber + 1; i < lines.length; i++) {
		const line = lines[i];
		const lineHeadingLevel = getHeadingLevel(line);

		if (lineHeadingLevel !== null) {
			if (targetHeadingLevel !== null && lineHeadingLevel <= targetHeadingLevel) {
				// 同レベル以上の見出しで終了
				break;
			}
			if (!includeSubHeadings) {
				// 子見出しを含めない場合は終了
				break;
			}
			// 子見出し自体はスキップしてタスク行のみ収集を続行
			continue;
		}

		tasksLines.push(line);
	}

	return parseTaskList(tasksLines, schedulePrefix);
}
