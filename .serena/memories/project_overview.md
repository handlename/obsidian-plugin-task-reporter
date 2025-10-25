# Project Overview: Obsidian Task Reporter Plugin

## Purpose
This is an Obsidian plugin that extracts task lists from notes, formats them for daily reports, and copies them to the clipboard. The plugin is designed to streamline the creation of work reports by:
- Extracting tasks from specific headings in the current note
- Filtering tasks by tags
- Transforming task content (tag conversion, link removal, GitHub URL formatting)
- Copying formatted output to clipboard for pasting into external tools

## Project Status
The project is in initial development phase. Currently contains only the Obsidian sample plugin boilerplate code. The actual task reporter functionality has not been implemented yet.

## Tech Stack
- **Language**: TypeScript
- **Platform**: Obsidian Plugin API (v0.15.0+)
- **Build Tool**: esbuild
- **Bundler**: esbuild (configured in esbuild.config.mjs)
- **Linter**: ESLint with TypeScript plugins
- **Package Manager**: npm
- **Runtime**: Node.js v16+ (as per devDependencies)

## Key Dependencies
- obsidian: Latest (plugin API)
- typescript: 4.7.4
- esbuild: 0.17.3
- @typescript-eslint/eslint-plugin: 5.29.0
- @typescript-eslint/parser: 5.29.0

## Testing Framework
Not configured yet. According to REQUIREMENTS.md, Jest should be set up for unit testing with 80%+ coverage target.
