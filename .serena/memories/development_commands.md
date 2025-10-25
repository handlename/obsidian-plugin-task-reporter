# Development Commands and Workflows

## Quick Reference

### Daily Development

```bash
# Install dependencies
npm install

# Development mode (watch mode)
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Build for production
npm run build
```

## Detailed Command Reference

### Installation and Setup

```bash
# Initial setup
npm install

# Verify Node.js version (must be v24)
node --version
```

### Development Workflow

#### 1. Watch Mode (Development)

```bash
npm run dev
```

**What it does**:
- Starts esbuild in watch mode
- Automatically rebuilds on file changes
- Outputs to `main.js`
- Fast incremental builds

**When to use**:
- During active development
- Testing changes in Obsidian vault
- Iterative development

#### 2. Production Build

```bash
npm run build
```

**What it does**:
- Runs TypeScript type checking (`tsc -noEmit -skipLibCheck`)
- Builds with esbuild in production mode
- Minifies output
- Generates `main.js` (6.5KB)

**When to use**:
- Before committing
- Before creating a release
- Final verification

### Testing

#### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test tests/utils/markdown-parser.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should extract tags"
```

#### Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

**Coverage Requirements**:
- Minimum: 80%
- Current: 98.83%
- CI fails if below threshold

### Code Quality

#### Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format
```

**Biome Configuration** (`biome.json`):
- Indent: Tabs
- Line width: 100
- Recommended rules enabled

**Common Issues**:
- Quote style (prefer single quotes)
- Indentation (tabs not spaces)
- Line length exceeding 100 chars

### Release Preparation

```bash
# Prepare release files
npm run release
```

**What it does**:
- Runs production build
- Copies files to `release/` directory:
  - main.js
  - manifest.json
  - manifest-beta.json
  - styles.css

**When to use**:
- Local testing before release
- Manual verification
- Not needed for automated releases (CI handles this)

### Git Workflow Commands

#### Commit with Automated Message

```bash
# Use the /commit-it slash command
# It will:
# - Check git status
# - Run tests
# - Generate Conventional Commit message
# - Commit changes
```

#### Manual Commit (if not using /commit-it)

```bash
# Stage changes
git add .

# Commit with Conventional Commit format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"
git commit -m "chore: update dependencies"

# Push to main
git push origin main
```

**Important**: Always run tests before committing!

### GitHub Actions Commands

#### Pin Actions to SHA Hashes

```bash
# Pin all actions in workflows
pinact run .github/workflows/ci.yml .github/workflows/tagpr.yml

# Check pinact version
pinact version
```

### Debugging and Troubleshooting

#### TypeScript Type Checking

```bash
# Check types without building
npx tsc --noEmit

# Check with verbose output
npx tsc --noEmit --listFiles
```

#### Build Debugging

```bash
# Build with verbose output
node esbuild.config.mjs

# Check bundle size
ls -lh main.js
```

#### Test Debugging

```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test file in watch mode
npm test -- --watch tests/utils/markdown-parser.test.ts

# Debug test with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Development Workflows

### Feature Development Workflow

1. **Create feature branch (optional)**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Write tests**:
   ```bash
   # Create test file
   touch tests/services/my-feature.test.ts
   
   # Run tests in watch mode
   npm test -- --watch
   ```

4. **Implement feature**:
   - Write code in `src/`
   - Follow pure function pattern
   - Use readonly types

5. **Verify**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

6. **Commit**:
   ```bash
   # Use /commit-it or manual commit
   git commit -m "feat: add my feature"
   ```

7. **Push and create PR** (or push directly to main):
   ```bash
   git push origin main
   ```

### Bug Fix Workflow

1. **Write failing test**:
   ```bash
   # Add test that reproduces the bug
   npm test -- --watch
   ```

2. **Fix the bug**:
   - Modify code in `src/`
   - Verify test passes

3. **Verify all tests**:
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Commit**:
   ```bash
   git commit -m "fix: resolve issue description"
   ```

### Release Workflow (Automated)

1. **Develop and commit**:
   ```bash
   git commit -m "feat: new feature"
   git push origin main
   ```

2. **tagpr creates PR automatically**:
   - Review version bump
   - Review changelog
   - Merge PR

3. **Automatic release**:
   - Tag created
   - Release published
   - Assets uploaded

### Hotfix Workflow

1. **Quick fix**:
   ```bash
   # Fix the issue
   git commit -m "fix: critical bug"
   git push origin main
   ```

2. **tagpr creates patch release**:
   - 0.1.0 → 0.1.1
   - Automatic deployment

## Environment Setup

### Required Tools

```bash
# Node.js v24 (LTS)
node --version  # Should be v24.x.x

# npm v10+
npm --version

# Git
git --version

# pinact (for action pinning)
brew install suzuki-shunsuke/pinact/pinact
```

### VS Code Setup (Recommended)

**Extensions**:
- Biome (biomejs.biome)
- TypeScript (built-in)
- Jest Runner (firsttris.vscode-jest-runner)

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

### Obsidian Development Setup

1. **Create test vault**:
   ```bash
   mkdir ~/obsidian-test-vault
   ```

2. **Link plugin for development**:
   ```bash
   mkdir -p ~/obsidian-test-vault/.obsidian/plugins/task-reporter
   ln -s $(pwd)/main.js ~/obsidian-test-vault/.obsidian/plugins/task-reporter/
   ln -s $(pwd)/manifest.json ~/obsidian-test-vault/.obsidian/plugins/task-reporter/
   ln -s $(pwd)/styles.css ~/obsidian-test-vault/.obsidian/plugins/task-reporter/
   ```

3. **Enable hot reload**:
   - Install "Hot Reload" plugin in test vault
   - Run `npm run dev`
   - Changes automatically reload in Obsidian

## Performance Optimization Commands

### Bundle Analysis

```bash
# Check bundle size
npm run build
ls -lh main.js

# Analyze bundle (if esbuild metafile enabled)
npx esbuild-visualizer
```

### Test Performance

```bash
# Run tests with timing
npm test -- --verbose

# Profile test execution
node --prof node_modules/.bin/jest
```

## Maintenance Commands

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm update typescript

# Update to latest (major versions)
npm install typescript@latest
```

### Clean Build

```bash
# Remove build artifacts
rm -f main.js

# Remove node_modules
rm -rf node_modules
npm install

# Remove coverage
rm -rf coverage
```

## CI/CD Commands (Local Testing)

### Test CI Locally with Act

```bash
# Install act
brew install act

# Run CI workflow locally
act push

# Run specific job
act -j lint
act -j test
act -j build
```

## Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
alias ot-dev="npm run dev"
alias ot-test="npm test"
alias ot-cov="npm run test:coverage"
alias ot-lint="npm run lint:fix"
alias ot-build="npm run build"
```

## Troubleshooting Commands

### Common Issues

#### Tests Failing

```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with no cache
npm test -- --no-cache
```

#### Build Errors

```bash
# Clean build
rm -f main.js
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

#### Lint Errors

```bash
# Auto-fix all issues
npm run lint:fix

# Check specific file
npx biome check src/main.ts
```
