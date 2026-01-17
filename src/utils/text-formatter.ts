/**
 * タグを変換する (FR-004)
 * プレフィックスに一致するタグを `*tagname*` 形式に変換
 * @param text テキスト
 * @param prefix 対象タグプレフィックス (例: "#work/")
 * @returns 変換後のテキスト
 */
export function convertTag(text: string, prefix: string): string {
	const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const regex = new RegExp(`${escapedPrefix}([\\w]+)`, 'g');
	return text.replace(regex, '*$1*');
}

/**
 * 内部リンクを除去する (FR-005)
 * Markdown形式とWikiLink形式の内部リンクをテキストのみに変換
 * @param text テキスト
 * @returns 変換後のテキスト
 */
export function removeInternalLinks(text: string): string {
	let result = text;

	// Markdown形式の内部リンク: [text](path.md) → text (外部リンクは除く)
	result = result.replace(/\[([^\]]+)\]\((?!https?:\/\/)([^)]+)\)/g, '$1');

	// エイリアス付きWikiLink: [[path|alias]] → alias
	result = result.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');

	// WikiLink: [[path]] → path
	result = result.replace(/\[\[([^\]]+)\]\]/g, '$1');

	return result;
}

/**
 * アンカー（ブロックリンク）を除去する
 * Obsidianのブロックリンク形式 ^block-id を除去
 * @param text テキスト
 * @returns アンカー除去後のテキスト
 */
export function removeAnchors(text: string): string {
	// ブロックIDアンカー: ^block-id 形式を除去
	// スペースの後に続くアンカー、またはリンク内のアンカー参照を対象
	// 累乗表記(5^2など)を誤って除去しないよう、^の前にスペースか#が必要
	return text.replace(/\s+\^[\w-]+|#\^[\w-]+/g, (match) => {
		// #で始まる場合は#を残す
		if (match.startsWith('#')) {
			return '#';
		}
		return '';
	});
}

/**
 * GitHub URLを整形する (FR-006)
 * Issue/PR URLを [repo#number](url) 形式に変換
 * ただし、既にMarkdownリンク内にあるURLは変換しない
 * @param text テキスト
 * @returns 変換後のテキスト
 */
export function formatGitHubUrl(text: string): string {
	// 既にMarkdownリンク内にあるURLは変換しない
	// 負の後読み(?<!\]\() を使って、](の直後にあるURLは除外
	const githubRegex =
		/(?<!\]\()https:\/\/github\.com\/([^/]+)\/([^/]+)\/(issues|pulls)\/(\d+)(\S*)/g;
	return text.replace(githubRegex, '[$2#$4](https://github.com/$1/$2/$3/$4$5)');
}

/**
 * 取り消し線を適用する (FR-007)
 * テキストを ~text~ で囲む
 * @param text テキスト
 * @returns 取り消し線付きテキスト
 */
export function applyStrikethrough(text: string): string {
	return `~${text}~`;
}
