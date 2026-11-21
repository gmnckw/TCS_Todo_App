# Todo App

## Prerequisites

- Node.js 22 or later
- npm

## Run the application

Run the backend and the frontend in two separate terminals.

### 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set real values:

- `JWT_SECRET`: a random string of at least 32 characters
- `SEED_PASSWORD`: the password for the demo users (at least 8 characters)

Then start the API:

```bash
npm run dev
```

The API listens on `http://localhost:4000`. Check it with `http://localhost:4000/api/v1/health`.

### 2. Start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The dev server forwards `/api` requests to the backend.

### Demo users

Both demo users use the `SEED_PASSWORD` value:

- `ana.torres@example.com` (employee)
- `marco.ruiz@example.com` (manager)

Data is stored in an in-memory database, so it resets when the backend restarts.
