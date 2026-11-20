# Backend Guidelines

## Stack
Node.js, Express, JWT auth, in-memory SQLite (better-sqlite3). Plain JavaScript (ES modules).

## Architecture
Routes -> Controllers -> Services -> Repositories -> Database
- Controllers: validate input, call a service, return a response. Nothing else.
- Services: all business logic.
- Repositories: all database access.

## Folder structure
src/ controllers/ routes/ services/ repositories/ middleware/ validators/ utils/ config/

## API standards
- REST conventions; nouns for resources; JSON only.
- Success shape: { "success": true, "message": "", "data": {} }
- Error shape:   { "success": false, "message": "Validation failed", "errors": [] }
- Central error-handling middleware.

## Entities
Task: id, title, description, priority, status, dueDate, assigneeId, createdAt, updatedAt
User: id, name, email, role (EMPLOYEE | MANAGER)

## Business rules (always enforce)
- title and dueDate are mandatory.
- dueDate cannot be in the past on creation.
- Employees manage only their own tasks; managers can reassign.
- Completed tasks are read-only unless a manager reopens them.
- Overdue tasks are flagged automatically (isOverdue).

## Auth
JWT on every route except POST /api/auth/login and GET /api/health.
Secrets come from environment variables. Never log passwords or tokens.

## Commands
- npm run dev     start with auto-reload
- npm start       start normally
- npm test        run Jest tests