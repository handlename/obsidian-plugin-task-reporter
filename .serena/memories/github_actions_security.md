# GitHub Actions Security Configuration

## Action Pinning Strategy

This project uses **pinact** to pin all GitHub Actions to SHA-256 hashes for security.

### Why Pin Actions?

1. **Supply Chain Attack Prevention**: Tags can be rewritten, but commit hashes cannot
2. **Reproducibility**: Ensures the same code runs every time
3. **Transparency**: Version comments show which version is being used
4. **Control**: Prevents unexpected breaking changes from automatic updates

### Pinned Actions

#### CI Workflow (`.github/workflows/ci.yml`)

```yaml
- uses: actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955 # v4.3.0
- uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
- uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
```

#### Release Workflow (`.github/workflows/tagpr.yml`)

```yaml
- uses: actions/checkout@08eba0b27e820071cde6df949e0beb9ba4906955 # v4.3.0
- uses: Songmu/tagpr@9c294c8b7b1815a5f3b7c61d6ee6aa50ac25b030 # v1.8.4
- uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
```

### Updating Pinned Actions

When you need to update an action version:

1. Update the version tag in the workflow file
2. Run pinact to update the hash:
   ```bash
   pinact run .github/workflows/ci.yml .github/workflows/tagpr.yml
   ```
3. Commit the updated hashes

### pinact Usage

```bash
# Pin actions in specific files
pinact run .github/workflows/*.yml

# pinact runs without configuration file (default mode)
# No .pinact.yaml needed
```

## GitHub Actions Permissions

### CI Workflow Permissions

```yaml
permissions:
  contents: read  # Read-only access to repository
```

### Release Workflow Permissions

```yaml
permissions:
  contents: write        # Write access for creating releases
  pull-requests: write   # Create/update PRs for version bumps
  issues: read          # Read issue labels for version bumping
```

## Required Repository Settings

For tagpr to work properly:

**Settings → Actions → General**
- ✅ Enable "Allow GitHub Actions to create and approve pull requests"

## Security Best Practices Implemented

1. ✅ All actions pinned to SHA hashes
2. ✅ Minimal permissions (least privilege principle)
3. ✅ Secrets only used where necessary (GITHUB_TOKEN)
4. ✅ No third-party actions from untrusted sources
5. ✅ Workflow files reviewed and version controlled
6. ✅ Dependency updates via pinact (controlled and reviewed)

## GitHub Actions Matrix

### CI Workflow

- **Triggers**: push to main, pull requests to main
- **Runner**: ubuntu-latest
- **Node Version**: 24
- **Jobs**: lint, test, build
- **Artifacts**: plugin-build (7 days retention)

### Release Workflow

- **Triggers**: push to main
- **Runner**: ubuntu-latest
- **Node Version**: 24
- **Jobs**: tagpr, build (conditional on tag), upload assets
- **Outputs**: GitHub Release with assets

## Troubleshooting

### pinact Not Found

Install pinact:
```bash
brew install suzuki-shunsuke/pinact/pinact
```

### Action Hash Mismatch

If you see an error about hash mismatch:
1. Check if the action version has changed
2. Re-run pinact to update the hash
3. Verify the hash on GitHub

### tagpr Permission Error

Ensure repository settings allow GitHub Actions to create PRs:
- Settings → Actions → General → Workflow permissions
- Select "Allow GitHub Actions to create and approve pull requests"
