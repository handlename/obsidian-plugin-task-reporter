# Code Style and Conventions

## Language and Type System
- **Language**: TypeScript with strict type checking enabled
- **TypeScript Configuration**:
  - `strictNullChecks`: true
  - `noImplicitAny`: true
  - Target: ES6
  - Module: ESNext

## Code Style
- **Indentation**: Tabs (tab width: 4, indent size: 4) as per .editorconfig
- **Line Endings**: LF (Unix-style)
- **Charset**: UTF-8
- **Final Newline**: Required

## Naming Conventions
- Classes: PascalCase (e.g., `MyPlugin`, `SampleModal`, `SampleSettingTab`)
- Interfaces: PascalCase with descriptive names (e.g., `MyPluginSettings`)
- Variables/Functions: camelCase
- Constants: camelCase for default objects (e.g., `DEFAULT_SETTINGS`)

## ESLint Rules
- Uses TypeScript ESLint recommended rules
- Custom overrides:
  - `@typescript-eslint/no-unused-vars`: error, but ignores function arguments
  - `@typescript-eslint/ban-ts-comment`: off
  - `@typescript-eslint/no-empty-function`: off
  - `no-prototype-builtins`: off

## User-Defined Coding Guidelines (from ~/.claude/CLAUDE.md)

### Pure Functions (SHOULD)
- Actively use pure functions (functions without side effects)
- Pure functions are easier to test and understand
- **Important**: Do NOT refactor existing functions to pure functions unless explicitly instructed

### Immutable Types (SHOULD)
- Actively use immutable types
- Immutability helps maintain invariants and facilitates parallel processing
- **Important**: Do NOT convert existing types to immutable unless explicitly instructed

### Comments (MUST)
- **Forbidden**: Redundant comments for simple operations (e.g., single function calls)
- **Required**: Comments that explain the intent when code alone is unclear

### Testing Before Commit (MUST)
- Always ensure related tests pass before git commit
- Run tests related to the current task
- Add and verify additional tests if judged to be related

## Documentation Style
- Use TSDoc for documenting public APIs
- Keep comments concise and focused on intent, not implementation details
