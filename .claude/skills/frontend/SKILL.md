---
name: frontend
description: Use this skill whenever React applications, user interfaces, pages, dashboards, forms, layouts, or frontend development is requested.
---

# Frontend Skill

Implement or extend the React UI in `frontend/`.

Steps:
1. Read `openapi.yaml` and `frontend/CLAUDE.md` first.
2. Scaffold with Vite (React JS), React Router, Axios, and Tailwind CSS.
3. Build: login page, task list with filters (status, priority, overdue), create/edit task form, task detail, and a manager-only reports page.
4. Keep all API calls in `src/services/`; store the JWT in an auth context.
5. Include loading, empty, and error states on every view.
6. Configure the Vite dev server proxy so `/api` forwards to the backend.