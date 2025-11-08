import type { Task } from '../models/task';

/**
 * タグでタスクをフィルタリングする (FR-002)
 * @param tasks タスクの配列
 * @param tagPrefix 対象タグプレフィックス (例: "#work/")
 * @param excludePatterns 除外タグパターンの配列
 * @param includeScheduleItems スケジュールアイテムをタグに関係なく含めるか
 * @returns フィルタリングされたタスクの配列
 */
export function filterByTag(
	tasks: readonly Task[],
	tagPrefix: string,
	excludePatterns: readonly string[],
	includeScheduleItems = false
): readonly Task[] {
	return tasks.filter((task) => {
		// サブタスク(level 1)はタグに関係なく保持
		// 親タスクのフィルタリング結果に従う
		if (task.level === 1) {
			return true;
		}

		// スケジュールアイテムをタグに関係なく含める場合
		if (includeScheduleItems && task.isScheduleItem) {
			// 除外タグパターンに一致するタグがないか確認
			const hasExcludeTag = task.tags.some((tag) => excludePatterns.includes(tag));
			if (hasExcludeTag) {
				return false;
			}
			return true;
		}

		// レベル0(親タスク)のみタグでフィルタリング
		// 対象タグプレフィックスを持つタグがあるか確認
		const hasTargetTag = task.tags.some((tag) => tag.startsWith(tagPrefix));
		if (!hasTargetTag) {
			return false;
		}

		// 除外タグパターンに一致するタグがないか確認
		const hasExcludeTag = task.tags.some((tag) => excludePatterns.includes(tag));
		if (hasExcludeTag) {
			return false;
		}

		return true;
	});
}

/**
 * サブアイテムをチェック文字でフィルタリングする (FR-003)
 * @param tasks タスクの配列
 * @param targetCheckChar 対象チェック文字 (例: "k")
 * @returns フィルタリングされたタスクの配列
 */
export function filterSubItems(tasks: readonly Task[], targetCheckChar: string): readonly Task[] {
	return tasks.filter((task) => {
		// レベル0(親タスク)は常に含める
		if (task.level === 0) {
			return true;
		}

		// レベル1(サブタスク)は対象チェック文字のもののみ
		return task.checkChar === targetCheckChar;
	});
}
