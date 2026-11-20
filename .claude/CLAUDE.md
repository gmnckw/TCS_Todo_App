# Engineering Standards

## Code
- Generate production-ready code.
- Keep modules small and single-purpose (SRP); follow SOLID where it applies.
- No duplicated logic; no dead code; no magic numbers or hardcoded values.
- Use meaningful names and consistent formatting.

## Security
- Never write passwords, API keys, tokens, or connection strings into code. Read them from environment variables.
- Validate every request; prevent SQL injection and XSS.
- Return correct HTTP status codes; never expose stack traces or internals.
- Authorize before performing any operation.

## Project Memory
- Backend work follows backend/CLAUDE.md.
- Frontend work follows frontend/CLAUDE.md.
- Do not duplicate layer-specific rules here.

## Before finishing any task
1. Requirement understood and the affected layer identified.
2. Standards above followed.
3. Code compiles, lints, and tests pass.
4. Docs updated if behavior changed.