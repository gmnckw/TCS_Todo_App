# Todo App Backend

Node.js + Express REST API. Routes -> Controllers -> Services -> Repositories. See `../openapi.yaml` for the contract.

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then set real values
```

| Variable        | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `PORT`          | HTTP port (default `4000`)                           |
| `JWT_SECRET`    | Secret for signing JWTs (at least 32 characters)     |
| `SEED_PASSWORD` | Password for the seeded demo users (at least 8 chars) |

## Commands

| Command         | Action                          |
| --------------- | ------------------------------- |
| `npm run dev`   | Start with auto-reload          |
| `npm start`     | Start normally                  |
| `npm test`      | Run the Jest test suite         |
| `npm run lint`  | Lint with ESLint                |

## API

Base path: `/api/v1` (the major version of the application). Health is at `GET /api/v1/health`; login at `POST /api/v1/auth/login`.

On startup two demo users are seeded, both with the `SEED_PASSWORD` value:

- `ana.torres@example.com` (EMPLOYEE)
- `marco.ruiz@example.com` (MANAGER)

The database is in-memory SQLite, so data resets on every restart.
