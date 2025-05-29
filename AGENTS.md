# Codex Agent Instructions

## Tools

- Requires Node.js 18+
- Install dependencies with `npm install`.
- Format code using `npm run format`.
- Lint code using `npm run lint` (or `npm run lint:ci` for CI parity).
- Run the test suite with `npm test`.

## Workflow

1. After making changes, run `npm run format`, `npm run lint`, and `npm test`.
2. Commit only when all checks pass.
3. Update `README.md` to document any new features or changes.

## Commit Messages

- Use concise messages in the imperative mood (e.g., "Add feature" or "Fix bug").
- Keep the summary line under 72 characters.
