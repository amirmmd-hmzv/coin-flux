# ESLint Setup Guide for Coin-Flux

## Overview

ESLint is configured with Next.js, TypeScript, and React best practices.

## Installation

The following packages should be installed (if not already done):

```bash
npm install --save-dev @eslint/js typescript-eslint
```

## Current Configuration

### File: `eslint.config.mjs`

The ESLint configuration includes:

- **JavaScript Best Practices** (`@eslint/js`)
- **TypeScript Support** (`typescript-eslint`)
- **Next.js Linting** (`eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`)

### Enabled Rules

#### TypeScript Rules

- `@typescript-eslint/no-unused-vars` - Warns about unused variables (allows `_` prefix)
- `@typescript-eslint/no-explicit-any` - Warns about `any` type usage
- `@typescript-eslint/explicit-function-return-types` - Suggests explicit return types

#### React/Next.js Rules

- `react/react-in-jsx-scope` - OFF (not needed in Next.js)
- `react/prop-types` - OFF (using TypeScript instead)
- `react-hooks/rules-of-hooks` - ERROR (enforces hooks rules)
- `react-hooks/exhaustive-deps` - WARN (exhaustive dependency arrays)

#### Code Quality

- `no-console` - WARN (allows `console.warn` and `console.error`)
- `prefer-const` - WARN (suggests const over let)
- `no-var` - ERROR (requires let/const)
- `eqeqeq` - ERROR (requires === and !==)
- `curly` - WARN (requires curly braces)

#### Import Rules

- `sort-imports` - WARN (encourages organized imports)

## Usage

### Run ESLint

```bash
npm run lint
```

### Fix Issues Automatically

```bash
npm run lint -- --fix
```

### Run on Specific File

```bash
npm run lint -- path/to/file.tsx
```

## Ignoring Files

Files listed in `.eslintignore` are automatically excluded:

- `node_modules/`
- `.next/`
- `build/` and `out/`
- `next-env.d.ts`
- And more (see `.eslintignore`)

## VS Code Integration

For best experience with VS Code:

1. Install the **ESLint** extension (ms-vscode.eslint)
2. Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.format.enable": true
}
```

## Best Practices

✅ **DO:**

- Use `const` and `let` instead of `var`
- Provide explicit return types for functions
- Use `===` instead of `==`
- Organize imports at the top of files
- Add `_` prefix to unused function parameters

❌ **DON'T:**

- Use `any` type without justification
- Leave console logs in production code
- Use `var` declarations
- Forget exhaustive dependency arrays in hooks

## Notes

- The configuration is intentionally non-strict to maintain developer productivity
- Warnings won't fail CI/CD; only errors will
- TypeScript's type system handles many issues that ESLint might check
