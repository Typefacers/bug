# Naming Conventions

This project follows a few simple rules to keep file and variable names predictable.

## Folders

- Lower-case names, hyphenated when a folder name contains multiple words.

## Files

- React components use `PascalCase.tsx` and export a default component with the same name.
- Non-component utilities and modules use lower-case names and may include hyphens, e.g. `utils.ts`, `badge-variants.ts`.
- Test files mirror the module they cover and use the `.test.ts` extension.

## Code

- Variables and functions are written in `camelCase`.
- Constants that represent configuration values are written in `UPPER_SNAKE_CASE`.
- Types and interfaces use `PascalCase`.
