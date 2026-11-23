---
name: testing
description: Use this skill whenever unit tests, integration tests, E2E tests, Jest, Supertest, React Testing Library, Playwright, or test coverage is requested.
---

# Test Architect Skill

Generate complete test suites. Derive every fixture and assertion from `CLAUDE.md`, `openapi.yaml`, and the real source code. Do not assume rules; if something is ambiguous, ask first.

Layers:
1. Backend unit (Jest): services, priority and overdue logic, validators.
2. Backend integration (Jest + Supertest): every endpoint, auth, role access, error shapes.
3. Frontend unit (Jest + React Testing Library): components, forms, API integration with mocked services.
4. End-to-end (Playwright, in `e2e/`): login, create a task, assign it, complete it.

Standards: descriptive test names, arrange-act-assert, no shared mutable state between tests, in-memory database reset between tests, each layer runnable with `npm test` (E2E with `npx playwright test`).