# Task Completion Checklist

When completing a development task, follow these steps:

## 1. Code Quality Checks (MUST)

### Type Checking
```bash
npx tsc -noEmit -skipLibCheck
```
Ensure no TypeScript errors exist.

### Linting
```bash
npx eslint main.ts
# Or for all TypeScript files:
npx eslint **/*.ts
```
Ensure ESLint reports no errors.

## 2. Testing (MUST)
```bash
npm test
```
**Status**: Testing framework not yet configured. Once Jest is set up:
- Run all related tests
- Ensure tests pass
- Add new tests for new functionality
- Verify test coverage meets 80% target (per requirements)

## 3. Build Verification
```bash
npm run build
```
Ensure the production build completes successfully without errors.

## 4. Manual Testing (Recommended)
- Test the plugin in Obsidian
- Verify functionality works as expected
- Check edge cases mentioned in requirements

## 5. Documentation (If Applicable)
- Update README.md if user-facing changes
- Update code comments for complex logic
- Follow comment guidelines: no redundant comments, only intent-clarifying ones

## 6. Git Commit (MUST follow user guidelines)
Before committing:
1. Verify all tests pass (per user's MUST requirement)
2. Stage changes: `git add .`
3. Commit with conventional commit format: `git commit -m "feat: description"`

## 7. Version Management (For Releases)
```bash
# Update minAppVersion in manifest.json manually if needed
npm version patch  # or minor/major
```

## Notes
- **User requirement**: Tests MUST pass before commit
- **User requirement**: Do NOT use GitHub CLI to create/modify issues or PRs without instruction
- **Code style**: Follow tab indentation (4 spaces), LF line endings, UTF-8 encoding
- **Pure functions**: Prefer pure functions for new code (per user SHOULD guideline)
- **Immutable types**: Prefer immutable types for new code (per user SHOULD guideline)
