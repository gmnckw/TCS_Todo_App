---
name: openapi
description: Use this skill whenever REST APIs, OpenAPI Specification, API contracts, request/response models, or endpoint documentation is requested.
---

# OpenAPI Skill

Generate or update `openapi.yaml` (OpenAPI 3.0) at the project root.

Include:
- All endpoints for auth, tasks, and reports, with path/query/body parameters
- Request and response schemas for Task and User
- The standard success and error response envelopes
- Status codes: 200, 201, 400, 401, 403, 404
- JWT bearer security scheme; login and health are public

Follow the business rules in backend/CLAUDE.md. Do not invent fields beyond the entities defined there.