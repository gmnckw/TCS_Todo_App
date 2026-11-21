---
name: run-app
description: Use this skill whenever the user asks to run, start, launch, or serve the Todo App (backend API and frontend together).
---

# Run App Skill

Start the backend (Express API) and frontend (Vite dev server) with `scripts/run-app.sh`.

Steps:
1. Make sure `SEED_PASSWORD` (min 8 characters) is available: either in the environment or in `backend/.env`. Never write secrets into code or commit `.env`. If it is missing, ask the user for a value or tell them to create `backend/.env` from `backend/.env.example`.
2. Run the script from the repository root in the background so the session is not blocked:
   `SEED_PASSWORD=<value> scripts/run-app.sh`
   `JWT_SECRET` is optional; the script generates a temporary one when unset and no `backend/.env` exists.
3. The script installs missing dependencies, starts the API, waits for `/api/v1/health`, then starts the frontend.
4. Confirm both are up:
   - API: `curl http://localhost:4000/api/v1/health`
   - UI: `http://localhost:5173` (proxies `/api` to the backend)
5. Report the URLs and the demo users (`ana.torres@example.com` employee, `marco.ruiz@example.com` manager; both use the `SEED_PASSWORD` value).
6. To stop, terminate the script (Ctrl+C, or stop the background task); it shuts down both services.

Optional overrides: `PORT` (backend, default 4000) and `FRONTEND_PORT` (default 5173).
