# Suggested Commands

## Development Commands

### Install Dependencies
```bash
npm install
```

### Development Build (Watch Mode)
```bash
npm run dev
```
Runs esbuild in watch mode. Automatically recompiles `main.ts` to `main.js` when files change.

### Production Build
```bash
npm run build
```
Runs TypeScript type checking (no emit) and builds the plugin for production using esbuild.

## Quality Assurance Commands

### Type Checking
```bash
npx tsc -noEmit -skipLibCheck
```
Run TypeScript compiler to check for type errors without emitting files.

### Linting
```bash
npx eslint main.ts
```
Run ESLint on main.ts. For checking all TypeScript files:
```bash
npx eslint **/*.ts
```

### Formatting Check
No formatter is configured in the project yet. Consider adding Prettier if needed.

## Testing Commands
**Note**: Testing framework is not set up yet. According to requirements, Jest should be configured.

Once Jest is set up, typical commands would be:
```bash
npm test           # Run all tests
npm test -- --watch  # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report
```

## Version Management

### Version Bump
```bash
npm version patch   # Bump patch version (1.0.0 -> 1.0.1)
npm version minor   # Bump minor version (1.0.0 -> 1.1.0)
npm version major   # Bump major version (1.0.0 -> 2.0.0)
```
This runs `version-bump.mjs` which updates `manifest.json` and `versions.json`, then stages them for commit.

## Git Commands (macOS/Darwin)
Standard git commands work on Darwin:
```bash
git status
git add .
git commit -m "message"
git push
```

## System Utility Commands (macOS/Darwin)
```bash
ls -la          # List files with details
find . -name "*.ts"  # Find TypeScript files
grep -r "pattern" .  # Search for pattern in files
pwd             # Print working directory
cat filename    # Display file contents
```

## Plugin Installation (Manual)
Copy the following files to your vault's plugin directory:
```bash
cp main.js styles.css manifest.json /path/to/vault/.obsidian/plugins/task-reporter/
```

## GitHub CLI (from user preferences)
For retrieving GitHub resources:
```bash
gh issue view <issue-number>
gh pr view <pr-number>
```
**Important**: Do NOT create or modify GitHub resources (issues, PRs) without explicit instruction.
