# Taskwave

A modular scheduling library with React integration.

## Monorepo Structure

This is a pnpm workspace monorepo containing multiple packages:

```
taskwave/
├── packages/
│   ├── core/          # @taskwave/core - Core scheduling functionality
│   └── react/         # @taskwave/react - React bindings
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.json
```

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Development Mode

Run all packages in watch mode:

```bash
pnpm dev
```

## Packages

### @taskwave/core

Core scheduling functionality that can be used in any JavaScript environment.

### @taskwave/react

React hooks and components for using taskwave in React applications.

## Package Dependencies

- `@taskwave/react` depends on `@taskwave/core` using workspace protocol
- TypeScript project references ensure proper type checking across packages
- No relative paths needed - packages reference each other by name

## Build System

- **Bundler**: Vite (library mode)
- **Output**: ESM and CommonJS formats
- **Type Definitions**: Generated with TypeScript compiler
- **Source Maps**: Enabled for debugging

