# Codebase Structure

## Root Directory Structure
```
obsidian-plugin-task-reporter/
├── .git/                    # Git repository
├── .serena/                 # Serena agent configuration
├── main.ts                  # Main plugin entry point
├── manifest.json            # Plugin manifest (metadata)
├── package.json             # npm package configuration
├── tsconfig.json            # TypeScript configuration
├── esbuild.config.mjs       # esbuild bundler configuration
├── .eslintrc                # ESLint configuration
├── .eslintignore            # ESLint ignore patterns
├── .editorconfig            # Editor configuration
├── .npmrc                   # npm configuration
├── .gitignore               # Git ignore patterns
├── styles.css               # Plugin styles
├── versions.json            # Version compatibility mapping
├── version-bump.mjs         # Version bump automation script
├── README.md                # Project documentation
├── REQUIREMENTS.md          # Detailed requirements (Japanese)
├── AGENTS.md                # Additional documentation
└── LICENSE                  # MIT License
```

## Current Implementation (main.ts)
The current `main.ts` contains the Obsidian sample plugin boilerplate:

### Main Classes
1. **MyPlugin** (extends Plugin)
   - Main plugin class
   - Methods: `onload()`, `onunload()`, `loadSettings()`, `saveSettings()`
   - Registers commands, ribbon icons, settings tab
   
2. **SampleModal** (extends Modal)
   - Example modal dialog implementation
   
3. **SampleSettingTab** (extends PluginSettingTab)
   - Settings UI implementation

### Interfaces
- **MyPluginSettings**: Plugin configuration interface

### Plugin Capabilities (from sample code)
- Ribbon icon registration
- Status bar items
- Command palette commands
- Editor commands
- Settings tab
- DOM event listeners
- Intervals

## Planned Structure (Not Yet Implemented)
Based on REQUIREMENTS.md, the plugin should implement:
- Task extraction from headings
- Tag filtering
- Sub-item filtering
- Text formatting (tag conversion, link removal, GitHub URL formatting)
- Clipboard copying
- Configurable settings

## Configuration Files

### manifest.json
Plugin metadata:
- id: "sample-plugin" (needs to be changed)
- name: "Sample Plugin" (needs to be changed)
- version: "1.0.0"
- minAppVersion: "0.15.0"
- Supports both desktop and mobile

### tsconfig.json
TypeScript configuration:
- Target: ES6
- Module: ESNext
- Strict type checking enabled (strictNullChecks, noImplicitAny)
- Includes all .ts files

### esbuild.config.mjs
Build configuration for bundling the plugin.

## Dependencies
All dependencies are dev dependencies (no runtime dependencies):
- Obsidian API types
- TypeScript
- ESLint + TypeScript ESLint plugins
- esbuild for bundling

## Testing Structure
**Not yet implemented**. Should add:
- Test directory (e.g., `tests/` or `src/__tests__/`)
- Jest configuration
- Test files for core functionality
