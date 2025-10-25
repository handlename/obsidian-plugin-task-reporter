# Obsidian Plugin Task Reporter - Project Overview

## Project Information

- **Repository**: handlename/obsidian-plugin-task-reporter
- **Description**: Obsidianで管理しているタスクリストを日報などの報告用フォーマットに整形し、クリップボードにコピーするプラグイン
- **Author**: handlename
- **License**: MIT
- **Current Version**: 0.1.0
- **Node.js Version**: v24 (LTS)
- **Package Manager**: npm

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.7.2
- **Platform**: Obsidian Plugin API (latest)
- **Build Tool**: esbuild 0.24.0
- **Test Framework**: Jest 29.7.0 with ts-jest 29.2.5
- **Linter/Formatter**: Biome 1.9.4 (instead of ESLint/Prettier)

### Development Tools
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Release Automation**: tagpr 1.8.4
- **Action Pinning**: pinact (SHA-256 hash pinning)
- **Beta Distribution**: BRAT (Beta Reviewers Auto-update Tool)

## Project Structure

```
.
├── src/
│   ├── models/           # Data models
│   │   ├── task.ts       # Task interface
│   │   └── settings.ts   # Plugin settings
│   ├── utils/            # Utility functions
│   │   ├── markdown-parser.ts
│   │   └── text-formatter.ts
│   ├── services/         # Business logic
│   │   ├── task-extractor.ts
│   │   ├── task-filter.ts
│   │   ├── task-formatter.ts
│   │   └── clipboard-service.ts
│   ├── ui/               # UI components
│   │   └── settings-tab.ts
│   └── main.ts           # Plugin entry point
├── tests/                # Unit tests
│   ├── utils/
│   └── services/
├── scripts/              # Build scripts
│   └── prepare-release.mjs
├── .github/
│   └── workflows/
│       ├── ci.yml        # CI workflow
│       └── tagpr.yml     # Release workflow
├── manifest.json         # Plugin manifest
├── manifest-beta.json    # BRAT beta manifest
├── package.json
├── biome.json
├── jest.config.js
├── tsconfig.json
├── esbuild.config.mjs
└── .tagpr                # tagpr configuration
```

## Architecture

### 3-Layer Architecture

1. **Model Layer** (`src/models/`)
   - Data structures with readonly properties
   - Type-safe interfaces
   - No business logic

2. **Service Layer** (`src/services/`)
   - Pure functions (no side effects)
   - Business logic implementation
   - Composable utilities

3. **UI Layer** (`src/ui/` and `src/main.ts`)
   - Obsidian Plugin integration
   - Command registration
   - Settings UI
   - Error handling

## Key Features

### Functional Requirements (FR)

- **FR-001**: Extract tasks from specified heading
- **FR-002**: Filter tasks by tag prefix
- **FR-003**: Filter sub-items by check character
- **FR-004**: Convert tags (`#work/dev` → `*dev*`)
- **FR-005**: Remove internal links
- **FR-006**: Format GitHub URLs
- **FR-007**: Apply strikethrough to canceled tasks
- **FR-008**: Add indentation for sub-items
- **FR-009**: Copy to clipboard
- **FR-010**: Error handling with Japanese messages
- **FR-011**: Plugin settings UI

### Non-Functional Requirements (NFR)

- **NFR-001**: Performance - Process 1000 lines in < 3 seconds
- **NFR-002**: Pure functions and immutable data structures
- **NFR-003**: Code quality - 80%+ test coverage, zero lint errors

## Default Settings

```typescript
{
  targetHeading: "## Task",
  targetTagPrefix: "#work/",
  excludeTagPatterns: ["#work/routine"],
  targetSubItemCheckChar: "k",
  canceledCheckChar: "-",
  schedulePrefix: "🗓️"
}
```

## Testing

- **Total Tests**: 103
- **Test Coverage**: 98.83%
- **Test Suites**: 5
  - markdown-parser.test.ts
  - text-formatter.test.ts
  - task-extractor.test.ts
  - task-filter.test.ts
  - task-formatter.test.ts

## Build and Release

### Build Process

```bash
npm run dev      # Development mode with file watching
npm run build    # Production build
npm run release  # Prepare release files
```

### Release Workflow (Automated)

1. Commit to main branch
2. tagpr creates version bump PR
3. Merge PR triggers release
4. GitHub Actions builds and uploads assets
5. Release includes: main.js, manifest.json, manifest-beta.json, styles.css

### Version Management

- **tagpr** manages versions in: manifest.json, manifest-beta.json, package.json
- **Conventional Commits** for version bumping:
  - `feat:` → Minor version (0.1.0 → 0.2.0)
  - `fix:` → Patch version (0.1.0 → 0.1.1)
  - `major` label → Major version (0.1.0 → 1.0.0)

## CI/CD

### CI Workflow (`.github/workflows/ci.yml`)

Triggers: Push/PR to main branch

Jobs:
1. **Lint**: Biome code quality check
2. **Test**: 103 unit tests + coverage verification (80% threshold)
3. **Build**: Plugin build + artifact upload

### Release Workflow (`.github/workflows/tagpr.yml`)

Triggers: Push to main branch

Jobs:
1. **tagpr**: Create/update version PR
2. **Build**: Build plugin on tag creation
3. **Upload**: Upload release assets

### Security

- All GitHub Actions pinned to SHA-256 hashes via pinact
- Prevents supply chain attacks
- Version comments for readability

## Installation Methods

### BRAT (Beta - Recommended)

```
Repository: handlename/obsidian-plugin-task-reporter
```

Uses `manifest-beta.json` for version tracking and auto-updates.

### Manual Installation

1. Download main.js, manifest.json, styles.css from releases
2. Place in `.obsidian/plugins/task-reporter/`
3. Enable in Obsidian settings

## Development Workflow

### Setup

```bash
npm install
npm run dev
```

### Testing

```bash
npm test                 # Run tests
npm run test:coverage    # With coverage report
```

### Code Quality

```bash
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run format           # Format code
```

### Commit

- Follow Conventional Commits format
- Run tests before commit
- Use `/commit-it` command for automated commit message generation

## Important Files

### Configuration Files

- **biome.json**: Linter/formatter configuration (tab indentation, 100 line width)
- **jest.config.js**: Test configuration with ts-jest
- **tsconfig.json**: TypeScript strict mode enabled
- **esbuild.config.mjs**: Production build configuration
- **.tagpr**: Release automation configuration

### Manifest Files

- **manifest.json**: Official plugin manifest
- **manifest-beta.json**: BRAT beta version manifest (same content as manifest.json)

### Documentation

- **REQUIREMENTS.md**: Detailed requirements specification
- **DESIGN.md**: Technical design document
- **TASKS.md**: Implementation task tracking
- **README.md**: User and developer documentation

## Code Patterns

### Pure Functions

All utility and service functions are pure (no side effects):

```typescript
export function formatTasks(
  tasks: readonly Task[],
  settings: PluginSettings
): string
```

### Immutable Data

Using readonly modifiers:

```typescript
export interface Task {
  readonly content: string;
  readonly level: number;
  readonly tags: readonly string[];
}
```

### Error Handling

Japanese error messages for user-facing errors:

```typescript
new Notice("エラー: 見出しが見つかりません");
```

## Git Workflow

- **Main Branch**: main
- **Release Branch**: main (tagpr creates PRs to main)
- **Commit Format**: Conventional Commits
- **Pre-commit**: Tests must pass

## Performance Metrics

- **Build Time**: < 1 second (esbuild)
- **Test Time**: ~0.2 seconds (103 tests)
- **Bundle Size**: 6.5KB (main.js)
- **Coverage**: 98.83%
