---
name: backend
description: Use this skill whenever backend development, API implementation, database design, authentication, business logic, or server-side development is requested.
---

# Backend Skill

Implement or extend the Node.js + Express API in `backend/`.

Steps:
1. Read `openapi.yaml` and `backend/CLAUDE.md` first.
2. Follow the Routes -> Controllers -> Services -> Repositories layering.
3. Enforce every business rule inside the service layer.
4. Add JWT auth middleware, request validation, and central error handling.
5. Seed two demo users (one EMPLOYEE, one MANAGER) on startup. Read their password from the SEED_PASSWORD environment variable.
6. Provide `.env.example` listing PORT, JWT_SECRET, and SEED_PASSWORD with placeholder values only.
7. Make sure `npm run dev`, `npm start`, and `npm test` work.
8. default route for the endpoints will be `/api/v{}` use the applications major version as the version