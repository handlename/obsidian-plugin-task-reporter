import {
	applyStrikethrough,
	convertTag,
	formatGitHubUrl,
	removeInternalLinks,
} from '../../src/utils/text-formatter';

describe('text-formatter', () => {
	describe('convertTag', () => {
		it('should convert tag with matching prefix', () => {
			const text = 'Task with #work/dev tag';
			expect(convertTag(text, '#work/')).toBe('Task with *dev* tag');
		});

		it('should convert multiple tags with same prefix', () => {
			const text = '#work/dev and #work/review';
			expect(convertTag(text, '#work/')).toBe('*dev* and *review*');
		});

		it('should not convert tags with different prefix', () => {
			const text = 'Task with #project/alpha tag';
			expect(convertTag(text, '#work/')).toBe('Task with #project/alpha tag');
		});

		it('should handle mixed tags', () => {
			const text = '#work/dev #project/alpha #work/review';
			expect(convertTag(text, '#work/')).toBe('*dev* #project/alpha *review*');
		});

		it('should handle text without tags', () => {
			const text = 'Task without tags';
			expect(convertTag(text, '#work/')).toBe('Task without tags');
		});

		it('should handle empty string', () => {
			expect(convertTag('', '#work/')).toBe('');
		});

		it('should handle prefix with special regex characters', () => {
			const text = '#work+test/dev';
			expect(convertTag(text, '#work+test/')).toBe('*dev*');
		});

		it('should handle tags with underscores', () => {
			const text = '#work/dev_test';
			expect(convertTag(text, '#work/')).toBe('*dev_test*');
		});
	});

	describe('removeInternalLinks', () => {
		it('should remove Markdown internal link', () => {
			const text = 'See [this note](note.md) for details';
			expect(removeInternalLinks(text)).toBe('See this note for details');
		});

		it('should preserve external links', () => {
			const text = 'See [website](https://example.com) for details';
			expect(removeInternalLinks(text)).toBe('See [website](https://example.com) for details');
		});

		it('should remove WikiLink', () => {
			const text = 'See [[Note Name]] for details';
			expect(removeInternalLinks(text)).toBe('See Note Name for details');
		});

		it('should remove WikiLink with alias', () => {
			const text = 'See [[path/to/note|Alias]] for details';
			expect(removeInternalLinks(text)).toBe('See Alias for details');
		});

		it('should handle multiple internal links', () => {
			const text = 'See [note1](note1.md) and [[note2]] and [[path|alias]]';
			expect(removeInternalLinks(text)).toBe('See note1 and note2 and alias');
		});

		it('should preserve http links', () => {
			const text = '[Link](http://example.com)';
			expect(removeInternalLinks(text)).toBe('[Link](http://example.com)');
		});

		it('should preserve https links', () => {
			const text = '[Link](https://example.com)';
			expect(removeInternalLinks(text)).toBe('[Link](https://example.com)');
		});

		it('should handle text without links', () => {
			const text = 'Plain text without any links';
			expect(removeInternalLinks(text)).toBe('Plain text without any links');
		});

		it('should handle empty string', () => {
			expect(removeInternalLinks('')).toBe('');
		});

		it('should handle mixed link types', () => {
			const text =
				'Internal [link](note.md), external [link](https://example.com), [[wiki]], [[path|alias]]';
			expect(removeInternalLinks(text)).toBe(
				'Internal link, external [link](https://example.com), wiki, alias',
			);
		});
	});

	describe('formatGitHubUrl', () => {
		it('should format GitHub issue URL', () => {
			const text = 'Fixed https://github.com/owner/repo/issues/123';
			expect(formatGitHubUrl(text)).toBe('Fixed [repo#123](https://github.com/owner/repo/issues/123)');
		});

		it('should format GitHub PR URL', () => {
			const text = 'Merged https://github.com/owner/repo/pulls/456';
			expect(formatGitHubUrl(text)).toBe('Merged [repo#456](https://github.com/owner/repo/pulls/456)');
		});

		it('should format multiple GitHub URLs', () => {
			const text =
				'https://github.com/owner1/repo1/issues/1 and https://github.com/owner2/repo2/pulls/2';
			expect(formatGitHubUrl(text)).toBe(
				'[repo1#1](https://github.com/owner1/repo1/issues/1) and [repo2#2](https://github.com/owner2/repo2/pulls/2)',
			);
		});

		it('should preserve non-GitHub URLs', () => {
			const text = 'https://example.com/issues/123';
			expect(formatGitHubUrl(text)).toBe('https://example.com/issues/123');
		});

		it('should handle text without URLs', () => {
			const text = 'Plain text without URLs';
			expect(formatGitHubUrl(text)).toBe('Plain text without URLs');
		});

		it('should handle empty string', () => {
			expect(formatGitHubUrl('')).toBe('');
		});

		it('should handle GitHub URLs with anchors', () => {
			const text = 'https://github.com/owner/repo/issues/123#issuecomment-456';
			expect(formatGitHubUrl(text)).toBe(
				'[repo#123](https://github.com/owner/repo/issues/123#issuecomment-456)',
			);
		});

		it('should handle GitHub URLs with query parameters', () => {
			const text = 'https://github.com/owner/repo/issues/123?tab=comments';
			expect(formatGitHubUrl(text)).toBe(
				'[repo#123](https://github.com/owner/repo/issues/123?tab=comments)',
			);
		});
	});

	describe('applyStrikethrough', () => {
		it('should apply strikethrough to text', () => {
			expect(applyStrikethrough('canceled task')).toBe('~canceled task~');
		});

		it('should handle empty string', () => {
			expect(applyStrikethrough('')).toBe('~~');
		});

		it('should handle text with special characters', () => {
			expect(applyStrikethrough('task with #tag and [link](url)')).toBe(
				'~task with #tag and [link](url)~',
			);
		});

		it('should handle text with existing formatting', () => {
			expect(applyStrikethrough('*bold* and _italic_')).toBe('~*bold* and _italic_~');
		});
	});
});
