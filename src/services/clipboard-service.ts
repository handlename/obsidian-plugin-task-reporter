/**
 * クリップボードにテキストをコピーする (FR-009)
 * @param text コピーするテキスト
 */
export async function copyToClipboard(text: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
	} catch (error) {
		throw new Error(
			`Failed to copy to clipboard: ${error instanceof Error ? error.message : String(error)}`
		);
	}
}
