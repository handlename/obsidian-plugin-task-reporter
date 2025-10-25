# Requirements Summary

This is a high-level summary of the detailed requirements in REQUIREMENTS.md (written in Japanese).

## Core Functionality

### Task Extraction (FR-001)
Extract task lists from under a specified heading in the current note.
- Configurable target heading (default: "## 今日やったこと")
- Recognizes Markdown task format (`- [ ]`, `- [x]`)
- Processes all hierarchy levels under the heading

### Tag Filtering (FR-002)
Filter tasks by tags:
- Include: Tasks with specified tag prefix (default: `#work/`)
- Exclude: Tasks with specific exclusion tags (default: `#work/routine`)

### Sub-item Filtering (FR-003)
Filter sub-items by check character:
- Only include sub-items with specific check characters (default: `k`)
- Format: `- [k] sub-task`
- Maximum hierarchy: Level 1 (parent = level 0)

### Text Formatting

#### Tag Conversion (FR-004)
Transform tags to report format:
- `#work/sre` → `*sre*` (italic)
- Remove configured prefix, keep tag name in italics
- Leave other tags unchanged

#### Internal Link Removal (FR-005)
Convert Obsidian links to plain text:
- Markdown links: `[text](path.md)` → `text`
- WikiLinks: `[[page]]` → `page`
- Aliased WikiLinks: `[[path|alias]]` → `alias`
- Preserve external links (starting with `https://`)

#### GitHub URL Formatting (FR-006)
Shorten GitHub issue/PR URLs:
- `https://github.com/org/repo/issues/1234` → `[repo#1234](URL)`
- Works for both issues and pull requests

#### Status Decoration (FR-007)
Apply status-based formatting:
- Cancelled tasks (`- [-]`): Wrap text in `~text~` (strikethrough)
- Schedule items: Add prefix emoji `📅` (configurable)

### Hierarchy Preservation (FR-008)
Maintain task hierarchy with indentation:
- Level 0 (parent): No indentation
- Level 1 (sub-item): 4 spaces + `- `

### Clipboard Copy (FR-009)
Copy formatted text to clipboard:
- Execute via command palette or ribbon button
- Show notification on completion

### Error Handling (FR-010)
Display appropriate error messages:
- Heading not found: Alert with heading name
- No matching tasks: Alert about empty result
- Other errors: Show descriptive message

### Settings UI (FR-011)
Configurable parameters:
- Target heading
- Include tag prefix
- Exclude tag pattern
- Sub-item check character
- Cancel task check character
- Schedule task prefix

## Non-Functional Requirements

### Performance (NFR-001)
Complete formatting within 3 seconds for notes up to 1000 lines.

### Compatibility (NFR-002)
Support Obsidian API v1.0+. Use only public APIs.

### Maintainability (NFR-003)
- TypeScript implementation
- Pure functions preferred
- 80%+ test coverage
- Meaningful comments only (no redundant comments)

### Security (NFR-004)
- No external data transmission
- All processing local
- Plain-text settings (no sensitive data)

### Usability (NFR-005)
- Accessible from command palette
- Optional ribbon icon
- Clear error messages

## Technical Constraints
- Language: TypeScript
- Platform: Obsidian Plugin API
- Build: esbuild
- Testing: Jest (to be configured)
- Node.js: v18+
- npm: v9+

## Key Risks
1. Obsidian API breaking changes → Use only official APIs, pin versions
2. Markdown format diversity → Support standard formats only
3. Performance with large notes → Process only target heading section
