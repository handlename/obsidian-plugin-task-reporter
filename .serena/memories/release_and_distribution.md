# Release and Distribution Strategy

## Distribution Channels

### 1. BRAT (Beta Reviewers Auto-update Tool)

**Status**: ✅ Implemented and Active

**Repository**: `handlename/obsidian-plugin-task-reporter`

**Files Required**:
- `manifest-beta.json` - Beta version manifest (auto-updated by tagpr)
- GitHub Releases with assets

**Installation**:
1. User installs BRAT plugin in Obsidian
2. Adds `handlename/obsidian-plugin-task-reporter` as beta plugin
3. BRAT automatically downloads and installs from latest release
4. Auto-updates on new releases

**Key Features**:
- Automatic updates
- Beta version tracking via `manifest-beta.json`
- No manual file management for users

### 2. Manual Installation

**Status**: ✅ Supported

**Required Files** (from GitHub Releases):
- `main.js` - Compiled plugin code (6.5KB)
- `manifest.json` - Plugin metadata
- `styles.css` - Plugin styles (164B)

**Installation Steps**:
1. Download files from latest release
2. Create `.obsidian/plugins/task-reporter/` in vault
3. Copy files to directory
4. Restart Obsidian
5. Enable plugin in settings

### 3. Obsidian Community Plugins (Future)

**Status**: ❌ Not Yet Submitted

**Requirements**:
- Stable version (recommend v1.0.0+)
- Well-tested in beta
- Documentation complete
- Follows Obsidian plugin guidelines

## Release Automation

### tagpr Workflow

**Configuration** (`.tagpr`):
```ini
[tagpr]
  releaseBranch = main
  versionFile = manifest.json,manifest-beta.json,package.json
  vPrefix = true
  changelog = true
  release = true
  majorLabels = major
  minorLabels = minor
  command = npm run build && npm run release
```

**Version Management**:
- Automatically updates 3 files: manifest.json, manifest-beta.json, package.json
- Creates changelog from commit messages
- Uses Conventional Commits for version bumping

**Workflow**:
1. Developer commits to main branch
2. tagpr analyzes commits and creates version bump PR
3. PR shows version changes and changelog
4. Developer reviews and merges PR
5. tagpr creates Git tag and GitHub release
6. GitHub Actions builds plugin and uploads assets

### Conventional Commits Version Strategy

```
feat: New feature          → Minor version (0.1.0 → 0.2.0)
fix: Bug fix              → Patch version (0.1.0 → 0.1.1)
PR with 'minor' label     → Minor version (0.1.0 → 0.2.0)
PR with 'major' label     → Major version (0.1.0 → 1.0.0)
```

### Release Assets

**Automatically Uploaded**:
- `main.js` - Compiled plugin
- `manifest.json` - Official manifest
- `manifest-beta.json` - BRAT beta manifest
- `styles.css` - Plugin styles

**Upload Process** (`.github/workflows/tagpr.yml`):
```yaml
gh release upload ${{ steps.tagpr.outputs.tag }} \
  main.js \
  manifest.json \
  manifest-beta.json \
  styles.css \
  --clobber
```

## Version Synchronization

### Files Managed by tagpr

1. **manifest.json**
   ```json
   {
     "version": "0.1.0"
   }
   ```

2. **manifest-beta.json**
   ```json
   {
     "version": "0.1.0"
   }
   ```

3. **package.json**
   ```json
   {
     "version": "0.1.0"
   }
   ```

All three files are updated simultaneously by tagpr to ensure consistency.

## Release Preparation Script

**File**: `scripts/prepare-release.mjs`

**Purpose**: Copy release files to `release/` directory for manual testing

**Files Copied**:
- main.js
- manifest.json
- manifest-beta.json
- styles.css

**Usage**:
```bash
npm run release
```

**Note**: This is primarily for local verification. CI/CD handles actual releases.

## Release Checklist

### Pre-Release (Automated)
- ✅ All tests passing (103/103)
- ✅ Coverage ≥ 80% (currently 98.83%)
- ✅ Lint errors = 0
- ✅ Build successful
- ✅ Version files synchronized

### Release (Automated by tagpr)
- ✅ Version bump in manifest.json, manifest-beta.json, package.json
- ✅ Changelog generated
- ✅ Git tag created (e.g., v0.1.0)
- ✅ GitHub release created
- ✅ Release assets uploaded

### Post-Release (Manual Verification)
- ⚠️ Test BRAT installation
- ⚠️ Verify auto-update works
- ⚠️ Check release notes accuracy
- ⚠️ Monitor for user issues

## Current Release Status

- **Latest Version**: 0.1.0
- **Release Type**: Prerelease/Beta
- **Distribution**: BRAT only
- **Total Releases**: 1 (v0.1.0)

## Future Release Plans

### v0.2.0 (Next Minor)
- Potential new features based on user feedback
- Bug fixes from beta testing

### v1.0.0 (Stable Release)
- Submit to Obsidian Community Plugins
- Comprehensive documentation
- Extensive testing by beta users
- Stable API

## Rollback Strategy

If a release has critical issues:

1. **Quick Fix**:
   - Create hotfix commit with `fix:` prefix
   - tagpr creates patch version PR
   - Merge to release fixed version

2. **Revert**:
   - Revert problematic commit
   - Push to main
   - tagpr creates new release

3. **Manual Intervention**:
   - Delete problematic tag and release
   - Fix issues
   - Create new release manually if needed

## BRAT-Specific Considerations

### manifest-beta.json vs manifest.json

- **Same Content**: Currently identical
- **Different Purpose**: 
  - `manifest.json` for official releases
  - `manifest-beta.json` for BRAT beta tracking
- **Synchronized**: tagpr updates both simultaneously

### BRAT Update Mechanism

1. BRAT checks `manifest-beta.json` version periodically
2. Compares with installed version
3. If newer version available, downloads from latest release
4. Updates plugin files automatically

### Testing BRAT Installation

```
1. Install BRAT plugin
2. Add beta plugin: handlename/obsidian-plugin-task-reporter
3. Verify installation
4. Check plugin loads correctly
5. Test auto-update on next release
```

## Release Notes Template

tagpr generates release notes from commits, formatted as:

```markdown
## What's Changed
* feat: add new feature by @author in #123
* fix: resolve bug by @author in #124
* chore: update dependencies by @author in #125

**Full Changelog**: https://github.com/handlename/obsidian-plugin-task-reporter/compare/v0.1.0...v0.2.0
```

## Metrics and Monitoring

### Release Metrics to Track

- Release frequency
- Time from commit to release
- Number of BRAT installations
- Update adoption rate
- Issue reports per release

### Current Metrics

- **Total Commits**: 27
- **Total Releases**: 1
- **CI Success Rate**: 100%
- **Test Coverage**: 98.83%
