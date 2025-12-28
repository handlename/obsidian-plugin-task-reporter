import type { Task } from '../models/task';

/**
 * 指定された見出しの行番号を検索する
 * @param content ノート全体の内容
 * @param heading 検索する見出し (例: "## 今日やったこと")
 * @returns 見出しの行番号(0-indexed)、見つからない場合はnull
 */
export function findHeading(content: string, heading: string): number | null {
	const lines = content.split('\n');
	const index = lines.findIndex((line) => line.trim() === heading.trim());
	return index >= 0 ? index : null;
}

/**
 * タスクリストを解析してTaskオブジェクトの配列に変換する
 * @param lines タスクリストを含む行の配列
 * @param schedulePrefix スケジュールプレフィックス (例: "🗓️")
 * @returns Taskオブジェクトの配列
 */
export function parseTaskList(lines: readonly string[], schedulePrefix: string): readonly Task[] {
	const tasks: Task[] = [];
	const taskRegex = /^(\s*)- \[(.)\] (.+)$/;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const match = line.match(taskRegex);

		if (match) {
			const [, indent, checkChar, content] = match;
			const level = indent.length === 0 ? 0 : 1;
			const tags = extractTags(content);
			const isScheduleItem = content.trimStart().startsWith(schedulePrefix);

			tasks.push({
				content,
				level,
				checkChar,
				tags,
				lineNumber: i,
				isScheduleItem,
			});
		}
	}

	return tasks;
}

/**
 * テキストからタグを抽出する
 * @param text テキスト
 * @returns タグの配列 (例: ["#work/dev", "#important"])
 */
export function extractTags(text: string): readonly string[] {
	const tagRegex = /#[\w/]+/g;
	const matches = text.match(tagRegex);
	return matches ?? [];
}

/**
 * 行の見出しレベルを取得する
 * @param line 解析対象の行
 * @returns 見出しレベル (例: "## 見出し" -> 2)、見出しでない場合はnull
 */
export function getHeadingLevel(line: string): number | null {
	const match = line.trim().match(/^(#+)\s/);
	return match ? match[1].length : null;
}
